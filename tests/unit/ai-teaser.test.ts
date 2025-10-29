/**
 * Alpha M7: AI Integration Tests
 * Tests for AI teaser analysis, prompts, and fallback logic
 *
 * DoD:
 * - 10 mock tests (OpenAI → Mock, Grok → Timeout)
 * - Response time < 3s
 * - Fallback works
 * - Valid JSON
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getTeaserAnalysis,
  type TeaserPayload,
  type AIProvider,
} from '@/lib/ai/teaserAdapter'
import { buildSystemPrompt, buildUserPrompt, validateAIResponse } from '@/lib/ai/prompts/taPrompt'
import type { AITeaserAnalysis, OCRResult, DexscreenerTokenData } from '@/types/analysis'

// Mock fetch globally
const originalFetch = global.fetch

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  global.fetch = originalFetch
})

describe('AI Teaser Analysis - M7 Integration', () => {
  describe('Prompt Generation', () => {
    it('builds valid system prompt', () => {
      const systemPrompt = buildSystemPrompt()

      expect(systemPrompt).toContain('expert crypto trading analyst')
      expect(systemPrompt).toContain('valid JSON')
      expect(systemPrompt).toContain('sr_levels')
      expect(systemPrompt).toContain('stop_loss')
      expect(systemPrompt).toContain('tp')
      expect(systemPrompt).toContain('confidence')
    })

    it('builds user prompt with market data', () => {
      const dexData: DexscreenerTokenData = {
        price: 0.000042,
        high24: 0.000045,
        low24: 0.00004,
        vol24: 1000000,
        liquidity: 500000,
        priceChange24h: 5.5,
        timestamp: Date.now(),
      }

      const userPrompt = buildUserPrompt(dexData)

      expect(userPrompt).toContain('$0.000042')
      expect(userPrompt).toContain('24h Range')
      expect(userPrompt).toContain('Volume')
      expect(userPrompt).toContain('Liquidity')
      expect(userPrompt).toContain('+5.50%')
    })

    it('builds user prompt with OCR data', () => {
      const ocrData: OCRResult = {
        text: 'RSI: 65 Bollinger: Upper',
        confidence: 0.85,
        labels: ['RSI', 'BOLLINGER'],
        indicators: {
          rsi: 65,
          bollinger: 'upper',
        },
        indicatorValues: [
          { name: 'RSI', value: 65, confidence: 0.9 },
          { name: 'Bollinger', value: 'upper', confidence: 0.8 },
        ],
        processingTime: 250,
      }

      const userPrompt = buildUserPrompt(undefined, ocrData)

      expect(userPrompt).toContain('Chart Indicators')
      expect(userPrompt).toContain('RSI: 65')
      expect(userPrompt).toContain('Bollinger Band: upper')
      expect(userPrompt).toContain('confidence: 90%')
    })

    it('builds minimal prompt without data', () => {
      const userPrompt = buildUserPrompt()

      expect(userPrompt).toContain('Analyze this trading chart')
      expect(userPrompt).toContain('JSON format')
    })
  })

  describe('Response Validation', () => {
    it('validates correct AI response structure', () => {
      const validResponse = {
        sr_levels: [
          { label: 'S1', price: 0.00004, type: 'support' },
          { label: 'R1', price: 0.000045, type: 'resistance' },
        ],
        stop_loss: 0.000038,
        tp: [0.000044, 0.000046],
        indicators: ['RSI: 65', 'Bollinger: Middle'],
        teaser_text: 'Bullish setup detected. Entry zone around support.',
        confidence: 0.75,
      }

      expect(validateAIResponse(validResponse)).toBe(true)
    })

    it('rejects invalid response - missing fields', () => {
      const invalidResponse = {
        sr_levels: [],
        // Missing stop_loss, tp, indicators, teaser_text, confidence
      }

      expect(validateAIResponse(invalidResponse)).toBe(false)
    })

    it('rejects invalid response - wrong types', () => {
      const invalidResponse = {
        sr_levels: 'not an array',
        stop_loss: 0.00004,
        tp: [0.000044],
        indicators: [],
        teaser_text: 'text',
        confidence: 0.75,
      }

      expect(validateAIResponse(invalidResponse)).toBe(false)
    })

    it('rejects invalid response - confidence out of range', () => {
      const invalidResponse = {
        sr_levels: [],
        stop_loss: 0.00004,
        tp: [],
        indicators: [],
        teaser_text: 'text',
        confidence: 1.5, // > 1.0
      }

      expect(validateAIResponse(invalidResponse)).toBe(false)
    })

    it('rejects invalid response - malformed sr_levels', () => {
      const invalidResponse = {
        sr_levels: [
          { label: 'S1', price: 'not a number', type: 'support' },
        ],
        stop_loss: 0.00004,
        tp: [],
        indicators: [],
        teaser_text: 'text',
        confidence: 0.75,
      }

      expect(validateAIResponse(invalidResponse)).toBe(false)
    })
  })

  describe('Heuristic Fallback', () => {
    it('returns heuristic analysis when provider is none', async () => {
      const payload: TeaserPayload = {
        dexData: {
          price: 0.000042,
          high24: 0.000045,
          low24: 0.00004,
          vol24: 1000000,
          timestamp: Date.now(),
        },
      }

      const result = await getTeaserAnalysis(payload, 'none')

      expect(result).toBeDefined()
      expect(result.provider).toBe('heuristic')
      expect(result.sr_levels.length).toBeGreaterThan(0)
      expect(result.stop_loss).toBeGreaterThan(0)
      expect(result.tp.length).toBe(2)
      expect(result.confidence).toBeGreaterThan(0)
      expect(result.processingTime).toBeGreaterThan(0)
    })

    it('uses provided heuristic if available', async () => {
      const customHeuristic = {
        supportLevel: 0.00004,
        resistanceLevel: 0.000045,
        rangeSize: 'Medium' as const,
        volatility24h: 10,
        bias: 'Bullish' as const,
        keyLevels: [0.00004, 0.000045],
        roundNumbers: [0.00004, 0.00005],
        stopLoss: 0.000038,
        takeProfit1: 0.000046,
        takeProfit2: 0.00005,
        confidence: 0.8,
        timestamp: Date.now(),
        source: 'heuristic' as const,
      }

      const payload: TeaserPayload = {
        heuristic: customHeuristic,
      }

      const result = await getTeaserAnalysis(payload, 'none')

      expect(result.provider).toBe('heuristic')
      expect(result.stop_loss).toBe(0.000038)
      expect(result.tp).toContain(0.000046)
      expect(result.confidence).toBe(0.8)
    })

    it('completes within performance budget', async () => {
      const payload: TeaserPayload = {
        dexData: {
          price: 0.000042,
          high24: 0.000045,
          low24: 0.00004,
          vol24: 1000000,
          timestamp: Date.now(),
        },
      }

      const startTime = performance.now()
      const result = await getTeaserAnalysis(payload, 'none')
      const duration = performance.now() - startTime

      // Heuristic should be < 300ms (as per M6 DoD)
      expect(duration).toBeLessThan(300)
      expect(result.processingTime).toBeLessThan(300)
    })
  })

  describe('AI Provider Integration (Mocked)', () => {
    it('calls edge proxy with correct payload - OpenAI', async () => {
      const mockResponse: AITeaserAnalysis = {
        sr_levels: [
          { label: 'S1', price: 0.00004, type: 'support' },
          { label: 'R1', price: 0.000045, type: 'resistance' },
        ],
        stop_loss: 0.000038,
        tp: [0.000044, 0.000046],
        indicators: ['RSI: 65'],
        teaser_text: 'Bullish setup',
        confidence: 0.75,
        processingTime: 1500,
        provider: 'openai',
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            content: JSON.stringify(mockResponse),
            provider: 'openai',
            processingTime: 1500,
          },
        }),
      })

      const payload: TeaserPayload = {
        dexData: {
          price: 0.000042,
          high24: 0.000045,
          low24: 0.00004,
          vol24: 1000000,
          timestamp: Date.now(),
        },
      }

      const result = await getTeaserAnalysis(payload, 'openai')

      expect(result.provider).toBe('openai')
      expect(result.sr_levels.length).toBeGreaterThan(0)
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/ai/analyze',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    it('falls back to heuristic on API error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })

      const payload: TeaserPayload = {
        dexData: {
          price: 0.000042,
          high24: 0.000045,
          low24: 0.00004,
          vol24: 1000000,
          timestamp: Date.now(),
        },
      }

      const result = await getTeaserAnalysis(payload, 'openai')

      // Should fallback to heuristic
      expect(result.provider).toBe('heuristic')
      expect(result.sr_levels.length).toBeGreaterThan(0)
    })

    it('falls back to heuristic on timeout', async () => {
      // Mock a delayed response that never resolves within timeout
      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => {
              const error = new Error('AbortError')
              error.name = 'AbortError'
              reject(error)
            }, 100)
          )
      )

      const payload: TeaserPayload = {
        dexData: {
          price: 0.000042,
          timestamp: Date.now(),
        },
      }

      const result = await getTeaserAnalysis(payload, 'grok')

      // Should fallback to heuristic due to timeout
      expect(result.provider).toBe('heuristic')
    })

    it('falls back to heuristic on invalid JSON response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            content: 'Invalid JSON {{{',
            provider: 'openai',
            processingTime: 1000,
          },
        }),
      })

      const payload: TeaserPayload = {
        dexData: {
          price: 0.000042,
          timestamp: Date.now(),
        },
      }

      const result = await getTeaserAnalysis(payload, 'openai')

      // Should handle parse error gracefully
      expect(result).toBeDefined()
      expect(result.confidence).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Performance', () => {
    it('respects 3s timeout budget', async () => {
      const payload: TeaserPayload = {
        dexData: {
          price: 0.000042,
          timestamp: Date.now(),
        },
      }

      const startTime = performance.now()
      const result = await getTeaserAnalysis(payload, 'none')
      const duration = performance.now() - startTime

      // Should complete well within 3s (heuristic is < 300ms)
      expect(duration).toBeLessThan(3000)
      expect(result.processingTime).toBeLessThan(3000)
    })
  })
})
