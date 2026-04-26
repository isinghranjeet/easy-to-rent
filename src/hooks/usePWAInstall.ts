import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * The beforeinstallprompt event is fired when the PWA meets the installability criteria.
 * It allows us to defer the install prompt and trigger it later programmatically.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

/**
 * Return type for the usePWAInstall hook.
 */
interface UsePWAInstallReturn {
  /** True if the app is currently running in standalone mode (installed). */
  isInstalled: boolean;
  /** True if the app can be installed (beforeinstallprompt fired, or iOS). */
  isInstallable: boolean;
  /** True if the device is an iPhone/iPad/iPod. */
  isIOS: boolean;
  /** Triggers the native install prompt. Returns true if user accepted. */
  promptInstall: () => Promise<boolean>;
}

/**
 * Detects if the app is running as an installed PWA.
 * Checks both standard display-mode and iOS navigator.standalone.
 */
function getIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-expect-error navigator.standalone is iOS-specific and not in standard types
    navigator.standalone === true
  );
}

/**
 * Detects iOS devices by checking the user agent string.
 */
function getIsIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

/**
 * usePWAInstall
 *
 * A robust PWA install detection hook that relies purely on browser APIs.
 * NO localStorage is used for install detection, so uninstall/re-install cycles work correctly.
 *
 * How it works:
 * 1. On mount, checks if the app is running in standalone mode via matchMedia.
 * 2. Listens for the `beforeinstallprompt` event to know when the browser thinks the app is installable.
 * 3. Listens for the `appinstalled` event to detect successful installation.
 * 4. Listens for changes to `display-mode: standalone` to detect installation/uninstallation.
 * 5. On iOS (which doesn't support beforeinstallprompt), treats the app as installable if not already standalone.
 */
export function usePWAInstall(): UsePWAInstallReturn {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  // Store the deferred install prompt so we can trigger it later
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  /**
   * Initialize state on mount.
   * We check standalone mode immediately so the UI is correct on first render.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const standalone = getIsStandalone();
    const ios = getIsIOS();

    setIsInstalled(standalone);
    setIsIOS(ios);

    // iOS Safari does not fire beforeinstallprompt, but the app is still installable
    // manually via Share → Add to Home Screen. We mark it installable here.
    if (ios && !standalone) {
      setIsInstallable(true);
    }
  }, []);

  /**
   * Set up event listeners for PWA install lifecycle events.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    /**
     * Fired when the app meets the installability criteria.
     * We prevent the default mini-infobar and store the event for later use.
     */
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setIsInstallable(true);
    };

    /**
     * Fired when the PWA has been successfully installed.
     */
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      deferredPromptRef.current = null;
    };

    /**
     * Fired when the display mode changes (e.g. user installs or uninstalls the app).
     * If it switches TO standalone, the app is now installed.
     * Note: uninstalling usually requires a page reload for this to update,
     * but on next visit the initial mount check will catch it.
     */
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const mql = window.matchMedia('(display-mode: standalone)');
    mql.addEventListener('change', handleDisplayModeChange);

    // Cleanup: remove all listeners when the component unmounts
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mql.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  /**
   * Triggers the native browser install prompt.
   * Returns true if the user clicked "Install", false otherwise.
   */
  const promptInstall = useCallback(async (): Promise<boolean> => {
    // Already installed — nothing to do
    if (isInstalled) return false;

    const deferredPrompt = deferredPromptRef.current;
    if (!deferredPrompt) return false;

    try {
      // Show the native install prompt to the user
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      // Clear the deferred prompt — it can only be used once
      deferredPromptRef.current = null;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }, [isInstalled]);

  return {
    isInstalled,
    isInstallable,
    isIOS,
    promptInstall,
  };
}

