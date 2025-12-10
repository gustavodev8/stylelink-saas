// ===================================
// STYLELINK - API CLIENT
// ===================================

const API_URL = 'http://localhost:3000/api';

class API {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Helper para fazer requisições
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        // Criar erro com dados adicionais
        const error = new Error(data.message || 'Erro na requisição');
        error.needsVerification = data.needsVerification;
        error.email = data.email;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Auth
  async register(email, password, storeName, storeSlug) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, storeName, storeSlug })
    });
    this.token = data.data.token;
    localStorage.setItem('token', this.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.token = data.data.token;
    localStorage.setItem('token', this.token);
    return data;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async checkSlug(slug) {
    return this.request(`/auth/check-slug/${slug}`);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  // Store
  async getStore() {
    return this.request('/store');
  }

  async updateStore(data) {
    return this.request('/store', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Products
  async getProducts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/products?${params}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(data) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateProduct(id, data) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Social Links
  async getSocialLinks() {
    return this.request('/social');
  }

  async upsertSocialLink(data) {
    return this.request('/social', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async deleteSocialLink(platform) {
    return this.request(`/social/${platform}`, {
      method: 'DELETE'
    });
  }

  // Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload/single`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro no upload');
    }

    return data;
  }

  async uploadMultipleImages(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro no upload');
    }

    return data;
  }

  // Public Page
  async getPublicPage(slug) {
    return this.request(`/page/${slug}`);
  }
}

// Criar instância global
const api = new API();

// Verificar autenticação
function requireAuth() {
  if (!api.token) {
    window.location.href = '/';
  }
}

// Mostrar mensagem de sucesso/erro
function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  const container = document.querySelector('.login-box') || document.querySelector('.main-content');
  if (container) {
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
}
