import { useState, useEffect } from 'react';

export interface StatusBadgesProps {
  provider?: string;
  aiEnabled?: boolean;
  snapshotTimestamp?: number;
  className?: string;
}

/**
 * Status Badges Component
 * 
 * Displays real-time status information:
 * - Data provider badge
 * - AI analysis status
 * - Data snapshot age with color coding
 * 
 * Color Coding for Age:
 * - Green: < 5 minutes (fresh)
 * - Yellow: 5-15 minutes (acceptable)
 * - Red: > 15 minutes (stale)
 */
export function StatusBadges({ 
  provider = 'DexScreener', 
  aiEnabled = false, 
  snapshotTimestamp,
  className = '' 
}: StatusBadgesProps) {
  const [snapshotAge, setSnapshotAge] = useState<number | null>(null);
  const [ageColor, setAgeColor] = useState<'green' | 'yellow' | 'red'>('green');

  useEffect(() => {
    if (!snapshotTimestamp) return;

    const updateAge = () => {
      const now = Date.now();
      const ageMs = now - snapshotTimestamp;
      const ageMinutes = Math.floor(ageMs / 1000 / 60);
      
      setSnapshotAge(ageMinutes);

      // Color coding logic
      if (ageMinutes < 5) {
        setAgeColor('green');
      } else if (ageMinutes < 15) {
        setAgeColor('yellow');
      } else {
        setAgeColor('red');
      }
    };

    updateAge();
    const interval = setInterval(updateAge, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [snapshotTimestamp]);

  const colorClasses = {
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const formatAge = (minutes: number | null): string => {
    if (minutes === null) return 'N/A';
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Provider Badge */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
        <span>{provider}</span>
      </div>

      {/* AI Status Badge */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${
        aiEnabled 
          ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
          : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
      }`}>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span>{aiEnabled ? 'AI Active' : 'AI Inactive'}</span>
        {aiEnabled && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
        )}
      </div>

      {/* Snapshot Age Badge */}
      {snapshotTimestamp && (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${colorClasses[ageColor]}`}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatAge(snapshotAge)}</span>
        </div>
      )}
    </div>
  );
}

/**
 * AI Opt-in Banner
 * 
 * Shows when AI features are enabled for the first time
 * Provides information about AI analysis capabilities
 */
export function AIOptinBanner({ onDismiss }: { onDismiss?: () => void }) {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <div className="rounded-lg bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/20 p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-100 mb-1">
            AI Analysis Enabled
          </h3>
          <p className="text-xs text-gray-400 mb-2">
            Advanced pattern recognition and market analysis is now active. 
            AI-powered insights will be displayed alongside your charts.
          </p>
          
          <div className="flex items-center gap-2 text-xs text-purple-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>AI analysis may take a few seconds per chart</span>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1.5 text-gray-400 hover:text-gray-300 transition-colors rounded-lg hover:bg-white/5 flex-shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
