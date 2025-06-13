import axios, { AxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:5000/api';

// Extend the AxiosRequestConfig to include our custom _retry property
interface RetryableAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

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

// Store the original request config for retry
const pendingRequests: Array<() => void> = [];
let onUnauthenticated: (() => void) | null = null;

// Function to set the callback for when authentication is required
export const setOnUnauthenticated = (callback: (() => void) | null) => {
  onUnauthenticated = callback;
};

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If this is the first time we're seeing this 401, handle it
      originalRequest._retry = true;
      
      // Remove the invalid token
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Store the current URL for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentPath);
      
      // If we have a callback for unauthenticated state, call it
      if (onUnauthenticated) {
        onUnauthenticated();
      } else {
        // Fallback to redirect if no callback is set
        window.location.href = '/?showLogin=true';
      }
      
      // Return a promise that will be resolved after successful login
      return new Promise((resolve, reject) => {
        pendingRequests.push(() => {
          // Retry the original request with new token
          const token = localStorage.getItem('token');
          if (token && originalRequest) {
            // Ensure headers exist
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }
    
    return Promise.reject(error);
  }
);

// Export a function to retry pending requests after successful login
export const retryPendingRequests = () => {
  while (pendingRequests.length > 0) {
    const request = pendingRequests.shift();
    if (request) request();
  }
};

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
