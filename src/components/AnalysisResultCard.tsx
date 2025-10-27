/**
 * Analysis Result Card Component - Step 7: Presentation Module
 * 
 * Displays heuristic analysis with collapsible advanced details
 * Includes: Price, S/R, Bias, Entry/Exit zones, Insights
 */

import { useState } from 'react'
import type { AnalysisResult } from '@/types/analysis'
import { formatPrice, formatLargeNumber } from '@/lib/marketData'
import { generateTeaserInsights } from '@/lib/teaserAnalysis'
import { exportAnalysisAsPNG, copyAnalysisToClipboard } from '@/lib/exportUtils'

interface AnalysisResultCardProps {
  result: AnalysisResult
  onSaveTrade: () => void
  onNewAnalysis: () => void
}

export default function AnalysisResultCard({
  result,
  onSaveTrade,
  onNewAnalysis,
}: AnalysisResultCardProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  
  const { heuristics, token } = result
  const insights = generateTeaserInsights(heuristics, token || {} as any)
  
  const handleExportPNG = async () => {
    setIsExporting(true)
    try {
      await exportAnalysisAsPNG(result, true)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export PNG')
    } finally {
      setIsExporting(false)
    }
  }
  
  const handleCopyToClipboard = async () => {
    const success = await copyAnalysisToClipboard(result)
    if (success) {
      alert('✓ Analysis copied to clipboard')
    } else {
      alert('Failed to copy to clipboard')
    }
  }
  
  const formatPriceDisplay = (value: number | undefined) => {
    if (!value) return '--'
    return `$${formatPrice(value)}`
  }
  
  const getBiasColor = (bias: string) => {
    if (bias === 'Bullish') return 'text-bull'
    if (bias === 'Bearish') return 'text-bear'
    return 'text-text-secondary'
  }
  
  const getBiasIcon = (bias: string) => {
    if (bias === 'Bullish') return '↗'
    if (bias === 'Bearish') return '↘'
    return '→'
  }

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto animate-slide-up">
      {/* Primary Analysis Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-display font-semibold text-text-primary">
            Chart Analysis
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-tertiary">
              {heuristics.source === 'heuristic' ? 'Beta' : 'AI'}
            </span>
            <span className={`text-xs font-mono px-2 py-1 rounded-md border ${
              heuristics.confidence > 0.7
                ? 'bg-accent/10 border-accent text-accent'
                : 'bg-text-tertiary/10 border-text-tertiary text-text-tertiary'
            }`}>
              {(heuristics.confidence * 100).toFixed(0)}% conf.
            </span>
          </div>
        </div>
        
        {/* Metrics Grid - Monospace precision */}
        <div className="space-y-3 font-mono text-sm">
          {token && (
            <>
              <div className="flex justify-between py-2 border-b border-border-subtle">
                <span className="text-text-secondary">Token</span>
                <span className="font-semibold text-text-primary">{token.symbol}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border-subtle">
                <span className="text-text-secondary">Price</span>
                <span className="font-semibold text-text-primary">
                  {formatPriceDisplay(token.price)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border-subtle">
                <span className="text-text-secondary">24h Change</span>
                <span className={`font-semibold ${
                  token.priceChange24h && token.priceChange24h > 0 ? 'text-bull' : 'text-bear'
                }`}>
                  {token.priceChange24h ? `${token.priceChange24h > 0 ? '+' : ''}${token.priceChange24h.toFixed(2)}%` : '--'}
                </span>
              </div>
            </>
          )}
          
          <div className="flex justify-between py-2 border-b border-border-subtle">
            <span className="text-text-secondary">Bias</span>
            <span className={`font-semibold ${getBiasColor(heuristics.bias)} flex items-center gap-1`}>
              <span className="inline-block w-2 h-2 rounded-full bg-current glow-accent" />
              {getBiasIcon(heuristics.bias)} {heuristics.bias}
            </span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-border-subtle">
            <span className="text-text-secondary">Support</span>
            <span className="font-semibold text-cyan">
              {formatPriceDisplay(heuristics.supportLevel)}
            </span>
          </div>
          
          <div className="flex justify-between py-2">
            <span className="text-text-secondary">Resistance</span>
            <span className="font-semibold text-bear">
              {formatPriceDisplay(heuristics.resistanceLevel)}
            </span>
          </div>
          
          <div className="flex justify-between py-2 border-t border-border-subtle pt-3">
            <span className="text-text-secondary">Volatility 24h</span>
            <span className="font-semibold text-text-primary">
              {heuristics.volatility24h.toFixed(2)}%
            </span>
          </div>
          
          <div className="flex justify-between py-2">
            <span className="text-text-secondary">Range Size</span>
            <span className="font-semibold text-text-primary">
              {heuristics.rangeSize}
            </span>
          </div>
        </div>

        {/* Collapsible Advanced Details */}
        <div className="mt-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-md border border-border-accent/30 hover:border-border-accent/50 bg-surface-hover/30 transition-colors duration-180"
          >
            <span className="text-sm font-medium text-text-primary">
              Advanced Details
            </span>
            <span className={`text-text-secondary transform transition-transform duration-200 ${
              showAdvanced ? 'rotate-180' : ''
            }`}>
              ▼
            </span>
          </button>
          
          {showAdvanced && (
            <div className="mt-4 p-4 rounded-md border border-border-subtle bg-bg-card space-y-3 font-mono text-sm animate-slide-up">
              {/* Entry/Exit Zones */}
              {heuristics.entryZone && (
                <div>
                  <div className="text-xs text-text-tertiary mb-1">Entry Zone</div>
                  <div className="text-text-primary">
                    {formatPriceDisplay(heuristics.entryZone.min)} - {formatPriceDisplay(heuristics.entryZone.max)}
                  </div>
                </div>
              )}
              
              {heuristics.reentryLevel && (
                <div>
                  <div className="text-xs text-text-tertiary mb-1">Re-entry (DCA)</div>
                  <div className="text-cyan">{formatPriceDisplay(heuristics.reentryLevel)}</div>
                </div>
              )}
              
              {heuristics.stopLoss && (
                <div>
                  <div className="text-xs text-text-tertiary mb-1">Stop Loss</div>
                  <div className="text-bear">{formatPriceDisplay(heuristics.stopLoss)}</div>
                </div>
              )}
              
              {heuristics.takeProfit1 && (
                <div>
                  <div className="text-xs text-text-tertiary mb-1">Take Profit 1</div>
                  <div className="text-bull">{formatPriceDisplay(heuristics.takeProfit1)}</div>
                </div>
              )}
              
              {heuristics.takeProfit2 && (
                <div>
                  <div className="text-xs text-text-tertiary mb-1">Take Profit 2</div>
                  <div className="text-bull">{formatPriceDisplay(heuristics.takeProfit2)}</div>
                </div>
              )}
              
              {/* Key Levels */}
              {heuristics.keyLevels.length > 0 && (
                <div className="pt-3 border-t border-border-subtle">
                  <div className="text-xs text-text-tertiary mb-2">Fibonacci Levels</div>
                  <div className="flex flex-wrap gap-2">
                    {heuristics.keyLevels.map((level, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-accent/10 text-accent text-xs">
                        {formatPriceDisplay(level)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Market Data */}
              {token && (
                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Volume 24h</span>
                    <span className="text-text-primary">${formatLargeNumber(token.volume24h || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Liquidity</span>
                    <span className="text-text-primary">${formatLargeNumber(token.liquidity || 0)}</span>
                  </div>
                  {token.marketCap && (
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Market Cap</span>
                      <span className="text-text-primary">${formatLargeNumber(token.marketCap)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onSaveTrade}
            className="btn-primary"
          >
            Mark Entry
          </button>
          <button
            onClick={onNewAnalysis}
            className="btn-ghost"
          >
            New Chart
          </button>
        </div>
        
        {/* Export Options */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className="btn-ghost text-xs flex-1"
          >
            {isExporting ? '⏳ Exporting...' : '📸 Export PNG'}
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="btn-ghost text-xs flex-1"
          >
            📋 Copy
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
          {insights.map((insight, index) => {
            const icon = insight.type === 'bullish' ? '✓' : insight.type === 'bearish' ? '↓' : insight.type === 'warning' ? '⚠' : '•'
            const color = insight.type === 'bullish' ? 'text-accent' : insight.type === 'warning' ? 'text-brand' : 'text-text-secondary'
            
            return (
              <li key={index} className="flex items-start gap-3 text-text-secondary">
                <span className={`${color} mt-0.5`}>{icon}</span>
                <span>{insight.text}</span>
              </li>
            )
          })}
        </ul>
        
        {/* Beta Notice */}
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <p className="text-xs text-text-tertiary italic">
            Beta Preview: Heuristic-based analysis. Full AI insights coming in Alpha.
          </p>
        </div>
      </div>
    </div>
  )
}
