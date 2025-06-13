import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, retryPendingRequests, setOnUnauthenticated } from '../services/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'superadmin';
  phone: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading for backward compatibility
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoginModalOpen: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  
  // Set the onUnauthenticated callback when the component mounts
  useEffect(() => {
    setOnUnauthenticated(openLoginModal);
    
    // Clean up the callback when the component unmounts
    return () => {
      setOnUnauthenticated(null);
    };
  }, [openLoginModal]);

  useEffect(() => {
    let isMounted = true;
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      console.log('Validating token:', { hasToken: !!token });
      
      if (!token) {
        console.log('No token found in localStorage');
        if (isMounted) setLoading(false);
        return;
      }

      // Set the token in axios headers before making any requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // First check if we have user data in local storage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (isMounted) {
            setUser(user);
            setError(null);
            setLoading(false);
          }
        } catch (e) {
          console.error('Failed to parse stored user:', e);
        }
      }

      // Then try to validate with server
      try {
        console.log('Attempting to validate token with server...');
        const response = await api.get('/auth/me', {
          // Don't throw on error - we'll handle it manually
          validateStatus: () => true
        });
        
        if (response.status === 200) {
          console.log('Token validation successful, user:', response.data);
          // Store user data in localStorage as fallback
          localStorage.setItem('user', JSON.stringify(response.data));
          
          if (isMounted) {
            setUser(response.data);
            setError(null);
          }
        } else {
          console.log('Server validation failed with status:', response.status);
          // If we have a stored user but server validation fails, keep the user logged in
          // but show a warning that they might need to log in again
          if (!storedUser) {
            throw new Error('Server validation failed');
          }
        }
      } catch (error: any) {
        console.error('Token validation failed:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });

        // Only clear auth state if we don't have a stored user
        if (!storedUser) {
          if (error.response?.status === 401) {
            console.log('Authentication failed (401), clearing token');
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            if (isMounted) setUser(null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    validateToken();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    console.log('Attempting login with email:', email);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', { 
        status: response.status, 
        hasToken: !!response.data.token,
        user: response.data.user 
      });
      
      const { token, user } = response.data;
      
      // Store the token
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token set in localStorage and axios headers');
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set user in state
      setUser(user);
      console.log('User set in context and localStorage:', user);
      closeLoginModal();
      
      // Retry any pending API requests that failed due to 401
      retryPendingRequests();
      
      // Handle redirect after successful login
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      console.log('Checking for redirect path:', redirectPath);
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        console.log('Navigating to:', redirectPath);
        navigate(redirectPath);
      }
      
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; phone: string; password: string }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      closeLoginModal();
      
      // Retry any pending API requests that failed due to 401
      retryPendingRequests();
      
      // Handle redirect after successful registration
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      }
      
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth-related data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('redirectAfterLogin');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/');
    }
  };



  const contextValue = {
    user,
    loading,
    isLoading: loading, // Alias for backward compatibility
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
    isLoginModalOpen,
    login,
    register,
    logout,
    openLoginModal,
    closeLoginModal,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
