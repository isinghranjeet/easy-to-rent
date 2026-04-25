import { useState } from 'react';
import { AdminHeader } from '@/admin/components/layout/AdminHeader';
import { StatusBadge } from '@/admin/components/shared/StatusBadge';
import { SkeletonLoader } from '@/admin/components/shared/SkeletonLoader';
import { EmptyState } from '@/admin/components/shared/EmptyState';
import { ConfirmActionModal } from '@/admin/components/modals/ConfirmActionModal';
import { useBookingManagement } from '@/admin/hooks/useBookingManagement';
import { exportToCSV } from '@/admin/utils/exportHelpers';
import { formatCurrency, formatDate } from '@/admin/utils/formatters';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  XCircle,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Eye,
} from 'lucide-react';
import type { AdminBooking } from '@/admin/types';

export default function BookingManagement() {
  const {
    data,
    isLoading,
    refetch,
    filters,
    setFilters,
    pagination,
    setPagination,
    updateStatus,
    cancelBooking,
    isMutating,
  } = useBookingManagement();

  const [confirmCancel, setConfirmCancel] = useState<AdminBooking | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [detailBooking, setDetailBooking] = useState<AdminBooking | null>(null);

  const bookings = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const pageSizeOptions = [10, 20, 50];
  const sortOptions = [
    { value: 'createdAt', label: 'Newest' },
    { value: 'totalAmount', label: 'Amount' },
    { value: 'status', label: 'Status' },
    { value: 'paymentStatus', label: 'Payment' },
  ];

  const handleSortChange = (value: string) => {
    setPagination((prev) => ({ ...prev, page: 1, sortBy: value }));
  };

  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    setPagination((prev) => ({ ...prev, page: 1, sortOrder: value }));
  };

  const handlePageSizeChange = (value: number) => {
    setPagination((prev) => ({ ...prev, page: 1, limit: value }));
  };

  const handleExport = () => {
    exportToCSV(
      bookings.map((b) => ({
        id: b._id,
        user: b.userName || b.guestDetails?.name || '—',
        pg: b.pgName || '—',
        roomType: b.roomType,
        amount: b.totalAmount,
        status: b.status,
        payment: b.paymentStatus,
        checkIn: b.checkInDate,
        created: b.createdAt,
      })),
      'bookings',
      [
        { key: 'id', label: 'Booking ID' },
        { key: 'user', label: 'User' },
        { key: 'pg', label: 'PG' },
        { key: 'roomType', label: 'Room' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' },
        { key: 'payment', label: 'Payment' },
        { key: 'checkIn', label: 'Check-in' },
        { key: 'created', label: 'Created' },
      ]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="Booking Management" subtitle="Manage all bookings and reservations" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user, PG, booking ID..."
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-colors',
                  showFilters
                    ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300'
                    : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                )}
              >
                <Filter className="h-4 w-4" /> Filters
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4" /> Export
              </button>
              <button
                onClick={() => refetch()}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} /> Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <select
              value={pagination.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={pagination.sortOrder}
              onChange={(e) => handleSortOrderChange(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <select
              value={pagination.limit}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size} per page</option>
              ))}
            </select>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <select
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <SkeletonLoader rows={6} columns={1} />
          ) : bookings.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No bookings found" description="Bookings will appear here" />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Booking</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">User</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">PG</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Amount</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Payment</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Check-in</th>
                      <th className="text-right px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">#{booking._id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-gray-400">{formatDate(booking.createdAt)}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                          {booking.userName || booking.guestDetails?.name || '—'}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                          {booking.pgName || '—'}
                          {booking.pgCity && <span className="text-gray-400 text-xs block">{booking.pgCity}</span>}
                        </td>
                        <td className="px-6 py-4 font-semibold text-purple-600 text-sm">
                          {formatCurrency(booking.totalAmount)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={booking.paymentStatus} />
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                          {formatDate(booking.checkInDate)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setDetailBooking(booking)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-600"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                              <button
                                onClick={() => setConfirmCancel(booking)}
                                disabled={isMutating}
                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600"
                                title="Cancel Booking"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <p className="text-sm text-gray-500">Showing {bookings.length} of {data?.total || 0} bookings</p>
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
            </>
          )}
        </div>
      </div>

      <ConfirmActionModal
        open={!!confirmCancel}
        onOpenChange={() => setConfirmCancel(null)}
        title="Cancel Booking"
        description={`Cancel booking #${confirmCancel?._id.slice(-6).toUpperCase()}? This will initiate a refund if applicable.`}
        confirmText="Cancel Booking"
        variant="danger"
        onConfirm={async () => {
          if (confirmCancel) {
            await cancelBooking({ id: confirmCancel._id, reason: 'Cancelled by admin' });
            setConfirmCancel(null);
          }
        }}
      />

      {/* Booking Detail Modal */}
      {detailBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Booking Details</h3>
              <button onClick={() => setDetailBooking(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-mono font-medium">{detailBooking._id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">User</span>
                <span className="font-medium">{detailBooking.userName || detailBooking.guestDetails?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">PG</span>
                <span className="font-medium">{detailBooking.pgName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Room Type</span>
                <span className="font-medium">{detailBooking.roomType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{detailBooking.durationMonths} months</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-bold text-purple-600">{formatCurrency(detailBooking.totalAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Check-in</span>
                <span className="font-medium">{formatDate(detailBooking.checkInDate)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Check-out</span>
                <span className="font-medium">{formatDate(detailBooking.checkOutDate)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Special Requests</span>
                <span className="font-medium text-right max-w-[200px]">{detailBooking.specialRequests || 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

