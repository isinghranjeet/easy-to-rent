import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

/**
 * OfflineBanner
 *
 * Shows a sleek top banner when the user goes offline,
 * and a brief "Back online" confirmation when connectivity returns.
 */
export function OfflineBanner() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  // Show "back online" toast only if we were previously offline
  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowOnlineToast(true);
      const timer = setTimeout(() => setShowOnlineToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return (
    <>
      {/* Offline Banner — positioned below navbar (h-14 ≈ 3.5rem) */}
      <div
        className={`fixed top-14 left-0 right-0 z-[100] transition-transform duration-500 ease-out ${
          !isOnline ? 'translate-y-0' : '-translate-y-[200%]'
        }`}
      >
        <div className="bg-gray-900/95 backdrop-blur text-white px-4 py-2 flex items-center justify-center gap-2 shadow-lg border-b border-gray-700">
          <WifiOff className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="text-sm font-medium">
            You are offline. Some features may be limited.
          </span>
        </div>
      </div>

      {/* Back Online Toast */}
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out ${
          showOnlineToast
            ? 'translate-y-0 opacity-100'
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium">
          <Wifi className="w-4 h-4" />
          Back online
        </div>
      </div>
    </>
  );
}

