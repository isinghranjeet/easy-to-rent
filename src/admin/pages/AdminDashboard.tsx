import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminHeader } from '@/admin/components/layout/AdminHeader';
import { KpiCard } from '@/admin/components/dashboard/KpiCard';
import { KpiCardSkeleton, SkeletonLoader } from '@/admin/components/shared/SkeletonLoader';
import { EmptyState } from '@/admin/components/shared/EmptyState';
import { StatusBadge } from '@/admin/components/shared/StatusBadge';
import { useDashboardStats } from '@/admin/hooks/useDashboardStats';
import { useLiveActivity } from '@/admin/hooks/useLiveActivity';
import { useReviewManagement } from '@/admin/hooks/useReviewManagement';
import { useAdminNotifications } from '@/admin/hooks/useAdminNotifications';
import { formatCurrency, formatTimeAgo, getActivityColor } from '@/admin/utils/formatters';
import {
  Users,
  Home,
  CalendarDays,
  IndianRupee,
  ShieldCheck,
  Clock,
  Activity,
  Star,
  Bell,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Mail,
  Heart,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { SendBulkOfferModal } from '@/admin/components/modals/SendBulkOfferModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { events, isLoading: activityLoading, unreadCount } = useLiveActivity();
  const { pendingReviews } = useReviewManagement();
  const { criticalCount } = useAdminNotifications();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [triggeringWishlist, setTriggeringWishlist] = useState(false);

  const kpiData = [
    {
      label: 'Total PGs',
      value: stats?.totalPGs ?? 0,
      change: 12.5,
      changeType: 'up' as const,
      icon: Home,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      onClick: () => navigate('/admin/pgs'),
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      change: 8.2,
      changeType: 'up' as const,
      icon: Users,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      onClick: () => navigate('/admin/users'),
    },
    {
      label: 'Total Bookings',
      value: stats?.totalBookings ?? 0,
      change: -2.4,
      changeType: 'down' as const,
      icon: CalendarDays,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      onClick: () => navigate('/admin/bookings'),
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue ?? 0, true),
      change: 15.3,
      changeType: 'up' as const,
      icon: IndianRupee,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      onClick: () => navigate('/admin/analytics'),
    },
    {
      label: 'Active Listings',
      value: stats?.activeListings ?? 0,
      change: 5.1,
      changeType: 'up' as const,
      icon: ShieldCheck,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
      onClick: () => navigate('/admin/pgs'),
    },
    {
      label: 'Pending Approvals',
      value: stats?.pendingApprovals ?? 0,
      change: stats?.pendingApprovals && stats.pendingApprovals > 5 ? 20 : 0,
      changeType: (stats?.pendingApprovals && stats.pendingApprovals > 5 ? 'up' : 'neutral') as 'up' | 'down' | 'neutral',
      icon: Clock,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50',
      onClick: () => navigate('/admin/pgs'),
    },
  ];

  const quickStats = [
    {
      label: 'Pending Reviews',
      value: pendingReviews?.length ?? 0,
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      onClick: () => navigate('/admin/reviews'),
    },
    {
      label: 'Notifications',
      value: criticalCount ?? 0,
      icon: Bell,
      color: 'text-red-600',
      bg: 'bg-red-50',
      onClick: () => navigate('/admin/notifications'),
    },
    {
      label: 'New Today',
      value: (stats?.newUsersToday ?? 0) + (stats?.newPGsToday ?? 0),
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      onClick: () => navigate('/admin/analytics'),
    },
  ];

  const handleTriggerWishlistReminders = async () => {
    try {
      setTriggeringWishlist(true);
      const res = await api.sendBulkWishlistReminders();
      if (res.success) {
        toast.success(res.message || 'Wishlist reminders triggered');
      } else {
        toast.error(res.message || 'Failed to trigger reminders');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to trigger wishlist reminders');
    } finally {
      setTriggeringWishlist(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="Dashboard" subtitle="Real-time platform overview" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsLoading
            ? Array.from({ length: 6 }).map((_, i) => <KpiCardSkeleton key={i} />)
            : kpiData.map((kpi) => (
                <KpiCard key={kpi.label} {...kpi} />
              ))}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStats.map((stat) => (
            <button
              key={stat.label}
              onClick={stat.onClick}
              className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon className={cn('h-6 w-6', stat.color)} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
            </button>
          ))}
        </div>

        {/* Main Content: Activity Feed + Recent Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Activity Feed */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Live Activity</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs text-gray-500">Live</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
              {activityLoading ? (
                <SkeletonLoader rows={4} />
              ) : events.length === 0 ? (
                <EmptyState
                  icon={Activity}
                  title="No activity found"
                  description="Platform activity will appear here in real-time"
                />
              ) : (
                events.map((event) => {
                  const colors = getActivityColor(event.type);
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        'p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                        !event.read && 'bg-purple-50/50 dark:bg-purple-900/10'
                      )}
                    >
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colors.bg)}>
                        <Activity className={cn('h-4 w-4', colors.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {event.message}
                          {event.userName && (
                            <span className="text-gray-500"> by <span className="font-medium">{event.userName}</span></span>
                          )}
                          {event.targetName && (
                            <span className="text-gray-500"> — <span className="font-medium">{event.targetName}</span></span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatTimeAgo(event.timestamp)}</p>
                      </div>
                      {!event.read && (
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Alerts + Summary */}
          <div className="space-y-6">
            {/* System Status Mini */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">API Health</span>
                  <StatusBadge status="healthy" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Database</span>
                  <StatusBadge status="healthy" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Cache</span>
                  <StatusBadge status="healthy" />
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => navigate('/admin/system')}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    View Details <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Alerts
              </h3>
              {criticalCount > 0 ? (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                    {criticalCount} critical alert{criticalCount > 1 ? 's' : ''} require attention
                  </p>
                  <button
                    onClick={() => navigate('/admin/notifications')}
                    className="text-xs text-red-600 hover:text-red-700 mt-1 font-medium"
                  >
                    View all alerts →
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No critical alerts at this time.</p>
              )}
            </div>

            {/* Marketing Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-purple-600" />
                Marketing Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Send Offer to All Users</p>
                    <p className="text-xs text-purple-500">Bulk email campaign</p>
                  </div>
                </button>
                <button
                  onClick={handleTriggerWishlistReminders}
                  disabled={triggeringWishlist}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-800 flex items-center justify-center flex-shrink-0">
                    {triggeringWishlist ? (
                      <Loader2 className="h-5 w-5 text-pink-600 animate-spin" />
                    ) : (
                      <Heart className="h-5 w-5 text-pink-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-pink-700 dark:text-pink-300">Trigger Wishlist Reminders</p>
                    <p className="text-xs text-pink-500">Send email to all wishlist users</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SendBulkOfferModal
        open={showOfferModal}
        onClose={() => setShowOfferModal(false)}
      />
    </div>
  );
}

