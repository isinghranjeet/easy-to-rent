/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User, LoginCredentials, RegisterCredentials } from '@/services/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string, role?: 'user' | 'owner') => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.setToken(token);
      loadUser();
    } else {
      setIsLoading(false);
    }

    // Listen for unauthorized events - DON'T auto logout immediately
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const handleUnauthorized = async () => {
    console.log('Unauthorized event received - attempting to refresh session');
    
    // Don't logout immediately - try to refresh session first
    const refreshed = await refreshSession();
    
    if (!refreshed) {
      // Only logout if refresh failed
      console.log('Session refresh failed, logging out');
      setUser(null);
      api.clearToken();
      toast.error('Session expired. Please login again.');
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    if (isRefreshing) return false;
    
    setIsRefreshing(true);
    try {
      // Try to refresh token (if you have a refresh endpoint)
      // For now, just try to load user with existing token
      const response = await api.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
    return false;
  };

  const loadUser = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        api.clearToken();
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      // Don't clear token on network errors
      if ((error as any)?.status !== 401) {
        // Only clear token if it's a 401 auth error
        api.clearToken();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.login({ email, password });
      
      if (response.success && response.data) {
        // If OTP is required, throw a special error for the UI to catch
        if (response.data.requireOtp) {
          const otpError = new Error('OTP_REQUIRED');
          (otpError as any).requireOtp = true;
          (otpError as any).email = response.data.email;
          throw otpError;
        }

        setUser(response.data.user);
        
        // Store user info in localStorage for persistence
        localStorage.setItem('userName', response.data.user.name);
        localStorage.setItem('userEmail', response.data.user.email);
        if (response.data.user.phone) localStorage.setItem('userPhone', response.data.user.phone);
        localStorage.setItem('userId', response.data.user._id);
        
        // Dispatch event for wishlist to sync
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        
        toast.success('Login successful!', {
          description: `Welcome back, ${response.data.user.name}!`,
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      // Re-throw OTP_REQUIRED so the modal can handle it
      if (error.message === 'OTP_REQUIRED') {
        throw error;
      }
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error('Login failed', { description: errorMessage });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string, role?: 'user' | 'owner') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.register({ name, email, password, phone, role });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        
        // Store user info in localStorage
        localStorage.setItem('userName', response.data.user.name);
        localStorage.setItem('userEmail', response.data.user.email);
        if (response.data.user.phone) localStorage.setItem('userPhone', response.data.user.phone);
        localStorage.setItem('userId', response.data.user._id);
        
        // Dispatch event for wishlist to sync
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        
        toast.success('Registration successful!', {
          description: `Welcome, ${response.data.user.name}!`,
        });
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error('Registration failed', { description: errorMessage });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      
      // Clear localStorage
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userId');
      
      // Dispatch event for wishlist to clear
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      api.clearToken();
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      register,
      logout,
      updateUser,
      refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};