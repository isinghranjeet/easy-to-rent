import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'indigo';
  trend?: number;
  description?: string;
}

export const StatsCard = ({ title, value, icon: Icon, color, trend, description }: StatsCardProps) => {
  const colors = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100' },
    green: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-100' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-100' },
    red: { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' },
    indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-100' }
  };

  const colorSet = colors[color as keyof typeof colors] || colors.blue;

  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorSet.light}`}>
          <Icon className={`h-6 w-6 ${colorSet.text}`} />
        </div>
        {trend !== undefined && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
      {description && (
        <div className="text-xs text-gray-500 mt-2">{description}</div>
      )}
    </div>
  );
};