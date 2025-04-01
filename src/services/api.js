// services/api.js
const API_BASE_URL = 'http://192.168.0.54:5000/api';  // Измените на реальный IP-адрес вашего бэкенда

export const authService = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },
  
  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return await response.json();
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  isAuthenticated: () => {
    // Проверяем наличие токена в localStorage
    return !!localStorage.getItem('token');
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const scanService = {
  getScans: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/scan/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch scans');
    }
    
    return await response.json();
  },
  
  getScanById: async (scanId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/scan/${scanId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch scan details');
    }
    
    return await response.json();
  },
  
  createScan: async (scanData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/scan/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(scanData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create scan');
    }
    
    return await response.json();
  },
  
  getScanStatus: async (scanId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/scan/status/${scanId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get scan status');
    }
    
    return await response.json();
  },
  
  getDashboardData: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/scan/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    
    return await response.json();
  },
  
  updateVulnerabilityStatus: async (scanId, vulnId, status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/scan/vulnerability/${scanId}/${vulnId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update vulnerability status');
    }
    
    return await response.json();
  },
  
  // Метод для веб-сканирования
  createWebScan: async (scanData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/scan/web-scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(scanData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create web scan');
    }
    
    return await response.json();
  },
  
  // Получение доступных инструментов
  getAvailableTools: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/scan/tools`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch available tools');
    }
    
    return await response.json();
  },
  
  // Метод для симуляции завершения сканирования (для тестирования)
  simulateScanCompletion: async (scanId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/scan/simulate/${scanId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to simulate scan completion');
    }
    
    return await response.json();
  }
};