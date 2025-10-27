/**
 * Heuristic Analysis Engine - Step 6
 * 
 * Calculates Support/Resistance, Volatility, Bias, and Trading Setups
 * Based on price action, volume, and technical indicators
 * 
 * Status: Beta Implementation - Pure heuristics, no ML
 * Timeframes: 5m, 15m, 1h, 4h, 1d
 */

import type { HeuristicAnalysis } from '@/types/analysis'
import type { MarketData } from './marketData'
import type { OCRResult } from './ocr'

export interface AnalysisInput {
  marketData: MarketData
  ocrLabels?: OCRResult
  timeframe?: '5m' | '15m' | '1h' | '4h' | '1d'
}

/**
 * Perform heuristic analysis on market data
 */
export function performHeuristicAnalysis(input: AnalysisInput): HeuristicAnalysis {
  const { marketData, ocrLabels } = input
  // timeframe support coming in future versions
  
  // 1. Calculate Support & Resistance
  const { supportLevel, resistanceLevel } = calculateSupportResistance(marketData)
  
  // 2. Calculate key levels (round numbers, fibonacci)
  const keyLevels = calculateKeyLevels(marketData.price, supportLevel, resistanceLevel)
  const roundNumbers = findRoundNumbers(marketData.price)
  
  // 3. Calculate range size
  const rangeSize = calculateRangeSize(supportLevel, resistanceLevel, marketData.price)
  
  // 4. Calculate volatility
  const volatility24h = calculateVolatility(marketData)
  
  // 5. Determine bias
  const bias = determineBias(marketData, ocrLabels)
  
  // 6. Calculate entry/exit zones
  const entryZone = calculateEntryZone(supportLevel, resistanceLevel, bias)
  const reentryLevel = calculateReentryLevel(supportLevel, marketData.price, bias)
  const stopLoss = calculateStopLoss(supportLevel, resistanceLevel, marketData.price, bias)
  const { takeProfit1, takeProfit2 } = calculateTakeProfitLevels(
    resistanceLevel,
    supportLevel,
    marketData.price,
    bias
  )
  
  // 7. Check indicator status (from OCR if available)
  const rsiOverbought = checkRSIOverbought(ocrLabels)
  const rsiOversold = checkRSIOversold(ocrLabels)
  const bollingerBandStatus = checkBollingerBands(ocrLabels)
  
  // 8. Calculate confidence score
  const confidence = calculateConfidence(marketData, ocrLabels, volatility24h)
  
  return {
    supportLevel,
    resistanceLevel,
    rangeSize,
    volatility24h,
    bias,
    keyLevels,
    roundNumbers,
    entryZone,
    reentryLevel,
    stopLoss,
    takeProfit1,
    takeProfit2,
    rsiOverbought,
    rsiOversold,
    bollingerBandStatus,
    confidence,
    timestamp: Date.now(),
    source: 'heuristic',
  }
}

/**
 * Calculate Support & Resistance levels
 * Uses 24h high/low + round number bias
 */
function calculateSupportResistance(data: MarketData): { 
  supportLevel: number
  resistanceLevel: number 
} {
  const { price, high24h, low24h } = data
  
  // Base levels from 24h range
  let support = low24h
  let resistance = high24h
  
  // Adjust to nearby round numbers (psychological levels)
  support = findNearestRoundNumber(support, 'down')
  resistance = findNearestRoundNumber(resistance, 'up')
  
  // Ensure current price is between S/R
  if (price < support) support = price * 0.95
  if (price > resistance) resistance = price * 1.05
  
  return {
    supportLevel: support,
    resistanceLevel: resistance,
  }
}

/**
 * Calculate key levels using Fibonacci retracements
 */
function calculateKeyLevels(
  price: number, 
  support: number, 
  resistance: number
): number[] {
  const range = resistance - support
  
  const fibLevels = [
    support + range * 0.236, // 23.6%
    support + range * 0.382, // 38.2%
    support + range * 0.5,   // 50%
    support + range * 0.618, // 61.8%
    support + range * 0.786, // 78.6%
  ]
  
  // Filter levels near current price (±10%)
  return fibLevels.filter(level => {
    const diff = Math.abs(level - price) / price
    return diff < 0.15 // Within 15%
  })
}

/**
 * Find psychologically important round numbers near price
 */
function findRoundNumbers(price: number): number[] {
  const roundNumbers: number[] = []
  
  // Determine magnitude
  const magnitude = Math.pow(10, Math.floor(Math.log10(price)))
  const step = magnitude / 10
  
  // Find nearest round numbers
  for (let i = -2; i <= 2; i++) {
    const roundNum = Math.round(price / step) * step + (i * step)
    if (roundNum > 0 && roundNum !== price) {
      roundNumbers.push(roundNum)
    }
  }
  
  return roundNumbers.sort((a, b) => a - b)
}

/**
 * Find nearest round number in a direction
 */
function findNearestRoundNumber(value: number, direction: 'up' | 'down'): number {
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
  const step = magnitude / 5 // Round to 0.2, 2, 20, 200, etc.
  
  if (direction === 'up') {
    return Math.ceil(value / step) * step
  } else {
    return Math.floor(value / step) * step
  }
}

/**
 * Calculate range size (Low/Medium/High)
 */
function calculateRangeSize(
  support: number,
  resistance: number,
  price: number
): 'Low' | 'Medium' | 'High' {
  const rangePercent = ((resistance - support) / price) * 100
  
  if (rangePercent < 5) return 'Low'
  if (rangePercent < 15) return 'Medium'
  return 'High'
}

/**
 * Calculate 24h volatility percentage
 */
function calculateVolatility(data: MarketData): number {
  const { high24h, low24h, price } = data
  return ((high24h - low24h) / price) * 100
}

