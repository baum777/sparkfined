import { useState, useEffect } from 'react';
import { isWCOSupported, isWCOVisible, onWCOGeometryChange } from '../lib/pwa/wco';
import { useSettings } from '../hooks/useSettings';
import { logEvent } from '../lib/telemetry';

interface TitlebarProps {
  title?: string;
  className?: string;
}

/**
 * Custom Desktop Titlebar Component
 * 
 * Provides a custom titlebar when Window Controls Overlay is active.
 * Features:
 * - Drag area for window movement
 * - Custom branding and title
 * - Graceful fallback when WCO not available
 * - Responsive to geometry changes
 * - Respects user settings toggle
 */
export function Titlebar({ title = 'Sparkfined', className = '' }: TitlebarProps) {
  const [wcoActive, setWcoActive] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    // Check initial WCO state
    const checkWCO = () => {
      const supported = isWCOSupported();
      const visible = isWCOVisible();
      const enabled = settings.customTitlebarEnabled;
      setWcoActive(supported && visible && enabled);

      if (supported && visible) {
        console.log('[Titlebar] WCO is active');
        // Log telemetry event
        logEvent(visible ? 'wco_visible' : 'wco_hidden', { 
          supported,
          enabled 
        });
      }
    };

    checkWCO();

    // Listen for WCO geometry changes
    const unsubscribe = onWCOGeometryChange((geometry) => {
      console.log('[Titlebar] Geometry changed:', geometry);
      checkWCO();
    });

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: window-controls-overlay)');
    const handleDisplayModeChange = () => {
      checkWCO();
    };

    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      unsubscribe();
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [settings.customTitlebarEnabled]);

  // Don't render if WCO is not active
  if (!wcoActive) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-10 bg-bg/95 backdrop-blur-xl border-b border-cyan-500/10 ${className}`}
      style={{
        // Respect the titlebar safe area
        // @ts-expect-error - WebkitAppRegion is not in CSSProperties but needed for WCO
        WebkitAppRegion: 'drag',
      }}
    >
      <div className="h-full flex items-center px-4 gap-3">
        {/* App Icon/Logo */}
        <div
          className="flex items-center gap-2 select-none"
          style={{
            // @ts-expect-error - WebkitAppRegion is not in CSSProperties but needed for WCO
            WebkitAppRegion: 'no-drag',
          }}
        >
          <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-100 hidden sm:block">
            {title}
          </span>
        </div>

        {/* Spacer - this area is draggable */}
        <div className="flex-1" />

        {/* Custom controls could go here if needed */}
        {/* The native window controls (min, max, close) are provided by the OS */}
      </div>
    </div>
  );
}

/**
 * Titlebar Safe Area Component
 * 
 * Provides padding/margin to account for the custom titlebar
 * Use this to push content below the titlebar when WCO is active
 */
export function TitlebarSafeArea({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [wcoActive, setWcoActive] = useState(false);

  useEffect(() => {
    const checkWCO = () => {
      setWcoActive(isWCOSupported() && isWCOVisible());
    };

    checkWCO();

    const unsubscribe = onWCOGeometryChange(checkWCO);
    const mediaQuery = window.matchMedia('(display-mode: window-controls-overlay)');
    mediaQuery.addEventListener('change', checkWCO);

    return () => {
      unsubscribe();
      mediaQuery.removeEventListener('change', checkWCO);
    };
  }, []);

  return (
    <div className={`${wcoActive ? 'pt-10' : ''} ${className}`}>
      {children}
    </div>
  );
}
