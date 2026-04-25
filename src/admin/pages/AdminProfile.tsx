import { useState } from 'react';
import { AdminHeader } from '@/admin/components/layout/AdminHeader';
import { useAdminProfile } from '@/admin/hooks/useAdminProfile';
import { RoleBadge } from '@/admin/components/shared/RoleBadge';
import { formatDate } from '@/admin/utils/formatters';
import { createPermissionChecker } from '@/admin/utils/rbacHelpers';
import { cn } from '@/lib/utils';
import type { AdminProfileUpdateData, AdminPasswordUpdateData, UserActivityLog } from '@/admin/types';
import {
  Loader2,
  UserCircle,
  Mail,
  Phone,
  Shield,
  Clock,
  Key,
  Edit,
  Save,
  X,
  Lock,
  Activity,
  CheckCircle2,
  XCircle,
  Globe,
  MessageSquare,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

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

export default function AdminProfile() {
  const {
    profile,
    isLoading,
    isLoadingActivity,
    activityLogs,
    updateProfile,
    updatePassword,
    isUpdatingProfile,
    isUpdatingPassword,
    refetchProfile,
  } = useAdminProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editForm, setEditForm] = useState<AdminProfileUpdateData>({});
  const [passwordForm, setPasswordForm] = useState<AdminPasswordUpdateData>({
    currentPassword: '',
    newPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const checker = createPermissionChecker(profile?.role || 'user');
  const allPermissions = checker.canAll;

  const permissionGroups = [
    {
      label: 'Dashboard',
      permissions: ['dashboard:view'] as const,
      icon: Activity,
    },
    {
      label: 'Users',
      permissions: ['users:view', 'users:manage', 'users:delete'] as const,
      icon: UserCircle,
    },
    {
      label: 'PG Listings',
      permissions: ['pgs:view', 'pgs:manage', 'pgs:delete'] as const,
      icon: Shield,
    },
    {
      label: 'Bookings',
      permissions: ['bookings:view', 'bookings:manage'] as const,
      icon: Clock,
    },
    {
      label: 'Reviews',
      permissions: ['reviews:view', 'reviews:moderate'] as const,
      icon: MessageSquare,
    },
    {
      label: 'Analytics',
      permissions: ['analytics:view'] as const,
      icon: Activity,
    },
    {
      label: 'System',
      permissions: ['system:view', 'settings:manage'] as const,
      icon: Key,
    },
  ];

  const handleStartEdit = () => {
    if (profile) {
      setEditForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
      });
      setIsEditing(true);
      setFormErrors({});
    }
  };

  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!editForm.name?.trim()) errors.name = 'Name is required';
    if (!editForm.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = 'Invalid email format';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateEditForm()) return;
    await updateProfile(editForm);
    setIsEditing(false);
    refetchProfile();
  };

  const validatePasswordForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePassword = async () => {
    if (!validatePasswordForm()) return;
    await updatePassword(passwordForm);
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: '', newPassword: '' });
    setFormErrors({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="Admin Profile" subtitle="Manage your account and permissions" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
                  {profile.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{profile.email}</p>
                <div className="mt-3">
                  <RoleBadge role={profile.role} />
                </div>
                <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last login: {profile.lastLogin ? formatDate(profile.lastLogin) : 'Never'}
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <UserCircle className="h-3 w-3" />
                    Member since: {profile.createdAt ? formatDate(profile.createdAt) : 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
                {!isEditing ? (
                  <button
                    onClick={handleStartEdit}
                    className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Name</label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className={cn(
                          'w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500',
                          formErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        )}
                      />
                      {formErrors.name && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className={cn(
                          'w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500',
                          formErrors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        )}
                      />
                      {formErrors.email && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isUpdatingProfile}
                        className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {isUpdatingProfile ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Save
                      </button>
                    </div>
                  </div>
                )}

                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Change Password
                  </button>
                ) : (
                  <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Change Password</h4>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className={cn(
                            'w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500',
                            formErrors.currentPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showCurrentPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      {formErrors.currentPassword && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.currentPassword}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className={cn(
                            'w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500',
                            formErrors.newPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      {formErrors.newPassword && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.newPassword}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setShowPasswordForm(false); setFormErrors({}); }}
                        className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePassword}
                        disabled={isUpdatingPassword}
                        className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {isUpdatingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column — Permissions & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Permissions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                Permissions & Role
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {permissionGroups.map((group) => {
                  const hasAny = group.permissions.some((p) => checker.can(p as never));
                  const hasAll = group.permissions.every((p) => checker.can(p as never));
                  return (
                    <div
                      key={group.label}
                      className={cn(
                        'p-4 rounded-xl border transition-colors',
                        hasAny
                          ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800'
                          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <group.icon
                          className={cn(
                            'h-4 w-4',
                            hasAny ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm font-semibold',
                            hasAny ? 'text-purple-900 dark:text-purple-200' : 'text-gray-500 dark:text-gray-400'
                          )}
                        >
                          {group.label}
                        </span>
                        {hasAll && (
                          <span className="ml-auto text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                            Full Access
                          </span>
                        )}
                        {hasAny && !hasAll && (
                          <span className="ml-auto text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded">
                            Partial
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {group.permissions.map((perm) => (
                          <div key={perm} className="flex items-center gap-1.5 text-xs">
                            {checker.can(perm as never) ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-3 w-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                            )}
                            <span
                              className={cn(
                                checker.can(perm as never)
                                  ? 'text-gray-700 dark:text-gray-300'
                                  : 'text-gray-400 dark:text-gray-500'
                              )}
                            >
                              {perm.split(':')[1].replace(/_/g, ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Logs */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                Activity Logs
              </h3>
              {isLoadingActivity ? (
                <div className="flex items-center gap-2 text-gray-400 py-8">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading activity...
                </div>
              ) : activityLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No activity recorded yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {activityLogs.map((log: UserActivityLog) => (
                    <div
                      key={log._id}
                      className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {actionLabelMap[log.action] || log.action}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(log.timestamp).toLocaleString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {log.ipAddress && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {log.ipAddress}
                          </span>
                        )}
                        <span
                          className={cn(
                            'px-1.5 py-0.5 rounded text-[10px] font-medium',
                            log.status === 'success'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          )}
                        >
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

