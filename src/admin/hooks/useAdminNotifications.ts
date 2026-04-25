import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, acknowledgeNotification } from '@/admin/services/adminApi';

export const NOTIFICATIONS_KEY = ['admin', 'notifications'];

export function useAdminNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: fetchNotifications,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: acknowledgeNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });

  const notifications = Array.isArray(query.data) ? query.data : [];

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.acknowledged).length,
    criticalCount: notifications.filter((n) => n.severity === 'critical' && !n.acknowledged).length,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    acknowledge: acknowledgeMutation.mutateAsync,
  };
}

