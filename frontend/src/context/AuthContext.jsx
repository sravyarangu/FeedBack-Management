import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check local storage for existing user and token
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Student login
  const studentLogin = async (rollNo, dob) => {
    try {
      setError(null);
      const response = await authService.studentLogin(rollNo, dob);
      
      console.log('🔐 Login Response:', response);
      
      if (response.success) {
        const userData = {
          ...response.user,
          role: 'student',
        };
        console.log('✅ User Data to be saved:', userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.token);
        return { success: true, user: userData };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // HOD login
  const hodLogin = async (email, password) => {
    try {
      setError(null);
      const response = await authService.hodLogin(email, password);
      
      if (response.success) {
        const userData = {
          ...response.user,
          role: 'hod',
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.token);
        return { success: true, user: userData };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Admin login
  const adminLogin = async (email, password) => {
    try {
      setError(null);
      const response = await authService.adminLogin(email, password);
      
      if (response.success) {
        const userData = {
          ...response.user,
          role: 'admin',
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.token);
        return { success: true, user: userData };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Principal login
  const principalLogin = async (email, password) => {
    try {
      setError(null);
      const response = await authService.principalLogin(email, password);
      
      if (response.success) {
        const userData = {
          ...response.user,
          role: 'principal',
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.token);
        return { success: true, user: userData };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Vice Principal login
  const vicePrincipalLogin = async (email, password) => {
    try {
      setError(null);
      const response = await authService.vicePrincipalLogin(email, password);
      
      if (response.success) {
        const userData = {
          ...response.user,
          role: 'vice-principal',
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.token);
        return { success: true, user: userData };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      let response;
      
      if (user.role === 'student') {
        response = await authService.studentChangePassword(currentPassword, newPassword);
      } else if (user.role === 'hod') {
        response = await authService.hodChangePassword(currentPassword, newPassword);
      } else if (user.role === 'admin' || user.role === 'principal' || user.role === 'vice-principal') {
        response = await authService.adminChangePassword(currentPassword, newPassword);
      }
      
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Password change failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    studentLogin,
    hodLogin,
    adminLogin,
    principalLogin,
    vicePrincipalLogin,
    changePassword,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