/**
 * Determine market bias (Bullish/Bearish/Neutral)
 */
function determineBias(
  data: MarketData,
  ocrLabels?: OCRResult
): 'Bullish' | 'Bearish' | 'Neutral' {
  let score = 0
  
  // 1. Price change bias
  if (data.priceChange24h > 5) score += 2
  else if (data.priceChange24h > 2) score += 1
  else if (data.priceChange24h < -5) score -= 2
  else if (data.priceChange24h < -2) score -= 1
  
  // 2. Volume bias (high volume = conviction)
  const volumeToLiquidity = data.volume24h / data.liquidity
  if (volumeToLiquidity > 2) {
    score += data.priceChange24h > 0 ? 1 : -1
  }
  
  // 3. RSI from OCR (if available)
  if (ocrLabels) {
    const rsiLabel = ocrLabels.labels.find(l => l.name === 'RSI')
    if (rsiLabel) {
      const rsi = parseFloat(rsiLabel.value)
      if (rsi > 60) score += 1
      if (rsi < 40) score -= 1
    }
  }
  
  // 4. Position in range
  const { high24h, low24h, price } = data
  const positionInRange = (price - low24h) / (high24h - low24h)
  if (positionInRange > 0.7) score += 1
  if (positionInRange < 0.3) score -= 1
  
  if (score >= 2) return 'Bullish'
  if (score <= -2) return 'Bearish'
  return 'Neutral'
}

/**
 * Calculate entry zone for position
 */
function calculateEntryZone(
  support: number,
  resistance: number,
  bias: 'Bullish' | 'Bearish' | 'Neutral'
): { min: number; max: number } {
  const range = resistance - support
  
  if (bias === 'Bullish') {
    // Enter near support on pullbacks
    return {
      min: support,
      max: support + range * 0.3,
    }
  } else if (bias === 'Bearish') {
    // Enter near resistance on bounces (short)
    return {
      min: resistance - range * 0.3,
      max: resistance,
    }
  } else {
    // Neutral: wait for breakout confirmation
    return {
      min: support + range * 0.4,
      max: support + range * 0.6,
    }
  }
}

/**
 * Calculate re-entry level (DCA point)
 */
function calculateReentryLevel(
  support: number,
  price: number,
  bias: 'Bullish' | 'Bearish' | 'Neutral'
): number {
  if (bias === 'Bullish') {
    // 2-3% below current support
    return support * 0.97
  } else if (bias === 'Bearish') {
    // Not applicable for bearish (or resistance * 1.03 for shorts)
    return price * 1.03
  } else {
    return support * 0.98
  }
}

/**
 * Calculate stop loss level
 */
function calculateStopLoss(
  support: number,
  resistance: number,
  price: number,
  bias: 'Bullish' | 'Bearish' | 'Neutral'
): number {
  if (bias === 'Bullish') {
    // Below support (1-2% cushion)
    return support * 0.98
  } else if (bias === 'Bearish') {
    // Above resistance
    return resistance * 1.02
  } else {
    // Neutral: tighter stop
    return price * 0.97
  }
}

/**
 * Calculate take profit levels
 */
function calculateTakeProfitLevels(
  resistance: number,
  support: number,
  price: number,
  bias: 'Bullish' | 'Bearish' | 'Neutral'
): { takeProfit1: number; takeProfit2: number } {
  const range = resistance - support
  
  if (bias === 'Bullish') {
    return {
      takeProfit1: resistance * 0.99, // Just below resistance
      takeProfit2: resistance + range * 0.5, // Extension target
    }
  } else if (bias === 'Bearish') {
    return {
      takeProfit1: support * 1.01,
      takeProfit2: support - range * 0.5,
    }
  } else {
    return {
      takeProfit1: price * 1.05,
      takeProfit2: price * 1.10,
    }
  }
}

/**
 * Check if RSI is overbought (from OCR)
 */
function checkRSIOverbought(ocrLabels?: OCRResult): boolean {
  if (!ocrLabels) return false
  
  const rsiLabel = ocrLabels.labels.find(l => l.name === 'RSI')
  if (!rsiLabel) return false
  
  const rsi = parseFloat(rsiLabel.value)
  return rsi > 70
}

/**
 * Check if RSI is oversold (from OCR)
 */
function checkRSIOversold(ocrLabels?: OCRResult): boolean {
  if (!ocrLabels) return false
  
  const rsiLabel = ocrLabels.labels.find(l => l.name === 'RSI')
  if (!rsiLabel) return false
  
  const rsi = parseFloat(rsiLabel.value)
  return rsi < 30
}

/**
 * Check Bollinger Band status (from OCR)
 */
function checkBollingerBands(
  _ocrLabels?: OCRResult
): 'upper' | 'lower' | 'middle' | 'neutral' {
  // Future: Extract BB data from OCR
  // For now, return neutral
  return 'neutral'
}

/**
 * Calculate overall confidence score (0-1)
 */
function calculateConfidence(
  data: MarketData,
  ocrLabels: OCRResult | undefined,
  volatility: number
): number {
  let score = 0.5 // Base
  
  // Higher confidence with:
  // 1. Good liquidity
  if (data.liquidity > 50000) score += 0.1
  if (data.liquidity > 100000) score += 0.1
  
  // 2. Moderate volatility (not too high/low)
  if (volatility > 3 && volatility < 15) score += 0.1
  
  // 3. OCR data available
  if (ocrLabels && ocrLabels.labels.length > 0) {
    score += 0.1
    if (ocrLabels.confidence > 0.7) score += 0.1
  }
  
  // 4. Clear trend (not flat)
  if (Math.abs(data.priceChange24h) > 3) score += 0.1
  
  return Math.min(Math.max(score, 0), 1)
}
