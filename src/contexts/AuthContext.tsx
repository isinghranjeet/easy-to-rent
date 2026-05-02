/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import type { User } from '@/types/user';
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
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('auth_refresh_token');
    if (token) {
      api.setToken(token);
      if (refreshToken) api.setRefreshToken(refreshToken);
      loadUser();
    } else {
      setIsLoading(false);
    }

    // Listen for unauthorized events
    const handleUnauthorizedEvent = () => {
      console.log('🚨 [AUTH_CONTEXT] Unauthorized event received');
      setUser(null);
      api.clearToken();
      toast.error('Session expired. Please login again.');
    };

window.addEventListener('unauthorized', handleUnauthorizedEvent);
    
    // ✅ NEW: Listen for userLoggedIn event (dispatched after OTP verification)
    const handleUserLoggedIn = (event: Event) => {
      const customEvent = event as CustomEvent<{ user?: User }>;
      if (customEvent.detail?.user) {
        console.log('✅ [AUTH_CONTEXT] Received userLoggedIn event with user data:', customEvent.detail.user.role);
        setUser(customEvent.detail.user);
        localStorage.setItem('userRole', customEvent.detail.user.role);
      } else {
        // Fallback: reload user data from API
        console.log('✅ [AUTH_CONTEXT] Reloading user data after login event');
        loadUser();
      }
    };
    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorizedEvent);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, []);

  const refreshSession = async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      console.log('⏳ [AUTH_CONTEXT] Refresh already in progress, skipping');
      return false;
    }
    
    isRefreshingRef.current = true;
    console.log('🔄 [AUTH_CONTEXT] Attempting session refresh...');
    
    try {
      const token = api.getToken();
      if (!token) {
        console.log('❌ [AUTH_CONTEXT] No token available for refresh');
        return false;
      }
      
      const response = await api.getCurrentUser();
      if (response.success && response.data) {
        console.log('✅ [AUTH_CONTEXT] Session refresh successful');
        setUser(response.data);
        return true;
      }
    } catch (error: any) {
      console.error('❌ [AUTH_CONTEXT] Session refresh failed:', error.message);
    } finally {
      isRefreshingRef.current = false;
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
    } catch (error: any) {
      console.error('Failed to load user:', error);
      if (error?.status === 401) {
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
      
      // Check if OTP required (Admin login)
      if (response.data?.requireOtp === true) {
        const otpError = new Error('OTP_REQUIRED');
        (otpError as any).email = response.data.email;
        throw otpError;
      }

      // Normal login flow
      if (response.success && response.data) {
        const { token, refreshToken, user: userData } = response.data;
        
        if (token) {
          localStorage.setItem('auth_token', token);
          api.setToken(token);
        }
        if (refreshToken) {
          localStorage.setItem('auth_refresh_token', refreshToken);
          api.setRefreshToken(refreshToken);
        }
        
        if (userData) {
          setUser(userData);
          localStorage.setItem('userRole', userData.role);
        }
        
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        toast.success('Login successful!');
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
        const { token, refreshToken, user: userData } = response.data;
        
        if (token) {
          localStorage.setItem('auth_token', token);
          api.setToken(token);
        }
        if (refreshToken) {
          localStorage.setItem('auth_refresh_token', refreshToken);
          api.setRefreshToken(refreshToken);
        }
        
        if (userData) {
          setUser(userData);
          localStorage.setItem('userRole', userData.role);
        }
        
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        toast.success('Registration successful!');
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
      api.clearToken();
      
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('userRole');
      
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
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