import { useState } from 'react'
import ViewStateHandler from '@/components/ViewStateHandler'
import SaveTradeModal from '@/components/SaveTradeModal'
import { ViewState } from '@/types/viewState'
import { useEventLogger } from '@/hooks/useEventLogger'

export default function AnalyzePage() {
  const [viewState, setViewState] = useState<ViewState>('empty')
  const [isSaveTradeOpen, setIsSaveTradeOpen] = useState(false)
  const { log } = useEventLogger()

  const emptyContent = (
    <div className="text-center space-y-4 px-4">
      <div className="text-6xl mb-4">📊</div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ready to Analyze</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
        Upload a chart or drop market data to begin technical analysis
      </p>
      <div className="flex gap-3 justify-center pt-4">
        <button
          onClick={() => {
            setViewState('loading')
            log('screenshot_dropped', { source: 'upload_button' })
          }}
          className="btn-primary"
        >
          Upload Chart
        </button>
        <button
          onClick={() => {
            setViewState('result')
            log('demo_mode_activated')
          }}
          className="px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Demo Mode
        </button>
      </div>
    </div>
  )

  const resultContent = (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Analysis Result (Placeholder)
        </h3>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Token:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">BTC/USD</span>
          </div>
          <div className="flex justify-between">
            <span>Current Price:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">$42,850</span>
          </div>
          <div className="flex justify-between">
            <span>Trend:</span>
            <span className="font-medium text-green-600 dark:text-green-400">Bullish</span>
          </div>
          <div className="flex justify-between">
            <span>Support Level:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">$42,150</span>
          </div>
          <div className="flex justify-between">
            <span>Resistance Level:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">$45,280</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => {
              setIsSaveTradeOpen(true)
              log('save_trade_clicked', { token: 'BTC/USD', price: 42850 })
            }}
            className="btn-primary"
          >
            💾 Save Trade
          </button>
          <button
            onClick={() => {
              setViewState('empty')
              log('new_analysis_clicked')
            }}
            className="px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* Quick insights placeholder */}
      <div className="card">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Quick Insights
        </h4>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Strong upward momentum detected in 4H timeframe</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Volume increasing on green candles</span>
          </li>
          <li className="flex items-start gap-2">
            <span>⚠️</span>
            <span>Approaching resistance zone - consider taking profit</span>
          </li>
        </ul>
      </div>
    </div>
  )

  // Simulate loading → result transition
  if (viewState === 'loading') {
    setTimeout(() => setViewState('result'), 800)
  }

  return (
    <>
      <ViewStateHandler
        state={viewState}
        emptyContent={emptyContent}
        resultContent={resultContent}
      />
      <SaveTradeModal
        isOpen={isSaveTradeOpen}
        onClose={() => setIsSaveTradeOpen(false)}
        prefillToken="BTC/USD"
        prefillPrice={42850}
      />
    </>
  )
}
