import { useState } from 'react'
import { PlayIcon, CalendarIcon } from '@heroicons/react/24/outline'
import type { ViewState } from '@/types/viewState'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'

export default function ReplayPage() {
  const [viewState, setViewState] = useState<ViewState>('empty')

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
}
