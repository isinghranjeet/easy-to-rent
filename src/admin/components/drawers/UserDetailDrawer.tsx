import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { formatDate } from '@/admin/utils/formatters';
import { RoleBadge } from '@/admin/components/shared/RoleBadge';
import { StatusBadge } from '@/admin/components/shared/StatusBadge';
import { fetchUserActivity, fetchUserStats } from '@/admin/services/adminApi';
import type { AdminUser, UserActivityLog, UserStats } from '@/admin/types';
import {
  X,
  UserCircle,
  Activity,
  Calendar,
  Star,
  Mail,
  Phone,
  Clock,
  Key,
  MapPin,
  Shield,
  ShieldOff,
  Trash2,
  Edit,
  Loader2,
  Globe,
  Briefcase,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface UserDetailDrawerProps {
  user: AdminUser | null;
  onClose: () => void;
  onEdit: () => void;
  onBlockToggle: () => void;
  onDelete: () => void;
  isMutating?: boolean;
}

const actionLabelMap: Record<string, string> = {
  login: 'Logged in',
  logout: 'Logged out',
  user_create: 'Account created',
  user_update: 'Profile updated',
  user_delete: 'Account deleted',
  user_suspend: 'Account suspended',
  user_activate: 'Account activated',
  pg_create: 'Created PG listing',
  pg_update: 'Updated PG listing',
  pg_delete: 'Deleted PG listing',
  pg_verify: 'Verified PG listing',
  booking_create: 'Created booking',
  booking_cancel: 'Cancelled booking',
  offer_sent: 'Offer email sent',
  reminder_sent: 'Reminder sent',
  export_data: 'Exported data',
  settings_change: 'Changed settings',
};

const actionIconMap: Record<string, React.ReactNode> = {
  login: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
  logout: <XCircle className="h-3.5 w-3.5 text-gray-400" />,
  user_create: <UserCircle className="h-3.5 w-3.5 text-blue-500" />,
  user_update: <Edit className="h-3.5 w-3.5 text-purple-500" />,
  user_suspend: <ShieldOff className="h-3.5 w-3.5 text-red-500" />,
  user_activate: <Shield className="h-3.5 w-3.5 text-emerald-500" />,
  booking_create: <Calendar className="h-3.5 w-3.5 text-orange-500" />,
  booking_cancel: <XCircle className="h-3.5 w-3.5 text-red-400" />,
};

export function UserDetailDrawer({
  user,
  onClose,
  onEdit,
  onBlockToggle,
  onDelete,
  isMutating,
}: UserDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview');

  const activityQuery = useQuery({
    queryKey: ['admin', 'user-activity', user?._id],
    queryFn: () => (user ? fetchUserActivity(user._id) : Promise.resolve([])),
    enabled: !!user && activeTab === 'activity',
    staleTime: 60_000,
  });

  const statsQuery = useQuery({
    queryKey: ['admin', 'user-stats', user?._id],
    queryFn: () => (user ? fetchUserStats(user._id) : Promise.resolve(null as unknown as UserStats)),
    enabled: !!user && activeTab === 'overview',
    staleTime: 60_000,
  });

  if (!user) return null;

  const activities: UserActivityLog[] = activityQuery.data || [];
  const stats: UserStats | null = (statsQuery.data as UserStats | null) || null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl h-full shadow-2xl overflow-y-auto animate-slideIn flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Profile</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-100 dark:border-gray-800">
            {[
              { key: 'overview', label: 'Overview', icon: UserCircle },
              { key: 'activity', label: 'Activity', icon: Activity },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'overview' | 'activity')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
                  activeTab === tab.key
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50 dark:bg-purple-900/10 dark:text-purple-300'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{user.name}</h4>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <RoleBadge role={user.role} />
                    <StatusBadge status={user.status || 'active'} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                </div>
              </div>

              {/* Stats Cards */}
              {statsQuery.isLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading stats...
                </div>
              ) : stats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Bookings</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.bookingCount}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Total bookings made</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium text-amber-900 dark:text-amber-200">Reviews</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.reviewCount}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Total reviews written</p>
                  </div>
                </div>
              ) : null}

              {/* Recent Bookings */}
              {stats && stats.recentBookings.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    Recent Bookings
                  </h5>
                  <div className="space-y-3">
                    {stats.recentBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.pgName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{booking.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-purple-600">₹{booking.totalAmount.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{formatDate(booking.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Email</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium text-sm">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Verified • Primary</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Phone</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium text-sm">{user.phone || 'Not provided'}</p>
                  <p className="text-xs text-gray-400 mt-1">{user.phone ? 'Verified' : 'Not verified'}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Member Since</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium text-sm">
                    {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Last Active</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium text-sm">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Never'}
                  </p>
                </div>
              </div>

              {/* Location */}
              {user.location && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                    </div>
                    <h5 className="font-semibold text-blue-900 dark:text-blue-200">Location</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">City</p>
                      <p className="font-medium text-blue-900 dark:text-blue-200 text-sm">{user.location.city || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">State</p>
                      <p className="font-medium text-blue-900 dark:text-blue-200 text-sm">{user.location.state || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Country</p>
                      <p className="font-medium text-blue-900 dark:text-blue-200 text-sm">{user.location.country || 'India'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">PIN Code</p>
                      <p className="font-medium text-blue-900 dark:text-blue-200 text-sm">{user.location.pincode || '—'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* System Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                  <Key className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">System Info</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">User ID</span>
                    <span className="font-mono text-gray-900 dark:text-white">{user._id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Account Type</span>
                    <span className="text-gray-900 dark:text-white">
                      {user.role === 'admin' ? 'Administrator' : user.role === 'owner' ? 'Property Owner' : 'Standard User'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onEdit}
                  className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
                <button
                  onClick={onBlockToggle}
                  disabled={isMutating}
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2',
                    user.status === 'active'
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300'
                  )}
                >
                  {isMutating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : user.status === 'active' ? (
                    <ShieldOff className="h-4 w-4" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )}
                  {user.status === 'active' ? 'Block User' : 'Unblock User'}
                </button>
                <button
                  onClick={onDelete}
                  disabled={isMutating}
                  className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Login Activity History</h4>
              {activityQuery.isLoading ? (
                <div className="flex items-center gap-2 text-gray-400 py-8">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading activity...
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No activity recorded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity, idx) => (
                    <div
                      key={activity._id || `activity-${idx}`}
                      className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {actionIconMap[activity.action] || <MessageSquare className="h-3.5 w-3.5 text-gray-400" />}
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {actionLabelMap[activity.action] || activity.action || 'Login'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.timestamp && !isNaN(new Date(activity.timestamp).getTime())
                            ? new Date(activity.timestamp).toLocaleString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: 'numeric',
                                month: 'short',
                              })
                            : '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {activity.ipAddress && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {activity.ipAddress}
                          </span>
                        )}
                        {activity.status && (
                          <span
                            className={cn(
                              'px-1.5 py-0.5 rounded text-[10px] font-medium',
                              activity.status === 'success'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            )}
                          >
                            {activity.status}
                          </span>
                        )}
                      </div>
                      {activity.userAgent && (
                        <p className="text-[10px] text-gray-400 mt-1 truncate">{activity.userAgent}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

