import subprocess
import xml.etree.ElementTree as ET
import json
import time
import threading
from models.scan import Scan

def parse_nmap_xml(xml_data):
    """Parse Nmap XML output into a structured dictionary"""
    try:
        root = ET.fromstring(xml_data)
        result = {
            'hosts': [],
            'summary': {}
        }
        
        # Get hosts info
        for host in root.findall('./host'):
            host_info = {'addresses': [], 'ports': []}
            
            # Get addresses
            for addr in host.findall('./address'):
                host_info['addresses'].append({
                    'addr': addr.get('addr'),
                    'addrtype': addr.get('addrtype')
                })
            
            # Get host names
            hostnames = []
            for hostname in host.findall('./hostnames/hostname'):
                hostnames.append(hostname.get('name'))
            host_info['hostnames'] = hostnames
            
            # Get ports
            for port in host.findall('./ports/port'):
                port_info = {
                    'port': port.get('portid'),
                    'protocol': port.get('protocol'),
                    'state': port.find('./state').get('state') if port.find('./state') is not None else '',
                    'service': port.find('./service').get('name') if port.find('./service') is not None else '',
                    'product': port.find('./service').get('product') if port.find('./service') is not None else '',
                    'version': port.find('./service').get('version') if port.find('./service') is not None else ''
                }
                host_info['ports'].append(port_info)
            
            result['hosts'].append(host_info)
        
        # Get summary
        run_stats = root.find('./runstats/finished')
        if run_stats is not None:
            result['summary'] = {
                'time': run_stats.get('time'),
                'timestr': run_stats.get('timestr'),
                'elapsed': run_stats.get('elapsed'),
                'exit': run_stats.get('exit')
            }
        
        return result
    except Exception as e:
        return {'error': str(e)}

def run_port_scan(scan_id, target, options="-sV"):
    """Run Nmap port scan as a background task"""
    scan = Scan.find_by_id(scan_id)
    if not scan:
        return
    
    scan.update_status("running")
    
    try:
        # Run Nmap with XML output
        cmd = ["nmap", options, target, "-oX", "-"]
        process = subprocess.run(cmd, capture_output=True, text=True)
        
        if process.returncode != 0:
            scan.update_status("failed")
            scan.save_result({"error": process.stderr})
            return
        
        # Parse and save the results
        result = parse_nmap_xml(process.stdout)
        scan.save_result(result)
        scan.update_status("completed")
    except Exception as e:
        scan.update_status("failed")
        scan.save_result({"error": str(e)})

def start_port_scan(user_id, target, scan_type="basic"):
    """Initialize a port scan and run it in the background"""
    scan_options = {
        "basic": "-sV",  # Service detection
        "quick": "-T4 -F",  # Fast scan
        "full": "-sS -sV -O -p-",  # Full scan with OS detection
        "udp": "-sU -sV --top-ports 100"  # UDP scan
    }
    
    options = scan_options.get(scan_type, "-sV")
    
    # Create scan record
    scan = Scan(user_id=user_id, target=target, scan_type=f"port_scan_{scan_type}", status="pending")
    if not scan.save():
        return None
    
    # Start scan in background
    thread = threading.Thread(target=run_port_scan, args=(scan.id, target, options))
    thread.daemon = True
    thread.start()
    
    return scan.id
