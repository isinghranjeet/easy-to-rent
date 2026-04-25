import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type SetStateAction } from 'react';
import {
  fetchUsers,
  updateUser,
  updateUserStatus,
  deleteUser,
  fetchUserBookings,
} from '@/admin/services/adminApi';
import type { AdminUser, FilterState, PaginationParams } from '@/admin/types';
import { toast } from 'sonner';

export const USER_LIST_KEY = ['admin', 'users'];

export function useUserManagement() {
  const queryClient = useQueryClient();
  const [filters, setFiltersState] = useState<FilterState>({
    search: '',
    status: 'all',
    role: 'all',
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
    queryKey: [...USER_LIST_KEY, filters, pagination],
    queryFn: () => fetchUsers(filters, pagination),
    staleTime: 30_000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminUser> }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_LIST_KEY });
      toast.success('User updated successfully');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update user'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_LIST_KEY });
      toast.success('User status updated');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update status'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_LIST_KEY });
      toast.success('User deleted successfully');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete user'),
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
    updateUser: updateMutation.mutateAsync,
    updateUserStatus: statusMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    fetchUserBookings,
    isMutating:
      updateMutation.isPending || statusMutation.isPending || deleteMutation.isPending,
  };
}

