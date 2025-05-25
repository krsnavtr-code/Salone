import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  adminOnly = false, 
  superAdminOnly = false 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;

    // If no user is logged in, we'll handle redirect in the render
    if (!user) {
      setIsAuthorized(false);
      return;
    }

    // Check admin access
    if (adminOnly || superAdminOnly) {
      const hasAdminAccess = user.role === 'admin' || user.role === 'superadmin';
      const hasSuperAdminAccess = user.role === 'superadmin';
      
      if ((adminOnly && !hasAdminAccess) || (superAdminOnly && !hasSuperAdminAccess)) {
        setIsAuthorized(false);
        return;
      }
    }

    // If we get here, user is authorized
    setIsAuthorized(true);
  }, [user, loading, adminOnly, superAdminOnly]);

  // Handle redirections in render instead of effect
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  // Redirect to home if not authorized
  if (isAuthorized === false) {
    return <Navigate to="/" replace />;
  }

  if (loading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
