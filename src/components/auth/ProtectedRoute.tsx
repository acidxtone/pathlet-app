'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

type ProtectedRouteProps = {
  component: React.ComponentType<any>;
  path: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  component: Component, 
  path,
  ...rest 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Component {...rest} /> : null;
};
