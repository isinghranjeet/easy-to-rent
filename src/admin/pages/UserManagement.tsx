import { useState } from 'react';
import { AdminHeader } from '@/admin/components/layout/AdminHeader';
import { RoleBadge } from '@/admin/components/shared/RoleBadge';
import { StatusBadge } from '@/admin/components/shared/StatusBadge';
import { SkeletonLoader } from '@/admin/components/shared/SkeletonLoader';
import { EmptyState } from '@/admin/components/shared/EmptyState';
import { ConfirmActionModal } from '@/admin/components/modals/ConfirmActionModal';
import { EditUserModal } from '@/admin/components/modals/EditUserModal';
import { UserDetailDrawer } from '@/admin/components/drawers/UserDetailDrawer';
import { useUserManagement } from '@/admin/hooks/useUserManagement';
import { exportToCSV } from '@/admin/utils/exportHelpers';
import { formatDate } from '@/admin/utils/formatters';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ShieldOff,
  Shield,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Eye,
  Edit,
} from 'lucide-react';
import type { AdminUser } from '@/admin/types';

export default function UserManagement() {
  const {
    data,
    isLoading,
    refetch,
    filters,
    setFilters,
    pagination,
    setPagination,
    updateUserStatus,
    deleteUser,
    updateUser,
    isMutating,
  } = useUserManagement();

  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<{ user: AdminUser; newStatus: string } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const users = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const pageSizeOptions = [10, 20, 50];
  const sortOptions = [
    { value: 'createdAt', label: 'Newest' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'role', label: 'Role' },
    { value: 'status', label: 'Status' },
    { value: 'lastLogin', label: 'Last Login' },
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
      users.map((u) => ({
        name: u.name,
        email: u.email,
        phone: u.phone || '—',
        role: u.role,
        status: u.status,
        city: u.location?.city || '—',
        joined: u.createdAt,
      })),
      'users',
      [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'role', label: 'Role' },
        { key: 'status', label: 'Status' },
        { key: 'city', label: 'City' },
        { key: 'joined', label: 'Joined' },
      ]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="User Management" subtitle="Manage platform users" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
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
                value={filters.role}
                onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <SkeletonLoader rows={6} columns={1} />
          ) : users.length === 0 ? (
            <EmptyState icon={Users} title="No users found" description="Try adjusting your search or filters" />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">User</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Contact</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Role</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Location</th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Joined</th>
                      <th className="text-right px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {user.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          <p className="text-sm">{user.email}</p>
                          <p className="text-xs text-gray-400">{user.phone || 'No phone'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={user.status || 'active'} />
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                          {user.location?.city || '—'}
                          {user.location?.state && <span className="text-gray-400 text-xs block">{user.location.state}</span>}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-600"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-purple-600"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {user.role !== 'admin' && (
                              <button
                                onClick={() =>
                                  setConfirmStatus({
                                    user,
                                    newStatus: user.status === 'active' ? 'suspended' : 'active',
                                  })
                                }
                                disabled={isMutating}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-purple-600"
                                title={user.status === 'active' ? 'Suspend' : 'Activate'}
                              >
                                {user.status === 'active' ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                              </button>
                            )}
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => setConfirmDelete(user)}
                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
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
                  Showing {users.length} of {data?.total || 0} users
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

      <ConfirmActionModal
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
        title="Delete User"
        description={`Delete user "${confirmDelete?.name}"? This cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={async () => {
          if (confirmDelete) {
            await deleteUser(confirmDelete._id);
            setConfirmDelete(null);
          }
        }}
      />

      <ConfirmActionModal
        open={!!confirmStatus}
        onOpenChange={() => setConfirmStatus(null)}
        title={confirmStatus?.newStatus === 'suspended' ? 'Suspend User' : 'Activate User'}
        description={`${confirmStatus?.newStatus === 'suspended' ? 'Suspend' : 'Activate'} user "${confirmStatus?.user.name}"?`}
        confirmText="Confirm"
        variant="warning"
        onConfirm={async () => {
          if (confirmStatus) {
            await updateUserStatus({ id: confirmStatus.user._id, status: confirmStatus.newStatus });
            setConfirmStatus(null);
          }
        }}
      />

      <UserDetailDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onEdit={() => {
          if (selectedUser) {
            setEditingUser(selectedUser);
            setSelectedUser(null);
          }
        }}
        onBlockToggle={() => {
          if (selectedUser) {
            setConfirmStatus({
              user: selectedUser,
              newStatus: selectedUser.status === 'active' ? 'suspended' : 'active',
            });
            setSelectedUser(null);
          }
        }}
        onDelete={() => {
          if (selectedUser) {
            setConfirmDelete(selectedUser);
            setSelectedUser(null);
          }
        }}
        isMutating={isMutating}
      />

      <EditUserModal
        user={editingUser}
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={async (formData) => {
          if (editingUser) {
            await updateUser({ id: editingUser._id, data: formData });
            setEditingUser(null);
          }
        }}
        loading={isMutating}
      />
    </div>
  );
}

