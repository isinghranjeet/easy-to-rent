// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';
import path from 'path';

export default defineConfig(async () => {
  const plugins: PluginOption[] = [react()];

  // ═══════════════════════════════════════════════════════════════════
  // Conditionally load vite-plugin-pwa so the dev server doesn't crash
  // if the package isn't installed yet.
  // Run: npm install vite-plugin-pwa
  // ═══════════════════════════════════════════════════════════════════
  try {
    const { VitePWA } = await import('vite-plugin-pwa');
    plugins.push(
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
        manifest: false,
        injectManifest: {
          globPatterns: [
            '**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}',
          ],
          globIgnores: ['**/node_modules/**/*'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      })
    );
  } catch {
    console.warn(
      '\n⚠️  [vite.config.ts] vite-plugin-pwa is not installed.\n' +
      '    PWA build features are disabled.\n' +
      '    Run: npm install vite-plugin-pwa\n'
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {

    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            // React ecosystem
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            // Router
            if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
              return 'router-vendor';
            }
            // UI / Charts
            if (id.includes('node_modules/recharts') || id.includes('node_modules/framer-motion')) {
              return 'ui-vendor';
            }
            // TanStack Query
            if (id.includes('node_modules/@tanstack')) {
              return 'query-vendor';
            }
            // Large utility libraries
            if (id.includes('node_modules/lodash') || id.includes('node_modules/moment')) {
              return 'utils-vendor';
            }
            // Everything else from node_modules
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (info: { name?: string }) => {
            const infoName = info.name || '';
            if (/\.(css)$/i.test(infoName)) {
              return 'assets/css/[name]-[hash][extname]';
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(infoName)) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/\.(woff2?|ttf|otf|eot)$/i.test(infoName)) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  };
});
