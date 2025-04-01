from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import datetime
import subprocess
import threading
import os
import re
import json
import ipaddress
import socket
import uuid
import xml.etree.ElementTree as ET

scan_bp = Blueprint('scan', __name__)

# Директории для сохранения результатов сканирования
SCAN_RESULTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../scan_results')
os.makedirs(SCAN_RESULTS_DIR, exist_ok=True)

# Хранение информации об активных сканированиях
active_scans = {}  # id -> status

# Базовые настройки для сканирования
DEFAULT_NMAP_ARGS = "-Pn -A"

class ScanStatus:
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SCHEDULED = "scheduled"


def validate_target(target, target_type):
    """Проверка корректности целевого хоста или сети"""
    if target_type == "hostname":
        # Проверка доменного имени
        pattern = r'^[a-zA-Z0-9]([a-zA-Z0-9\-\.]+)?[a-zA-Z0-9](\.[a-zA-Z]{2,})+$'
        if not re.match(pattern, target):
            return False, "Invalid hostname format"
        return True, ""
    elif target_type == "ip":
        # Проверка IP-адреса
        try:
            ipaddress.ip_address(target)
            return True, ""
        except ValueError:
            return False, "Invalid IP address"
    elif target_type == "range":
        # Проверка диапазона CIDR
        try:
            ipaddress.ip_network(target, strict=False)
            return True, ""
        except ValueError:
            return False, "Invalid IP range format"
    return False, "Invalid target type"


def get_scan_command(scan_id, target, scan_type, port_range, scan_speed, service_detection, os_detection, script_scan):
    """Формирует команду для сканирования на основе параметров"""
    # Базовая директория для результатов
    result_dir = os.path.join(SCAN_RESULTS_DIR, str(scan_id))
    os.makedirs(result_dir, exist_ok=True)
    
    # Базовая команда nmap
    cmd = ["nmap"]
    
    # Аргументы в зависимости от типа сканирования
    if scan_type == "basic":
        cmd.append("-sV")  # Service version detection
    elif scan_type == "quick":
        cmd.append("-F")   # Fast scan
        cmd.append("-sV")  # Service version detection
    elif scan_type == "full":
        cmd.append("-sS")  # SYN scan
        cmd.append("-sV")  # Service version detection
        cmd.append("-O")   # OS detection
        cmd.append("--script=default,vuln")  # Default and vulnerability scripts
    elif scan_type == "udp":
        cmd.append("-sU")  # UDP scan
        cmd.append("-sV")  # Service version detection
    elif scan_type == "web":
        cmd.append("-sV")  # Service version detection
        cmd.append("--script=http-enum,http-headers,http-methods,http-title,http-webdav-scan")
    
    # Порты
    if port_range == "top-100":
        cmd.append("--top-ports 100")
    elif port_range == "top-1000":
        cmd.append("--top-ports 1000")
    elif port_range == "all":
        cmd.append("-p-")  # All ports
    elif port_range.startswith("custom:"):
        custom_ports = port_range.split(":", 1)[1]
        cmd.append(f"-p {custom_ports}")
    
    # Скорость сканирования
    if scan_speed == "slow":
        cmd.append("-T2")
    elif scan_speed == "normal":
        cmd.append("-T3")
    elif scan_speed == "fast":
        cmd.append("-T4")
    
    # Дополнительные опции
    if service_detection and "-sV" not in cmd:
        cmd.append("-sV")
    if os_detection:
        cmd.append("-O")
    if script_scan and "--script" not in " ".join(cmd):
        cmd.append("--script=default,vuln")
    
    # Output formats
    xml_output = os.path.join(result_dir, "scan.xml")
    cmd.extend(["-oX", xml_output])
    
    # Add target
    cmd.append(target)
    
    return cmd, result_dir


def parse_nmap_xml(xml_file):
    """Парсит XML-файл результатов nmap в структуру данных"""
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
        
        # Базовая информация о сканировании
        scan_info = {
            "start_time": root.get("start", ""),
            "args": root.get("args", ""),
            "hosts": []
        }
        
        # Информация о хостах
        for host in root.findall(".//host"):
            host_info = {
                "state": host.find(".//status").get("state", ""),
                "addresses": [],
                "hostnames": [],
                "ports": [],
                "os": []
            }
            
            # IP-адреса
            for addr in host.findall(".//address"):
                host_info["addresses"].append({
                    "addr": addr.get("addr", ""),
                    "addrtype": addr.get("addrtype", "")
                })
            
            # Доменные имена
            for hostname in host.findall(".//hostname"):
                host_info["hostnames"].append({
                    "name": hostname.get("name", ""),
                    "type": hostname.get("type", "")
                })
            
            # Порты и сервисы
            for port in host.findall(".//port"):
                port_info = {
                    "protocol": port.get("protocol", ""),
                    "portid": port.get("portid", ""),
                    "state": port.find(".//state").get("state", ""),
                    "service": {}
                }
                
                # Информация о сервисе
                service = port.find(".//service")
                if service is not None:
                    port_info["service"] = {
                        "name": service.get("name", ""),
                        "product": service.get("product", ""),
                        "version": service.get("version", ""),
                        "extrainfo": service.get("extrainfo", "")
                    }
                
                # Скрипты (если есть)
                scripts = port.findall(".//script")
                if scripts:
                    port_info["scripts"] = []
                    for script in scripts:
                        script_info = {
                            "id": script.get("id", ""),
                            "output": script.get("output", "")
                        }
                        port_info["scripts"].append(script_info)
                
                host_info["ports"].append(port_info)
            
            # Информация об ОС
            os_matches = host.findall(".//osmatch")
            for os_match in os_matches:
                os_info = {
                    "name": os_match.get("name", ""),
                    "accuracy": os_match.get("accuracy", "")
                }
                host_info["os"].append(os_info)
            
            scan_info["hosts"].append(host_info)
        
        return scan_info
    except Exception as e:
        print(f"Error parsing nmap XML: {e}")
        return {"error": str(e)}


