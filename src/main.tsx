import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

// Service Worker Registration - Manual Update Flow
// SW is registered via vite-plugin-pwa with registerType: 'prompt'
// Update handling is done via UpdateBanner component
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // Listen for SW messages (e.g., cache status, SKIP_WAITING)
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data) {
      switch (event.data.type) {
        case 'CACHE_UPDATED':
          console.log('📦 Cache updated:', event.data.url)
          break
        case 'SW_ACTIVATED':
          console.log('✅ Service Worker activated')
          break
      }
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
