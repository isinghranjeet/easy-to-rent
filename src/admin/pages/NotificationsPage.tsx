import { AdminHeader } from '@/admin/components/layout/AdminHeader';
import { StatusBadge } from '@/admin/components/shared/StatusBadge';
import { SkeletonLoader } from '@/admin/components/shared/SkeletonLoader';
import { EmptyState } from '@/admin/components/shared/EmptyState';
import { useAdminNotifications } from '@/admin/hooks/useAdminNotifications';
import { formatTimeAgo } from '@/admin/utils/formatters';
import { cn } from '@/lib/utils';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  CreditCard,
  CalendarDays,
  AlertOctagon,
  MessageSquare,
} from 'lucide-react';

const categoryConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  high_traffic: { icon: TrendingUp, label: 'High Traffic', color: 'text-blue-600 bg-blue-50' },
  payment_failure: { icon: CreditCard, label: 'Payment', color: 'text-red-600 bg-red-50' },
  low_booking: { icon: CalendarDays, label: 'Low Bookings', color: 'text-amber-600 bg-amber-50' },
  system_error: { icon: AlertOctagon, label: 'System', color: 'text-red-600 bg-red-50' },
  new_signup: { icon: Bell, label: 'New Signup', color: 'text-purple-600 bg-purple-50' },
  review_flagged: { icon: MessageSquare, label: 'Review', color: 'text-orange-600 bg-orange-50' },
};

export default function NotificationsPage() {
  const { notifications, isLoading, acknowledge, unreadCount, criticalCount } = useAdminNotifications();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="Notifications" subtitle="Admin alerts and system messages" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Alerts</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{notifications.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Unread</p>
            <p className="text-3xl font-bold text-purple-600">{unreadCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Critical</p>
            <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              All Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="text-sm text-gray-500">{unreadCount} unread</span>
            )}
          </div>

          {isLoading ? (
            <SkeletonLoader rows={5} />
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up!"
            />
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {notifications.map((notification) => {
                const config = categoryConfig[notification.category] || categoryConfig.system_error;
                const Icon = config.icon;
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-5 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                      !notification.acknowledged && 'bg-purple-50/30 dark:bg-purple-900/10'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', config.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{notification.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{notification.message}</p>
                        </div>
                        <StatusBadge status={notification.severity} />
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">{formatTimeAgo(notification.createdAt)}</span>
                        <span className="text-xs text-gray-400 capitalize">{config.label}</span>
                        {!notification.acknowledged && (
                          <button
                            onClick={() => acknowledge(notification.id)}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                    {!notification.acknowledged && (
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

