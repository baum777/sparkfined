import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

// Service Worker Registration - Offline & PWA Support
// Register SW with lifecycle notifications for better UX
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })

      console.log('✅ SW registered:', registration.scope)

      // Handle SW updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
              // New SW activated - notify user or auto-reload
              console.log('🔄 SW updated - new version available')
              // Optional: Show toast notification for update
            }
          })
        }
      })
    } catch (error) {
      console.warn('SW registration failed:', error)
    }
  })

  // Listen for SW messages (e.g., cache status)
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      console.log('📦 Cache updated:', event.data.url)
    }
  })
}

// Track online/offline status
window.addEventListener('online', () => {
  console.log('🌐 Back online')
  document.body.classList.remove('offline-mode')
})

window.addEventListener('offline', () => {
  console.log('📴 Offline mode')
  document.body.classList.add('offline-mode')
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
