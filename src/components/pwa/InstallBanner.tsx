import { useState, useEffect, useCallback } from 'react';
import { X, Download, Smartphone, Share2, ChevronUp } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function InstallBanner() {
  const { isInstalled, canShowBanner, isIOS, promptInstall, dismissBanner } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    if (canShowBanner && !isInstalled) {
      // Small delay for smooth enter animation
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setShowIOSHint(false);
    }
  }, [canShowBanner, isInstalled]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      dismissBanner();
    }, 300);
  }, [dismissBanner]);

  const handleInstall = useCallback(async () => {
    if (isIOS) {
      setShowIOSHint(true);
      return;
    }

    const installed = await promptInstall();
    if (installed) {
      setIsVisible(false);
    }
  }, [isIOS, promptInstall]);

  if (isInstalled || !canShowBanner) return null;

  return (
    <>
      {/* Mobile Bottom Sticky Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[60] lg:hidden transition-all duration-500 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            {/* App Icon */}
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <Smartphone className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                EasyToRent
              </p>
              <p className="text-xs text-gray-500 truncate">
                Install app for faster experience
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleInstall}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all duration-200 whitespace-nowrap"
                aria-label="Install app"
              >
                Install
              </button>

              <button
                onClick={handleDismiss}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Dismiss install banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Bottom-Right Card */}
      <div
        className={`fixed bottom-6 right-6 z-[60] hidden lg:block transition-all duration-500 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-80">
          <div className="flex items-start gap-3">
            {/* App Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <Download className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-gray-900">EasyToRent</p>
                <button
                  onClick={handleDismiss}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors -mt-1 -mr-1"
                  aria-label="Dismiss install banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Install our app for a faster, smoother experience with offline access.
              </p>

              <button
                onClick={handleInstall}
                className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] transition-all duration-200"
                aria-label="Install app"
              >
                Install App
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Install Hint Tooltip */}
      {showIOSHint && isIOS && (
        <div
          className={`fixed inset-0 z-[70] flex items-end justify-center lg:items-center lg:justify-end lg:pr-8 lg:pb-8 transition-opacity duration-300 ${
            showIOSHint ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setShowIOSHint(false)}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Mobile iOS Hint */}
          <div className="relative lg:hidden w-full px-4 pb-8">
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Install on iOS</h3>
                <button
                  onClick={() => setShowIOSHint(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Step 1</p>
                    <p className="text-xs text-gray-600">Tap the <span className="font-bold text-orange-600">Share</span> button in Safari</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <ChevronUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Step 2</p>
                    <p className="text-xs text-gray-600">Scroll down and tap <span className="font-bold text-orange-600">Add to Home Screen</span></p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSHint(false)}
                className="w-full mt-5 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
              >
                Got it
              </button>
            </div>
          </div>

          {/* Desktop iOS Hint (rare but handled) */}
          <div className="hidden lg:block relative">
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 w-80 animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Install on iOS</h3>
                <button
                  onClick={() => setShowIOSHint(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                  <Share2 className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Tap <strong>Share</strong> in Safari
                  </p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                  <ChevronUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Select <strong>Add to Home Screen</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSHint(false)}
                className="w-full mt-4 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

