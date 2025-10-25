import { useState } from 'react'
import ViewStateHandler from '@/components/ViewStateHandler'
import { ViewState } from '@/types/viewState'

export default function ReplayPage() {
  const [viewState, setViewState] = useState<ViewState>('empty')

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

  const resultContent = (
    <div className="p-4 space-y-4">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            BTC/USD - Jan 2024
          </h3>
          <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
            Replay Mode
          </span>
        </div>

        {/* Placeholder chart area */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg h-64 flex items-center justify-center mb-4">
          <span className="text-slate-400">📈 Chart visualization area</span>
        </div>

        {/* Replay controls */}
        <div className="space-y-3">
          <div className="flex gap-2 justify-center">
            <button className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600">
              ⏮️ Reset
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
              ▶️ Play
            </button>
            <button className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600">
              ⏭️ Forward
            </button>
          </div>

          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            Candle: <span className="font-medium">15 / 240</span>
          </div>
        </div>

        <button
          onClick={() => setViewState('empty')}
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mt-4"
        >
          ← Exit Replay
        </button>
      </div>
    </div>
  )

  // Simulate loading → result transition
  if (viewState === 'loading') {
    setTimeout(() => setViewState('result'), 1000)
  }

  return (
    <ViewStateHandler state={viewState} emptyContent={emptyContent} resultContent={resultContent} />
  )
}
