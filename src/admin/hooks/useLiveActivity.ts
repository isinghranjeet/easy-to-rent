import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchActivityFeed } from '@/admin/services/adminApi';
import type { ActivityEvent } from '@/admin/types';

export const ACTIVITY_FEED_KEY = ['admin', 'activity'];

export function useLiveActivity(pollingInterval = 5000) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  const query = useQuery({
    queryKey: ACTIVITY_FEED_KEY,
    queryFn: () => fetchActivityFeed(20),
    staleTime: pollingInterval / 2,
    refetchInterval: pollingInterval,
  });

  useEffect(() => {
    if (query.data) {
      setEvents(query.data);
    }
  }, [query.data]);

  return {
    events,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    unreadCount: events.filter((e) => !e.read).length,
  };
}

