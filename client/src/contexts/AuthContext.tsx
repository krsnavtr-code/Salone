import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'superadmin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Decode the token to get user info
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const userData = JSON.parse(window.atob(base64));
          
          // Get the full user data from localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            // Make sure the role from token matches the stored user
            if (userData.role) {
              user.role = userData.role;
            }
            setUser(user);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null); // Clear any previous error
      // First, try to login with our backend
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      console.log('Login successful, user role:', user.role);
      
      // Get the redirect URL
      const urlParams = new URLSearchParams(window.location.search);
      let redirectUrl = urlParams.get('redirect') || '/';
      
      // Redirect admin users to admin dashboard
      if ((user.role === 'admin' || user.role === 'superadmin') && !redirectUrl.startsWith('/admin')) {
        redirectUrl = '/admin';
      }
      
      // Show success message and redirect
      setError('Login successful! Redirecting...');
      
      // Use a small timeout to allow the UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use navigate instead of window.location
      navigate(redirectUrl, { replace: true });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || 'Login failed. Please check your credentials and try again.');
      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed. Please check your details and try again.');
    }
  };

  const logout = async () => {
    try {
      // Call the logout endpoint
      await api.get('/auth/logout');
      // Clear local storage and user state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      // Redirect to login page
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