def process_nmap_results(scan_id, result_dir):
    """Обрабатывает результаты nmap и преобразует их в формат для фронтенда"""
    xml_file = os.path.join(result_dir, "scan.xml")
    
    if not os.path.exists(xml_file):
        return {
            "id": scan_id,
            "status": "failed",
            "error": "Scan results not found"
        }
    
    try:
        # Парсим XML результаты nmap
        nmap_data = parse_nmap_xml(xml_file)
        
        # Получаем информацию о хосте (берем первый хост из списка)
        host_data = nmap_data["hosts"][0] if nmap_data.get("hosts") else {}
        
        # Получаем IP и hostname
        ip = next((addr["addr"] for addr in host_data.get("addresses", []) 
                   if addr["addrtype"] == "ipv4"), "")
        hostname = next((h["name"] for h in host_data.get("hostnames", [])
                        if h["name"]), "")
        
        # Определяем ОС
        operating_system = "Unknown"
        if host_data.get("os"):
            os_matches = sorted(host_data["os"], key=lambda x: int(x.get("accuracy", 0)), reverse=True)
            if os_matches:
                operating_system = os_matches[0].get("name", "Unknown")
        
        # Получаем информацию об открытых портах
        open_ports = []
        vulnerabilities = []
        vuln_id = 1
        
        high_count = 0
        medium_count = 0
        low_count = 0
        
        # Идентификаторы скриптов с высоким риском
        high_risk_scripts = ["ssl-heartbleed", "ms17-010", "smb-vuln-", "ftp-vsftpd-backdoor",
                            "ssl-poodle", "ssl-ccs-injection", "http-shellshock"]
        
        # Идентификаторы скриптов со средним риском
        medium_risk_scripts = ["ssl-dh-params", "ssl-cert-expiry", "http-csrf", "http-dombased-xss",
                              "http-passwd", "http-enum", "ftp-anon"]
        
        for port in host_data.get("ports", []):
            if port.get("state") == "open":
                service = port.get("service", {})
                port_info = {
                    "port": int(port.get("portid", 0)),
                    "service": service.get("name", "unknown"),
                    "version": f"{service.get('product', '')} {service.get('version', '')}".strip()
                }
                open_ports.append(port_info)
                
                # Проверяем на уязвимости с помощью скриптов
                if "scripts" in port:
                    for script in port["scripts"]:
                        script_id = script.get("id", "")
                        
                        # Определяем серьезность уязвимости по имени скрипта
                        severity = "low"
                        for high_pattern in high_risk_scripts:
                            if high_pattern in script_id:
                                severity = "high"
                                high_count += 1
                                break
                        
                        if severity != "high":
                            for medium_pattern in medium_risk_scripts:
                                if medium_pattern in script_id:
                                    severity = "medium"
                                    medium_count += 1
                                    break
                        
                        if severity == "low":
                            low_count += 1
                        
                        # Формируем описание уязвимости
                        output = script.get("output", "").strip()
                        
                        # Краткое описание
                        description = output.split('\n')[0] if output else script_id
                        
                        # Категория уязвимости
                        category = "web" if "http" in script_id else \
                                  "encryption" if "ssl" in script_id or "tls" in script_id else \
                                  "authentication" if "auth" in script_id or "passwd" in script_id else \
                                  "database" if "mysql" in script_id or "mssql" in script_id or "oracle" in script_id else \
                                  "network"
                        
                        # Рекомендации по исправлению
                        remediation = "Update the service to the latest version and apply security patches."
                        if "ssl" in script_id or "tls" in script_id:
                            remediation = "Configure the server to use only strong encryption protocols and cipher suites."
                        elif "http" in script_id:
                            remediation = "Update the web application and implement proper input validation and security headers."
                        
                        vulnerability = {
                            "id": f"vuln-{scan_id}-{vuln_id}",
                            "name": script_id.replace("-", " ").title(),
                            "description": description,
                            "severity": severity,
                            "details": output,
                            "category": category,
                            "remediation": remediation,
                            "dateDiscovered": datetime.datetime.now().isoformat() + "Z",
                            "status": "open"
                        }
                        
                        vulnerabilities.append(vulnerability)
                        vuln_id += 1
        
        # Форматируем результаты для фронтенда
        scan_result = {
            "id": scan_id,
            "target": hostname or ip,
            "date": datetime.datetime.now().isoformat() + "Z",
            "status": "completed",
            "duration": 120,  # примерная длительность
            "findings": {
                "high": high_count,
                "medium": medium_count,
                "low": low_count,
                "total": high_count + medium_count + low_count,
                "resolved": 0
            },
            "vulnerabilities": vulnerabilities,
            "openPorts": open_ports,
            "hostInfo": {
                "ip": ip,
                "hostname": hostname,
                "operatingSystem": operating_system,
                "uptime": "Unknown",  # nmap не всегда может определить uptime
                "lastBoot": "Unknown"  # также не всегда можно определить
            }
        }
        
        # Сохраняем результаты в JSON файл
        with open(os.path.join(result_dir, "processed_results.json"), "w") as f:
            json.dump(scan_result, f, indent=2)
        
        return scan_result
    
    except Exception as e:
        print(f"Error processing nmap results: {e}")
        return {
            "id": scan_id,
            "status": "failed",
            "error": str(e)
        }


