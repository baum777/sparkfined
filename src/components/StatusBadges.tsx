/**
 * M-PWA-7: Status Badges Component
 * Displays provider, AI status, and data age badges
 */

import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export interface StatusBadgesProps {
  provider?: 'dexpaprika' | 'moralis' | 'dexscreener' | 'pumpfun'
  aiProvider?: 'none' | 'openai' | 'grok' | 'anthropic' | 'heuristic'
  dataTimestamp?: number
  showAge?: boolean
}

export function StatusBadges({
  provider,
  aiProvider,
  dataTimestamp,
  showAge = true,
}: StatusBadgesProps) {
  const isOnline = useOnlineStatus()

  // Calculate data age in seconds
  const dataAge = dataTimestamp ? Math.floor((Date.now() - dataTimestamp) / 1000) : 0
  const isStale = dataAge > 120 // > 2 minutes

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {/* Online/Offline Status */}
      <span
        className={`
          inline-flex items-center gap-1 px-2 py-1 rounded font-medium
          ${isOnline ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}
        `}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
        {isOnline ? 'Online' : 'Offline'}
      </span>

      {/* Data Provider Badge */}
      {provider && (
        <span className="inline-flex items-center px-2 py-1 rounded font-medium bg-blue-900/50 text-blue-300">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
            />
          </svg>
          {provider === 'dexpaprika' && 'DexPaprika'}
          {provider === 'moralis' && 'Moralis'}
          {provider === 'dexscreener' && 'Dexscreener'}
          {provider === 'pumpfun' && 'Pump.fun'}
        </span>
      )}

      {/* AI Provider Badge */}
      {aiProvider && aiProvider !== 'none' && (
        <span className="inline-flex items-center px-2 py-1 rounded font-medium bg-purple-900/50 text-purple-300">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          AI:{' '}
          {aiProvider === 'openai' && 'OpenAI'}
          {aiProvider === 'grok' && 'Grok'}
          {aiProvider === 'anthropic' && 'Claude'}
          {aiProvider === 'heuristic' && 'Off'}
        </span>
      )}

      {/* Data Age Indicator */}
      {showAge && dataTimestamp && (
        <span
          className={`
            inline-flex items-center px-2 py-1 rounded font-medium
            ${isStale ? 'bg-yellow-900/50 text-yellow-300' : 'bg-gray-800 text-gray-400'}
          `}
          title={`Last updated: ${new Date(dataTimestamp).toLocaleTimeString()}`}
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {dataAge < 60 && `${dataAge}s`}
          {dataAge >= 60 && dataAge < 3600 && `${Math.floor(dataAge / 60)}m`}
          {dataAge >= 3600 && `${Math.floor(dataAge / 3600)}h`}
          {isStale && ' ⚠️'}
        </span>
      )}
    </div>
  )
}

/**
 * AI Advisory Banner
 * Shown when AI provider is active
 */
export function AIAdvisoryBanner({ provider }: { provider?: string }) {
  if (!provider || provider === 'none' || provider === 'heuristic') {
    return null
  }

  return (
    <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-3 mb-4">
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-xs text-purple-200 font-medium mb-1">
            AI Analysis Active
          </p>
          <p className="text-xs text-purple-300/80">
            AI suggestions are advisory only and should be verified with your own analysis.
            Always use proper risk management and position sizing.
          </p>
        </div>
      </div>
    </div>
  )
}
