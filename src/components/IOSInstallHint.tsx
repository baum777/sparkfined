import { useState, useEffect } from 'react';

/**
 * iOS Install Hint Component
 * 
 * Shows installation instructions for iOS users
 * Features:
 * - Auto-detects iOS devices
 * - Shows only once (localStorage)
 * - Clear step-by-step instructions
 * - Dismissible with animation
 */
export function IOSInstallHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if we're on iOS
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    
    // Check if already running as standalone app (iOS-specific property)
    const isStandalone = 'standalone' in window.navigator && 
      (window.navigator as typeof window.navigator & { standalone?: boolean }).standalone;
    
    // Check if hint was already shown/dismissed
    const hintDismissed = localStorage.getItem('ios-install-hint-dismissed');
    
    // Show hint if:
    // 1. We're on iOS
    // 2. Not running as standalone app
    // 3. Haven't dismissed before
    if (isIOS && !isStandalone && !hintDismissed) {
      // Delay showing for better UX (don't overwhelm immediately)
      const timer = setTimeout(() => setVisible(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('ios-install-hint-dismissed', new Date().toISOString());
    
    console.log('[iOS Install Hint] Dismissed by user');
    
    // TODO: Log telemetry
    // logEvent('ios_install_hint_dismissed', {});
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleDismiss}
    >
      <div
        className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-6 py-4 border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100">Install Sparkfined</h3>
                <p className="text-xs text-gray-400">Add to your home screen</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors rounded-lg hover:bg-white/5"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-300">
            Get the full app experience with offline access and faster performance.
          </p>

          {/* Instructions */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Installation Steps:
            </p>
            
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-cyan-400">1</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-gray-200">
                    Tap the <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold mx-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 3c-.9 0-1.7.4-2.3 1H9.8c-.6-.6-1.4-1-2.3-1A3.5 3.5 0 004 6.5c0 .7.2 1.3.6 1.8L12 17l7.4-8.7c.4-.5.6-1.1.6-1.8A3.5 3.5 0 0016.5 3z"/>
                      </svg>
                    </span> Share button in Safari
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-purple-400">2</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-gray-200">
                    Scroll and tap <span className="font-semibold text-gray-100">"Add to Home Screen"</span>
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-pink-400">3</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-gray-200">
                    Tap <span className="font-semibold text-gray-100">"Add"</span> to confirm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Hint */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/5 to-purple-500/5 border border-cyan-500/10">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-400">
                The share button is at the bottom of your screen (middle button)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700/50">
          <button
            onClick={handleDismiss}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/20"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
