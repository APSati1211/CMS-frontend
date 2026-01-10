import React, { createContext, useState, useEffect, useContext } from 'react';
import { setAuthToken } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app start
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedToken) {
      setToken(storedToken);
      setUser({ role: storedRole });
      setAuthToken(storedToken); // Ensure API has the token
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', userData.role);
    setToken(token);
    setUser(userData);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setToken(null);
    setUser(null);
    setAuthToken(null);
    // Optional: Redirect is handled by ProtectedRoute, but we can force it here too
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);