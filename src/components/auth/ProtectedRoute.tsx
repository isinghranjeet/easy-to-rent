import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateSession = () => {
      try {
        // Check sessionStorage first (more secure)
        const sessionData = sessionStorage.getItem('adminSession');
        
        if (sessionData) {
          const { expiresAt } = JSON.parse(sessionData);
          
          // Check if session is expired
          if (new Date(expiresAt) > new Date()) {
            setIsAuthenticated(true);
          } else {
            // Session expired
            sessionStorage.removeItem('adminSession');
            setIsAuthenticated(false);
            toast.error('Session expired. Please login again.');
          }
        } else {
          // Fallback to localStorage (less secure)
          const token = localStorage.getItem('adminToken');
          const user = localStorage.getItem('adminUser');
          
          if (token && user) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Session validation error:', error);
        setIsAuthenticated(false);
        // Clear all auth data on error
        sessionStorage.removeItem('adminSession');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      } finally {
        setIsLoading(false);
      }
    };
    
    validateSession();
    
    // Auto-logout after 5 minutes of inactivity
    const activityEvents = ['mousedown', 'keydown', 'touchstart'];
    
    const resetTimer = () => {
      // Reset activity timer
      localStorage.setItem('lastActivity', Date.now().toString());
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    const checkActivity = setInterval(() => {
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
      const inactiveTime = Date.now() - lastActivity;
      
      if (inactiveTime > 5 * 60 * 1000) { // 5 minutes
        if (isAuthenticated) {
          toast.info('Session timeout due to inactivity');
          sessionStorage.removeItem('adminSession');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setIsAuthenticated(false);
        }
      }
    }, 60000); // Check every minute
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      clearInterval(checkActivity);
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="relative inline-flex mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
            <div className="relative w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Security Check</h3>
          <p className="text-gray-400 text-sm">Verifying session integrity...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse delay-100"></div>
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error('Security verification failed. Please login.');
    return <Navigate to="/admin/login" state={{ from: location, reason: 'unauthorized' }} replace />;
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">SECURE SESSION</span>
        </div>
      </div>
      {children}
    </>
  );
};

export default ProtectedRoute;