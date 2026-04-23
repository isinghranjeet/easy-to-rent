import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Review } from '@/services/api';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: unknown;
  reviews?: Review[];
  canReview?: boolean;
  error?: string;
}

export interface UseReviewsReturn {
  reviews: Review[];
  canReview: boolean;
  hasUserReviewed: boolean;
  isSubmitting: boolean;
  reviewRating: number;
  reviewComment: string;
  setReviewRating: (value: number) => void;
  setReviewComment: (value: string) => void;
  fetchReviews: (pgId: string) => Promise<void>;
  checkCanReview: (pgId: string) => Promise<void>;
  submitReview: (pgId: string, pgName: string) => Promise<void>;
  resetForm: () => void;
}

export const useReviews = (pgId: string | undefined): UseReviewsReturn => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const hasUserReviewed = reviews.some((r) => r.userId === user?._id);

  const fetchReviews = useCallback(async (id: string) => {
    try {
      const response = await api.request<ApiResponse>(`/api/reviews/pg/${id}`);
      if (response.success && response.reviews) {
        setReviews(response.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, []);

  const checkCanReview = useCallback(async (id: string) => {
    if (!isAuthenticated) return;

    const alreadyReviewed = reviews.some((r) => r.userId === user?._id);
    if (alreadyReviewed) {
      setCanReview(false);
      return;
    }

    if (user?.role === 'admin') {
      setCanReview(true);
      return;
    }

    try {
      const response = await api.request<ApiResponse>(`/api/bookings/can-review/${id}`);
      if (response.success && typeof response.canReview === 'boolean') {
        setCanReview(response.canReview);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      setCanReview(false);
    }
  }, [isAuthenticated, user, reviews]);

  const submitReview = useCallback(async (id: string, pgName: string) => {
    const alreadyReviewed = reviews.some((r) => r.userId === user?._id);
    if (alreadyReviewed) {
      toast.error('You have already reviewed this property');
      return;
    }

    if (reviewComment.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.request<ApiResponse>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          pgId: id,
          rating: reviewRating,
          comment: reviewComment.trim(),
          title: `Review for ${pgName}`,
        }),
      });

      if (response.success) {
        toast.success('Review submitted successfully!');
        setCanReview(false);
        await fetchReviews(id);
        setReviewRating(5);
        setReviewComment('');
      } else {
        toast.error(response.message || 'Failed to submit review');
      }
    } catch (error: unknown) {
      console.error('Error submitting review:', error);
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('already')) {
        toast.error('You have already reviewed this property');
      } else if (msg.includes('validation') || msg.includes('longer than')) {
        toast.error('Review is too long. Maximum 1000 characters allowed.');
      } else {
        toast.error('Failed to submit review');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [reviews, user?._id, reviewRating, reviewComment, fetchReviews]);

  const resetForm = useCallback(() => {
    setReviewRating(5);
    setReviewComment('');
  }, []);

  useEffect(() => {
    if (pgId) {
      fetchReviews(pgId);
    }
  }, [pgId, fetchReviews]);

  useEffect(() => {
    if (pgId) {
      checkCanReview(pgId);
    }
  }, [pgId, checkCanReview]);

  return {
    reviews,
    canReview,
    hasUserReviewed,
    isSubmitting,
    reviewRating,
    reviewComment,
    setReviewRating,
    setReviewComment,
    fetchReviews,
    checkCanReview,
    submitReview,
    resetForm,
  };
};

