import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  loading?: boolean;
  onClick?: () => void;
}

export function KpiCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-purple-600',
  iconBg = 'bg-purple-50',
  loading = false,
  onClick,
}: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm transition-all',
        onClick && 'cursor-pointer hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          )}
          {!loading && change !== undefined && (
            <div className="flex items-center gap-1">
              {changeType === 'up' && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
              {changeType === 'down' && <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
              {changeType === 'neutral' && <Minus className="h-3.5 w-3.5 text-gray-400" />}
              <span
                className={cn(
                  'text-xs font-medium',
                  changeType === 'up' && 'text-emerald-600',
                  changeType === 'down' && 'text-red-600',
                  changeType === 'neutral' && 'text-gray-500'
                )}
              >
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-400 ml-1">vs last 7d</span>
            </div>
          )}
        </div>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
      </div>
    </div>
  );
}

