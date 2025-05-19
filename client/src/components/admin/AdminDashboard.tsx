import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardStats, DashboardStats } from '../../services/dashboardService';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-pink-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-pink-600">{stats?.totalAppointments || 0}</p>
              </div>
              <div className="bg-pink-100 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-pink-600">{stats?.todayAppointments || 0}</p>
              </div>
              <div className="bg-pink-100 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-pink-600">{stats?.totalServices || 0}</p>
              </div>
              <div className="bg-pink-100 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-pink-600">{stats?.totalUsers || 0}</p>
              </div>
              <div className="bg-pink-100 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.upcomingAppointments || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff4747" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Services Management */}
          <Link to="/admin/services" className="bg-pink-50 rounded-lg p-6 hover:bg-pink-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-pink-600 mb-2">Services</div>
                <p className="text-gray-600">Manage salon services</p>
              </div>
              <div className="bg-pink-100 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total: {stats?.totalServices || 0}</span>
              <span>Active: {stats?.totalServices || 0}</span>
            </div>
          </Link>

          {/* Appointments Management */}
          <Link to="/admin/appointments" className="bg-pink-50 rounded-lg p-6 hover:bg-pink-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-pink-600 mb-2">Appointments</div>
                <p className="text-gray-600">Manage customer appointments</p>
              </div>
              <div className="bg-pink-100 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Today: {stats?.todayAppointments || 0}</span>
              <span>Total: {stats?.totalAppointments || 0}</span>
            </div>
          </Link>

          {/* User Management */}
          <Link to="/admin/users" className="bg-pink-50 rounded-lg p-6 hover:bg-pink-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-pink-600 mb-2">Users</div>
                <p className="text-gray-600">Manage salon users</p>
              </div>
              <div className="bg-pink-100 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total: {stats?.totalUsers || 0}</span>
              <span>Active: {stats?.totalUsers || 0}</span>
            </div>
          </Link>

          {/* Offers Management */}
          <Link to="/admin/offers" className="bg-pink-50 rounded-lg p-6 hover:bg-pink-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-pink-600 mb-2">Offers</div>
                <p className="text-gray-600">Manage special offers</p>
              </div>
              <div className="bg-pink-100 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 0112 15c2.305 0 4.408.867 6.132 2.348m-3.438-5.845L21 6.75A.75.75 0 0021.75 6H22.5A1.5 1.5 0 0024 7.5v9A1.5 1.5 0 0022.5 18H9a1.5 1.5 0 00-1.5 1.5v.75A.75.75 0 009 19.5h.75m-3.44-2.04l.054-.09A13.916 13.916 0 0012 15c2.305 0 4.408.867 6.132 2.348m-3.438-5.845A2.5 2.5 0 0118 16.07V19.25a.75.75 0 01-.75.75h-9a.75.75 0 01-.75-.75V16.07a2.5 2.5 0 012.385-2.22"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Active: 0</span>
              <span>Expired: 0</span>
            </div>
          </Link>

          {/* Analytics */}
          <Link to="/admin/analytics" className="bg-pink-50 rounded-lg p-6 hover:bg-pink-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-pink-600 mb-2">Analytics</div>
                <p className="text-gray-600">View salon performance</p>
              </div>
              <div className="bg-pink-100 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Revenue: ${stats?.totalRevenue?.toFixed(2) || 0}</span>
              <span>Appointments: {stats?.totalAppointments || 0}</span>
            </div>
          </Link>

          {/* Settings */}
          <Link to="/admin/settings" className="bg-pink-50 rounded-lg p-6 hover:bg-pink-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-pink-600 mb-2">Settings</div>
                <p className="text-gray-600">Configure salon settings</p>
              </div>
              <div className="bg-pink-100 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Working Days: 6</span>
              <span>Hours: 9-6</span>
            </div>
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-gray-600">Welcome, {user?.name}! You're logged in as an admin.</p>
        </div>
      </div>
    </div>
  );
}
