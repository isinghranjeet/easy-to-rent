import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Trash2,
  Shield,
  ShieldOff,
  ShieldAlert,
  Search,
  RefreshCw,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Clock,
  UserCircle,
  LogOut,
  Home,
  Loader2,
  Eye,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api, User } from '@/services/api';
import { toast } from 'sonner';

// ────────────────── Status Badge Component ──────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    active: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    inactive: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-500', icon: <XCircle className="h-3.5 w-3.5" /> },
    suspended: { bg: 'bg-red-50 border-red-200', text: 'text-red-600', icon: <ShieldAlert className="h-3.5 w-3.5" /> },
  };
  const c = config[status] || config.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text}`}>
      {c.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ────────────────── Role Badge Component ──────────────────
const RoleBadge = ({ role }: { role: string }) => {
  const config: Record<string, { bg: string; text: string }> = {
    admin: { bg: 'bg-purple-100 border-purple-300', text: 'text-purple-700' },
    owner: { bg: 'bg-blue-100 border-blue-300', text: 'text-blue-700' },
    user: { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-600' },
  };
  const c = config[role] || config.user;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text}`}>
      {role === 'admin' ? <Shield className="h-3 w-3" /> : <UserCircle className="h-3 w-3" />}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

// ────────────────── Confirm Modal ──────────────────
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  variant: 'danger' | 'warning';
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, title, message, confirmText, variant, loading, onConfirm, onCancel }: ConfirmModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
            <AlertTriangle className={`h-6 w-6 ${variant === 'danger' ? 'text-red-600' : 'text-amber-600'}`} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onCancel} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ────────────────── User Detail Drawer ──────────────────
const UserDetailDrawer = ({ user, onClose }: { user: User | null; onClose: () => void }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto animate-slideIn">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-gray-900">User Details</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-500/20">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">{user.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status || 'active'} />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 text-gray-600 mb-1">
                <Mail className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Email</span>
              </div>
              <p className="text-gray-900 font-medium ml-7">{user.email}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 text-gray-600 mb-1">
                <Phone className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Phone</span>
              </div>
              <p className="text-gray-900 font-medium ml-7">{user.phone || 'Not provided'}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Joined</span>
              </div>
              <p className="text-gray-900 font-medium ml-7">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 text-gray-600 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Last Login</span>
              </div>
              <p className="text-gray-900 font-medium ml-7">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'Never'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 text-gray-600 mb-1">
                <UserCircle className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">User ID</span>
              </div>
              <p className="text-gray-900 font-mono text-sm ml-7">{user._id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────── Admin Panel Page ──────────────────
const AdminPanel = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [statusChangeTarget, setStatusChangeTarget] = useState<{ user: User; newStatus: string } | null>(null);

  // Check admin access
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast.error('Admin access required');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data.items || []);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchUsers();
    }
  }, [isAuthenticated, user, fetchUsers]);

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const response = await api.deleteUser(deleteTarget._id);
      if (response.success) {
        toast.success(response.message);
        setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = async () => {
    if (!statusChangeTarget) return;
    setActionLoading(true);
    try {
      const response = await api.updateUserStatus(statusChangeTarget.user._id, statusChangeTarget.newStatus);
      if (response.success) {
        toast.success(response.message);
        setUsers((prev) => prev.map((u) => (u._id === statusChangeTarget.user._id ? { ...u, status: statusChangeTarget.newStatus } : u)));
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setActionLoading(false);
      setStatusChangeTarget(null);
    }
  };

  // Stats
  const stats = {
    total: users.length,
    active: users.filter((u) => (u.status || 'active') === 'active').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    admins: users.filter((u) => u.role === 'admin').length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">EassyToRent Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full border border-purple-100">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-purple-700">{user?.name}</span>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.total, icon: <Users className="h-5 w-5" />, color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50' },
            { label: 'Active', value: stats.active, icon: <CheckCircle2 className="h-5 w-5" />, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50' },
            { label: 'Suspended', value: stats.suspended, icon: <ShieldAlert className="h-5 w-5" />, color: 'from-red-500 to-rose-600', bg: 'bg-red-50' },
            { label: 'Admins', value: stats.admins, icon: <Shield className="h-5 w-5" />, color: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <div key={i} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            </div>
          ))}
        </div>

        {/* ── Filters & Search ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="p-5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                  <option value="owner">Owners</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Refresh */}
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ── Users Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No users found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="hidden md:grid md:grid-cols-[1fr_1fr_100px_100px_120px_120px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span>User</span>
                <span>Contact</span>
                <span>Role</span>
                <span>Status</span>
                <span>Joined</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Rows */}
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_100px_100px_120px_120px] gap-2 md:gap-4 items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                      u.role === 'admin' 
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-500' 
                        : 'bg-gradient-to-br from-orange-500 to-amber-500'
                    }`}>
                      {u.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate md:hidden">{u.email}</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="hidden md:block min-w-0">
                    <p className="text-sm text-gray-700 truncate">{u.email}</p>
                    <p className="text-xs text-gray-400">{u.phone || 'No phone'}</p>
                  </div>

                  {/* Role */}
                  <div>
                    <RoleBadge role={u.role} />
                  </div>

                  {/* Status */}
                  <div>
                    <StatusBadge status={u.status || 'active'} />
                  </div>

                  {/* Joined */}
                  <div className="hidden md:block">
                    <p className="text-sm text-gray-600">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 justify-end">
                    {/* View */}
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {/* Status Toggle */}
                    {u.role !== 'admin' && (
                      <button
                        onClick={() =>
                          setStatusChangeTarget({
                            user: u,
                            newStatus: (u.status || 'active') === 'active' ? 'suspended' : 'active',
                          })
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          (u.status || 'active') === 'active'
                            ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-amber-500 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={(u.status || 'active') === 'active' ? 'Suspend User' : 'Activate User'}
                      >
                        {(u.status || 'active') === 'active' ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </button>
                    )}

                    {/* Delete */}
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-700">{filteredUsers.length}</span> of{' '}
                  <span className="font-semibold text-gray-700">{users.length}</span> users
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ── Modals ── */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone. All their data, reviews, and bookings will be removed.`}
        confirmText="Delete User"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        isOpen={!!statusChangeTarget}
        title={statusChangeTarget?.newStatus === 'suspended' ? 'Suspend User' : 'Activate User'}
        message={
          statusChangeTarget?.newStatus === 'suspended'
            ? `Suspend "${statusChangeTarget?.user.name}"? They will not be able to log in until reactivated.`
            : `Reactivate "${statusChangeTarget?.user.name}"? They will be able to log in again.`
        }
        confirmText={statusChangeTarget?.newStatus === 'suspended' ? 'Suspend' : 'Activate'}
        variant="warning"
        loading={actionLoading}
        onConfirm={handleStatusChange}
        onCancel={() => setStatusChangeTarget(null)}
      />

      <UserDetailDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
};

export default AdminPanel;
