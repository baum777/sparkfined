import { useState } from 'react'
import DropZone from '@/components/DropZone'
import ViewStateHandler from '@/components/ViewStateHandler'
import SaveTradeModal from '@/components/SaveTradeModal'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import AnalysisResultCard from '@/components/AnalysisResultCard'
import { ViewState } from '@/types/viewState'
import { useEventLogger } from '@/hooks/useEventLogger'
import { analyzeChartImage, analyzeByContractAddress, getDemoAnalysis } from '@/lib/analysisOrchestrator'
import type { AnalysisResult } from '@/types/analysis'

export default function AnalyzePage() {
  const [viewState, setViewState] = useState<ViewState>('empty')
  const [isSaveTradeOpen, setIsSaveTradeOpen] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [progressMessage, setProgressMessage] = useState('')
  const { log } = useEventLogger()

  const handleDropZoneReady = async ({ file, ca }: { file?: File; ca?: string }) => {
    if (file) {
      log('upload_ok', { source: 'image', size: file.size })
      
      // Show skeleton immediately
      setShowSkeleton(true)
      setViewState('loading')
      
      try {
        const result = await analyzeChartImage(file, () => {
          // Progress updates (future: display progress bar)
        })
        
        setAnalysisResult(result)
        setViewState('result')
        setShowSkeleton(false)
        
        log('analysis_complete', { 
          processingTime: result.processingTime,
          confidence: result.heuristics.confidence,
          bias: result.heuristics.bias,
        })
        
      } catch (error) {
        console.error('Analysis failed:', error)
        log('analysis_error', { error: String(error) })
        alert('Analysis failed. Please try again.')
        setViewState('empty')
        setShowSkeleton(false)
      }
    } else if (ca) {
      log('paste_ca_ok', { ca: ca.slice(0, 10) })
      
      // Show skeleton immediately
      setShowSkeleton(true)
      setViewState('loading')
      
      try {
        const result = await analyzeByContractAddress(ca, (progress) => {
          setProgressMessage(progress.message)
        })
        
        setAnalysisResult(result)
        setViewState('result')
        setShowSkeleton(false)
        
        log('analysis_complete', { source: 'ca' })
      } catch (error) {
        console.error('Analysis failed:', error)
        log('analysis_error', { error: String(error) })
        alert('Analysis failed. Please try again.')
        setViewState('empty')
        setShowSkeleton(false)
      }
    }
  }

  const handleDemoMode = async () => {
    log('demo_mode_activated')
    setShowSkeleton(true)
    setViewState('loading')
    
    try {
      const result = await getDemoAnalysis()
      setAnalysisResult(result)
      setViewState('result')
      setShowSkeleton(false)
    } catch (error) {
      console.error('Demo failed:', error)
      setViewState('empty')
      setShowSkeleton(false)
    }
  }

  const emptyContent = (
    <div className="px-4 py-12 animate-fade-in">
      <DropZone onReady={handleDropZoneReady} />
      
      {/* Demo Mode Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleDemoMode}
          className="btn-ghost text-sm"
        >
          💡 Try Demo Mode
        </button>
      </div>
    </div>
  )

  const resultContent = analysisResult ? (
    <AnalysisResultCard
      result={analysisResult}
      onSaveTrade={() => {
        setIsSaveTradeOpen(true)
        log('save_trade_clicked', { 
          token: analysisResult.token?.symbol || 'Unknown',
          price: analysisResult.token?.price || 0
        })
      }}
      onNewAnalysis={() => {
        setAnalysisResult(null)
        setViewState('empty')
        log('new_analysis_clicked')
      }}
    />
  ) : null

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
        prefillToken={analysisResult?.token?.symbol || "Unknown"}
        prefillPrice={analysisResult?.token?.price || 0}
      />
    </>
  )
}
