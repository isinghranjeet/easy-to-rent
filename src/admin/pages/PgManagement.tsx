 import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminHeader } from '@/admin/components/layout/AdminHeader';
import { StatusBadge } from '@/admin/components/shared/StatusBadge';
import { SkeletonLoader } from '@/admin/components/shared/SkeletonLoader';
import { EmptyState } from '@/admin/components/shared/EmptyState';
import { ConfirmActionModal } from '@/admin/components/modals/ConfirmActionModal';
import { usePgManagement } from '@/admin/hooks/usePgManagement';
import { exportToCSV } from '@/admin/utils/exportHelpers';
import { formatCurrency, formatDate } from '@/admin/utils/formatters';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Shield,
  ShieldOff,
  Award,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Home,
  CheckCircle2,
  XCircle,
  ThumbsUp,
} from 'lucide-react';
import type { AdminPG } from '@/admin/types';
import { EditPGModal } from '@/admin/components/modals/EditPGModal';
import { adminRecommendPG } from '@/admin/services/adminApi';
import { toast } from 'sonner';

export default function PgManagement() {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    refetch,
    filters,
    setFilters,
    pagination,
    setPagination,
    verifyPG,
    featurePG,
    updatePG,
    deletePG,
    isMutating,
  } = usePgManagement();

  const [confirmDelete, setConfirmDelete] = useState<AdminPG | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingPG, setEditingPG] = useState<AdminPG | null>(null);
  const [recommendingId, setRecommendingId] = useState<string | null>(null);

  const pgs = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const pageSizeOptions = [10, 20, 50];
  const sortOptions = [
    { value: 'createdAt', label: 'Newest' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'city', label: 'Location' },
    { value: 'name', label: 'Name' },
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
      pgs.map((p) => ({
        name: p.name,
        city: p.city,
        price: p.price,
        type: p.type,
        status: p.verified ? (p.published ? 'Live' : 'Draft') : 'Pending',
        rating: p.rating,
        owner: p.ownerName || '—',
        created: p.createdAt,
      })),
      'pg-listings',
      [
        { key: 'name', label: 'Name' },
        { key: 'city', label: 'City' },
        { key: 'price', label: 'Price' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'rating', label: 'Rating' },
        { key: 'owner', label: 'Owner' },
        { key: 'created', label: 'Created' },
      ]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="PG Management" subtitle="Manage all property listings" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, city, owner..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <select
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="featured">Featured</option>
              </select>
              <select
                value={filters.type}
                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="co-ed">Co-ed</option>
                <option value="family">Family</option>
              </select>
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice || ''}
                onChange={(e) => setFilters((f) => ({ ...f, minPrice: Number(e.target.value) || undefined }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) || undefined }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <SkeletonLoader rows={6} columns={1} />
          ) : pgs.length === 0 ? (
            <EmptyState
              icon={Home}
              title="No PGs found"
              description="Try adjusting your search or filters"
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Property</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Location</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Price</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Rating</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Owner</th>
                      <th className="text-right px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {pgs.map((pg) => (
                      <tr key={pg._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                              {pg.images?.[0] ? (
                                <img src={pg.images[0]} alt={pg.name} className="w-full h-full object-cover" />
                              ) : (
                                <Home className="h-5 w-5 text-gray-400 m-2.5" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{pg.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{pg.type} PG</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {pg.city}
                          {pg.locality && <span className="text-gray-400 text-xs block">{pg.locality}</span>}
                        </td>
                        <td className="px-6 py-4 font-semibold text-purple-600">
                          {formatCurrency(pg.price)}/mo
                        </td>
                        <td className="px-6 py-4">
                          {pg.verified ? (
                            pg.published !== false ? (
                              <StatusBadge status="live" />
                            ) : (
                              <StatusBadge status="draft" />
                            )
                          ) : (
                            <StatusBadge status="pending" />
                          )}
                          {pg.featured && (
                            <span className="ml-2">
                              <StatusBadge status="featured" />
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{pg.rating || '—'}</span>
                            <span className="text-xs text-gray-400">({pg.reviewCount || 0})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                          {pg.ownerName || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigate(`/pg/${pg.slug || pg._id}`)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-600"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingPG(pg)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-600"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => verifyPG({ id: pg._id, verified: !pg.verified })}
                              disabled={isMutating}
                              className={cn(
                                'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800',
                                pg.verified ? 'text-amber-600' : 'text-emerald-600'
                              )}
                              title={pg.verified ? 'Unverify' : 'Verify'}
                            >
                              {pg.verified ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => featurePG({ id: pg._id, featured: !pg.featured })}
                              disabled={isMutating}
                              className={cn(
                                'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800',
                                pg.featured ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'
                              )}
                              title={pg.featured ? 'Unfeature' : 'Feature'}
                            >
                              <Award className="h-4 w-4" />
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  setRecommendingId(pg._id);
                                  await adminRecommendPG(pg._id, !pg.adminRecommended);
                                  toast.success(pg.adminRecommended ? 'Removed from admin picks' : 'Added to admin picks');
                                  refetch();
                                } catch (err: any) {
                                  toast.error(err.message || 'Failed to update admin pick');
                                } finally {
                                  setRecommendingId(null);
                                }
                              }}
                              disabled={recommendingId === pg._id || isMutating}
                              className={cn(
                                'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800',
                                pg.adminRecommended ? 'text-orange-600' : 'text-gray-400 hover:text-orange-600'
                              )}
                              title={pg.adminRecommended ? 'Remove Admin Pick' : 'Add Admin Pick'}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setConfirmDelete(pg)}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {pgs.length} of {data?.total || 0} properties
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                    disabled={pagination.page <= 1}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Page {pagination.page} of {totalPages}
                  </span>
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

      <EditPGModal
        pg={editingPG}
        open={!!editingPG}
        onClose={() => setEditingPG(null)}
        onSave={async (data) => {
          if (editingPG) {
            await updatePG({ id: editingPG._id, data });
            setEditingPG(null);
          }
        }}
        loading={isMutating}
      />

      <ConfirmActionModal
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
        title="Delete Property"
        description={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={async () => {
          if (confirmDelete) {
            await deletePG(confirmDelete._id);
            setConfirmDelete(null);
          }
        }}
      />
    </div>
  );
}

