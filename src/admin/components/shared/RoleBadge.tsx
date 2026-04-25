import { cn } from '@/lib/utils';
import { Shield, UserCircle, Building2, Crown } from 'lucide-react';
import { getRoleColor } from '@/admin/utils/formatters';

interface RoleBadgeProps {
  role: string;
  showIcon?: boolean;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  admin: Crown,
  moderator: Shield,
  owner: Building2,
  user: UserCircle,
};

export function RoleBadge({ role, showIcon = true, className }: RoleBadgeProps) {
  const normalized = role.toLowerCase();
  const colors = getRoleColor(normalized);
  const Icon = iconMap[normalized] || UserCircle;

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
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

