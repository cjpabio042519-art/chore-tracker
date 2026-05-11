const API_BASE = '/api';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    return headers;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: this.getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  async signup(email, password) {
    return this.request('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
  }

  async login(email, password) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  }

  async getTasks() {
    return this.request('/tasks');
  }

  async createTask(task) {
    return this.request('/tasks', { method: 'POST', body: JSON.stringify(task) });
  }

  async updateTask(id, updates) {
    return this.request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, { method: 'DELETE' });
  }
}

const api = new APIClient();
