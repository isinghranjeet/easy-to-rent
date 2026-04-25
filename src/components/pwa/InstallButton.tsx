import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface InstallButtonProps {
  variant?: 'navbar' | 'floating';
}

export function InstallButton({ variant = 'navbar' }: InstallButtonProps) {
  const { isInstalled, canShowButton, isIOS, promptInstall } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (canShowButton && !isInstalled) {
      const timer = setTimeout(() => setIsVisible(true), 200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [canShowButton, isInstalled]);

  const handleInstall = async () => {
    if (isIOS) {
      // On iOS, there's no programmatic prompt - show the banner instead
      return;
    }

    const installed = await promptInstall();
    if (installed) {
      setIsVisible(false);
    }
  };

  if (isInstalled || !canShowButton) return null;

  // Desktop Navbar Button (top-right style)
  if (variant === 'navbar') {
    return (
      <button
        onClick={handleInstall}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
          isVisible
            ? 'translate-x-0 opacity-100'
            : 'translate-x-4 opacity-0'
        } ${
          isHovered
            ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-200 scale-105'
            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg'
        }`}
        aria-label="Install EasyToRent app"
        title="Install EasyToRent app"
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </button>
    );
  }

  // Mobile Floating Button (bottom)
  return (
    <button
      onClick={handleInstall}
      className={`fixed bottom-20 right-4 z-[55] lg:hidden flex items-center gap-2 px-4 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-300/60 active:scale-95 transition-all duration-300 ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-6 opacity-0'
      }`}
      aria-label="Install EasyToRent app"
      style={{
        animation: isVisible ? 'float 3s ease-in-out infinite' : 'none',
      }}
    >
      <Download className="w-4 h-4" />
      <span>Install App</span>
    </button>
  );
}

