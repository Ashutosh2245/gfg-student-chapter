import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gfg-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-mono text-gray-400">Verifying security token...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
          <span className="text-2xl font-bold">403</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400 max-w-md text-sm mb-6">
          Your current role (<span className="text-gfg-accent font-semibold">{user.role}</span>) does not have authorization to view this management section.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-dark-card border border-dark-border text-gray-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          Return to Safety
        </button>
      </div>
    );
  }

  return children;
};
