import { useState } from 'react'
import { ChartBarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import type { ViewState } from '@/types/viewState'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'

export default function AnalyzePage() {
  const [viewState, setViewState] = useState<ViewState>('empty')

  // Simulate state changes for demo
  const handleStateDemo = (state: ViewState) => {
    setViewState(state)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Analyze</h2>
        <MagnifyingGlassIcon className="w-6 h-6 text-slate-400" />
      </div>

      {/* Demo Controls - Remove in production */}
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
            icon={<ChartBarIcon className="w-16 h-16 text-slate-600" />}
            title="No chart selected"
            description="Search for a symbol to start analyzing market data"
            action={
              <button
                onClick={() => handleStateDemo('loading')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Search Symbol
              </button>
            }
          />
        )}

        {viewState === 'loading' && (
          <div className="space-y-4">
            <LoadingSkeleton rows={5} />
          </div>
        )}

        {viewState === 'error' && (
          <ErrorState
            error="Failed to load chart data. Please check your connection."
            onRetry={() => handleStateDemo('loading')}
          />
        )}

        {viewState === 'result' && (
          <div className="space-y-4">
            <div className="card bg-slate-900 border border-slate-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">AAPL - Apple Inc.</h3>
              <p className="text-2xl font-bold text-green-500 mb-4">$182.45</p>

              {/* Placeholder Chart Area */}
              <div className="h-64 bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <ChartBarIcon className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Chart visualization area</p>
                  <p className="text-xs">(To be implemented in Phase 2)</p>
                </div>
              </div>
            </div>

            {/* Technical Indicators Placeholder */}
            <div className="grid grid-cols-2 gap-4">
              {['RSI', 'MACD', 'MA(20)', 'Volume'].map((indicator) => (
                <div
                  key={indicator}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-lg"
                >
                  <p className="text-xs text-slate-400 mb-1">{indicator}</p>
                  <p className="text-lg font-semibold">--</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
