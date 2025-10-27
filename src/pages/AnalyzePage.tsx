import { useState } from 'react'
<<<<<<< HEAD
<<<<<<< HEAD
import { ChartBarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import type { ViewState } from '@/types/viewState'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
=======
import ViewStateHandler from '@/components/ViewStateHandler'
import SaveTradeModal from '@/components/SaveTradeModal'
import { ViewState } from '@/types/viewState'
<<<<<<< HEAD
>>>>>>> origin/pr/2
=======
import { useEventLogger } from '@/hooks/useEventLogger'
>>>>>>> origin/pr/3
=======
import ViewStateHandler from '@/components/ViewStateHandler'
import SaveTradeModal from '@/components/SaveTradeModal'
import { ViewState } from '@/types/viewState'
import { useEventLogger } from '@/hooks/useEventLogger'
>>>>>>> origin/pr/8

export default function AnalyzePage() {
  const [viewState, setViewState] = useState<ViewState>('empty')
  const [isSaveTradeOpen, setIsSaveTradeOpen] = useState(false)
  const { log } = useEventLogger()

<<<<<<< HEAD
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
=======
>>>>>>> origin/pr/8
  const emptyContent = (
    <div className="text-center space-y-6 px-4 py-12 animate-fade-in">
      {/* Icon: Minimalist chart symbol */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-surface border border-border-accent/20 mb-2">
        <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-display-sm font-display font-bold text-text-primary">
          Ready to Analyze
        </h2>
        <p className="text-text-secondary text-base max-w-md mx-auto leading-relaxed">
          Drop a chart. Read the tape. <span className="text-accent font-medium">Carve the candle.</span>
        </p>
      </div>
      
      <div className="flex gap-3 justify-center pt-4">
        <button
          onClick={() => {
            setViewState('loading')
            log('screenshot_dropped', { source: 'upload_button' })
          }}
          className="btn-primary"
        >
          Drop Chart
        </button>
        <button
          onClick={() => {
            setViewState('result')
            log('demo_mode_activated')
          }}
          className="btn-ghost"
        >
          Demo Mode
        </button>
      </div>
    </div>
  )

  const resultContent = (
    <div className="p-4 space-y-4 max-w-2xl mx-auto animate-slide-up">
      {/* Primary Analysis Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-display font-semibold text-text-primary">
            Chart Analysis
          </h3>
          <span className="text-xs font-mono text-text-tertiary">Demo Mode</span>
        </div>
        
        {/* Metrics Grid - Monospace precision */}
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between py-2 border-b border-border-subtle">
            <span className="text-text-secondary">Token</span>
            <span className="font-semibold text-text-primary">BTC/USD</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-subtle">
            <span className="text-text-secondary">Current Price</span>
            <span className="font-semibold text-text-primary">$42,850.00</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-subtle">
            <span className="text-text-secondary">Trend</span>
            <span className="font-semibold text-bull flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-bull glow-accent" />
              Bullish
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-subtle">
            <span className="text-text-secondary">Support</span>
            <span className="font-semibold text-cyan">$42,150.00</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-text-secondary">Resistance</span>
            <span className="font-semibold text-bear">$45,280.00</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => {
              setIsSaveTradeOpen(true)
              log('save_trade_clicked', { token: 'BTC/USD', price: 42850 })
            }}
            className="btn-primary"
          >
            Mark Entry
          </button>
          <button
            onClick={() => {
              setViewState('empty')
              log('new_analysis_clicked')
            }}
            className="btn-ghost"
          >
            New Chart
          </button>
        </div>
      </div>

      {/* Insights Card */}
      <div className="card border-accent/10">
        <h4 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
          <span className="inline-block w-1 h-4 bg-accent rounded-full glow-accent" />
          Quick Insights
        </h4>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3 text-text-secondary">
            <span className="text-accent mt-0.5">✓</span>
            <span>Strong upward momentum detected in 4H timeframe</span>
          </li>
          <li className="flex items-start gap-3 text-text-secondary">
            <span className="text-accent mt-0.5">✓</span>
            <span>Volume increasing on green candles</span>
          </li>
          <li className="flex items-start gap-3 text-text-secondary">
            <span className="text-brand mt-0.5">⚠</span>
            <span>Approaching resistance zone — consider taking profit</span>
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
<<<<<<< HEAD
>>>>>>> origin/pr/2
=======
>>>>>>> origin/pr/8
}
