/**
 * M-PWA-3: Install Prompt Hook
 * Handles beforeinstallprompt event and app installation
 */

import { useState, useEffect } from 'react'
import { Telemetry } from '@/lib/TelemetryService'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [promptShown, setPromptShown] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) {
      setInstalled(true)
      Telemetry.log('pwa_already_installed', 1)
    }

    // Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Log telemetry
      Telemetry.log('install_prompt_available', 1, {
        timestamp: Date.now(),
      })
    }

    // Handle successful installation
    const handleAppInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
      
      // Log telemetry
      Telemetry.log('pwa_installed', 1, {
        timestamp: Date.now(),
      })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.warn('[useInstallPrompt] No deferred prompt available')
      return
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt()
      setPromptShown(true)

      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice
      
      // Log telemetry
      Telemetry.log('install_prompt_shown', 1, {
        outcome,
        timestamp: Date.now(),
      })

      if (outcome === 'accepted') {
        Telemetry.log('install_prompt_accepted', 1)
      } else {
        Telemetry.log('install_prompt_dismissed', 1)
      }

      // Clear the deferred prompt
      setDeferredPrompt(null)
    } catch (error) {
      console.error('[useInstallPrompt] Error showing install prompt:', error)
      Telemetry.logError(error as Error, { context: 'install_prompt' }, 'medium')
    }
  }

  return {
    canInstall: !!deferredPrompt && !installed,
    installed,
    promptShown,
    promptInstall,
  }
}
