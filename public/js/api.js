/**
 * WargaKonek Desa Pajerukan - API Client & Utility Functions
 */

const API_BASE = '/api';

const Api = {
  async get(endpoint, params = {}) {
    const url = new URL(`${window.location.origin}${API_BASE}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal memuat data dari server.');
      }
      return result;
    } catch (error) {
      console.error(`API GET error on ${endpoint}:`, error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengirim data ke server.');
      }
      return result;
    } catch (error) {
      console.error(`API POST error on ${endpoint}:`, error);
      throw error;
    }
  },

  async patch(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal memperbarui data.');
      }
      return result;
    } catch (error) {
      console.error(`API PATCH error on ${endpoint}:`, error);
      throw error;
    }
  }
};

// UI Feedback Utilities
const Toast = {
  container: null,
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = 'success', duration = 4000) {
    this.init();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="icon"></i>
      <span>${message}</span>
    `;
    this.container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// Helpers for dates & status badges
const Utils = {
  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  },

  formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date) + ' WIB';
  },

  renderStatusBadge(status) {
    const s = (status || '').toLowerCase();
    let iconName = 'clock';
    if (s === 'ditinjau') iconName = 'eye';
    else if (s === 'diproses') iconName = 'loader';
    else if (s === 'selesai') iconName = 'check-circle';
    else if (s === 'ditolak') iconName = 'x-circle';

    return `<span class="status-badge ${s}">
      <i data-lucide="${iconName}" class="icon icon-sm"></i>
      <span>${status || 'Menunggu'}</span>
    </span>`;
  },

  renderLoading(message = 'Memuat data...') {
    return `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>${message}</p>
      </div>
    `;
  },

  renderEmpty(message = 'Tidak ada data yang ditemukan.', icon = 'inbox') {
    return `
      <div class="empty-state">
        <i data-lucide="${icon}" class="icon icon-lg"></i>
        <p>${message}</p>
      </div>
    `;
  },

  renderError(message = 'Terjadi kesalahan saat memuat data.', icon = 'alert-triangle') {
    return `
      <div class="error-state">
        <i data-lucide="${icon}" class="icon icon-lg" style="color:#DC2626;"></i>
        <p style="color:#DC2626; font-weight:600;">${message}</p>
        <button class="btn btn-sm btn-outline" onclick="window.location.reload()" style="margin-top:1rem;">
          Coba Lagi
        </button>
      </div>
    `;
  }
};
