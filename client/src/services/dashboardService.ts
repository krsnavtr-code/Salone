import { api } from './api';

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  totalServices: number;
  totalUsers: number;
  totalRevenue: number;
  upcomingAppointments: {
    date: string;
    count: number;
  }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalAppointments: 0,
      todayAppointments: 0,
      totalServices: 0,
      totalUsers: 0,
      totalRevenue: 0,
      upcomingAppointments: [],
    };
  }
};
