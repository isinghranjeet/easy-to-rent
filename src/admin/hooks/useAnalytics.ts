import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics } from '@/admin/services/adminApi';

export const ANALYTICS_KEY = ['admin', 'analytics'];

export function useAnalytics() {
  return useQuery({
    queryKey: ANALYTICS_KEY,
    queryFn: fetchAnalytics,
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
}

