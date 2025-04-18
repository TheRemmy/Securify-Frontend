from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from backend.api.auth import auth_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'infosec-platform-secret-2024'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-infosec-2024'

# Initialize extensions
CORS(app)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok', 'message': 'API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
