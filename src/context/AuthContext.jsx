import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('job_seek_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('job_seek_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync state to localStorage
    if (token) {
      localStorage.setItem('job_seek_token', token);
    } else {
      localStorage.removeItem('job_seek_token');
    }

    if (user) {
      localStorage.setItem('job_seek_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('job_seek_user');
    }
    setLoading(false);
  }, [token, user]);

  const login = async (role, email, password) => {
    const res = await authApi.login({ role, email, password });
    const { token: jwtToken, userId, name, email: userEmail, role: userRole } = res.data;
    const userData = { id: userId, name, email: userEmail, role: userRole };
    
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('job_seek_token', jwtToken);
    localStorage.setItem('job_seek_user', JSON.stringify(userData));
    return userData;
  };

  const signup = async (role, name, email, password) => {
    const res = await authApi.signup({ role, name, email, password });
    const { token: jwtToken, userId, name: userName, email: userEmail, role: userRole } = res.data;
    const userData = { id: userId, name: userName, email: userEmail, role: userRole };
    
    if (jwtToken) {
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('job_seek_token', jwtToken);
      localStorage.setItem('job_seek_user', JSON.stringify(userData));
    }
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('job_seek_token');
    localStorage.removeItem('job_seek_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token || !!user,
        login,
        signup,
        logout,
        setUser,
        loading,
      }}
    >
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
