/**
 * Teaser Analysis - Step 5: KI-Preview Mock
 * 
 * Generates AI-powered insights preview for Beta users
 * Uses heuristic analysis + template-based commentary
 * 
 * Status: Beta Mock (Template-based)
 * Future: Real OpenAI/Grok integration in Alpha
 */

import type { HeuristicAnalysis, AnalysisResult } from '@/types/analysis'
import type { MarketData } from './marketData'
import type { OCRResult } from './ocr'

export interface TeaserInsight {
  type: 'bullish' | 'bearish' | 'neutral' | 'warning'
  text: string
  confidence: number
}

/**
 * Generate teaser AI insights (Mock for Beta)
 */
export function generateTeaserInsights(
  heuristics: HeuristicAnalysis,
  marketData: MarketData,
  ocrLabels?: OCRResult
): TeaserInsight[] {
  const insights: TeaserInsight[] = []
  
  // 1. Trend/Bias insight
  insights.push(generateBiasInsight(heuristics, marketData))
  
  // 2. Volume/Momentum insight
  insights.push(generateVolumeInsight(marketData, heuristics))
  
  // 3. Key level insight
  insights.push(generateKeyLevelInsight(heuristics, marketData))
  
  // 4. Risk/Warning insight (if applicable)
  const warningInsight = generateWarningInsight(heuristics, marketData, ocrLabels)
  if (warningInsight) {
    insights.push(warningInsight)
  }
  
  // 5. Setup suggestion
  insights.push(generateSetupInsight(heuristics, marketData))
  
  return insights.filter(Boolean).slice(0, 4) // Max 4 insights
}

/**
 * Generate complete analysis result
 */
export function generateAnalysisResult(
  heuristics: HeuristicAnalysis,
  marketData: MarketData,
  ocrLabels?: OCRResult,
  imageDataUrl?: string
): AnalysisResult {
  const startTime = Date.now()
  
  const insights = generateTeaserInsights(heuristics, marketData, ocrLabels)
  const aiCommentary = generateAICommentary(insights, heuristics, marketData)
  
  const processingTime = Date.now() - startTime
  
  return {
    heuristics,
    token: {
      symbol: marketData.symbol,
      name: marketData.name,
      address: marketData.address,
      chain: marketData.chain,
      price: marketData.price,
      priceChange24h: marketData.priceChange24h,
      volume24h: marketData.volume24h,
      liquidity: marketData.liquidity,
      marketCap: marketData.marketCap,
    },
    analyzedAt: Date.now(),
    processingTime,
    imageDataUrl,
    aiCommentary,
    aiProvider: 'none', // Beta: Template-based
  }
}

/**
 * Generate bias/trend insight
 */
function generateBiasInsight(
  heuristics: HeuristicAnalysis,
  marketData: MarketData
): TeaserInsight {
  const { bias, volatility24h } = heuristics
  const { priceChange24h } = marketData
  
  const templates = {
    Bullish: [
      `Strong upward momentum detected in ${getTimeframeName('4h')} timeframe`,
      `Price showing bullish structure with ${priceChange24h.toFixed(1)}% gain`,
      `Buyers stepping in at support — continuation likely`,
      `Accumulation pattern forming near key support`,
    ],
    Bearish: [
      `Bearish pressure building with ${Math.abs(priceChange24h).toFixed(1)}% decline`,
      `Sellers dominating, testing support levels`,
      `Downward momentum accelerating in current session`,
      `Distribution pattern visible — caution advised`,
    ],
    Neutral: [
      `Consolidation phase — awaiting directional break`,
      `Price action contained within tight range`,
      `Neutral momentum — waiting for catalyst`,
      `Sideways accumulation — patience required`,
    ],
  }
  
  const template = templates[bias][Math.floor(Math.random() * templates[bias].length)]
  
  return {
    type: bias.toLowerCase() as 'bullish' | 'bearish' | 'neutral',
    text: template,
    confidence: volatility24h > 5 ? 0.8 : 0.6,
  }
}

/**
 * Generate volume/momentum insight
 */
function generateVolumeInsight(
  marketData: MarketData,
  heuristics: HeuristicAnalysis
): TeaserInsight {
  const volumeRatio = marketData.volume24h / marketData.liquidity
  const { bias } = heuristics
  
  if (volumeRatio > 2) {
    return {
      type: bias === 'Bullish' ? 'bullish' : 'bearish',
      text: bias === 'Bullish'
        ? 'Volume increasing on green candles — strong conviction'
        : 'Heavy selling volume — distribution in progress',
      confidence: 0.85,
    }
  } else if (volumeRatio < 0.5) {
    return {
      type: 'neutral',
      text: 'Low volume environment — wait for confirmation',
      confidence: 0.6,
    }
  } else {
    return {
      type: 'neutral',
      text: 'Moderate volume — healthy price discovery ongoing',
      confidence: 0.7,
    }
  }
}

/**
 * Generate key level insight
 */
