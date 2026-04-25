import { useState } from 'react';
import { AdminHeader } from '@/admin/components/layout/AdminHeader';
import { StatusBadge } from '@/admin/components/shared/StatusBadge';
import { SkeletonLoader } from '@/admin/components/shared/SkeletonLoader';
import { EmptyState } from '@/admin/components/shared/EmptyState';
import { ConfirmActionModal } from '@/admin/components/modals/ConfirmActionModal';
import { useReviewManagement } from '@/admin/hooks/useReviewManagement';
import { formatDate, formatTimeAgo } from '@/admin/utils/formatters';
import { cn } from '@/lib/utils';
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Flag,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import type { AdminReview } from '@/admin/types';

export default function ReviewManagement() {
  const {
    data,
    pendingReviews,
    reviewStats,
    isLoading,
    isPendingLoading,
    status,
    setStatus,
    pagination,
    setPagination,
    approve,
    reject,
    deleteReview,
    flag,
    isMutating,
  } = useReviewManagement();

  const [confirmDelete, setConfirmDelete] = useState<AdminReview | null>(null);
  const [confirmFlag, setConfirmFlag] = useState<AdminReview | null>(null);

  const reviews = status === 'pending' ? pendingReviews : data?.items || [];
  const totalPages = data?.totalPages || 1;
  const stats = reviewStats || { pending: 0, approved: 0, rejected: 0, total: 0 };
  const pageSizeOptions = [10, 20, 50];
  const sortOptions = [
    { value: 'createdAt', label: 'Newest' },
    { value: 'rating', label: 'Rating' },
    { value: 'status', label: 'Status' },
  ];

  const tabs = [
    { key: 'pending', label: 'Pending', count: stats.pending, color: 'amber' },
    { key: 'approved', label: 'Approved', count: stats.approved, color: 'green' },
    { key: 'rejected', label: 'Rejected', count: stats.rejected, color: 'red' },
    { key: 'all', label: 'All', count: stats.total, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="Review Management" subtitle="Moderate user reviews" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatus(tab.key)}
              className={cn(
                'bg-white dark:bg-gray-900 rounded-2xl p-5 border shadow-sm text-left transition-all',
                status === tab.key
                  ? `border-${tab.color}-300 dark:border-${tab.color}-800 bg-${tab.color}-50 dark:bg-${tab.color}-900/20`
                  : 'border-gray-200 dark:border-gray-800 hover:shadow-md'
              )}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{tab.label}</p>
              <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
                {tab.key === 'pending'
                  ? stats.pending
                  : tab.key === 'approved'
                  ? stats.approved
                  : tab.key === 'rejected'
                  ? stats.rejected
                  : stats.total}
              </p>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {status === 'pending'
                ? `Showing pending review queue (${stats.pending} items)`
                : status === 'approved'
                ? `Showing ${data?.items?.length || 0} of ${stats.approved} approved reviews`
                : status === 'rejected'
                ? `Showing ${data?.items?.length || 0} of ${stats.rejected} rejected reviews`
                : `Showing ${data?.items?.length || 0} of ${stats.total} reviews`}
            </p>
          </div>
          {status !== 'pending' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={pagination.sortBy}
                onChange={(e) => setPagination((prev) => ({ ...prev, page: 1, sortBy: e.target.value }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={pagination.sortOrder}
                onChange={(e) => setPagination((prev) => ({ ...prev, page: 1, sortOrder: e.target.value as 'asc' | 'desc' }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
              <select
                value={pagination.limit}
                onChange={(e) => setPagination((prev) => ({ ...prev, page: 1, limit: Number(e.target.value) }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>{size} per page</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {isLoading || isPendingLoading ? (
            <SkeletonLoader rows={4} />
          ) : reviews.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title={`No ${status} reviews`}
              description="Reviews will appear here"
            />
          ) : (
            <>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {reviews.map((review) => (
                  <div key={review._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                            {review.userName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.userName || 'Anonymous'}</p>
                            <p className="text-xs text-gray-500">{review.userEmail}</p>
                          </div>
                          <div className="flex items-center gap-0.5 ml-auto">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  'h-4 w-4',
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                )}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{review.pgName}</p>
                          <p className="text-xs text-gray-500">{review.pgCity}</p>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(review.createdAt)}</p>

                        <div className="mt-3 flex items-center gap-2">
                          <StatusBadge status={review.status} />
                          {review.flagged && <StatusBadge status="warning" />}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approve(review._id)}
                              disabled={isMutating}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle2 className="h-4 w-4" /> Approve
                            </button>
                            <button
                              onClick={() => reject(review._id)}
                              disabled={isMutating}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                              <XCircle className="h-4 w-4" /> Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setConfirmFlag(review)}
                          disabled={isMutating}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
                        >
                          <Flag className="h-4 w-4" /> Flag
                        </button>
                        <button
                          onClick={() => setConfirmDelete(review)}
                          disabled={isMutating}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {status !== 'pending' && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-sm text-gray-500">Showing {reviews.length} reviews</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                      disabled={pagination.page <= 1}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Page {pagination.page} of {totalPages}</span>
                    <button
                      onClick={() => setPagination((p) => ({ ...p, page: Math.min(totalPages, p.page + 1) }))}
                      disabled={pagination.page >= totalPages}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmActionModal
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={async () => {
          if (confirmDelete) {
            await deleteReview(confirmDelete._id);
            setConfirmDelete(null);
          }
        }}
      />

      <ConfirmActionModal
        open={!!confirmFlag}
        onOpenChange={() => setConfirmFlag(null)}
        title="Flag Review"
        description="Flag this review as inappropriate? It will be marked for moderator attention."
        confirmText="Flag"
        variant="warning"
        onConfirm={async () => {
          if (confirmFlag) {
            await flag({ id: confirmFlag._id, reason: 'Inappropriate content' });
            setConfirmFlag(null);
          }
        }}
      />
    </div>
  );
}

