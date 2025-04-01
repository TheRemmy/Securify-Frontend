from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

# Временно используем мок-данные вместо базы данных
mock_users = {
    "admin": {
        "id": 1,
        "username": "admin",
        "password": generate_password_hash("admin123"),
        "email": "admin@example.com",
        "fullName": "Administrator",
        "company": "SecureScan Inc.",
        "jobTitle": "Security Administrator",
        "role": "admin",
        "createdAt": "2023-01-15T09:30:00Z"
    },
    "testuser": {
        "id": 2,
        "username": "testuser",
        "password": generate_password_hash("password123"),
        "email": "test@example.com",
        "fullName": "Test User",
        "company": "ACME Corporation",
        "jobTitle": "Security Analyst",
        "role": "user",
        "createdAt": "2023-01-15T09:30:00Z"
    }
}

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', None)
    password = data.get('password', None)
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    user = mock_users.get(username)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Create JWT token
    access_token = create_access_token(identity=username)
    
    # Update last login time (in a real application, this would be saved to database)
    user_data = {k: v for k, v in user.items() if k != 'password'}
    user_data['lastLogin'] = datetime.datetime.now().isoformat()
    
    return jsonify({
        "token": access_token,
        "user": user_data
    })

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', None)
    email = data.get('email', None)
    password = data.get('password', None)
    
    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400
    
    if username in mock_users:
        return jsonify({"error": "Username already exists"}), 409
    
    # Create new user
    new_user = {
        "id": len(mock_users) + 1,
        "username": username,
        "password": generate_password_hash(password),
        "email": email,
        "fullName": data.get('fullName', username),
        "company": data.get('company', ''),
        "jobTitle": data.get('jobTitle', ''),
        "role": "user",
        "createdAt": datetime.datetime.now().isoformat(),
        "lastLogin": datetime.datetime.now().isoformat()
    }
    
    # In a real application, this would be saved to a database
    mock_users[username] = new_user
    
    # Create token for auto-login
    access_token = create_access_token(identity=username)
    
    # Return new user without password
    user_data = {k: v for k, v in new_user.items() if k != 'password'}
    
    return jsonify({
        "token": access_token,
        "user": user_data
    }), 201

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user = get_jwt_identity()
    if current_user not in mock_users:
        return jsonify({"error": "User not found"}), 404
    
    # Return user data without password
    user_data = {k: v for k, v in mock_users[current_user].items() if k != 'password'}
    
    return jsonify(user_data)

@auth_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user = get_jwt_identity()
    if current_user not in mock_users:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    user = mock_users[current_user]
    
    # Update user fields
    if 'email' in data:
        user['email'] = data['email']
    if 'fullName' in data:
        user['fullName'] = data['fullName']
    if 'company' in data:
        user['company'] = data['company']
    if 'jobTitle' in data:
        user['jobTitle'] = data['jobTitle']
    
    # Return updated user without password
    user_data = {k: v for k, v in user.items() if k != 'password'}
    
    return jsonify({
        "message": "Profile updated successfully",
        "user": user_data
    })