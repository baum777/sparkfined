/**
 * M-PWA-3: Install CTA Component
 * Call-to-action for installing the PWA
 */

import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { useState } from 'react'

export function InstallCTA() {
  const { canInstall, installed, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  // Don't show if already installed or user dismissed
  if (installed || dismissed || !canInstall) {
    return null
  }

  const handleInstall = async () => {
    await promptInstall()
  }

  const handleDismiss = () => {
    setDismissed(true)
    // Store dismissal in localStorage (session-based)
    sessionStorage.setItem('install-cta-dismissed', 'true')
  }

  // Check if dismissed in current session
  if (typeof window !== 'undefined' && sessionStorage.getItem('install-cta-dismissed')) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-10 h-10 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-1">
              Install Sparkfined
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Add to your home screen for quick access and offline use.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
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
