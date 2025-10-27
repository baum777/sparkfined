import { useState } from 'react'
<<<<<<< HEAD
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
=======
import DropZone from '@/components/DropZone'
>>>>>>> origin/pr/10
import ViewStateHandler from '@/components/ViewStateHandler'
import SaveTradeModal from '@/components/SaveTradeModal'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import { ViewState } from '@/types/viewState'
import { useEventLogger } from '@/hooks/useEventLogger'
<<<<<<< HEAD
>>>>>>> origin/pr/8
=======
import { compressImage } from '@/lib/imageUtils'
>>>>>>> origin/pr/10

export default function AnalyzePage() {
  const [viewState, setViewState] = useState<ViewState>('empty')
  const [isSaveTradeOpen, setIsSaveTradeOpen] = useState(false)
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const { log } = useEventLogger()

<<<<<<< HEAD
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
=======
  const handleDropZoneReady = async ({ file, ca }: { file?: File; ca?: string }) => {
    if (file) {
      log('upload_ok', { source: 'image', size: file.size })
      
      // Show skeleton immediately
      setShowSkeleton(true)
      setViewState('loading')
      
      try {
        // Compress image (target 1MB)
        const compressed = await compressImage(file, 1, 0.85)
        // Image stored for future use (analysis API integration)
        
        log('image_processed', { 
          originalSize: file.size, 
          compressedSize: compressed.size,
          compressionRatio: (compressed.size / file.size).toFixed(2)
        })
        
        // Simulate analysis delay (replace with actual analysis)
        setTimeout(() => {
          setViewState('result')
          setShowSkeleton(false)
        }, 600)
        
      } catch (error) {
        console.error('Image processing failed:', error)
        log('image_processing_error', { error: String(error) })
        alert('Failed to process image. Please try again.')
        setViewState('empty')
        setShowSkeleton(false)
      }
    } else if (ca) {
      log('paste_ca_ok', { ca: ca.slice(0, 10) })
      setContractAddress(ca)
      
      // Show skeleton immediately
      setShowSkeleton(true)
      setViewState('loading')
      
      // Simulate CA lookup (replace with actual Dexscreener API call)
      setTimeout(() => {
        setViewState('result')
        setShowSkeleton(false)
        log('analysis_done', { source: 'ca' })
      }, 500)
    }
  }

>>>>>>> origin/pr/10
  const emptyContent = (
    <div className="px-4 py-12 animate-fade-in">
      <DropZone onReady={handleDropZoneReady} />
      
      {/* Demo Mode Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => {
            setViewState('result')
            log('demo_mode_activated')
          }}
          className="btn-ghost text-sm"
        >
          💡 Try Demo Mode
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

  // Show skeleton during loading
  const loadingContent = showSkeleton ? <LoadingSkeleton type="analysis" /> : null

  return (
    <>
      {viewState === 'loading' && loadingContent ? (
        loadingContent
      ) : (
        <ViewStateHandler
          state={viewState}
          emptyContent={emptyContent}
          resultContent={resultContent}
        />
      )}
      <SaveTradeModal
        isOpen={isSaveTradeOpen}
        onClose={() => setIsSaveTradeOpen(false)}
        prefillToken={contractAddress ? `CA: ${contractAddress.slice(0, 8)}...` : "BTC/USD"}
        prefillPrice={42850}
      />
    </>
  )
<<<<<<< HEAD
>>>>>>> origin/pr/2
=======
>>>>>>> origin/pr/8
}
