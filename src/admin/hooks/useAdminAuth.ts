import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createPermissionChecker } from '@/admin/utils/rbacHelpers';
import type { Permission } from '@/admin/types';
import { toast } from 'sonner';

export function useAdminAuth(requiredPermission?: Permission) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const checker = createPermissionChecker(user?.role || 'user');

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error('Please login to access the admin panel');
        navigate('/login', { replace: true });
      } else if (!['admin', 'moderator', 'owner'].includes(user?.role || '')) {
        toast.error('Admin access required');
        navigate('/', { replace: true });
      } else if (requiredPermission && !checker.can(requiredPermission)) {
        toast.error('You do not have permission to access this page');
        navigate('/admin', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, requiredPermission, navigate, checker]);

  return {
    user,
    isLoading,
    isAuthenticated,
    checker,
    role: user?.role || 'user',
  };
}

