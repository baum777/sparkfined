// Event logging hook for tracking user actions
import { useCallback, useEffect } from 'react'
import { logEvent, getSessionId, startNewSession, incrementMetric } from '@/lib/db'

// Key metrics to track for Phase 4
const TRACKED_METRICS = [
  'drop_to_result',
  'save_trade',
  'open_replay',
  'export_share',
  'screenshot_dropped',
  'demo_mode_activated',
]

export function useEventLogger() {
  // Initialize session on mount
  useEffect(() => {
    const sessionId = getSessionId()
    logEvent({
      sessionId,
      type: 'session_start',
      timestamp: Date.now(),
      data: { userAgent: navigator.userAgent },
    })

    return () => {
      logEvent({
        sessionId,
        type: 'session_end',
        timestamp: Date.now(),
      })
    }
  }, [])

  const log = useCallback(async (type: string, data?: Record<string, unknown>) => {
    try {
      // Log detailed event
      await logEvent({
        sessionId: getSessionId(),
        type,
        timestamp: Date.now(),
        data,
      })

      // Increment metric counter if it's a tracked metric
      if (TRACKED_METRICS.includes(type)) {
        await incrementMetric(type)
      }
    } catch (error) {
      console.warn('Failed to log event:', error)
    }
  }, [])

  return { log, sessionId: getSessionId(), startNewSession }
}
