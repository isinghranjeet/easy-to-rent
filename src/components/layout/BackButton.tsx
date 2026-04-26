import { ArrowLeft } from 'lucide-react';
import { useGoBack } from '@/hooks/useNavigationHistory';

interface BackButtonProps {
  variant?: 'sticky' | 'floating';
  className?: string;
}

/**
 * BackButton
 *
 * A minimal, elegant back navigation button.
 * - "sticky" variant: sits at the top of page content below navbar (default)
 * - "floating" variant: fixed circle button for deep pages
 */
export function BackButton({ variant = 'sticky', className = '' }: BackButtonProps) {
  const goBack = useGoBack();

  if (variant === 'floating') {
    return (
      <button
        onClick={goBack}
        className={`
          fixed bottom-6 left-6 z-50
          w-12 h-12 rounded-full
          bg-white/90 dark:bg-gray-900/90
          backdrop-blur-md
          shadow-lg shadow-black/10
          flex items-center justify-center
          text-gray-700 dark:text-gray-200
          hover:bg-white dark:hover:bg-gray-800
          active:scale-95
          transition-all duration-200
          border border-gray-200 dark:border-gray-700
          ${className}
        `}
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    );
  }

  // Sticky bar variant — positioned below navbar with pt-16 offset
  return (
    <div
      className={`
        fixed top-16 left-0 right-0 z-40
        bg-white/80 dark:bg-gray-950/80
        backdrop-blur-md
        border-b border-gray-100 dark:border-gray-800
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={goBack}
          className="
            group
            flex items-center gap-1.5
            py-2
            text-sm font-medium
            text-gray-600 dark:text-gray-400
            hover:text-orange-600 dark:hover:text-orange-400
            transition-colors duration-200
          "
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}

