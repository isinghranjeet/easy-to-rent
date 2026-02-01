import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Handle SSR: default to false if window is not defined
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);

    // Set initial state
    setIsMobile(mediaQuery.matches);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
