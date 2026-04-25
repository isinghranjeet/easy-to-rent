import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonLoaderProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonLoader({ rows = 5, columns = 1, className }: SkeletonLoaderProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-12 flex-1 rounded-xl" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
      <div className="flex items-start justify-between">
        <div className="space-y-3 w-full">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800', className)}>
      <Skeleton className="h-6 w-40 mb-4" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

