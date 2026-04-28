import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAarogyaData } from '@/hooks/useAarogyaData';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAarogyaData();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.some(role => role.toLowerCase() === user.role?.toLowerCase())) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-8 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-widest mb-2">Access Restricted</h1>
        <p className="text-muted-foreground text-sm font-medium tracking-tight max-w-md">
          Your credentials level <strong>({user.role})</strong> does not have authorization to access this terminal. Please contact the Systems Administrator.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
