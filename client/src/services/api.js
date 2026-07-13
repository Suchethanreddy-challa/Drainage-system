import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'https://drainage-system.onrender.com'}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sdm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sdm_token');
      localStorage.removeItem('sdm_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Complaint APIs
export const complaintAPI = {
  create: (formData) => api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (params) => api.get('/complaints', { params }),
  getOne: (id) => api.get(`/complaints/${id}`),
  track: (complaintId) => api.get(`/complaints/track/${complaintId}`),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
  assignWorker: (id, data) => api.put(`/complaints/${id}/assign`, data),
  getStats: () => api.get('/complaints/stats'),
  getAnalytics: () => api.get('/complaints/analytics'),
  getMapData: () => api.get('/complaints/map'),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAreas: () => api.get('/admin/areas'),
};

export default api;
