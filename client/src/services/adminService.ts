import axios from 'axios';
import { getHeaders } from './authService';

// Admin Dashboard Stats Interface
export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  totalServices: number;
  totalUsers: number;
  upcomingAppointments: Array<{
    date: string;
    count: number;
  }>;
}

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await axios.get('/api/admin/dashboard', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Manage Services
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await axios.get('/api/admin/services', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const createService = async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
  try {
    const response = await axios.post('/api/admin/services', serviceData, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (id: number, serviceData: Partial<Service>): Promise<Service> => {
  try {
    const response = await axios.put(`/api/admin/services/${id}`, serviceData, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/api/admin/services/${id}`, { headers: getHeaders() });
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// Manage Users
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get('/api/admin/users', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserRole = async (id: number, role: string): Promise<User> => {
  try {
    const response = await axios.put(`/api/admin/users/${id}/role`, { role }, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Manage Appointments
export interface Appointment {
  id: number;
  userId: number;
  serviceId: number;
  date: string;
  time: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await axios.get('/api/admin/appointments', { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const updateAppointmentStatus = async (id: number, status: string): Promise<Appointment> => {
  try {
    const response = await axios.put(`/api/admin/appointments/${id}/status`, { status }, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};
