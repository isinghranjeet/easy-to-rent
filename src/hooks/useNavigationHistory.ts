import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const STACK_KEY = 'easytorent_nav_stack_v2';
const MAX_STACK = 30;

interface NavEntry {
  path: string;
  key: string;
  timestamp: number;
}

/* ═══════════════════════════════════════════════════════════════════
   IN-MEMORY NAVIGATION STACK (singleton)
   Faster than sessionStorage reads on every render.
   ═══════════════════════════════════════════════════════════════════ */
let memoryStack: NavEntry[] | null = null;

function getStack(): NavEntry[] {
  if (memoryStack) return memoryStack;
  try {
    const raw = sessionStorage.getItem(STACK_KEY);
    memoryStack = raw ? JSON.parse(raw) : [];
  } catch {
    memoryStack = [];
  }
  return memoryStack;
}

function setStack(stack: NavEntry[]) {
  memoryStack = stack;
  try {
    sessionStorage.setItem(STACK_KEY, JSON.stringify(stack));
  } catch {
    // sessionStorage might be full or disabled
  }
}

function pushEntry(entry: NavEntry) {
  const stack = getStack();
  // Deduplicate: don't push same path twice in a row
  const last = stack[stack.length - 1];
  if (last && last.path === entry.path) return;

  stack.push(entry);
  if (stack.length > MAX_STACK) stack.shift();
  setStack(stack);
}

function popEntry() {
  const stack = getStack();
  stack.pop();
  setStack(stack);
}

/* ═══════════════════════════════════════════════════════════════════
   HOOK: useNavigationHistory
   Call this once at the app root (already done in GlobalBackNavigation).
   ═══════════════════════════════════════════════════════════════════ */
export function useNavigationHistory() {
  const location = useLocation();
  const lastKey = useRef<string>('');

  useEffect(() => {
    // Only push if location.key changed (prevents double-pushes on re-renders)
    if (location.key === lastKey.current) return;
    lastKey.current = location.key;

    pushEntry({
      path: location.pathname,
      key: location.key,
      timestamp: Date.now(),
    });
  }, [location.pathname, location.key]);

  // Sync stack when user uses browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const stack = getStack();
      // Trim stack to match current history position
      const currentPath = window.location.pathname;
      let idx = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].path === currentPath) {
          idx = i;
          break;
        }
      }
      if (idx >= 0 && idx < stack.length - 1) {
        setStack(stack.slice(0, idx + 1));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
}

/* ═══════════════════════════════════════════════════════════════════
   canGoBack
   Returns true if there's app-internal history to go back to.
   ═══════════════════════════════════════════════════════════════════ */
export function canGoBack(): boolean {
  return getStack().length > 1;
}

/* ═══════════════════════════════════════════════════════════════════
   goBackOrHome
   Smart back navigation:
   1. If we have internal history → navigate(-1)
   2. If no history → redirect to "/" (replace, so user can't go back to empty)
   ═══════════════════════════════════════════════════════════════════ */
export function goBackOrHome(navigate: ReturnType<typeof useNavigate>) {
  if (canGoBack()) {
    popEntry();
    navigate(-1);
  } else {
    navigate('/', { replace: true });
  }
}

/* ═══════════════════════════════════════════════════════════════════
   useGoBack
   Convenience hook for components that need back navigation.
   ═══════════════════════════════════════════════════════════════════ */
export function useGoBack() {
  const navigate = useNavigate();
  return useCallback(() => goBackOrHome(navigate), [navigate]);
}

/* ═══════════════════════════════════════════════════════════════════
   clearNavigationHistory
   Call on logout to prevent cross-session leakage.
   ═══════════════════════════════════════════════════════════════════ */
export function clearNavigationHistory() {
  memoryStack = [];
  try {
    sessionStorage.removeItem(STACK_KEY);
  } catch {
    // ignore
  }
}

