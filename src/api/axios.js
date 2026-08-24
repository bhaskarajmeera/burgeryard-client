import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

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
  placeOrder: (payload) => api.post('/checkout', payload),
};
