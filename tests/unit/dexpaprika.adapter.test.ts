/**
 * Alpha Issue 2: DexPaprika Adapter (Primary)
 * Tests for DexPaprika TokenSnapshot mapping
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mapDexPaprika, getDexPaprikaToken } from '@/lib/adapters/dexpaprikaAdapter'

describe('DexPaprika adapter', () => {
  describe('mapDexPaprika', () => {
    it('maps happy path with all fields', () => {
      const raw = {
        symbol: 'SOL',
        name: 'Solana',
        priceUsd: 150,
        ohlcv: {
          h24: {
            high: 155,
            low: 140,
          },
        },
        volume24h: 123456,
        pool: {
          liquidity: 999000,
        },
      }

      const snap = mapDexPaprika(raw, 'So11111111111111111111111111111111111111112')

      expect(snap.address).toBe('So11111111111111111111111111111111111111112')
      expect(snap.symbol).toBe('SOL')
      expect(snap.name).toBe('Solana')
      expect(snap.price).toBe(150)
      expect(snap.high24).toBe(155)
      expect(snap.low24).toBe(140)
      expect(snap.volume24).toBe(123456)
      expect(snap.liquidity).toBe(999000)
      expect(snap.provider).toBe('dexpaprika')
      expect(snap.timestamp).toBeLessThanOrEqual(Date.now())
      expect(snap.timestamp).toBeGreaterThan(Date.now() - 1000)
    })

    it('handles missing ohlcv fields (shape drift)', () => {
      const raw = {
        symbol: 'BONK',
        name: 'Bonk',
        priceUsd: 0.00001234,
        // No ohlcv field
        volume24h: 50000,
        pool: {
          liquidity: 250000,
        },
      }

      const snap = mapDexPaprika(raw, 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263')

      expect(snap.price).toBe(0.00001234)
      expect(snap.high24).toBe(0.00001234) // Falls back to price
      expect(snap.low24).toBe(0.00001234) // Falls back to price
      expect(snap.volume24).toBe(50000)
      expect(snap.liquidity).toBe(250000)
    })

    it('handles missing pool/liquidity fields', () => {
      const raw = {
        symbol: 'TEST',
        name: 'Test Token',
        priceUsd: 1.5,
        ohlcv: {
          h24: {
            high: 1.8,
            low: 1.2,
          },
        },
        volume24h: 10000,
        // No pool field
      }

      const snap = mapDexPaprika(raw, 'TestAddress123')

      expect(snap.liquidity).toBe(0) // Defaults to 0
      expect(snap.price).toBe(1.5)
      expect(snap.high24).toBe(1.8)
      expect(snap.low24).toBe(1.2)
    })

    it('handles completely missing optional fields', () => {
      const raw = {
        // Minimal data - all optionals missing
      }

      const snap = mapDexPaprika(raw, 'MinimalAddress')

      expect(snap.symbol).toBe('UNKNOWN')
      expect(snap.name).toBe('Unknown Token')
      expect(snap.price).toBe(0)
      expect(snap.high24).toBe(0)
      expect(snap.low24).toBe(0)
      expect(snap.volume24).toBe(0)
      expect(snap.liquidity).toBe(0)
      expect(snap.provider).toBe('dexpaprika')
    })

    it('handles partial ohlcv (only high or only low)', () => {
      const rawOnlyHigh = {
        symbol: 'HALF',
        name: 'Half Data',
        priceUsd: 100,
        ohlcv: {
          h24: {
            high: 110,
            // No low
          },
        },
      }

      const snap1 = mapDexPaprika(rawOnlyHigh, 'Addr1')
      expect(snap1.high24).toBe(110)
      expect(snap1.low24).toBe(100) // Falls back to price

      const rawOnlyLow = {
        symbol: 'HALF',
        name: 'Half Data',
        priceUsd: 100,
        ohlcv: {
          h24: {
            low: 90,
            // No high
          },
        },
      }

      const snap2 = mapDexPaprika(rawOnlyLow, 'Addr2')
      expect(snap2.high24).toBe(100) // Falls back to price
      expect(snap2.low24).toBe(90)
    })

    it('uses numeric zero values correctly (not falsy)', () => {
      const raw = {
        symbol: 'ZERO',
        name: 'Zero Token',
        priceUsd: 0, // Explicitly 0
        volume24h: 0,
        pool: {
          liquidity: 0,
        },
      }

      const snap = mapDexPaprika(raw, 'ZeroAddr')

      // Should preserve 0 values, not treat as missing
      expect(snap.price).toBe(0)
      expect(snap.volume24).toBe(0)
      expect(snap.liquidity).toBe(0)
    })
  })

  describe('getDexPaprikaToken', () => {
    beforeEach(() => {
      // Reset fetch mocks before each test
      vi.resetAllMocks()
    })

    it('fetches and maps token successfully', async () => {
      // Mock fetch for happy path
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          symbol: 'JUP',
          name: 'Jupiter',
          priceUsd: 1.23,
          ohlcv: {
            h24: {
              high: 1.35,
              low: 1.15,
            },
          },
          volume24h: 5000000,
          pool: {
            liquidity: 10000000,
          },
        }),
      })

      const snap = await getDexPaprikaToken('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN')

      expect(snap.symbol).toBe('JUP')
      expect(snap.name).toBe('Jupiter')
      expect(snap.price).toBe(1.23)
      expect(snap.high24).toBe(1.35)
      expect(snap.low24).toBe(1.15)
      expect(snap.volume24).toBe(5000000)
      expect(snap.liquidity).toBe(10000000)
      expect(snap.provider).toBe('dexpaprika')
    })

    it('throws error on network failure', async () => {
      // Mock fetch to fail
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(
        getDexPaprikaToken('FailAddress')
      ).rejects.toThrow('DexPaprika fetch failed')
    }, 10000) // Increase timeout to account for retries with backoff

    it('throws error on 404 not found', async () => {
      // Mock fetch to return 404
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(
        getDexPaprikaToken('NotFoundAddress')
      ).rejects.toThrow('DexPaprika fetch failed')
    }, 10000) // Increase timeout to account for retries with backoff

    it('handles malformed response gracefully', async () => {
      // Mock fetch to return empty/malformed data
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          // Missing all expected fields
        }),
      })

      const snap = await getDexPaprikaToken('MalformedAddress')

      // Should still return a valid TokenSnapshot with defaults
      expect(snap.symbol).toBe('UNKNOWN')
      expect(snap.price).toBe(0)
      expect(snap.provider).toBe('dexpaprika')
    })

    it('uses correct API endpoint path', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          symbol: 'TEST',
          priceUsd: 1,
        }),
      })
      global.fetch = mockFetch

      await getDexPaprikaToken('TestAddr123')

      // Verify fetch was called with correct edge proxy URL
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/dexpaprika/tokens/TestAddr123',
        expect.any(Object)
      )
    })
  })

  describe('type safety and validation', () => {
    it('returns TokenSnapshot with all required fields', () => {
      const raw = {
        symbol: 'SAFE',
        name: 'Safe Token',
        priceUsd: 10,
      }

      const snap = mapDexPaprika(raw, 'SafeAddr')

      // Type check - should have all TokenSnapshot fields
      const requiredFields: (keyof typeof snap)[] = [
        'address',
        'symbol',
        'name',
        'price',
        'high24',
        'low24',
        'volume24',
        'liquidity',
        'timestamp',
        'provider',
      ]

      requiredFields.forEach((field) => {
        expect(snap).toHaveProperty(field)
      })
    })

    it('provider is always dexpaprika', () => {
      const snap = mapDexPaprika({}, 'Addr')
      expect(snap.provider).toBe('dexpaprika')
    })
  })
})
