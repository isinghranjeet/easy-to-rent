// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';
import path from 'path';

export default defineConfig(async () => {
  const plugins: PluginOption[] = [react()];

  // Conditionally load vite-plugin-pwa
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
          globIgnores: ['**/node_modules/**/*', '**/dev-dist/**/*'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      })
    );
  } catch {
    console.warn('\n⚠️ vite-plugin-pwa not installed. PWA disabled.\n');
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            // React core - prevents circular deps
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler|loose-envify|react-router|react-router-dom|@remix-run)[\\/]/.test(id)) {
              return 'react-core';
            }
            // UI / Charts / Animation libraries
            if (/[\\/]node_modules[\\/](recharts|framer-motion|lucide-react|@radix-ui|clsx|class-variance-authority)[\\/]/.test(id)) {
              return 'ui-vendor';
            }
            // TanStack Query
            if (/[\\/]node_modules[\\/](@tanstack)[\\/]/.test(id)) {
              return 'query-vendor';
            }
            // Map libraries (lazy loaded)
            if (/[\\/]node_modules[\\/](leaflet|react-leaflet)[\\/]/.test(id)) {
              return 'map-vendor';
            }
            // Utility libraries
            if (/[\\/]node_modules[\\/](lodash|moment|dayjs)[\\/]/.test(id)) {
              return 'utils-vendor';
            }
            // Everything else from node_modules
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            // Split components by route
            if (id.includes('/pages/')) {
              return 'pages';
            }
            if (id.includes('/admin/')) {
              return 'admin';
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
      chunkSizeWarningLimit: 500,
      target: 'esnext',
      treeShaking: true,
    },
    deps: {
      inline: [/^lodash$/, /^clsx$/, /^dayjs$/],
    },
  };
});
