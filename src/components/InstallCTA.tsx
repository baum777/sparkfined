import { useState, useEffect } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

interface InstallCTAProps {
  variant?: 'banner' | 'button' | 'floating';
  className?: string;
}

/**
 * Install CTA Component - Prompts users to install the PWA
 * 
 * Features:
 * - Respects user dismissal (7 days cooldown)
 * - Multiple display variants
 * - Smooth animations
 * - Accessibility friendly
 */
export function InstallCTA({ variant = 'banner', className = '' }: InstallCTAProps) {
  const { isInstallable, isInstalled, promptInstall, dismissPrompt } = useInstallPrompt();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed the prompt
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const now = new Date();
      const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Show CTA if installable and not already installed
    if (isInstallable && !isInstalled) {
      // Delay showing for better UX (don't overwhelm immediately)
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    await promptInstall();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    dismissPrompt();
    setIsVisible(false);
  };

  if (!isVisible || isInstalled) {
    return null;
  }

  // Banner variant - Full width at top/bottom
  if (variant === 'banner') {
    return (
      <div
        className={`fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${className}`}
      >
        <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-b border-cyan-500/20 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-100">Install Sparkfined</p>
                  <p className="text-xs text-gray-400">Get the full app experience with offline access</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/20"
                >
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
                  aria-label="Dismiss install prompt"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Button variant - Inline button
  if (variant === 'button') {
    return (
      <button
        onClick={handleInstall}
        className={`px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 ${className}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Install App
      </button>
    );
  }

  // Floating variant - Bottom right floating button
  return (
    <div
      className={`fixed bottom-20 right-4 z-40 transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-lg border border-cyan-500/20 rounded-2xl shadow-xl shadow-purple-500/20 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-100 mb-1">Install Sparkfined</h3>
            <p className="text-xs text-gray-400 mb-3">Fast, offline access. No app store needed.</p>
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all"
              >
                Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-gray-400 hover:text-gray-300 text-xs transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
