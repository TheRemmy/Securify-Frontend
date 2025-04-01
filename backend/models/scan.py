import sqlite3
import json
from datetime import datetime

class Scan:
    def __init__(self, id=None, user_id=None, target=None, scan_type=None, status="pending"):
        self.id = id
        self.user_id = user_id
        self.target = target
        self.scan_type = scan_type
        self.status = status
        self.created_at = datetime.now()
    
    @staticmethod
    def get_db_connection():
        conn = sqlite3.connect('database/infosec.db')
        conn.row_factory = sqlite3.Row
        return conn
    
    def save(self):
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO scans (user_id, target, scan_type, status) VALUES (?, ?, ?, ?)',
                (self.user_id, self.target, self.scan_type, self.status)
            )
            conn.commit()
            self.id = cursor.lastrowid
            return True
        except Exception as e:
            conn.rollback()
            return False
        finally:
            conn.close()
    
    def update_status(self, status):
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'UPDATE scans SET status = ? WHERE id = ?',
                (status, self.id)
            )
            conn.commit()
            self.status = status
            return True
        except:
            conn.rollback()
            return False
        finally:
            conn.close()
    
    def save_result(self, result_data):
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO scan_results (scan_id, result_data) VALUES (?, ?)',
                (self.id, json.dumps(result_data) if isinstance(result_data, dict) else result_data)
            )
            conn.commit()
            return True
        except:
            conn.rollback()
            return False
        finally:
            conn.close()
    
    @classmethod
    def find_by_id(cls, scan_id):
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM scans WHERE id = ?', (scan_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            scan = cls()
            scan.id = row['id']
            scan.user_id = row['user_id']
            scan.target = row['target']
            scan.scan_type = row['scan_type']
            scan.status = row['status']
            return scan
        return None
    
    @classmethod
    def find_by_user_id(cls, user_id):
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM scans WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
        rows = cursor.fetchall()
        conn.close()
        
        scans = []
        for row in rows:
            scan = cls()
            scan.id = row['id']
            scan.user_id = row['user_id']
            scan.target = row['target']
            scan.scan_type = row['scan_type']
            scan.status = row['status']
            scans.append(scan)
        
        return scans
    
    @classmethod
    def get_result(cls, scan_id):
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT result_data FROM scan_results WHERE scan_id = ?', (scan_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            try:
                return json.loads(row['result_data'])
            except:
                return row['result_data']
        return None
