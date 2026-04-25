import { useQuery } from '@tanstack/react-query';
import { fetchSystemHealth, fetchErrorLogs } from '@/admin/services/adminApi';

export const SYSTEM_HEALTH_KEY = ['admin', 'system', 'health'];
export const ERROR_LOGS_KEY = ['admin', 'system', 'errors'];

export function useSystemHealth() {
  const healthQuery = useQuery({
    queryKey: SYSTEM_HEALTH_KEY,
    queryFn: fetchSystemHealth,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  const logsQuery = useQuery({
    queryKey: ERROR_LOGS_KEY,
    queryFn: () => fetchErrorLogs(50),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  return {
    health: healthQuery.data,
    errorLogs: Array.isArray(logsQuery.data) ? logsQuery.data : [],
    isLoading: healthQuery.isLoading || logsQuery.isLoading,
    error: healthQuery.error || logsQuery.error,
    refetch: () => {
      healthQuery.refetch();
      logsQuery.refetch();
    },
  };
}

