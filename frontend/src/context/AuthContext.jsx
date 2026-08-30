import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gfg_token') || null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    if (token) {
      try {
        const res = await authAPI.getCurrentUser();
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSession();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const newToken = res.data.token;
      const userData = res.data.user;
      localStorage.setItem('gfg_token', newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    } else {
      throw new Error(res.data.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('gfg_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const isExecutive = () => user && ['PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR'].includes(user.role);
  const isPresident = () => user && user.role === 'PRESIDENT';
  const isLead = () => user && user.role === 'LEAD';
  const isCoLead = () => user && user.role === 'CO_LEAD';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      updateUser,
      fetchSession,
      isExecutive,
      isPresident,
      isLead,
      isCoLead
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
