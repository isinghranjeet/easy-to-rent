# TODO: Fix Vite + React PWA createContext Error

## Root Cause
- `manualChunks` in `vite.config.ts` uses loose `includes('node_modules/react')` which incorrectly matches `react-router-dom`, `react-helmet`, etc.
- PWA Service Worker caches vendor chunks; stale cached chunks reference old hashes after rebuild, causing `React` to be undefined when `vendor` chunk executes.
- Double SW registration: `main.tsx` manually registers `/sw.js` while `vite-plugin-pwa` also manages registration.

## Steps
- [x] 1. Analyze `npm ls react` — confirmed no duplicate React versions
- [x] 2. Read `vite.config.ts`, `sw.ts`, `main.tsx`, `package.json`
- [x] 3. Fix `vite.config.ts` — precise manualChunks regex, add dedupe + optimizeDeps
- [x] 4. Fix `sw.ts` — add `skipWaiting`, aggressive old cache cleanup
- [x] 5. Fix `main.tsx` — replace manual SW registration with `virtual:pwa-register`
- [x] 6. Extract inline styles from `index.html` to `public/boot-screen.css` (fixes `vite-plugin-pwa` build error)
- [x] 7. Run cache-clearing commands
- [x] 8. Build and verify — SUCCESS

