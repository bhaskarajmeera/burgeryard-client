import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('burgerYardToken');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const apiClient = api;

export const authApi = {
  signup: (payload) => api.post('/signup', payload),
  login: (payload) => api.post('/login', payload),
  getProfile: () => api.get('/me'),
  updateProfile: (payload) => api.put('/profile', payload),
  getOrders: () => api.get('/orders'),
};

export const checkoutApi = {
  createPaymentIntent: (payload) => api.post('/payments/create-intent', payload),
  placeOrder: (payload) => api.post('/checkout', payload),
};

export const menuApi = {
  getAll: () => api.get('/menu'),
  create: (payload) => api.post('/admin/menu', payload),
  update: (id, payload) => api.put(`/admin/menu/${id}`, payload),
  remove: (id) => api.delete(`/admin/menu/${id}`),
};
