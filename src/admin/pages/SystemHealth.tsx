import { AdminHeader } from '@/admin/components/layout/AdminHeader';
import { StatusBadge } from '@/admin/components/shared/StatusBadge';
import { SkeletonLoader } from '@/admin/components/shared/SkeletonLoader';
import { useSystemHealth } from '@/admin/hooks/useSystemHealth';
import { formatDate } from '@/admin/utils/formatters';
import { cn } from '@/lib/utils';
import {
  Activity,
  Server,
  Database,
  Clock,
  AlertTriangle,
  Zap,
  RefreshCw,
  HardDrive,
  Cpu,
} from 'lucide-react';

export default function SystemHealth() {
  const { health, errorLogs, isLoading, refetch } = useSystemHealth();

  const uptime = health?.uptime ?? 99.9;
  const overall = health?.overall ?? 'healthy';
  const cacheHitRatio = health?.cacheHitRatio ?? 0;
  const serverLoad = health?.serverLoad ?? { cpu: 0, memory: 0, disk: 0 };

  const apiEndpoints = health?.apiHealth || [
    { endpoint: '/api/auth', status: 'healthy' as const, responseTime: 45, errorRate: 0 },
    { endpoint: '/api/pg', status: 'healthy' as const, responseTime: 120, errorRate: 0.1 },
    { endpoint: '/api/bookings', status: 'healthy' as const, responseTime: 85, errorRate: 0 },
    { endpoint: '/api/payments', status: 'healthy' as const, responseTime: 200, errorRate: 0.2 },
    { endpoint: '/api/reviews', status: 'healthy' as const, responseTime: 60, errorRate: 0 },
  ];

  const slowEndpoints = apiEndpoints.filter((e) => e.responseTime > 150);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="System Health" subtitle="Monitor platform infrastructure" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overall Status</p>
                <StatusBadge status={overall} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{uptime.toFixed(2)}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cache Hit Ratio</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{cacheHitRatio.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Slow Endpoints</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{slowEndpoints.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Server Load */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Server className="h-4 w-4 text-purple-600" />
            Server Load
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'CPU', value: serverLoad.cpu, icon: Cpu, color: 'bg-blue-500' },
              { label: 'Memory', value: serverLoad.memory, icon: Database, color: 'bg-purple-500' },
              { label: 'Disk', value: serverLoad.disk, icon: HardDrive, color: 'bg-emerald-500' },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <metric.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{metric.value.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', metric.color)}
                    style={{ width: `${Math.min(100, metric.value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Health */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              API Health
            </h3>
            <button
              onClick={refetch}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Endpoint</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Response Time</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-500 dark:text-gray-400">Error Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {apiEndpoints.map((endpoint) => (
                  <tr key={endpoint.endpoint} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900 dark:text-white">{endpoint.endpoint}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={endpoint.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <span className={cn(endpoint.responseTime > 150 && 'text-amber-600 font-medium')}>
                        {endpoint.responseTime}ms
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <span className={cn(endpoint.errorRate > 1 && 'text-red-600 font-medium')}>
                        {endpoint.errorRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error Logs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Recent Error Logs
            </h3>
          </div>
          {isLoading ? (
            <SkeletonLoader rows={4} />
          ) : (errorLogs || []).length === 0 ? (
            <div className="p-8 text-center text-gray-500">No errors logged. System is healthy.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[400px] overflow-y-auto">
{(errorLogs || []).map((log: unknown, idx: number) => (
                <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm text-gray-900 dark:text-white">{log.endpoint || 'Unknown'}</span>
                    <span className="text-xs text-gray-400">{formatDate(log.timestamp)}</span>
                  </div>
                  <p className="text-sm text-red-600">{log.message || 'Error occurred'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{log.method} • Status {log.statusCode}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

