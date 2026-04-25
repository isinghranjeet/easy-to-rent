import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type SetStateAction } from 'react';
import {
  fetchReviews,
  fetchPendingReviews,
  fetchReviewStats,
  approveReview,
  rejectReview,
  deleteReview,
  flagReview,
} from '@/admin/services/adminApi';
import type { AdminReview, PaginationParams } from '@/admin/types';
import { toast } from 'sonner';

export const REVIEW_LIST_KEY = ['admin', 'reviews'];

export function useReviewManagement() {
  const queryClient = useQueryClient();
  const [status, setStatusState] = useState<string>('pending');
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const setStatus = (value: string) => {
    setPagination((previous) => ({ ...previous, page: 1 }));
    setStatusState(value);
  };

  const query = useQuery({
    queryKey: [...REVIEW_LIST_KEY, status, pagination],
    queryFn: () => fetchReviews(status, pagination),
    staleTime: 30_000,
  });

  const statsQuery = useQuery({
    queryKey: [...REVIEW_LIST_KEY, 'stats'],
    queryFn: fetchReviewStats,
    staleTime: 30_000,
  });

  const pendingQuery = useQuery({
    queryKey: [...REVIEW_LIST_KEY, 'pending-only'],
    queryFn: fetchPendingReviews,
    staleTime: 30_000,
  });

  const approveMutation = useMutation({
    mutationFn: approveReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_LIST_KEY });
      toast.success('Review approved');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to approve review'),
  });

  const rejectMutation = useMutation({
    mutationFn: (reviewId: string) => rejectReview(reviewId, 'Does not meet community guidelines'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_LIST_KEY });
      toast.success('Review rejected');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to reject review'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_LIST_KEY });
      toast.success('Review deleted');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete review'),
  });

  const flagMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => flagReview(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_LIST_KEY });
      toast.success('Review flagged');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to flag review'),
  });

  return {
    data: query.data,
    pendingReviews: Array.isArray(pendingQuery.data) ? pendingQuery.data : [],
    reviewStats: statsQuery.data,
    isLoading: query.isLoading,
    isPendingLoading: pendingQuery.isLoading,
    error: query.error,
    refetch: query.refetch,
    status,
    setStatus,
    pagination,
    setPagination,
    approve: approveMutation.mutateAsync,
    reject: rejectMutation.mutateAsync,
    deleteReview: deleteMutation.mutateAsync,
    flag: flagMutation.mutateAsync,
    isMutating:
      approveMutation.isPending ||
      rejectMutation.isPending ||
      deleteMutation.isPending ||
      flagMutation.isPending,
  };
}

