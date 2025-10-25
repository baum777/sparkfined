import { useState, useEffect } from 'react'
import ReplayModal from '@/components/ReplayModal'
import { getAllEvents, initDB } from '@/lib/db'
import type { SessionEvent } from '@/lib/db'

export default function ReplayPage() {
  const [sessions, setSessions] = useState<{ sessionId: string; count: number; firstEvent: number; lastEvent: number }[]>([])
  const [isReplayOpen, setIsReplayOpen] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState('')

  useEffect(() => {
    initDB().then(loadSessions)
  }, [])

  const loadSessions = async () => {
    try {
      const events = await getAllEvents()
      
      // Group events by session
      const sessionMap = new Map<string, SessionEvent[]>()
      events.forEach((event) => {
        const existing = sessionMap.get(event.sessionId) || []
        existing.push(event)
        sessionMap.set(event.sessionId, existing)
      })

      // Convert to array with metadata
      const sessionList = Array.from(sessionMap.entries()).map(([sessionId, events]) => ({
        sessionId,
        count: events.length,
        firstEvent: Math.min(...events.map((e) => e.timestamp)),
        lastEvent: Math.max(...events.map((e) => e.timestamp)),
      }))

      // Sort by most recent first
      sessionList.sort((a, b) => b.lastEvent - a.lastEvent)
      setSessions(sessionList)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  const openReplay = (sessionId: string) => {
    setSelectedSessionId(sessionId)
    setIsReplayOpen(true)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const formatDuration = (start: number, end: number) => {
    const durationMs = end - start
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  }

  if (sessions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-4">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Session Replay</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            No recorded sessions yet. Start using the app to capture your analysis journey.
          </p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Preview Mode:</strong> Static timeline viewer showing recorded user events.
              Full scrubbing and playback coming soon!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-4 space-y-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Session Replay
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review your analysis sessions and learning moments
            </p>
          </div>
          <button
            onClick={loadSessions}
            className="px-4 py-2 text-sm rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                Static Preview Mode
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                This is a proof-of-concept timeline viewer. Full replay features (scrubbing, 
                playback controls, chart snapshots) are planned for future phases.
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <div
              key={session.sessionId}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openReplay(session.sessionId)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎬</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      Session
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {session.sessionId.slice(0, 20)}...
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  {session.count} events
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Started:</span>
                  <span className="font-medium">{formatDate(session.firstEvent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {formatDuration(session.firstEvent, session.lastEvent)}
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                Watch Replay →
              </button>
            </div>
          ))}
        </div>
      </div>

      <ReplayModal
        isOpen={isReplayOpen}
        onClose={() => setIsReplayOpen(false)}
        sessionId={selectedSessionId}
      />
    </>
  )
}
