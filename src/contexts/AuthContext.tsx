import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  name: string;
  permissions: string[];
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'https://eassy-to-rent-backend.onrender.com/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved auth data on mount
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const savedToken = localStorage.getItem('adminToken');
        const savedUser = localStorage.getItem('adminUser');
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuthData();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('🔐 Attempting login with:', { username });
      
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });
      
      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('Backend connection failed');
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }
      
      // Store auth data
      localStorage.setItem('adminToken', result.data.token);
      localStorage.setItem('adminUser', JSON.stringify(result.data.user));
      
      setToken(result.data.token);
      setUser(result.data.user);
      
      toast.success('✅ Login successful!');
      return true;
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Fallback to demo mode ONLY for known users
      const allowedDemoUsers = ['admin', 'manager', 'moderator'];
      const allowedPasswords = ['admin123', 'manager123', 'moderator123'];
      
      if (allowedDemoUsers.includes(username) && allowedPasswords.includes(password)) {
        toast.warning('⚠️ Backend not reachable. Using demo mode...');
        
        const mockUser = {
          id: allowedDemoUsers.indexOf(username) + 1,
          username: username,
          email: `${username}@pgfinder.com`,
          role: username === 'admin' ? 'superadmin' : username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          permissions: ['all']
        };
        
        const demoToken = `demo-token-${Date.now()}`;
        
        localStorage.setItem('adminToken', demoToken);
        localStorage.setItem('adminUser', JSON.stringify(mockUser));
        
        setToken(demoToken);
        setUser(mockUser);
        
        toast.success(`✅ Logged in as ${mockUser.name} (Demo Mode)`);
        return true;
      } else {
        toast.error('❌ Invalid username or password');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setUser(null);
    toast.info('👋 Logged out successfully');
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};