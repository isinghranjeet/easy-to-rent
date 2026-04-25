import { useState, useEffect, useCallback, useRef } from 'react';

// PWA Install Prompt Event Type (not in standard DOM types)
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

const STORAGE_KEYS = {
  INSTALLED: 'pwaInstalled',
  DISMISSED: 'pwaDismissed',
  PAGE_VISITS: 'pwaPageVisits',
} as const;

const DISMISS_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const BANNER_DELAY_MS = 7000; // 7 seconds
const BANNER_MIN_PAGES = 2;

interface PWAInstallState {
  isInstalled: boolean;
  isInstallable: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  canShowBanner: boolean;
  canShowButton: boolean;
  promptInstall: () => Promise<boolean>;
  dismissBanner: () => void;
}

function getIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-expect-error navigator.standalone is iOS-specific
    navigator.standalone === true
  );
}

function getIsIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

function getLocalStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setLocalStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function isDismissedExpired(): boolean {
  const dismissedAt = getLocalStorageItem(STORAGE_KEYS.DISMISSED);
  if (!dismissedAt) return true;
  const dismissedTime = parseInt(dismissedAt, 10);
  if (isNaN(dismissedTime)) return true;
  return Date.now() - dismissedTime > DISMISS_DURATION_MS;
}

function getPageVisits(): number {
  const visits = getLocalStorageItem(STORAGE_KEYS.PAGE_VISITS);
  if (!visits) return 0;
  const count = parseInt(visits, 10);
  return isNaN(count) ? 0 : count;
}

function incrementPageVisits(): number {
  const current = getPageVisits();
  const next = current + 1;
  setLocalStorageItem(STORAGE_KEYS.PAGE_VISITS, String(next));
  return next;
}

export function usePWAInstall(): PWAInstallState {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [canShowBanner, setCanShowBanner] = useState<boolean>(false);
  const [canShowButton, setCanShowButton] = useState<boolean>(false);

  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasIncrementedRef = useRef<boolean>(false);

  // Initialize state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const standalone = getIsStandalone();
    const ios = getIsIOS();
    const storedInstalled = getLocalStorageItem(STORAGE_KEYS.INSTALLED) === 'true';

    setIsStandalone(standalone);
    setIsIOS(ios);
    setIsInstalled(standalone || storedInstalled);

    // If already installed, nothing else to do
    if (standalone || storedInstalled) {
      setCanShowBanner(false);
      setCanShowButton(false);
      return;
    }

    // Check if we have a deferred prompt (Chrome/Edge/Android)
    const hasDeferredPrompt = deferredPromptRef.current !== null;
    const installable = hasDeferredPrompt || ios;
    setIsInstallable(installable);

    // Button shows if installable and not installed
    setCanShowButton(installable);

    // Banner logic: needs time OR page visits, and not dismissed recently
    const visits = incrementPageVisits();
    hasIncrementedRef.current = true;

    const shouldShowBanner = isDismissedExpired();
    if (!shouldShowBanner) return;

    const meetsEngagementCriteria = visits >= BANNER_MIN_PAGES;

    if (meetsEngagementCriteria) {
      // Show after delay
      bannerTimerRef.current = setTimeout(() => {
        setCanShowBanner(true);
      }, BANNER_DELAY_MS);
    } else {
      // Show after delay even on first page (gives user time to browse)
      bannerTimerRef.current = setTimeout(() => {
        setCanShowBanner(true);
      }, BANNER_DELAY_MS);
    }

    return () => {
      if (bannerTimerRef.current) {
        clearTimeout(bannerTimerRef.current);
      }
    };
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setIsInstallable(true);
      setCanShowButton(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanShowBanner(false);
      setCanShowButton(false);
      setLocalStorageItem(STORAGE_KEYS.INSTALLED, 'true');
      deferredPromptRef.current = null;
    };

    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        setCanShowBanner(false);
        setCanShowButton(false);
        setLocalStorageItem(STORAGE_KEYS.INSTALLED, 'true');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const mql = window.matchMedia('(display-mode: standalone)');
    mql.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mql.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (isInstalled) return false;

    const deferredPrompt = deferredPromptRef.current;
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPromptRef.current = null;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setCanShowBanner(false);
        setCanShowButton(false);
        setLocalStorageItem(STORAGE_KEYS.INSTALLED, 'true');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [isInstalled]);

  const dismissBanner = useCallback(() => {
    setCanShowBanner(false);
    setLocalStorageItem(STORAGE_KEYS.DISMISSED, String(Date.now()));
  }, []);

  return {
    isInstalled,
    isInstallable,
    isIOS,
    isStandalone,
    canShowBanner,
    canShowButton,
    promptInstall,
    dismissBanner,
  };
}

