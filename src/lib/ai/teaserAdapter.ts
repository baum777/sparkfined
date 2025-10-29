/**
 * AI Teaser Adapter - M7 Enhanced
 *
 * Orchestrates AI-powered analysis from multiple providers via Edge proxy:
 * - none → Heuristic Fallback
 * - openai → GPT-4o-mini Vision
 * - grok → Grok Vision
 * - anthropic → Claude 4.5 Sonnet
 *
 * Features:
 * - Edge proxy for API key protection
 * - 3s timeout (never blocks UI)
 * - Automatic fallback to heuristic
 * - Telemetry integration
 * - Response validation
 *
 * DoD: Response < 3s, Fallback works, Valid JSON
 */

import type {
  AITeaserAnalysis,
  OCRResult,
  DexscreenerTokenData,
  PumpfunTokenData,
  HeuristicAnalysis,
} from '@/types/analysis'
import { calculateHeuristic, heuristicToTeaser } from '@/lib/analysis/heuristicEngine'
import { buildSystemPrompt, buildUserPrompt, validateAIResponse } from './prompts/taPrompt'
import { Telemetry, TelemetryEvents } from '@/lib/TelemetryService'

export type AIProvider = 'none' | 'openai' | 'grok' | 'anthropic'

export interface TeaserPayload {
  imageDataUrl?: string
  ocrData?: OCRResult
  dexData?: DexscreenerTokenData
  pumpfunData?: PumpfunTokenData
  contractAddress?: string
  heuristic?: HeuristicAnalysis
}

const AI_PROVIDER = (import.meta.env.VITE_ANALYSIS_AI_PROVIDER || 'none') as AIProvider
const TIMEOUT_MS = 3000

/**
 * Main entry point for AI teaser analysis
 */
export async function getTeaserAnalysis(
  payload: TeaserPayload,
  provider: AIProvider = AI_PROVIDER
): Promise<AITeaserAnalysis> {
  const startTime = performance.now()

  try {
    let result: AITeaserAnalysis

    // Route to appropriate provider
    switch (provider) {
      case 'openai':
        result = await getAITeaser(payload, 'openai')
        break
      case 'grok':
        result = await getAITeaser(payload, 'grok')
        break
      case 'anthropic':
        result = await getAITeaser(payload, 'anthropic')
        break
      case 'none':
      default:
        result = await getHeuristicTeaser(payload)
        break
    }

    const processingTime = performance.now() - startTime
    result.processingTime = processingTime

    // Log telemetry
    Telemetry.log(TelemetryEvents.AI_TEASER_MS, processingTime, {
      provider: result.provider,
      confidence: result.confidence,
    })

    return result
  } catch (error) {
    console.error('AI Teaser failed, falling back to heuristic:', error)

    // Log fallback event
    Telemetry.log(TelemetryEvents.PROVIDER_FALLBACK, 1, {
      from: provider,
      to: 'heuristic',
      reason: error instanceof Error ? error.message : 'unknown',
    })

    // Always fallback to heuristic on error
    const fallback = await getHeuristicTeaser(payload)
    fallback.processingTime = performance.now() - startTime
    return fallback
  }
}

/**
 * Heuristic fallback (no external API)
 */
async function getHeuristicTeaser(payload: TeaserPayload): Promise<AITeaserAnalysis> {
  const startTime = performance.now()

  // Use provided heuristic or calculate new one
  let heuristic: HeuristicAnalysis

  if (payload.heuristic) {
    heuristic = payload.heuristic
  } else if (payload.dexData) {
    heuristic = calculateHeuristic({
      price: payload.dexData.price,
      high24: payload.dexData.high24,
      low24: payload.dexData.low24,
      vol24: payload.dexData.vol24,
      ocrData: payload.ocrData,
    })
  } else {
    // Minimal fallback
    heuristic = calculateHeuristic({
      price: 0.000042,
      ocrData: payload.ocrData,
    })
  }

  const teaser = heuristicToTeaser(heuristic)
  teaser.processingTime = performance.now() - startTime

  return teaser
}

/**
 * AI-powered teaser via Edge proxy
 */
async function getAITeaser(
  payload: TeaserPayload,
  provider: Exclude<AIProvider, 'none'>
): Promise<AITeaserAnalysis> {
  const startTime = performance.now()

  // Build prompts
  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildUserPrompt(payload.dexData, payload.ocrData, payload.pumpfunData)

  // Call edge proxy
  const requestBody = {
    provider,
    imageDataUrl: payload.imageDataUrl,
    systemPrompt,
    userPrompt,
    maxTokens: 500,
  }

  // Fetch with timeout
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`AI API returned ${response.status}`)
    }

    const result = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.error || 'AI request failed')
    }

    const content = result.data.content
    const parsed = parseAIResponse(content, provider)

    const processingTime = performance.now() - startTime

    return {
      ...parsed,
      processingTime,
      provider,
    }
  } catch (error) {
    clearTimeout(timeout)

    // Check for timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI request timeout (3s)')
    }

    throw error
  }
}

/**
 * Parse AI response to AITeaserAnalysis format
 */
function parseAIResponse(
  content: string,
  provider: Exclude<AIProvider, 'none'>
): Omit<AITeaserAnalysis, 'processingTime' | 'provider'> {
  try {
    // Handle empty or undefined content
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid content: empty or not a string')
    }

    // Try to extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
    const jsonStr = jsonMatch ? jsonMatch[1] : content

    const parsed = JSON.parse(jsonStr)

    // Validate response structure
    if (!validateAIResponse(parsed)) {
      throw new Error('Invalid AI response structure')
    }

    return {
      sr_levels: parsed.sr_levels || [],
      stop_loss: parsed.stop_loss || 0,
      tp: parsed.tp || [],
      indicators: parsed.indicators || [],
      teaser_text: parsed.teaser_text || 'Analysis generated',
      confidence: parsed.confidence || 0.5,
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error)

    // Return minimal valid response on parse error
    return {
      sr_levels: [],
      stop_loss: 0,
      tp: [],
      indicators: [],
      teaser_text: 'Unable to parse AI response',
      confidence: 0,
    }
  }
}

/**
 * Batch teaser analysis (future enhancement)
 */
export async function getTeaserAnalysisBatch(
  payloads: TeaserPayload[],
  provider: AIProvider = AI_PROVIDER
): Promise<AITeaserAnalysis[]> {
  const results = await Promise.all(
    payloads.map((payload) => getTeaserAnalysis(payload, provider))
  )
  return results
}
