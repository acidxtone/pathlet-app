'use client';

import React from 'react';
import { Route, Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType<any>;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  path, 
  component: Component 
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  return (
    <Route path={path}>
      {(params) => 
        isAuthenticated ? (
          <Component {...params} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    </Route>
  );
};
