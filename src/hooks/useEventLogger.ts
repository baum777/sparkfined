// Event logging hook for tracking user actions
import { useCallback, useEffect } from 'react'
import { logEvent, getSessionId, startNewSession } from '@/lib/db'

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
      await logEvent({
        sessionId: getSessionId(),
        type,
        timestamp: Date.now(),
        data,
      })
    } catch (error) {
      console.warn('Failed to log event:', error)
    }
  }, [])

  return { log, sessionId: getSessionId(), startNewSession }
}
