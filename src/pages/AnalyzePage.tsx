import { useState } from 'react'
<<<<<<< HEAD
import { ChartBarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import type { ViewState } from '@/types/viewState'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
=======
import ViewStateHandler from '@/components/ViewStateHandler'
import { ViewState } from '@/types/viewState'
>>>>>>> origin/pr/2

export default function AnalyzePage() {
  const [viewState, setViewState] = useState<ViewState>('empty')

<<<<<<< HEAD
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
=======
  const emptyContent = (
    <div className="text-center space-y-4 px-4">
      <div className="text-6xl mb-4">📊</div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ready to Analyze</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
        Upload a chart or drop market data to begin technical analysis
      </p>
      <div className="flex gap-3 justify-center pt-4">
        <button onClick={() => setViewState('loading')} className="btn-primary">
          Upload Chart
        </button>
        <button
          onClick={() => setViewState('result')}
          className="px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Demo Mode
        </button>
      </div>
    </div>
  )

  const resultContent = (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Analysis Result (Placeholder)
        </h3>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Trend:</span>
            <span className="font-medium text-green-600 dark:text-green-400">Bullish</span>
          </div>
          <div className="flex justify-between">
            <span>Support Level:</span>
            <span className="font-medium">$42,150</span>
          </div>
          <div className="flex justify-between">
            <span>Resistance Level:</span>
            <span className="font-medium">$45,280</span>
          </div>
        </div>
        <button onClick={() => setViewState('empty')} className="btn-primary w-full mt-4">
          New Analysis
        </button>
      </div>
    </div>
  )

  // Simulate loading → result transition
  if (viewState === 'loading') {
    setTimeout(() => setViewState('result'), 800)
  }

  return (
    <ViewStateHandler state={viewState} emptyContent={emptyContent} resultContent={resultContent} />
  )
>>>>>>> origin/pr/2
}
