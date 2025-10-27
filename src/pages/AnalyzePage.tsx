import { useState } from 'react'
import DropZone from '@/components/DropZone'
import ViewStateHandler from '@/components/ViewStateHandler'
import SaveTradeModal from '@/components/SaveTradeModal'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import { ViewState } from '@/types/viewState'
import { useEventLogger } from '@/hooks/useEventLogger'
import { compressImage } from '@/lib/imageUtils'

export default function AnalyzePage() {
  const [viewState, setViewState] = useState<ViewState>('empty')
  const [isSaveTradeOpen, setIsSaveTradeOpen] = useState(false)
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const { log } = useEventLogger()

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
}
