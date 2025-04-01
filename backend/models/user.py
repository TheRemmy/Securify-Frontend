import sqlite3
import hashlib
from datetime import datetime

class User:
    def __init__(self, id=None, username=None, email=None, password=None, role='user'):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = self._hash_password(password) if password else None
        self.role = role
        self.created_at = datetime.now()
    
    def _hash_password(self, password):
        # Simple password hashing using SHA-256
        return hashlib.sha256(password.encode()).hexdigest()
    
    def check_password(self, password):
        return self.password_hash == self._hash_password(password)
    
    @staticmethod
    def get_db_connection():
        conn = sqlite3.connect('database/infosec.db')
        conn.row_factory = sqlite3.Row
        return conn
    
    @classmethod
    def create(cls, username, email, password, role='user'):
        user = cls(username=username, email=email, password=password, role=role)
        
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                (user.username, user.email, user.password_hash, user.role)
            )
            conn.commit()
            user.id = cursor.lastrowid
            return user
        except sqlite3.IntegrityError:
            conn.rollback()
            return None
        finally:
            conn.close()
    
    @classmethod
    def find_by_username(cls, username):
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            user = cls()
            user.id = row['id']
            user.username = row['username']
            user.email = row['email']
            user.password_hash = row['password_hash']
            user.role = row['role']
            return user
        return None
    
    @classmethod
    def find_by_email(cls, email):
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            user = cls()
            user.id = row['id']
            user.username = row['username']
            user.email = row['email']
            user.password_hash = row['password_hash']
            user.role = row['role']
            return user
        return None
