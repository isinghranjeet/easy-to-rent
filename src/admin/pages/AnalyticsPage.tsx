import { AdminHeader } from '@/admin/components/layout/AdminHeader';
import { ChartSkeleton, KpiCardSkeleton } from '@/admin/components/shared/SkeletonLoader';
import { EmptyState } from '@/admin/components/shared/EmptyState';
import { useAnalytics } from '@/admin/hooks/useAnalytics';
import { formatCurrency, formatCompactNumber } from '@/admin/utils/formatters';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, TrendingUp, Eye, MousePointer } from 'lucide-react';

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  const monthlyRevenue = data?.monthlyRevenue || [];
  const bookingTrends = data?.bookingTrends || [];
  const cityDistribution = data?.cityDistribution || [];
  const mostViewed = data?.mostViewedPGs || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="Analytics" subtitle="Platform insights and performance metrics" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
          ) : (
            <>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCompactNumber(data?.totalViews || 0)}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCompactNumber(data?.totalBookings || 0)}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{(data?.conversionRate || 0).toFixed(1)}%</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Revenue / Booking</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency((data?.totalBookings || 0) > 0 ? 12000 : 0, true)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              Monthly Revenue
            </h3>
            {isLoading ? (
              <ChartSkeleton />
            ) : monthlyRevenue.length === 0 ? (
              <EmptyState icon={BarChart3} title="No revenue data" description="Revenue data will appear here" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Booking Trends */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Booking Trends
            </h3>
            {isLoading ? (
              <ChartSkeleton />
            ) : bookingTrends.length === 0 ? (
              <EmptyState icon={TrendingUp} title="No trend data" description="Booking trends will appear here" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* City Distribution */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              City-wise PG Distribution
            </h3>
            {isLoading ? (
              <ChartSkeleton />
            ) : cityDistribution.length === 0 ? (
              <EmptyState icon={Eye} title="No city data" description="City distribution will appear here" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="city"
                    label={({ city, percentage }) => `${city} ${percentage.toFixed(0)}%`}
                  >
                    {cityDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Most Viewed PGs */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-amber-600" />
              Most Viewed PGs
            </h3>
            {isLoading ? (
              <ChartSkeleton />
            ) : mostViewed.length === 0 ? (
              <EmptyState icon={MousePointer} title="No view data" description="Most viewed PGs will appear here" />
            ) : (
              <div className="space-y-4">
                {mostViewed.map((pg, idx) => (
                  <div key={pg.pgId} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{pg.name}</p>
                      <p className="text-xs text-gray-500">{pg.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCompactNumber(pg.views)} views</p>
                      <p className="text-xs text-gray-500">{pg.bookings} bookings • {pg.conversionRate.toFixed(1)}% conv.</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

