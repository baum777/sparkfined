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
}
