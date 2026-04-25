import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '@/admin/services/adminApi';

export const DASHBOARD_STATS_KEY = ['admin', 'dashboard', 'stats'];

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_STATS_KEY,
    queryFn: fetchDashboardStats,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}

