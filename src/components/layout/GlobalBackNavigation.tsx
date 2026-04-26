import { useLocation } from 'react-router-dom';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import { useSwipeBack } from '@/hooks/useSwipeBack';
import { BackButton } from './BackButton';

/**
 * GlobalBackNavigation
 *
 * Automatically renders a back button on every page EXCEPT the home page.
 * Uses a sticky bar for normal pages and a floating button for "deep" pages
 * (pages with dynamic IDs like /pg/:slug, /booking/:id, etc.).
 *
 * Place this component ONCE inside <BrowserRouter> and outside <Routes>.
 * It requires zero changes to any existing page or route.
 */

// Routes where back button should NEVER appear
const HIDDEN_PATHS = ['/', '/login', '/owner/login', '/owner/register'];

// Routes considered "deep" — show floating button instead of sticky bar
const DEEP_PATH_PATTERNS = [
  /^\/pg\/.+/,       // /pg/:slug
  /^\/booking\/.+/,   // /booking/:id
  /^\/location\/.+/,  // /location/:slug
  /^\/blog\/.+/,      // /blog/:slug
  /^\/admin\/.+/,     // /admin/*
  /^\/owner\/.+/,     // /owner/*
];

function isDeepPage(pathname: string): boolean {
  return DEEP_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

function shouldShowBack(pathname: string): boolean {
  return !HIDDEN_PATHS.includes(pathname);
}

export function GlobalBackNavigation() {
  const location = useLocation();

  // Track navigation history for smart back behavior
  useNavigationHistory();

  // Enable swipe-back gesture on mobile
  useSwipeBack();

  if (!shouldShowBack(location.pathname)) {
    return null;
  }

  const isDeep = isDeepPage(location.pathname);

  return (
    <>
      {/* Sticky bar for normal pages — fixed below navbar */}
      {!isDeep && <BackButton variant="sticky" />}

      {/* Floating button for deep pages */}
      {isDeep && <BackButton variant="floating" />}
    </>
  );
}

