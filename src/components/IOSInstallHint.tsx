/**
 * M-PWA-6: iOS A2HS Install Hint
 * Shows iOS-specific install instructions
 */

import { useState, useEffect } from 'react'

export function IOSInstallHint() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
    
    // Check if already in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    
    // Check if hint was already dismissed
    const dismissed = localStorage.getItem('ios-install-hint-dismissed')
    
    // Show hint if: iOS + not installed + not dismissed
    if (isIOS && !isStandalone && !dismissed) {
      // Delay showing to not overwhelm on first load
      setTimeout(() => setShow(true), 3000)
    }
  }, [])

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('ios-install-hint-dismissed', 'true')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 md:max-w-md md:left-auto md:right-4 z-50">
      <div className="bg-blue-900/95 border border-blue-700 rounded-lg shadow-xl p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-8 h-8 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-2">
              Add to Home Screen
            </h3>
            
            <div className="text-xs text-blue-100 space-y-2">
              <p>Install Sparkfined for quick access:</p>
              <ol className="list-decimal list-inside space-y-1 ml-1">
                <li>
                  Tap the{' '}
                  <span className="inline-flex items-center mx-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/>
                    </svg>
                  </span>
                  Share button
                </li>
                <li>Scroll and tap "Add to Home Screen"</li>
                <li>Tap "Add" to install</li>
              </ol>
            </div>
            
            <button
              onClick={handleDismiss}
              className="mt-3 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors"
            >
              Got it
            </button>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-blue-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
