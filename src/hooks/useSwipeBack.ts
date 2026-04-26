import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { goBackOrHome } from './useNavigationHistory';

/**
 * useSwipeBack
 *
 * Enables iOS-style swipe-back gesture on mobile.
 * Swipe from the left edge of the screen to go back.
 *
 * Usage: Call this hook once at the app level (e.g., in App.tsx)
 */
export function useSwipeBack() {
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    const EDGE_THRESHOLD = 30; // px from left edge
    const SWIPE_THRESHOLD = 80; // px horizontal distance to trigger back
    const VERTICAL_TOLERANCE = 50; // px vertical drift allowed

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      // Only track if starting near left edge
      if (touch.clientX <= EDGE_THRESHOLD) {
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = Math.abs(touch.clientY - touchStartY.current);

      // Check if horizontal swipe is long enough and vertical drift is small
      if (deltaX > SWIPE_THRESHOLD && deltaY < VERTICAL_TOLERANCE) {
        goBackOrHome(navigate);
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    const handleTouchCancel = () => {
      touchStartX.current = null;
      touchStartY.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [navigate]);
}

