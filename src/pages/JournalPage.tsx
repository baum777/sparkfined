import { useState } from 'react'
import { BookOpenIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { ViewState } from '@/types/viewState'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'

export default function JournalPage() {
  const [viewState, setViewState] = useState<ViewState>('empty')

  const handleStateDemo = (state: ViewState) => {
    setViewState(state)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Journal</h2>
        <button
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          aria-label="Add entry"
        >
          <PlusIcon className="w-5 h-5 text-white" />
        </button>
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
            icon={<BookOpenIcon className="w-16 h-16 text-slate-600" />}
            title="No journal entries"
            description="Start documenting your trading journey and market observations"
            action={
              <button
                onClick={() => handleStateDemo('result')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create First Entry
              </button>
            }
          />
        )}

        {viewState === 'loading' && <LoadingSkeleton rows={4} />}

        {viewState === 'error' && (
          <ErrorState
            error="Failed to load journal entries"
            onRetry={() => handleStateDemo('loading')}
          />
        )}

        {viewState === 'result' && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-200">Entry #{i} - AAPL Analysis</h3>
                  <span className="text-xs text-slate-500">2h ago</span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">
                  Observed strong support at $180. RSI showing oversold conditions. Potential bounce
                  opportunity...
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded">
                    analysis
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">
                    bullish
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
