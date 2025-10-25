import { useEffect, useState } from 'react'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showOfflineToast, setShowOfflineToast] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineToast(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineToast(true)
      // Auto-hide toast after 3 seconds
      setTimeout(() => setShowOfflineToast(false), 3000)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Persistent offline badge (always visible when offline)
  if (!isOnline) {
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full bg-amber-500 dark:bg-amber-600 text-white text-xs font-medium shadow-lg flex items-center gap-1.5">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        Offline Mode
      </div>
    )
  }

  // Transient toast when going offline
  if (showOfflineToast) {
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-slate-800 dark:bg-slate-700 text-white text-sm shadow-xl animate-fade-in">
        📴 You're offline - cached data will be used
      </div>
    )
  }

  return null
}
