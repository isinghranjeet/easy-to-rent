import { useState, useEffect, useCallback } from 'react';
import { Download, X, Share2, PlusSquare, Smartphone, CheckCircle2, Loader2 } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

/**
 * Props for the InstallButton component.
 * - variant: visual style of the button
 */
interface InstallButtonProps {
  variant?: 'navbar' | 'floating' | 'hero';
}

/**
 * Production-ready PWA Install Button
 *
 * Features:
 * - Shows only when the app is installable (beforeinstallprompt fired)
 * - Hides if already installed (display-mode: standalone or appinstalled event)
 * - Stores install state in localStorage for persistence
 * - iOS fallback: shows step-by-step instructions since Safari doesn't support beforeinstallprompt
 * - Prevents duplicate install prompts
 * - Smooth enter/exit animations
 * - Accessible (ARIA labels, keyboard support)
 */
export function InstallButton({ variant = 'floating' }: InstallButtonProps) {
  // Get PWA install state from our custom hook
  const { isInstalled, canShowButton, isIOS, isStandalone, promptInstall } = usePWAInstall();

  // Local UI state
  const [isVisible, setIsVisible] = useState(false);        // Controls animation in/out
  const [showIOSModal, setShowIOSModal] = useState(false);  // iOS instruction modal
  const [isHovered, setIsHovered] = useState(false);        // Hover state for desktop
  const [isInstalling, setIsInstalling] = useState(false);  // Loading state during prompt

  /**
   * Determine visibility with a small delay for smooth entrance animation.
   * We also double-check isStandalone to be safe.
   */
  useEffect(() => {
    if (canShowButton && !isInstalled && !isStandalone) {
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [canShowButton, isInstalled, isStandalone]);

  /**
   * Handle the install button click.
   * - iOS: show manual instructions modal
   * - Chrome/Edge/Android: trigger native install prompt
   */
  const handleInstall = useCallback(async () => {
    // iOS Safari doesn't support beforeinstallprompt, so we show manual instructions
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // Prevent multiple simultaneous prompts
    if (isInstalling) return;
    setIsInstalling(true);

    try {
      const installed = await promptInstall();
      if (installed) {
        // If user accepted, hide the button immediately
        setIsVisible(false);
      }
    } catch (err) {
      console.error('Install prompt failed:', err);
    } finally {
      setIsInstalling(false);
    }
  }, [isIOS, isInstalling, promptInstall]);

  /**
   * Close the iOS instruction modal.
   */
  const closeIOSModal = useCallback(() => {
    setShowIOSModal(false);
  }, []);

  // Don't render anything if the button shouldn't be shown
  if (!isVisible) return null;

  /* ─────────────────────────── VARIANTS ─────────────────────────── */

  // 1. NAVBAR: Compact button for top navigation bar (desktop)
  if (variant === 'navbar') {
    return (
      <>
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
            transition-all duration-300 ease-out transform
            ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
            ${isHovered
              ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-200 scale-105'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg'
            }
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
          aria-label="Install EasyToRent app on your device"
          title="Install EasyToRent app"
        >
          {isInstalling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
        </button>

        {/* iOS Instruction Modal */}
        <IOSInstallModal isOpen={showIOSModal} onClose={closeIOSModal} />
      </>
    );
  }

  // 2. HERO: Large prominent button for landing pages / hero sections
  if (variant === 'hero') {
    return (
      <>
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className={`
            inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold
            transition-all duration-300 ease-out transform
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            bg-gradient-to-r from-orange-500 to-orange-600 text-white
            shadow-xl shadow-orange-300/40 hover:shadow-2xl hover:shadow-orange-300/60
            hover:scale-105 active:scale-95
            disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
          `}
          aria-label="Install EasyToRent app on your device"
        >
          {isInstalling ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Smartphone className="w-5 h-5" />
          )}
          <span>{isInstalling ? 'Installing...' : isIOS ? 'Add to Home Screen' : 'Download App'}</span>
          {!isInstalling && (
            <span className="ml-1 text-xs font-medium opacity-80 bg-white/20 px-2 py-0.5 rounded-full">
              Free
            </span>
          )}
        </button>

        <IOSInstallModal isOpen={showIOSModal} onClose={closeIOSModal} />
      </>
    );
  }

  // 3. FLOATING: Fixed bottom-right button (default, mobile-friendly)
  return (
    <>
      <button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`
          fixed bottom-6 right-6 z-[55]
          flex items-center gap-2.5 px-5 py-3.5 rounded-full
          text-sm font-bold text-white
          bg-gradient-to-r from-orange-500 to-orange-600
          shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-300/70
          active:scale-95
          transition-all duration-500 ease-out transform
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          disabled:opacity-70 disabled:cursor-not-allowed
        `}
        style={{
          animation: isVisible && !isInstalling ? 'gentleFloat 3s ease-in-out infinite' : 'none',
        }}
        aria-label="Install EasyToRent app on your device"
      >
        {isInstalling ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        <span>{isInstalling ? 'Installing...' : isIOS ? 'Add to Home Screen' : 'Install App'}</span>
      </button>

      {/* iOS Instruction Modal */}
      <IOSInstallModal isOpen={showIOSModal} onClose={closeIOSModal} />

      {/* Floating animation keyframes (injected via style tag) */}
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   iOS INSTALL MODAL
   Safari on iOS doesn't support the beforeinstallprompt event,
   so we show users manual step-by-step instructions.
   ═══════════════════════════════════════════════════════════════════ */

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function IOSInstallModal({ isOpen, onClose }: IOSInstallModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="iOS installation instructions"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Install on iOS</h3>
                <p className="text-orange-100 text-xs">Safari only</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close instructions"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="px-6 py-6 space-y-5">
          <Step
            number={1}
            icon={<Share2 className="w-5 h-5 text-orange-600" />}
            title="Tap the Share button"
            description="Located at the bottom of Safari"
          />
          <Step
            number={2}
            icon={<PlusSquare className="w-5 h-5 text-orange-600" />}
            title="Scroll & tap 'Add to Home Screen'"
            description="You may need to scroll down to find it"
          />
          <Step
            number={3}
            icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
            title="Tap 'Add' in the top right"
            description="The app icon will appear on your home screen"
          />
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Step Component ──────────────────────── */

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Step({ number, icon, title, description }: StepProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-sm font-bold text-orange-600 border border-orange-100">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <p className="text-sm font-semibold text-gray-900">{title}</p>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

