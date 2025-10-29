/**
 * AI Teaser Analysis - Prompt Templates
 * M7: Optimized prompts for OpenAI, Grok, and Anthropic
 *
 * Response format:
 * {
 *   sr_levels: [{ label, price, type }],
 *   stop_loss: number,
 *   tp: number[],
 *   indicators: string[],
 *   teaser_text: string,
 *   confidence: number
 * }
 */

import type { OCRResult, DexscreenerTokenData, PumpfunTokenData } from '@/types/analysis'

/**
 * System prompt for AI trading analyst role
 */
export function buildSystemPrompt(): string {
  return `You are an expert crypto trading analyst specializing in Solana tokens.
Your task is to analyze chart images and market data to provide actionable trading insights.

Output MUST be valid JSON with this exact structure:
{
  "sr_levels": [{"label": "S1", "price": 0.000042, "type": "support"}],
  "stop_loss": 0.00004,
  "tp": [0.000044, 0.000046],
  "indicators": ["RSI: 65", "Bollinger: Middle"],
  "teaser_text": "Brief analysis summary (2-3 sentences)",
  "confidence": 0.75
}

Guidelines:
- Support/Resistance levels (S1, S2, R1, R2) based on chart and price action
- Stop loss placement (-3% to -7% from entry)
- Take profit targets (2 levels: +5-10%, +15-25%)
- Key technical indicators from chart analysis
- Brief, actionable trading recommendation

Focus on:
1. Price structure and key levels
2. Technical indicator signals (RSI, Bollinger, MA)
3. Risk/reward ratio
4. Entry timing

Be concise and actionable. This is a quick preview, not a full report.
Confidence score should reflect data quality and signal strength (0.0-1.0).`
}

/**
 * User prompt with market context
 */
export function buildUserPrompt(
  dexData?: DexscreenerTokenData,
  ocrData?: OCRResult,
  pumpfunData?: PumpfunTokenData
): string {
  let prompt = 'Analyze this trading chart and provide technical analysis.\n\n'

  // Market data context
  if (dexData) {
    prompt += '📊 Market Data:\n'
    prompt += `- Current Price: $${dexData.price}\n`
    if (dexData.high24 && dexData.low24) {
      prompt += `- 24h Range: $${dexData.low24} - $${dexData.high24}\n`
      const rangePercent = ((dexData.high24 - dexData.low24) / dexData.price) * 100
      prompt += `- 24h Range %: ${rangePercent.toFixed(2)}%\n`
    }
    if (dexData.vol24) {
      prompt += `- 24h Volume: $${dexData.vol24.toLocaleString()}\n`
    }
    if (dexData.liquidity) {
      prompt += `- Liquidity: $${dexData.liquidity.toLocaleString()}\n`
    }
    if (dexData.priceChange24h !== undefined) {
      prompt += `- 24h Change: ${dexData.priceChange24h > 0 ? '+' : ''}${dexData.priceChange24h.toFixed(2)}%\n`
    }
    prompt += '\n'
  }

  // OCR indicator data
  if (ocrData && ocrData.indicatorValues.length > 0) {
    prompt += '📈 Chart Indicators:\n'
    
    // Group by indicator type
    const rsi = ocrData.indicatorValues.filter((i) => i.name === 'RSI')
    const bb = ocrData.indicatorValues.filter((i) => i.name === 'Bollinger')
    const ema = ocrData.indicatorValues.filter((i) => i.name.startsWith('EMA'))
    const sma = ocrData.indicatorValues.filter((i) => i.name.startsWith('SMA'))

    if (rsi.length > 0) {
      const rsiVal = rsi[0]
      prompt += `- RSI: ${rsiVal.value} (confidence: ${(rsiVal.confidence * 100).toFixed(0)}%)\n`
    }

    if (bb.length > 0) {
      const bbVal = bb[0]
      prompt += `- Bollinger Band: ${bbVal.value} (confidence: ${(bbVal.confidence * 100).toFixed(0)}%)\n`
    }

    if (ema.length > 0) {
      prompt += '- EMA: '
      prompt += ema.map((e) => `${e.name}=${e.value}`).join(', ')
      prompt += '\n'
    }

    if (sma.length > 0) {
      prompt += '- SMA: '
      prompt += sma.map((s) => `${s.name}=${s.value}`).join(', ')
      prompt += '\n'
    }

    prompt += '\n'
  }

  // Token metadata (Pump.fun)
  if (pumpfunData) {
    prompt += '🪙 Token Info:\n'
    prompt += `- Name: ${pumpfunData.name} (${pumpfunData.symbol})\n`
    if (pumpfunData.liquidity) {
      prompt += `- Liquidity: $${pumpfunData.liquidity.toLocaleString()}\n`
    }
    if (pumpfunData.launchDate) {
      prompt += `- Launch Date: ${pumpfunData.launchDate}\n`
    }
    prompt += '\n'
  }

  prompt += 'Provide your analysis in the specified JSON format.'
  prompt += '\nFocus on actionable levels and clear risk management.'

  return prompt
}

/**
 * Minimal prompt for fallback/timeout scenarios
 */
export function buildMinimalPrompt(price: number): string {
  return `Analyze Solana token at current price $${price}.
Provide support/resistance levels, stop loss, and take profit targets in JSON format.
Keep it brief and actionable.`
}

/**
 * Validate AI response structure
 */
export function validateAIResponse(parsed: unknown): boolean {
  if (!parsed || typeof parsed !== 'object') return false

  const response = parsed as Record<string, unknown>

  // Required fields
  if (!Array.isArray(response.sr_levels)) return false
  if (typeof response.stop_loss !== 'number') return false
  if (!Array.isArray(response.tp)) return false
  if (!Array.isArray(response.indicators)) return false
  if (typeof response.teaser_text !== 'string') return false
  if (typeof response.confidence !== 'number') return false

  // Validate sr_levels structure
  for (const level of response.sr_levels) {
    if (typeof level !== 'object') return false
    const l = level as Record<string, unknown>
    if (typeof l.label !== 'string') return false
    if (typeof l.price !== 'number') return false
    if (l.type !== 'support' && l.type !== 'resistance') return false
  }

  // Validate confidence range
  if (response.confidence < 0 || response.confidence > 1) return false

  return true
}
