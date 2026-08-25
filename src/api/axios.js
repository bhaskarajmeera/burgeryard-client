import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = `${configuredApiUrl.replace(/\/+$/, '')}/api/v1`;

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
  // Create a new customer account.
  signup: (payload) => api.post('/signup', payload),
  // Authenticate an existing customer.
  login: (payload) => api.post('/login', payload),
  // Load the signed-in customer's profile.
  getProfile: () => api.get('/me'),
  // Save profile, address, and masked card details.
  updateProfile: (payload) => api.put('/profile', payload),
  // Load the signed-in customer's order history.
  getOrders: () => api.get('/orders'),
};

export const checkoutApi = {
  // Create a Stripe payment intent for the order total.
  createPaymentIntent: (payload) => api.post('/payments/create-intent', payload),
  // Submit the order after payment details are collected.
  placeOrder: (payload) => api.post('/checkout', payload),
};

export const menuApi = {
  // Load menu items available to customers.
  getAll: () => api.get('/menu'),
  // Add a menu item from the admin dashboard.
  create: (payload) => api.post('/admin/menu', payload),
  // Update an existing menu item from the admin dashboard.
  update: (id, payload) => api.put(`/admin/menu/${id}`, payload),
  // Remove a menu item from the admin dashboard.
  remove: (id) => api.delete(`/admin/menu/${id}`),
};
