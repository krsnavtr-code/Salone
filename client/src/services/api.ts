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

// Service types
export interface ServiceResponse {
  id: number;
  name: string;
  description: string | null;
  price: number | string;
  duration: number | string;
  category: string;
  is_active: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // For any additional properties
}

// Service functions
export const serviceApi = {
  // Get all services (public endpoint)
  getAllServices: async (): Promise<ServiceResponse[]> => {
    try {
      const response = await api.get<ServiceResponse[]>('/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Get services by category (admin endpoint)
  getServicesByCategory: async (categoryId: string | number): Promise<ServiceResponse[]> => {
    try {
      const response = await api.get<ServiceResponse[]>(`/services/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching services for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Get service by ID
  getServiceById: async (id: string | number): Promise<ServiceResponse> => {
    try {
      const response = await api.get<ServiceResponse>(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      throw error;
    }
  }
};

export default api;
