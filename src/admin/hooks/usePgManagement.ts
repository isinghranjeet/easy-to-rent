import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type SetStateAction } from 'react';
import {
  fetchPGs,
  verifyPG,
  featurePG,
  updatePG,
  deletePG,
} from '@/admin/services/adminApi';
import type { AdminPG, FilterState, PaginationParams } from '@/admin/types';
import { toast } from 'sonner';

export const PG_LIST_KEY = ['admin', 'pgs'];

export function usePgManagement() {
  const queryClient = useQueryClient();
  const [filters, setFiltersState] = useState<FilterState>({
    search: '',
    status: 'all',
    city: 'all',
    type: 'all',
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
    queryKey: [...PG_LIST_KEY, filters, pagination],
    queryFn: () => fetchPGs(filters, pagination),
    staleTime: 30_000,
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) => verifyPG(id, verified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PG_LIST_KEY });
      toast.success('PG verification updated');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update PG'),
  });

  const featureMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) => featurePG(id, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PG_LIST_KEY });
      toast.success('Featured status updated');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update PG'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminPG> }) => updatePG(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PG_LIST_KEY });
      toast.success('PG updated successfully');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update PG'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePG(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PG_LIST_KEY });
      toast.success('PG deleted successfully');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete PG'),
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
    verifyPG: verifyMutation.mutateAsync,
    featurePG: featureMutation.mutateAsync,
    updatePG: updateMutation.mutateAsync,
    deletePG: deleteMutation.mutateAsync,
    isMutating:
      verifyMutation.isPending ||
      featureMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}

