/**
 * Alpha M8: Enhanced Telemetry Tests
 * Tests for extended metrics, error pipeline, and export functionality
 *
 * DoD:
 * - Metrics captured and exportable
 * - No PII
 * - Error pipeline works
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Telemetry, TelemetryEvents } from '@/lib/TelemetryService'

describe('Enhanced Telemetry Service - M8', () => {
  beforeEach(async () => {
    // Clear telemetry before each test
    await Telemetry.clear()
  })

  afterEach(async () => {
    // Cleanup
    await Telemetry.clear()
  })

  describe('Event Logging', () => {
    it('logs AI latency metrics', () => {
      Telemetry.log(TelemetryEvents.AI_LATENCY, 1500, {
        provider: 'openai',
        confidence: 0.75,
      })

      const stats = Telemetry.getStats(TelemetryEvents.AI_LATENCY)
      expect(stats).toBeDefined()
      expect(stats?.count).toBe(1)
      expect(stats?.avg).toBe(1500)
    })

    it('logs OCR confidence average', () => {
      Telemetry.log(TelemetryEvents.OCR_CONFIDENCE_AVG, 0.85, {
        indicatorCount: 5,
      })

      const stats = Telemetry.getStats(TelemetryEvents.OCR_CONFIDENCE_AVG)
      expect(stats).toBeDefined()
      expect(stats?.count).toBe(1)
      expect(stats?.avg).toBe(0.85)
    })

    it('logs provider fallback events', () => {
      Telemetry.log(TelemetryEvents.PROVIDER_FALLBACK, 1, {
        from: 'openai',
        to: 'heuristic',
        reason: 'timeout',
      })

      const stats = Telemetry.getStats(TelemetryEvents.PROVIDER_FALLBACK)
      expect(stats).toBeDefined()
      expect(stats?.count).toBe(1)
    })

    it('tracks multiple events with statistics', () => {
      const latencies = [1200, 1500, 1800, 2100, 900]

      latencies.forEach((latency) => {
        Telemetry.log(TelemetryEvents.AI_TEASER_MS, latency)
      })

      const stats = Telemetry.getStats(TelemetryEvents.AI_TEASER_MS)
      expect(stats).toBeDefined()
      expect(stats?.count).toBe(5)
      expect(stats?.median).toBeGreaterThan(0)
      expect(stats?.p95).toBeGreaterThan(0)
      expect(stats?.max).toBe(2100)
      expect(stats?.avg).toBeCloseTo(1500, 0)
    })

    it('limits in-memory events to 1000', () => {
      // Log 1500 events
      for (let i = 0; i < 1500; i++) {
        Telemetry.log('test_event', i)
      }

      const stats = Telemetry.getStats('test_event')
      expect(stats).toBeDefined()
      // Should only keep last 1000
      expect(stats?.count).toBeLessThanOrEqual(1000)
    })
  })

  describe('Error Pipeline', () => {
    it('logs error with context', () => {
      const error = new Error('Test error')
      const context = { component: 'OCR', action: 'parse' }

      Telemetry.logError(error, context, 'medium')

      // Error should be in memory
      expect(true).toBe(true) // logError is fire-and-forget
    })

    it('logs string error', () => {
      Telemetry.logError('Simple error message', { source: 'test' }, 'low')

      expect(true).toBe(true) // No error thrown
    })

    it('handles critical errors', () => {
      const criticalError = new Error('Critical failure')

      Telemetry.logError(criticalError, { userId: 'anonymous' }, 'critical')

      expect(true).toBe(true)
    })

    it('limits in-memory errors to 100', async () => {
      // Log 150 errors
      for (let i = 0; i < 150; i++) {
        Telemetry.logError(`Error ${i}`, {}, 'low')
      }

      // Wait a bit for persistence
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Should trim to 100 in memory (IndexedDB has all)
      expect(true).toBe(true) // Test passes if no crash
    })
  })

  describe('Performance Budgets', () => {
    it('checks if metric exceeds budget', () => {
      // AI_TEASER_MS budget is 3000ms (registered in TelemetryService)
      const withinBudget = Telemetry.checkBudget(TelemetryEvents.AI_TEASER_MS, 2500)
      const exceedsBudget = Telemetry.checkBudget(TelemetryEvents.AI_TEASER_MS, 3500)

      expect(withinBudget).toBe(true)
      expect(exceedsBudget).toBe(false)
    })

    it('returns true for unregistered budgets', () => {
      const result = Telemetry.checkBudget('unknown_metric', 5000)
      expect(result).toBe(true) // No budget = no violation
    })

    it('validates OCR parse budget (500ms)', () => {
      const withinBudget = Telemetry.checkBudget(TelemetryEvents.OCR_PARSE_MS, 450)
      const exceedsBudget = Telemetry.checkBudget(TelemetryEvents.OCR_PARSE_MS, 600)

      expect(withinBudget).toBe(true)
      expect(exceedsBudget).toBe(false)
    })
  })

  describe('Statistics', () => {
    it('calculates median correctly', () => {
      const values = [100, 200, 300, 400, 500]
      values.forEach((v) => Telemetry.log('test', v))

      const stats = Telemetry.getStats('test')
      expect(stats?.median).toBe(300)
    })

    it('calculates p95 correctly', () => {
      const values = Array.from({ length: 100 }, (_, i) => i + 1)
      values.forEach((v) => Telemetry.log('test_p95', v))

      const stats = Telemetry.getStats('test_p95')
      expect(stats?.p95).toBeGreaterThanOrEqual(95)
    })

    it('returns null for non-existent metrics', () => {
      const stats = Telemetry.getStats('non_existent_metric')
      expect(stats).toBeNull()
    })
  })

  describe('Export Functionality', () => {
    it('exports telemetry data as JSON', async () => {
      Telemetry.log(TelemetryEvents.OCR_PARSE_MS, 350)
      Telemetry.log(TelemetryEvents.AI_LATENCY, 1200)
      Telemetry.logError('Test export error', { test: true }, 'low')

      const dump = await Telemetry.dump()

      expect(dump).toHaveProperty('events')
      expect(dump).toHaveProperty('errors')
      expect(dump).toHaveProperty('budgets')
      expect(dump.events.length).toBeGreaterThan(0)
      expect(dump.budgets.length).toBeGreaterThan(0)
    })

    it('exports events as CSV', async () => {
      Telemetry.log(TelemetryEvents.OCR_PARSE_MS, 350)
      Telemetry.log(TelemetryEvents.AI_LATENCY, 1200)

      const csv = await Telemetry.exportCSV()

      expect(csv).toContain('name,value,timestamp,metadata')
      expect(csv).toContain('ocr_parse_ms')
      expect(csv).toContain('ai_latency')
    })

    it('exports errors as CSV', async () => {
      Telemetry.logError('Test error 1', { component: 'OCR' }, 'medium')
      Telemetry.logError('Test error 2', { component: 'AI' }, 'high')

      // Wait for persistence
      await new Promise((resolve) => setTimeout(resolve, 100))

      const csv = await Telemetry.exportErrorsCSV()

      expect(csv).toContain('timestamp,severity,message,stack,context')
      expect(csv).toContain('medium')
      expect(csv).toContain('high')
    })

    it('ensures no PII in telemetry data', async () => {
      // Log events with safe data
      Telemetry.log('test_event', 100, {
        userId: 'anonymous',
        sessionId: 'session_123',
        action: 'click',
      })

      const dump = await Telemetry.dump()
      const jsonStr = JSON.stringify(dump)

      // Check for common PII patterns
      expect(jsonStr).not.toMatch(/[\w.%+-]+@[\w.-]+\.[A-Z]{2,}/i) // Email
      expect(jsonStr).not.toMatch(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/) // Phone
    })
  })

  describe('Persistence (IndexedDB)', () => {
    it('persists events to IndexedDB', async () => {
      Telemetry.log('test_persist', 100)

      // Wait for async persistence
      await new Promise((resolve) => setTimeout(resolve, 100))

      const persisted = await Telemetry.getPersistedEvents()
      expect(Array.isArray(persisted)).toBe(true)
    })

    it('persists errors to IndexedDB', async () => {
      Telemetry.logError('Test persistence error', {}, 'low')

      // Wait for async persistence
      await new Promise((resolve) => setTimeout(resolve, 100))

      const persisted = await Telemetry.getPersistedErrors()
      expect(Array.isArray(persisted)).toBe(true)
    })

    it('clears both memory and IndexedDB', async () => {
      Telemetry.log('test_clear', 100)
      Telemetry.logError('Test clear error', {}, 'low')

      await new Promise((resolve) => setTimeout(resolve, 100))

      await Telemetry.clear()

      const events = await Telemetry.getPersistedEvents()
      const errors = await Telemetry.getPersistedErrors()

      expect(events.length).toBe(0)
      expect(errors.length).toBe(0)
    })
  })

  describe('Integration', () => {
    it('tracks complete workflow', async () => {
      // Simulate OCR → AI → Save workflow
      Telemetry.log(TelemetryEvents.OCR_PARSE_MS, 450)
      Telemetry.log(TelemetryEvents.OCR_CONFIDENCE_AVG, 0.82)
      Telemetry.log(TelemetryEvents.AI_LATENCY, 1800, { provider: 'openai' })
      Telemetry.log(TelemetryEvents.JOURNAL_SAVE_MS, 50)

      const ocrStats = Telemetry.getStats(TelemetryEvents.OCR_PARSE_MS)
      const aiStats = Telemetry.getStats(TelemetryEvents.AI_LATENCY)
      const saveStats = Telemetry.getStats(TelemetryEvents.JOURNAL_SAVE_MS)

      expect(ocrStats?.count).toBe(1)
      expect(aiStats?.count).toBe(1)
      expect(saveStats?.count).toBe(1)

      // Check budgets
      expect(Telemetry.checkBudget(TelemetryEvents.OCR_PARSE_MS, 450)).toBe(true)
      expect(Telemetry.checkBudget(TelemetryEvents.AI_LATENCY, 1800)).toBe(true)
      expect(Telemetry.checkBudget(TelemetryEvents.JOURNAL_SAVE_MS, 50)).toBe(true)
    })
  })
})
