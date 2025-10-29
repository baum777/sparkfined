import { useState, useEffect } from 'react';
import { logEvent } from '../lib/telemetry';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface UseInstallPromptReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  promptInstall: () => Promise<void>;
  dismissPrompt: () => void;
}

/**
 * Hook to manage PWA installation prompt (Add to Home Screen)
 * 
 * Features:
 * - Captures beforeinstallprompt event
 * - Provides install prompt trigger
 * - Tracks installation state
 * - Respects user dismissal
 * - Logs telemetry events
 */
export function useInstallPrompt(): UseInstallPromptReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // @ts-expect-error - navigator.standalone is iOS-specific
      const isIOSStandalone = window.navigator.standalone === true;
      
      if (isStandalone || isIOSStandalone) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);

      // Log telemetry: install_prompt event
      console.log('[PWA] Install prompt available');
      logEvent('install_prompt', { 
        platform: navigator.platform,
        userAgent: navigator.userAgent.substring(0, 50) // Truncated for privacy
      });
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);

      console.log('[PWA] App successfully installed');
      
      // Log telemetry: installed event
      logEvent('installed', { 
        platform: navigator.platform 
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`[PWA] User ${outcome} the install prompt`);
    
    // Log telemetry: user choice
    if (outcome === 'dismissed') {
      logEvent('install_prompt_dismissed', { outcome });
    }

    if (outcome === 'accepted') {
      setIsInstallable(false);
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
  };

  const dismissPrompt = () => {
    setIsInstallable(false);
    
    // Store dismissal in localStorage to respect user preference
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    
    console.log('[PWA] Install prompt dismissed by user');
    
    // Log telemetry: dismissed
    logEvent('install_prompt_dismissed', {});
  };

  return {
    isInstallable,
    isInstalled,
    promptInstall,
    dismissPrompt,
  };
}
