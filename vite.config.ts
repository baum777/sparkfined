import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      // M-PWA-2: Service Worker with App-Shell + Runtime Caching
      registerType: 'prompt', // Manual update prompt (not aggressive)
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'mask-icon.svg',
        'pwa-192x192.png',
        'pwa-512x512.png',
      ],
      // Use external manifest file
      manifestFilename: 'manifest.webmanifest',
      manifest: false, // Use public/manifest.webmanifest instead
      workbox: {
        // App-Shell precaching: HTML/JS/CSS/Fonts/Icons
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}',
          '**/*.{woff,woff2,ttf,eot}',
        ],
        globIgnores: ['**/node_modules/**', '**/tests/**'],
        
        // Navigation fallback for SPA
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/.*\.(json|txt|xml)$/],
        
        // Client control (not aggressive)
        skipWaiting: false, // Don't force update immediately
        clientsClaim: false, // Don't take control of uncontrolled pages
        
        // Runtime caching strategies
        runtimeCaching: [
          // Edge API routes (/api/*) - StaleWhileRevalidate (300s)
          {
            urlPattern: /^\/api\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-edge-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200, 201],
              },
            },
          },
          // External APIs - StaleWhileRevalidate
          {
            urlPattern: /^https:\/\/api\.(dexscreener|moralis|dexpaprika)\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'external-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 300, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // OpenAI/Grok/Anthropic AI APIs - NetworkFirst (don't cache sensitive)
          {
            urlPattern: /^https:\/\/api\.(openai|x\.ai|anthropic)\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ai-api-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60, // 1 minute only
              },
            },
          },
          // Images - CacheFirst with expiration
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 2592000, // 30 days
              },
            },
          },
          // Google Fonts - CacheFirst (long expiration)
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 31536000, // 1 year
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // Disable SW in dev for easier debugging
      },
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
