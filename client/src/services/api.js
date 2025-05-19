import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
};

export const servicesApi = {
  getAll: async () => {
    return api.get('/services');
  },
  getById: async (id) => {
    return api.get(`/services/${id}`);
  },
};

export const appointmentsApi = {
  create: async (appointmentData) => {
    return api.post('/appointments', appointmentData);
  },
  getAll: async () => {
    return api.get('/appointments');
  },
};
