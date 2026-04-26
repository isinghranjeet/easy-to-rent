import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

// ═══════════════════════════════════════════════════════════════════
// SERVICE WORKER REGISTRATION (PWA)
// Uses virtual:pwa-register from vite-plugin-pwa for reliable
// auto-update behavior and stale cache cleanup.
// ═══════════════════════════════════════════════════════════════════
(async () => {
  if ('serviceWorker' in navigator) {
    try {
      const { registerSW } = await import('virtual:pwa-register');
      const updateSW = registerSW({
        immediate: true,
        onRegistered(r) {
          if (r) {
            console.log('[PWA] Service Worker registered:', r.scope);
          }
        },
        onRegisterError(error) {
          console.error('[PWA] Service Worker registration failed:', error);
        },
        onNeedRefresh() {
          console.log('[PWA] New version available. Auto-updating...');
          // Force reload to ensure fresh chunks (prevents stale vendor chunk errors)
          updateSW(true);
        },
        onOfflineReady() {
          console.log('[PWA] App ready to work offline.');
        },
      });
    } catch {
      console.warn('[PWA] vite-plugin-pwa not available, skipping SW registration.');
    }
  } else {
    console.warn('[PWA] Service Workers not supported in this browser.');
  }
})();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log("Google Client ID:", googleClientId);

if (!googleClientId) {
  console.error("VITE_GOOGLE_CLIENT_ID is not set in .env file");
}

const container = document.getElementById("root")!;
const root = createRoot(container);

// Direct render - no delay
root.render(
  <React.StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
