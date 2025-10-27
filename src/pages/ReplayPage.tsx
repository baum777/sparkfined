<<<<<<< HEAD
<<<<<<< HEAD
import { useState } from 'react'
<<<<<<< HEAD
import { PlayIcon, CalendarIcon } from '@heroicons/react/24/outline'
import type { ViewState } from '@/types/viewState'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
=======
import ViewStateHandler from '@/components/ViewStateHandler'
import { ViewState } from '@/types/viewState'
>>>>>>> origin/pr/2
=======
=======
>>>>>>> origin/pr/8
import { useState, useEffect } from 'react'
import ReplayModal from '@/components/ReplayModal'
import { getAllEvents, initDB } from '@/lib/db'
import type { SessionEvent } from '@/lib/db'
<<<<<<< HEAD
>>>>>>> origin/pr/3
=======
>>>>>>> origin/pr/8

export default function ReplayPage() {
  const [sessions, setSessions] = useState<{ sessionId: string; count: number; firstEvent: number; lastEvent: number }[]>([])
  const [isReplayOpen, setIsReplayOpen] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState('')

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const handleStateDemo = (state: ViewState) => {
    setViewState(state)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Replay</h2>
        <CalendarIcon className="w-6 h-6 text-slate-400" />
      </div>

      {/* Demo Controls */}
      <div className="flex gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800">
        <span className="text-xs text-slate-400">Demo States:</span>
        {(['empty', 'loading', 'error', 'result'] as ViewState[]).map((state) => (
          <button
            key={state}
            onClick={() => handleStateDemo(state)}
            className={`text-xs px-2 py-1 rounded ${
              viewState === state
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      {/* View State Rendering */}
      <div className="min-h-[400px]">
        {viewState === 'empty' && (
          <EmptyState
            icon={<PlayIcon className="w-16 h-16 text-slate-600" />}
            title="No replay session"
            description="Practice your analysis skills by replaying historical market data"
            action={
              <button
                onClick={() => handleStateDemo('result')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Start Replay
              </button>
            }
          />
        )}

        {viewState === 'loading' && <LoadingSkeleton rows={4} />}

        {viewState === 'error' && (
          <ErrorState
            error="Failed to load replay data"
            onRetry={() => handleStateDemo('loading')}
          />
        )}

        {viewState === 'result' && (
          <div className="space-y-4">
            {/* Replay Session Info */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-200">TSLA - Tesla Inc.</h3>
                  <p className="text-sm text-slate-400">Replay: Jan 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-200">$245.30</p>
                  <p className="text-sm text-green-500">+2.4%</p>
                </div>
              </div>

              {/* Replay Timeline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Jan 1, 2024</span>
                  <span>15 / 30 days</span>
                  <span>Jan 30, 2024</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-blue-600 rounded-full" />
                </div>
              </div>
            </div>

            {/* Replay Controls */}
            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <PlayIcon className="w-5 h-5 mx-auto text-slate-300" />
              </button>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                Next Bar
              </button>
            </div>

            {/* Your Predictions */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <h4 className="font-medium text-slate-300 mb-3">Your Predictions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Win Rate:</span>
                  <span className="text-slate-200">--</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Predictions:</span>
                  <span className="text-slate-200">0</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
=======
  const emptyContent = (
    <div className="text-center space-y-4 px-4">
      <div className="text-6xl mb-4">⏮️</div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chart Replay</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
        Practice analysis on historical data. Load a chart to begin replaying.
      </p>
      <button onClick={() => setViewState('loading')} className="btn-primary mt-4">
        Load Historical Data
      </button>
    </div>
  )
=======
=======
>>>>>>> origin/pr/8
  useEffect(() => {
    initDB().then(loadSessions)
  }, [])
>>>>>>> origin/pr/3

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
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-surface border border-border-accent/20 mb-2">
            <svg className="w-10 h-10 text-brand" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </div>
          <div className="space-y-3">
            <h2 className="text-display-sm font-display font-bold text-text-primary">Session Replay</h2>
            <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
              No recorded sessions yet. <span className="text-brand font-medium">Watch your analysis journey.</span>
            </p>
          </div>
          <div className="mt-4 p-4 bg-brand/10 border border-brand/20 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-text-secondary">
              <strong className="text-brand">Preview Mode:</strong> Static timeline viewer.
              Full playback controls coming soon.
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
            <h2 className="text-display-sm font-display font-bold text-text-primary">
              Session Replay
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Review your analysis sessions and learning moments
            </p>
          </div>
          <button
            onClick={loadSessions}
            className="btn-ghost text-sm"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="p-4 bg-brand/10 rounded-lg border border-brand/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-brand mb-1">
                Static Preview Mode
              </h3>
              <p className="text-sm text-text-secondary">
                Proof-of-concept timeline viewer. Full replay features (scrubbing, 
                playback controls, chart snapshots) coming in future phases.
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm font-mono text-text-tertiary mb-4">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <div
              key={session.sessionId}
              className="card-interactive"
              onClick={() => openReplay(session.sessionId)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎬</span>
                  <div>
                    <h3 className="font-display font-semibold text-text-primary">
                      Session
                    </h3>
                    <div className="text-xs text-text-tertiary font-mono">
                      {session.sessionId.slice(0, 20)}...
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-mono rounded-md border bg-cyan/10 border-cyan text-cyan">
                  {session.count} events
                </span>
              </div>

              <div className="space-y-2 text-sm font-mono text-text-secondary">
                <div className="flex justify-between">
                  <span>Started</span>
                  <span className="font-medium text-text-primary">{formatDate(session.firstEvent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-medium text-text-primary">
                    {formatDuration(session.firstEvent, session.lastEvent)}
                  </span>
                </div>
              </div>

              <button className="btn-primary w-full mt-4">
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
>>>>>>> origin/pr/2
}
