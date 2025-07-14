import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking auth status...');
      // Try to get user profile from the auth endpoint
      const result = await authAPI.getProfile();
      console.log('🔍 Auth check result:', result);

      if (result.success && result.data.success) {
        console.log('✅ User authenticated:', result.data.user);
        setUser(result.data.user);
        setIsAuthenticated(true);
      } else {
        console.log('❌ User not authenticated:', result);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('❌ Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const result = await authAPI.login(credentials);

      if (result.success && result.data.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.data?.message || 'Login failed' };
      }
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout process...');
      await authAPI.logout();
      console.log('🚪 Logout API call completed');
    } catch (error) {
      console.error('🚪 Logout error:', error);
    } finally {
      // Clear state regardless of API call success
      console.log('🚪 Clearing auth state...');
      setUser(null);
      setIsAuthenticated(false);
      console.log('🚪 Auth state cleared - isAuthenticated: false, user: null');
    }
  };

  const signup = async (userData) => {
    try {
      const result = await authAPI.signup(userData);
      return result;
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    signup,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};