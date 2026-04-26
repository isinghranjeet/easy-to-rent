import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

/**
 * OfflineBanner
 *
 * NOTE: Offline banner is currently hidden (returns null).
 * The "You are offline" text was disabled per user request.
 */
export function OfflineBanner() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  // Keep hook logic alive in case we re-enable later
  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowOnlineToast(true);
      const timer = setTimeout(() => setShowOnlineToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // Banner hidden — do not show on screen
  return null;
}