def run_scan(scan_id, cmd, result_dir):
    """Выполняет сканирование в отдельном потоке"""
    try:
        # Обновляем статус сканирования
        active_scans[scan_id] = ScanStatus.RUNNING
        
        # Запускаем процесс сканирования
        print(f"Running scan {scan_id} with command: {' '.join(cmd)}")
        process = subprocess.Popen(
            cmd, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Ждем завершения сканирования
        stdout, stderr = process.communicate()
        
        # Сохраняем stdout и stderr
        with open(os.path.join(result_dir, "stdout.log"), "w") as f:
            f.write(stdout)
        
        with open(os.path.join(result_dir, "stderr.log"), "w") as f:
            f.write(stderr)
        
        # Проверяем успешность выполнения
        if process.returncode != 0:
            active_scans[scan_id] = ScanStatus.FAILED
            print(f"Scan {scan_id} failed with code {process.returncode}")
            print(f"Error: {stderr}")
            return
        
        # Обрабатываем результаты сканирования
        scan_result = process_nmap_results(scan_id, result_dir)
        
        # Сохраняем результат и обновляем статус
        active_scans[scan_id] = ScanStatus.COMPLETED
        
        # В реальном приложении здесь можно было бы сохранить результаты в базу данных
        # Также можно отправить уведомление пользователю о завершении сканирования
        print(f"Scan {scan_id} completed successfully")
        
    except Exception as e:
        active_scans[scan_id] = ScanStatus.FAILED
        print(f"Error during scan {scan_id}: {e}")


def run_nikto_scan(target, output_file):
    """Запускает сканирование Nikto для веб-уязвимостей"""
    try:
        cmd = ["nikto", "-h", target, "-o", output_file, "-Format", "json"]
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            print(f"Nikto scan failed: {stderr}")
            return None
        
        # Читаем и парсим результаты
        with open(output_file, "r") as f:
            results = json.load(f)
        
        return results
    except Exception as e:
        print(f"Error running Nikto scan: {e}")
        return None


# API endpoints

@scan_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_scans():
    """
    Возвращает список всех сканирований
    
    Временно использует mock_scans, в реальном приложении будет получать данные из БД
    """
    # Для демонстрации используем заготовленные данные и добавляем статусы активных сканирований
    scan_list = []
    
    # Добавляем mock данные
    for scan in mock_scans:
        # Проверяем, не обновлен ли статус в active_scans
        if scan["id"] in active_scans:
            scan_copy = scan.copy()
            scan_copy["status"] = active_scans[scan["id"]]
            scan_list.append(scan_copy)
        else:
            scan_list.append(scan)
    
    # Добавляем активные сканирования, которых нет в mock данных
    for scan_id, status in active_scans.items():
        if not any(s["id"] == scan_id for s in scan_list):
            # Получаем данные сканирования из результатов
            result_dir = os.path.join(SCAN_RESULTS_DIR, str(scan_id))
            result_file = os.path.join(result_dir, "processed_results.json")
            
            if os.path.exists(result_file):
                with open(result_file, "r") as f:
                    scan_data = json.load(f)
                scan_data["status"] = status
                scan_list.append(scan_data)
            else:
                # Если результаты еще не обработаны, добавляем базовую информацию
                scan_list.append({
                    "id": scan_id,
                    "status": status,
                    "date": datetime.datetime.now().isoformat() + "Z"
                })
    
    return jsonify(scan_list)


@scan_bp.route('/<int:scan_id>', methods=['GET'])
@jwt_required()
def get_scan_by_id(scan_id):
    """
    Возвращает детали сканирования по ID
    
    Сначала проверяет наличие результатов в файловой системе,
    затем в mock данных
    """
    # Проверяем, есть ли результаты в файловой системе
    result_dir = os.path.join(SCAN_RESULTS_DIR, str(scan_id))
    result_file = os.path.join(result_dir, "processed_results.json")
    
    if os.path.exists(result_file):
        with open(result_file, "r") as f:
            scan_data = json.load(f)
        
        # Обновляем статус из active_scans если есть
        if scan_id in active_scans:
            scan_data["status"] = active_scans[scan_id]
        
        return jsonify(scan_data)
    
    # Если нет результатов на диске, ищем в mock данных
    scan = next((s for s in mock_scans if s["id"] == scan_id), None)
    if scan:
        # Возвращаем копию, чтобы не менять оригинал
        scan_copy = scan.copy()
        
        # Обновляем статус если есть в active_scans
        if scan_id in active_scans:
            scan_copy["status"] = active_scans[scan_id]
        
        return jsonify(scan_copy)
    
    # Если сканирование запущено, но результаты еще не доступны
    if scan_id in active_scans:
        return jsonify({
            "id": scan_id,
            "status": active_scans[scan_id],
            "message": "Scan is in progress or scheduled"
        })
    
    return jsonify({"error": "Scan not found"}), 404


@scan_bp.route('/new', methods=['POST'])
@jwt_required()
def create_scan():
    """
    Создает новое сканирование
    
    Принимает JSON с параметрами сканирования и запускает процесс
    в отдельном потоке
    """
    data = request.get_json()
    
    # Проверка необходимых параметров
    if not data.get('target'):
        return jsonify({"error": "Target is required"}), 400
    
    # Получаем параметры сканирования
    target = data.get('target')
    target_type = data.get('targetType', 'hostname')
    scan_type = data.get('scanType', 'basic')
    port_range = data.get('portRange', 'top-1000')
    # Обрабатываем custom port range
    if isinstance(port_range, dict) and 'custom' in port_range:
        port_range = f"custom:{port_range['custom']}"
    
    scan_speed = data.get('scanSpeed', 'normal')
    
    options = data.get('options', {})
    service_detection = options.get('serviceDetection', True)
    os_detection = options.get('osDetection', True)
    script_scan = options.get('scriptScan', False)
    
    # Валидация цели
    valid, error_msg = validate_target(target, target_type)
    if not valid:
        return jsonify({"error": error_msg}), 400
    
    # Проверяем, запланировано ли сканирование
    schedule = data.get('schedule')
    
    # Создаем уникальный ID для сканирования
    scan_id = len(mock_scans) + len(active_scans) + 1
    
    # Формируем команду для сканирования
    cmd, result_dir = get_scan_command(
        scan_id, target, scan_type, port_range, scan_speed,
        service_detection, os_detection, script_scan
    )
    
    # Если сканирование запланировано
    if schedule:
        active_scans[scan_id] = ScanStatus.SCHEDULED
        
        # В реальном приложении здесь бы был код для запланированного запуска
        # Например, с использованием celery.beat или APScheduler
        
        return jsonify({
            "id": scan_id, 
            "status": ScanStatus.SCHEDULED, 
            "message": "Scan scheduled successfully",
            "scheduledTime": f"{schedule.get('date')} {schedule.get('time')}"
        })
    
    # Запускаем сканирование в отдельном потоке
    active_scans[scan_id] = ScanStatus.QUEUED
    thread = threading.Thread(target=run_scan, args=(scan_id, cmd, result_dir))
    thread.start()
    
    return jsonify({
        "id": scan_id, 
        "status": ScanStatus.QUEUED, 
        "message": "Scan started successfully"
    })


@scan_bp.route('/status/<int:scan_id>', methods=['GET'])
@jwt_required()
def get_scan_status(scan_id):
    """Возвращает текущий статус сканирования"""
    if scan_id in active_scans:
        return jsonify({"id": scan_id, "status": active_scans[scan_id]})
    
    # Проверяем, есть ли результаты в файловой системе
    result_dir = os.path.join(SCAN_RESULTS_DIR, str(scan_id))
    result_file = os.path.join(result_dir, "processed_results.json")
    
    if os.path.exists(result_file):
        return jsonify({"id": scan_id, "status": ScanStatus.COMPLETED})
    
    # Проверяем в mock данных
    scan = next((s for s in mock_scans if s["id"] == scan_id), None)
    if scan:
        return jsonify({"id": scan_id, "status": scan["status"]})
    
    return jsonify({"error": "Scan not found"}), 404


@scan_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    """Возвращает данные для дашборда"""
    # Получаем все сканирования (включая активные)
    scan_list = []
    
    # Добавляем mock данные
    for scan in mock_scans:
        # Проверяем, не обновлен ли статус в active_scans
        if scan["id"] in active_scans:
            scan_copy = scan.copy()
            scan_copy["status"] = active_scans[scan["id"]]
            scan_list.append(scan_copy)
        else:
            scan_list.append(scan)
    
    # Добавляем активные сканирования, которых нет в mock данных
    for scan_id, status in active_scans.items():
        if not any(s["id"] == scan_id for s in scan_list):
            result_dir = os.path.join(SCAN_RESULTS_DIR, str(scan_id))
            result_file = os.path.join(result_dir, "processed_results.json")
            
            if os.path.exists(result_file):
                with open(result_file, "r") as f:
                    scan_data = json.load(f)
                scan_data["status"] = status
                scan_list.append(scan_data)
            else:
                scan_list.append({
                    "id": scan_id,
                    "status": status,
                    "date": datetime.datetime.now().isoformat() + "Z"
                })
    
    # Фильтруем завершенные сканирования
    completed_scans = [s for s in scan_list if s["status"] == ScanStatus.COMPLETED]
    running_scans = [s for s in scan_list if s["status"] == ScanStatus.RUNNING]
    scheduled_scans = [s for s in scan_list if s["status"] == ScanStatus.SCHEDULED]
    
    # Подсчитываем общее количество уязвимостей
    total_high = sum(s.get("findings", {}).get("high", 0) for s in completed_scans)
    total_medium = sum(s.get("findings", {}).get("medium", 0) for s in completed_scans)
    total_low = sum(s.get("findings", {}).get("low", 0) for s in completed_scans)
    total_findings = total_high + total_medium + total_low
    
    # Рассчитываем security score
    security_score = 100
    if total_findings > 0:
        security_score = max(0, 100 - (total_high * 15 + total_medium * 5 + total_low))
    
    # Сортируем сканирования по дате (новые в начале)
    recent_scans = sorted(
        (s for s in scan_list if s["status"] == ScanStatus.COMPLETED),
        key=lambda x: x["date"],
        reverse=True
    )[:3]
    
    # Формируем данные для дашборда
    dashboard_data = {
        "securityScore": security_score,
        "securityScoreChange": 5,  # В реальном приложении это был бы расчет на основе истории
        "securityStatus": "Good" if security_score > 70 else "Fair" if security_score > 50 else "Poor",
        "scanCount": len(scan_list),
        "scanCountChange": 3,  # В реальном приложении это был бы расчет на основе истории
        "vulnerabilities": {
            "high": total_high,
            "medium": total_medium,
            "low": total_low,
            "total": total_findings,
            "resolved": 7  # В реальном приложении это было бы число исправленных уязвимостей
        },
        "securityTrend": [65, 68, 72, 70, 73, security_score],  # Историю можно сохранять в БД
        "recentScans": recent_scans,
        "criticalAlerts": [
            {
                "id": 1,
                "title": "High Severity Vulnerabilities Detected" if total_high > 0 else "Security Scan Completed",
                "severity": "high" if total_high > 0 else "medium",
                "time": "1 hour ago",
                "target": "multiple hosts" if len(completed_scans) > 1 else (completed_scans[0]["target"] if completed_scans else ""),
                "status": "active"
            },
            {
                "id": 2,
                "title": "SSL Certificate Expires Soon",
                "severity": "medium",
                "time": "5 hours ago",
                "target": "web-server.example.com",
                "status": "active"
            } if any("SSL Certificate" in s.get("name", "") for s in 
                    [v for scan in completed_scans 
                     for v in scan.get("vulnerabilities", [])]) else None
        ],
        "securedAssets": len(set(s["target"] for s in scan_list)),
        "monitoredEndpoints": len(set(s["target"] for s in scan_list)) + 8,  # Дополнительно мониторимые точки
        "scheduleScans": len(scheduled_scans)
    }
    
    # Удаляем None из списка criticalAlerts
    dashboard_data["criticalAlerts"] = [alert for alert in dashboard_data["criticalAlerts"] if alert is not None]
    
    return jsonify(dashboard_data)


@scan_bp.route('/tools', methods=['GET'])
@jwt_required()
def get_available_tools():
    """Возвращает список доступных инструментов для сканирования и их статус"""
    tools = [
        {"name": "nmap", "status": "available", "description": "Network Mapper - Port and vulnerability scanner"},
        {"name": "nikto", "status": "available", "description": "Web server scanner"},
        {"name": "dirb", "status": "available", "description": "Web content scanner"},
        {"name": "sqlmap", "status": "available", "description": "SQL injection scanner"},
        {"name": "wpscan", "status": "available", "description": "WordPress vulnerability scanner"},
        {"name": "hydra", "status": "available", "description": "Password cracking tool"},
        {"name": "gobuster", "status": "available", "description": "Directory/file & DNS busting tool"},
        {"name": "sslscan", "status": "available", "description": "SSL/TLS scanner"}
    ]
    
    # В реальном приложении можно проверять наличие этих инструментов в системе
    # и их версии с помощью shell команд
    
    return jsonify(tools)


@scan_bp.route('/web-scan', methods=['POST'])
@jwt_required()
def create_web_scan():
    """Создает новое сканирование для веб-приложений с использованием специализированных инструментов"""
    data = request.get_json()
    
    # Проверка необходимых параметров
    if not data.get('target'):
        return jsonify({"error": "Target is required"}), 400
    
    # Получаем параметры сканирования
    target = data.get('target')
    tools = data.get('tools', ["nikto"])  # По умолчанию используем nikto
    
    # Валидация цели (для веб-сканирования это должен быть URL)
    if not target.startswith(('http://', 'https://')):
        target = 'http://' + target
    
    # Создаем уникальный ID для сканирования
    scan_id = len(mock_scans) + len(active_scans) + 1
    
    # Создаем директорию для результатов
    result_dir = os.path.join(SCAN_RESULTS_DIR, str(scan_id))
    os.makedirs(result_dir, exist_ok=True)
    
    # Устанавливаем статус "в очереди"
    active_scans[scan_id] = ScanStatus.QUEUED
    
    # Функция для выполнения сканирования в отдельном потоке
    def run_web_scan():
        try:
            active_scans[scan_id] = ScanStatus.RUNNING
            
            results = {
                "target": target,
                "scan_id": scan_id,
                "tools_results": {},
                "vulnerabilities": [],
                "status": ScanStatus.RUNNING,
                "start_time": datetime.datetime.now().isoformat() + "Z"
            }
            
            # Запускаем указанные инструменты
            vuln_id = 1
            
            # Nikto - веб-сканер
            if "nikto" in tools:
                nikto_output = os.path.join(result_dir, "nikto_results.json")
                nikto_results = run_nikto_scan(target, nikto_output)
                
                if nikto_results:
                    results["tools_results"]["nikto"] = nikto_results
                    
                    # Обрабатываем результаты nikto
                    for item in nikto_results.get("vulnerabilities", []):
                        severity = "low"  # По умолчанию
                        
                        # Определяем серьезность уязвимости
                        if "XSS" in item.get("title", "") or "SQL Injection" in item.get("title", "") or \
                           "Remote Command Execution" in item.get("title", ""):
                            severity = "high"
                        elif "Information Disclosure" in item.get("title", "") or \
                             "Default Credentials" in item.get("title", ""):
                            severity = "medium"
                        
                        vulnerability = {
                            "id": f"vuln-{scan_id}-{vuln_id}",
                            "name": item.get("title", "Unknown"),
                            "description": item.get("message", ""),
                            "severity": severity,
                            "details": f"{item.get('message', '')} (OSVDB: {item.get('osvdbid', 'N/A')})",
                            "category": "web",
                            "remediation": "Please refer to the OSVDB entry for remediation information.",
                            "dateDiscovered": datetime.datetime.now().isoformat() + "Z",
                            "status": "open"
                        }
                        
                        results["vulnerabilities"].append(vulnerability)
                        vuln_id += 1
            
            # Dirb/Gobuster - сканер директорий
            if "dirb" in tools or "gobuster" in tools:
                # Предпочитаем gobuster, если доступен
                tool = "gobuster" if "gobuster" in tools else "dirb"
                dirb_output = os.path.join(result_dir, f"{tool}_results.txt")
                
                # Команда для сканирования директорий
                if tool == "gobuster":
                    cmd = ["gobuster", "dir", "-u", target, "-w", "/usr/share/wordlists/dirb/common.txt", "-o", dirb_output]
                else:
                    cmd = ["dirb", target, "/usr/share/wordlists/dirb/common.txt", "-o", dirb_output]
                
                try:
                    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                    stdout, stderr = process.communicate()
                    
                    # Если есть результаты, обрабатываем их
                    if os.path.exists(dirb_output) and os.path.getsize(dirb_output) > 0:
                        results["tools_results"][tool] = {"output_file": dirb_output}
                        
                        # На основе найденных директорий создаем уязвимости низкой серьезности
                        with open(dirb_output, "r") as f:
                            content = f.read()
                        
                        # Ищем интересные пути
                        interesting_paths = []
                        for line in content.splitlines():
                            if "admin" in line or "login" in line or "config" in line or \
                               "backup" in line or "wp-" in line or ".git" in line:
                                interesting_paths.append(line)
                        
                        # Если найдены интересные пути, создаем уязвимость
                        if interesting_paths:
                            vulnerability = {
                                "id": f"vuln-{scan_id}-{vuln_id}",
                                "name": "Sensitive Directories Exposed",
                                "description": "Potentially sensitive directories were discovered on the web server.",
                                "severity": "medium",
                                "details": "The following sensitive directories were found: " + 
                                           ", ".join(interesting_paths[:5]) + 
                                           (f" and {len(interesting_paths) - 5} more." if len(interesting_paths) > 5 else ""),
                                "category": "web",
                                "remediation": "Restrict access to sensitive directories or remove them if not needed.",
                                "dateDiscovered": datetime.datetime.now().isoformat() + "Z",
                                "status": "open"
                            }
                            
                            results["vulnerabilities"].append(vulnerability)
                            vuln_id += 1
                
                except Exception as e:
                    print(f"Error running {tool}: {e}")
            
            # SSLScan - проверка SSL/TLS
            if "sslscan" in tools and target.startswith("https://"):
                sslscan_output = os.path.join(result_dir, "sslscan_results.xml")
                
                # Извлекаем домен из URL
                domain = target.split("//")[1].split("/")[0]
                
                cmd = ["sslscan", "--xml=" + sslscan_output, domain]
                
                try:
                    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                    stdout, stderr = process.communicate()
                    
                    # Если есть результаты, обрабатываем их
                    if os.path.exists(sslscan_output) and os.path.getsize(sslscan_output) > 0:
                        try:
                            tree = ET.parse(sslscan_output)
                            root = tree.getroot()
                            
                            results["tools_results"]["sslscan"] = {"output_file": sslscan_output}
                            
                            # Проверяем поддержку устаревших протоколов
                            ssl_protocols = root.findall(".//protocol")
                            for protocol in ssl_protocols:
                                if protocol.get("type") in ["ssl2", "ssl3", "tls1", "tls1_1"] and protocol.get("enabled") == "1":
                                    vulnerability = {
                                        "id": f"vuln-{scan_id}-{vuln_id}",
                                        "name": f"Deprecated SSL/TLS Protocol: {protocol.get('type')}",
                                        "description": f"The server supports deprecated SSL/TLS protocol: {protocol.get('type')}",
                                        "severity": "medium",
                                        "details": f"The server at {domain} supports {protocol.get('type').upper()}, " +
                                                   "which is considered insecure and has known vulnerabilities.",
                                        "category": "encryption",
                                        "remediation": "Disable older SSL/TLS protocols and only enable TLS 1.2 and TLS 1.3.",
                                        "dateDiscovered": datetime.datetime.now().isoformat() + "Z",
                                        "status": "open"
                                    }
                                    
                                    results["vulnerabilities"].append(vulnerability)
                                    vuln_id += 1
                            
                            # Проверяем слабые шифры
                            weak_ciphers = []
                            ciphers = root.findall(".//cipher")
                            for cipher in ciphers:
                                if "NULL" in cipher.get("cipher", "") or \
                                   "RC4" in cipher.get("cipher", "") or \
                                   "DES" in cipher.get("cipher", "") or \
                                   "EXPORT" in cipher.get("cipher", ""):
                                    weak_ciphers.append(cipher.get("cipher", ""))
                            
                            if weak_ciphers:
                                vulnerability = {
                                    "id": f"vuln-{scan_id}-{vuln_id}",
                                    "name": "Weak SSL/TLS Cipher Suites",
                                    "description": "The server supports weak cipher suites",
                                    "severity": "medium",
                                    "details": f"The server at {domain} supports the following weak cipher suites: " +
                                               ", ".join(weak_ciphers),
                                    "category": "encryption",
                                    "remediation": "Disable weak cipher suites and only enable strong ciphers with forward secrecy.",
                                    "dateDiscovered": datetime.datetime.now().isoformat() + "Z",
                                    "status": "open"
                                }
                                
                                results["vulnerabilities"].append(vulnerability)
                                vuln_id += 1
                            
                            # Проверяем срок действия сертификата
                            certificate = root.find(".//certificate")
                            if certificate:
                                expires = certificate.find(".//expires")
                                if expires is not None:
                                    expires_text = expires.text
                                    expires_date = datetime.datetime.strptime(expires_text, "%b %d %H:%M:%S %Y GMT")
                                    now = datetime.datetime.now()
                                    days_left = (expires_date - now).days
                                    
                                    if days_left < 30:
                                        vulnerability = {
                                            "id": f"vuln-{scan_id}-{vuln_id}",
                                            "name": "SSL Certificate Expiring Soon",
                                            "description": f"The SSL certificate will expire in {days_left} days",
                                            "severity": "medium" if days_left < 15 else "low",
                                            "details": f"The SSL certificate for {domain} will expire on {expires_text}.",
                                            "category": "encryption",
                                            "remediation": "Renew the SSL certificate before it expires.",
                                            "dateDiscovered": datetime.datetime.now().isoformat() + "Z",
                                            "status": "open"
                                        }
                                        
                                        results["vulnerabilities"].append(vulnerability)
                                        vuln_id += 1
                        
                        except Exception as e:
                            print(f"Error parsing sslscan results: {e}")
                
                except Exception as e:
                    print(f"Error running sslscan: {e}")
            
            # WPScan - для WordPress сайтов
            if "wpscan" in tools:
                wpscan_output = os.path.join(result_dir, "wpscan_results.json")
                
                cmd = ["wpscan", "--url", target, "--format", "json", "--output", wpscan_output]
                
                try:
                    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                    stdout, stderr = process.communicate()
                    
                    # Если есть результаты, обрабатываем их
                    if os.path.exists(wpscan_output) and os.path.getsize(wpscan_output) > 0:
                        with open(wpscan_output, "r") as f:
                            wpscan_data = json.load(f)
                        
                        results["tools_results"]["wpscan"] = wpscan_data
                        
                        # Обрабатываем найденные плагины
                        if "plugins" in wpscan_data:
                            for plugin_name, plugin_data in wpscan_data["plugins"].items():
                                if "vulnerabilities" in plugin_data and plugin_data["vulnerabilities"]:
                                    for vuln in plugin_data["vulnerabilities"]:
                                        vulnerability = {
                                            "id": f"vuln-{scan_id}-{vuln_id}",
                                            "name": f"WordPress Plugin Vulnerability: {plugin_name}",
                                            "description": vuln.get("title", ""),
                                            "severity": "high",  # Большинство уязвимостей плагинов критичны
                                            "details": f"The WordPress plugin {plugin_name} " +
                                                       f"(version {plugin_data.get('version', {}).get('number', 'unknown')}) " +
                                                       f"has a vulnerability: {vuln.get('title', '')}\n\n" +
                                                       f"References: {', '.join(vuln.get('references', {}).get('url', []))}",
                                            "category": "web",
                                            "remediation": "Update the plugin to the latest version or replace it with a secure alternative.",
                                            "dateDiscovered": datetime.datetime.now().isoformat() + "Z",
                                            "status": "open"
                                        }
                                        
                                        results["vulnerabilities"].append(vulnerability)
                                        vuln_id += 1
                        
                        # Обрабатываем найденные темы
                        if "themes" in wpscan_data:
                            for theme_name, theme_data in wpscan_data["themes"].items():
                                if "vulnerabilities" in theme_data and theme_data["vulnerabilities"]:
                                    for vuln in theme_data["vulnerabilities"]:
                                        vulnerability = {
                                            "id": f"vuln-{scan_id}-{vuln_id}",
                                            "name": f"WordPress Theme Vulnerability: {theme_name}",
                                            "description": vuln.get("title", ""),
                                            "severity": "high",
                                            "details": f"The WordPress theme {theme_name} " +
                                                       f"(version {theme_data.get('version', {}).get('number', 'unknown')}) " +
                                                       f"has a vulnerability: {vuln.get('title', '')}\n\n" +
                                                       f"References: {', '.join(vuln.get('references', {}).get('url', []))}",
                                            "category": "web",
                                            "remediation": "Update the theme to the latest version or replace it with a secure alternative.",
                                            "dateDiscovered": datetime.datetime.now().isoformat() + "Z",
                                            "status": "open"
                                        }
                                        
                                        results["vulnerabilities"].append(vulnerability)
                                        vuln_id += 1
                        
                        # Обрабатываем версию WordPress
                        if "wordpress" in wpscan_data and "version" in wpscan_data["wordpress"]:
                            wp_version = wpscan_data["wordpress"]["version"]
                            if "vulnerabilities" in wp_version and wp_version["vulnerabilities"]:
                                for vuln in wp_version["vulnerabilities"]:
                                    vulnerability = {
                                        "id": f"vuln-{scan_id}-{vuln_id}",
                                        "name": f"WordPress Core Vulnerability",
                                        "description": vuln.get("title", ""),
                                        "severity": "high",
                                        "details": f"The WordPress installation (version {wp_version.get('number', 'unknown')}) " +
                                                   f"has a vulnerability: {vuln.get('title', '')}\n\n" +
                                                   f"References: {', '.join(vuln.get('references', {}).get('url', []))}",
                                        "category": "web",
                                        "remediation": "Update WordPress to the latest version.",
                                        "dateDiscovered": datetime.datetime.now().isoformat() + "Z",
                                        "status": "open"
                                    }
                                    
                                    results["vulnerabilities"].append(vulnerability)
                                    vuln_id += 1
                
                except Exception as e:
                    print(f"Error running wpscan: {e}")
            
            # SQLMap - для поиска SQL инъекций
            if "sqlmap" in tools:
                # SQLMap может работать только с формами или параметрами
                # Для демонстрации просто отметим, что инструмент был запущен
                results["tools_results"]["sqlmap"] = {
                    "note": "SQLMap requires specific URLs with parameters or forms to test."
                }
                
                # В реальном приложении здесь был бы код для поиска форм на сайте,
                # а затем проверки их на SQL инъекции
            
            # Обновляем результаты сканирования
            # Считаем количество уязвимостей по уровням серьезности
            high_count = sum(1 for v in results["vulnerabilities"] if v["severity"] == "high")
            medium_count = sum(1 for v in results["vulnerabilities"] if v["severity"] == "medium")
            low_count = sum(1 for v in results["vulnerabilities"] if v["severity"] == "low")
            
            # Формируем итоговый результат в формате, совместимом с фронтендом
            scan_result = {
                "id": scan_id,
                "target": target,
                "date": results["start_time"],
                "status": ScanStatus.COMPLETED,
                "duration": 180,  # Примерно 3 минуты
                "findings": {
                    "high": high_count,
                    "medium": medium_count,
                    "low": low_count,
                    "total": high_count + medium_count + low_count,
                    "resolved": 0
                },
                "vulnerabilities": results["vulnerabilities"],
                "openPorts": [],  # Для веб-сканирования это не так важно
                "hostInfo": {
                    "hostname": target,
                    "ip": "",  # Можно добавить с помощью socket.gethostbyname
                    "operatingSystem": "Unknown"
                },
                "scanOptions": {
                    "tools": tools
                }
            }
            
            # Сохраняем результаты в JSON файл
            with open(os.path.join(result_dir, "processed_results.json"), "w") as f:
                json.dump(scan_result, f, indent=2)
            
            # Обновляем статус сканирования
            active_scans[scan_id] = ScanStatus.COMPLETED
            print(f"Web scan {scan_id} completed successfully")
            
        except Exception as e:
            active_scans[scan_id] = ScanStatus.FAILED
            print(f"Error during web scan {scan_id}: {e}")
            
            # Сохраняем информацию об ошибке
            with open(os.path.join(result_dir, "error.log"), "w") as f:
                f.write(str(e))
    
    # Запускаем сканирование в отдельном потоке
    thread = threading.Thread(target=run_web_scan)
    thread.start()
    
    return jsonify({
        "id": scan_id,
        "status": ScanStatus.QUEUED,
        "message": "Web scan started successfully"
    })


@scan_bp.route('/check-port/<string:host>/<int:port>', methods=['GET'])
@jwt_required()
def check_port(host, port):
    """Проверяет доступность указанного порта на хосте"""
    try:
        # Проверяем доступность порта
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(3)  # Таймаут 3 секунды
        result = sock.connect_ex((host, port))
        sock.close()
        
        return jsonify({
            "host": host,
            "port": port,
            "open": result == 0
        })
    except Exception as e:
        return jsonify({
            "host": host,
            "port": port,
            "open": False,
            "error": str(e)
        })


@scan_bp.route('/dns-info/<string:domain>', methods=['GET'])
@jwt_required()
def get_dns_info(domain):
    """Получает DNS информацию о домене"""
    try:
        # Получаем IP адреса
        ip_addresses = socket.gethostbyname_ex(domain)[2]
        
        # В реальном приложении можно было бы использовать dnspython для
        # получения дополнительной информации (MX, NS, CNAME, и т.д.)
        
        return jsonify({
            "domain": domain,
            "ip_addresses": ip_addresses,
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "domain": domain,
            "error": str(e),
            "status": "error"
        })


@scan_bp.route('/vulnerabilities/<int:scan_id>', methods=['GET'])
@jwt_required()
def get_vulnerabilities(scan_id):
    """Возвращает список уязвимостей для сканирования"""
    # Проверяем, есть ли результаты в файловой системе
    result_dir = os.path.join(SCAN_RESULTS_DIR, str(scan_id))
    result_file = os.path.join(result_dir, "processed_results.json")
    
    if os.path.exists(result_file):
        with open(result_file, "r") as f:
            scan_data = json.load(f)
        
        return jsonify(scan_data.get("vulnerabilities", []))
    
    # Если нет результатов на диске, ищем в mock данных
    scan = next((s for s in mock_scans if s["id"] == scan_id), None)
    if scan:
        return jsonify(scan.get("vulnerabilities", []))
    
    return jsonify({"error": "Scan not found"}), 404


@scan_bp.route('/vulnerability/<int:scan_id>/<string:vuln_id>/status', methods=['PUT'])
@jwt_required()
def update_vulnerability_status(scan_id, vuln_id):
    """Обновляет статус уязвимости (открыта/решена)"""
    data = request.get_json()
    new_status = data.get('status')
    
    if new_status not in ['open', 'resolved']:
        return jsonify({"error": "Invalid status. Must be 'open' or 'resolved'"}), 400
    
    # Проверяем, есть ли результаты в файловой системе
    result_dir = os.path.join(SCAN_RESULTS_DIR, str(scan_id))
    result_file = os.path.join(result_dir, "processed_results.json")
    
    if os.path.exists(result_file):
        with open(result_file, "r") as f:
            scan_data = json.load(f)
        
        # Ищем уязвимость по ID
        for vuln in scan_data.get("vulnerabilities", []):
            if vuln["id"] == vuln_id:
                vuln["status"] = new_status
                
                # Обновляем счетчики в findings
                findings = scan_data.get("findings", {})
                if new_status == "resolved":
                    findings["resolved"] = findings.get("resolved", 0) + 1
                else:
                    findings["resolved"] = max(0, findings.get("resolved", 0) - 1)
                
                # Сохраняем обновленные данные
                with open(result_file, "w") as f:
                    json.dump(scan_data, f, indent=2)
                
                return jsonify({
                    "id": vuln_id,
                    "status": new_status,
                    "message": f"Vulnerability status updated to {new_status}"
                })
        
        return jsonify({"error": "Vulnerability not found"}), 404
    
    # Если нет результатов на диске, ищем в mock данных
    scan = next((s for s in mock_scans if s["id"] == scan_id), None)
    if scan:
        # Ищем уязвимость по ID
        for vuln in scan.get("vulnerabilities", []):
            if vuln["id"] == vuln_id:
                vuln["status"] = new_status
                
                # Обновляем счетчики в findings
                findings = scan.get("findings", {})
                if new_status == "resolved":
                    findings["resolved"] = findings.get("resolved", 0) + 1
                else:
                    findings["resolved"] = max(0, findings.get("resolved", 0) - 1)
                
                return jsonify({
                    "id": vuln_id,
                    "status": new_status,
                    "message": f"Vulnerability status updated to {new_status}"
                })
        
        return jsonify({"error": "Vulnerability not found"}), 404
    
    return jsonify({"error": "Scan not found"}), 404
            