import { useState } from 'react'
import ViewStateHandler from '@/components/ViewStateHandler'
import { ViewState } from '@/types/viewState'

export default function AnalyzePage() {
  const [viewState, setViewState] = useState<ViewState>('empty')

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
}
