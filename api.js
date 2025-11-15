// API service utility
// NOTE: For React Native/Expo:
// - iOS Simulator: use 'http://localhost:8888/api'
// - Android Emulator: use 'http://10.0.2.2:8888/api'
// - Physical devices: use your computer's IP address, e.g., 'http://192.168.1.100:8888/api'
// - Production: use your deployed backend URL
const API_BASE_URL = 'http://localhost:8888/api'; // Change this to your backend URL

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(username, password, fullName) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, fullName }),
    });
  }

  // Room endpoints
  async getRooms() {
    return this.request('/rooms');
  }

  async createRoom(id, name) {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify({ id, name }),
    });
  }

  // Device endpoints
  async getDevices() {
    return this.request('/device/status/all');
  }

  async controlDevice(device, action, value = null) {
    const body = { action };
    if (value !== null) {
      body.value = value;
    }
    return this.request(`/device/${device}/action`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Sensor endpoints
  async getSensors() {
    return this.request('/sensors');
  }

  async getSensorData(sensorId, limit = 50) {
    return this.request(`/sensors/${sensorId}/data?limit=${limit}`);
  }

  // Automation endpoints
  async runScene(scene) {
    return this.request(`/automation/run/${scene}`, {
      method: 'POST',
    });
  }

  // Log endpoints
  async getLogs(device = null, limit = 50) {
    const queryParams = new URLSearchParams({ limit: limit.toString() });
    if (device) {
      queryParams.append('device', device);
    }
    return this.request(`/logs?${queryParams.toString()}`);
  }

  // Status endpoint
  async getStatus() {
    return this.request('/status');
  }
}

export default new ApiService();