function generateKeyLevelInsight(
  heuristics: HeuristicAnalysis,
  marketData: MarketData
): TeaserInsight {
  const { resistanceLevel, supportLevel, bias } = heuristics
  const { price } = marketData
  
  // Distance to resistance
  const distToResistance = ((resistanceLevel - price) / price) * 100
  const distToSupport = ((price - supportLevel) / price) * 100
  
  if (Math.abs(distToResistance) < 3) {
    return {
      type: 'warning',
      text: 'Approaching resistance zone — consider taking profit',
      confidence: 0.8,
    }
  } else if (Math.abs(distToSupport) < 3) {
    return {
      type: bias === 'Bullish' ? 'bullish' : 'neutral',
      text: bias === 'Bullish'
        ? 'Testing support — potential bounce zone'
        : 'Support breakdown risk — watch closely',
      confidence: 0.75,
    }
  } else {
    return {
      type: 'neutral',
      text: `Trading mid-range between $${supportLevel.toFixed(4)} and $${resistanceLevel.toFixed(4)}`,
      confidence: 0.7,
    }
  }
}

/**
 * Generate warning insight (if needed)
 */
function generateWarningInsight(
  heuristics: HeuristicAnalysis,
  marketData: MarketData,
  _ocrLabels?: OCRResult
): TeaserInsight | null {
  // Low liquidity warning
  if (marketData.liquidity < 20000) {
    return {
      type: 'warning',
      text: '⚠ Low liquidity — high slippage risk on entries/exits',
      confidence: 0.9,
    }
  }
  
  // Extreme volatility warning
  if (heuristics.volatility24h > 30) {
    return {
      type: 'warning',
      text: '⚠ Extreme volatility detected — use tighter stops',
      confidence: 0.85,
    }
  }
  
  // RSI warnings
  if (heuristics.rsiOverbought) {
    return {
      type: 'warning',
      text: 'RSI overbought (>70) — potential reversal zone',
      confidence: 0.75,
    }
  }
  
  if (heuristics.rsiOversold) {
    return {
      type: 'bullish',
      text: 'RSI oversold (<30) — bounce opportunity',
      confidence: 0.75,
    }
  }
  
  return null
}

/**
 * Generate trading setup insight
 */
function generateSetupInsight(
  heuristics: HeuristicAnalysis,
  _marketData: MarketData
): TeaserInsight {
  const { bias, entryZone, stopLoss, takeProfit1 } = heuristics
  
  if (!entryZone || !stopLoss || !takeProfit1) {
    return {
      type: 'neutral',
      text: 'Wait for clearer setup before entering',
      confidence: 0.5,
    }
  }
  
  const riskReward = (takeProfit1 - entryZone.max) / (entryZone.max - stopLoss)
  
  if (bias === 'Bullish' && riskReward > 2) {
    return {
      type: 'bullish',
      text: `Favorable R:R setup (${riskReward.toFixed(1)}:1) — patience on entry`,
      confidence: 0.8,
    }
  } else if (bias === 'Bearish') {
    return {
      type: 'bearish',
      text: 'Bearish setup forming — wait for breakdown confirmation',
      confidence: 0.7,
    }
  } else {
    return {
      type: 'neutral',
      text: 'No clear setup yet — continue monitoring',
      confidence: 0.6,
    }
  }
}

/**
 * Generate AI commentary text
 */
function generateAICommentary(
  insights: TeaserInsight[],
  heuristics: HeuristicAnalysis,
  marketData: MarketData
): string {
  const lines: string[] = []
  
  // Header
  lines.push(`**${marketData.symbol} Analysis** (${new Date().toLocaleTimeString()})`)
  lines.push('')
  
  // Key levels
  lines.push(`**Key Levels:**`)
  lines.push(`• Support: $${heuristics.supportLevel.toFixed(6)}`)
  lines.push(`• Resistance: $${heuristics.resistanceLevel.toFixed(6)}`)
  lines.push(`• Bias: ${heuristics.bias}`)
  lines.push('')
  
  // Insights
  lines.push(`**Insights:**`)
  insights.forEach((insight, i) => {
    const emoji = insight.type === 'bullish' ? '✓' : insight.type === 'bearish' ? '↓' : insight.type === 'warning' ? '⚠' : '•'
    lines.push(`${i + 1}. ${emoji} ${insight.text}`)
  })
  lines.push('')
  
  // Disclaimer
  lines.push(`*Beta Preview: Template-based insights. Full AI analysis coming in Alpha.*`)
  
  return lines.join('\n')
}

/**
 * Get timeframe display name
 */
function getTimeframeName(tf: string): string {
  const map: Record<string, string> = {
    '5m': '5-minute',
    '15m': '15-minute',
    '1h': '1-hour',
    '4h': '4-hour',
    '1d': '1-day',
  }
  return map[tf] || tf
}

/**
 * Mock: Check if AI provider is configured
 */
export function isAIAnalysisEnabled(): boolean {
  const provider = import.meta.env.VITE_AI_PROVIDER || 'none'
  return provider !== 'none'
}

/**
 * Mock: Future OpenAI integration placeholder
 */
export async function fetchAIInsights(
  _prompt: string
): Promise<string> {
  // Future: Call OpenAI/Grok API
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4-turbo",
  //   messages: [{ role: "user", content: prompt }]
  // })
  
  console.info('[teaserAnalysis] AI provider not implemented in Beta')
  return 'AI insights available in Alpha phase'
}
