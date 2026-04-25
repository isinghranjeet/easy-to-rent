import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type SetStateAction } from 'react';
import {
  fetchBookings,
  updateBookingStatus,
  cancelBookingAdmin,
} from '@/admin/services/adminApi';
import type { AdminBooking, FilterState, PaginationParams } from '@/admin/types';
import { toast } from 'sonner';

export const BOOKING_LIST_KEY = ['admin', 'bookings'];

export function useBookingManagement() {
  const queryClient = useQueryClient();
  const [filters, setFiltersState] = useState<FilterState>({
    search: '',
    status: 'all',
  });
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const setFilters = (value: SetStateAction<FilterState>) => {
    setPagination((previous) => ({ ...previous, page: 1 }));
    setFiltersState(value);
  };

  const query = useQuery({
    queryKey: [...BOOKING_LIST_KEY, filters, pagination],
    queryFn: () => fetchBookings(filters, pagination),
    staleTime: 30_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      updateBookingStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_LIST_KEY });
      toast.success('Booking status updated');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update booking'),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => cancelBookingAdmin(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_LIST_KEY });
      toast.success('Booking cancelled');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to cancel booking'),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    filters,
    setFilters,
    pagination,
    setPagination,
    updateStatus: statusMutation.mutateAsync,
    cancelBooking: cancelMutation.mutateAsync,
    isMutating: statusMutation.isPending || cancelMutation.isPending,
  };
}

