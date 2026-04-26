import { Loader2 } from 'lucide-react';

/**
 * PageLoader
 *
 * Shown while lazy-loaded pages are being fetched.
 * Centered, minimal, and matches the app's orange theme.
 */
export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
    </div>
  );
}

