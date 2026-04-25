import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, Clock, ShieldCheck, ShieldOff } from 'lucide-react';
import { getStatusColor } from '@/admin/utils/formatters';

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  active: CheckCircle2,
  approved: CheckCircle2,
  confirmed: CheckCircle2,
  paid: CheckCircle2,
  live: CheckCircle2,
  healthy: CheckCircle2,
  verified: ShieldCheck,
  inactive: XCircle,
  rejected: XCircle,
  cancelled: XCircle,
  failed: XCircle,
  down: XCircle,
  suspended: ShieldOff,
  pending: Clock,
  processing: Clock,
  draft: Clock,
  degraded: AlertTriangle,
  warning: AlertTriangle,
  critical: AlertTriangle,
};

export function StatusBadge({ status, showIcon = true, className }: StatusBadgeProps) {
  const safeStatus = status || 'unknown';
  const normalized = safeStatus.toLowerCase();
  const colors = getStatusColor(normalized);
  const Icon = iconMap[normalized] || CheckCircle2;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
}

