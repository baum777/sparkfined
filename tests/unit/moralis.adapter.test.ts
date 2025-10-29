/**
 * Alpha Issue 3: Moralis Adapter (Secondary)
 * Tests for Moralis TokenSnapshot mapping
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mapMoralis, getMoralisToken } from '@/lib/adapters/moralisAdapter'

describe('Moralis adapter', () => {
  describe('mapMoralis', () => {
    it('maps moralis snapshot to TokenSnapshot', () => {
      const raw = {
        tokenSymbol: 'SOL',
        tokenName: 'Solana',
        usdPrice: 151,
        '24hrPercentChange': 5.2,
        volume24h: 1000,
        pairTotalLiquidityUsd: 800,
      }

      const snap = mapMoralis(raw, 'So11111111111111111111111111111111111111112')

      expect(snap.address).toBe('So11111111111111111111111111111111111111112')
      expect(snap.symbol).toBe('SOL')
      expect(snap.name).toBe('Solana')
      expect(snap.price).toBe(151)
      expect(snap.volume24).toBe(1000)
      expect(snap.liquidity).toBe(800)
      expect(snap.provider).toBe('moralis')
      expect(snap.timestamp).toBeLessThanOrEqual(Date.now())
      expect(snap.timestamp).toBeGreaterThan(Date.now() - 1000)
    })

    it('estimates high24/low24 from price change (positive)', () => {
      const raw = {
        tokenSymbol: 'TEST',
        tokenName: 'Test Token',
        usdPrice: 100,
        '24hrPercentChange': 10, // Price went up 10%
      }

      const snap = mapMoralis(raw, 'TestAddr')

      expect(snap.price).toBe(100)
      expect(snap.high24).toBe(100) // Current price is high
      expect(snap.low24).toBeCloseTo(90.91, 1) // 100 / 1.10 ≈ 90.91
    })

    it('estimates high24/low24 from price change (negative)', () => {
      const raw = {
        tokenSymbol: 'TEST',
        tokenName: 'Test Token',
        usdPrice: 100,
        '24hrPercentChange': -10, // Price went down 10%
      }

      const snap = mapMoralis(raw, 'TestAddr')

      expect(snap.price).toBe(100)
      expect(snap.low24).toBe(100) // Current price is low
      expect(snap.high24).toBeCloseTo(111.11, 1) // 100 / 0.90 ≈ 111.11
    })

    it('handles zero price change', () => {
      const raw = {
        tokenSymbol: 'STABLE',
        tokenName: 'Stable Token',
        usdPrice: 1,
        '24hrPercentChange': 0,
      }

      const snap = mapMoralis(raw, 'StableAddr')

      expect(snap.high24).toBe(1)
      expect(snap.low24).toBe(1)
    })

    it('handles missing fields gracefully', () => {
      const raw = {
        // Minimal data
        tokenSymbol: 'MIN',
      }

      const snap = mapMoralis(raw, 'MinAddr')

      expect(snap.symbol).toBe('MIN')
      expect(snap.name).toBe('Unknown Token')
      expect(snap.price).toBe(0)
      expect(snap.high24).toBe(0)
      expect(snap.low24).toBe(0)
      expect(snap.volume24).toBe(0)
      expect(snap.liquidity).toBe(0)
      expect(snap.provider).toBe('moralis')
    })

    it('handles completely empty response', () => {
      const raw = {}

      const snap = mapMoralis(raw, 'EmptyAddr')

      expect(snap.symbol).toBe('UNKNOWN')
      expect(snap.name).toBe('Unknown Token')
      expect(snap.price).toBe(0)
      expect(snap.volume24).toBe(0)
      expect(snap.liquidity).toBe(0)
      expect(snap.provider).toBe('moralis')
    })

    it('parses string numeric values', () => {
      const raw = {
        tokenSymbol: 'STR',
        tokenName: 'String Token',
        usdPrice: '123.45',
        '24hrPercentChange': '2.5',
        volume24h: '50000',
        pairTotalLiquidityUsd: '100000',
      }

      const snap = mapMoralis(raw, 'StrAddr')

      expect(snap.price).toBe(123.45)
      expect(snap.volume24).toBe(50000)
      expect(snap.liquidity).toBe(100000)
    })

    it('handles invalid numeric strings', () => {
      const raw = {
        tokenSymbol: 'INV',
        usdPrice: 'not-a-number',
        volume24h: 'invalid',
      }

      const snap = mapMoralis(raw, 'InvAddr')

      expect(snap.price).toBe(0)
      expect(snap.volume24).toBe(0)
    })

    it('uses numeric zero values correctly', () => {
      const raw = {
        tokenSymbol: 'ZERO',
        tokenName: 'Zero Token',
        usdPrice: 0,
        volume24h: 0,
        pairTotalLiquidityUsd: 0,
      }

      const snap = mapMoralis(raw, 'ZeroAddr')

      expect(snap.price).toBe(0)
      expect(snap.volume24).toBe(0)
      expect(snap.liquidity).toBe(0)
    })
  })

  describe('getMoralisToken', () => {
    beforeEach(() => {
      vi.resetAllMocks()
    })

    it('fetches and maps token successfully', async () => {
      // Mock the internal fetchMoralisPrice function
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          tokenSymbol: 'USDC',
          tokenName: 'USD Coin',
          usdPrice: 1.0,
          '24hrPercentChange': 0.1,
          volume24h: 5000000,
          pairTotalLiquidityUsd: 10000000,
        }),
      })
      global.fetch = mockFetch

      const snap = await getMoralisToken('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')

      expect(snap.symbol).toBe('USDC')
      expect(snap.name).toBe('USD Coin')
      expect(snap.price).toBe(1.0)
      expect(snap.provider).toBe('moralis')
    })

    it('throws error on network failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(
        getMoralisToken('FailAddress')
      ).rejects.toThrow('Moralis fetch failed')
    }, 10000)

    it('throws error on 404 not found', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(
        getMoralisToken('NotFoundAddress')
      ).rejects.toThrow('Moralis fetch failed')
    }, 10000)

    it('handles malformed response gracefully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          // Missing most fields
        }),
      })

      const snap = await getMoralisToken('MalformedAddress')

      expect(snap.symbol).toBe('UNKNOWN')
      expect(snap.price).toBe(0)
      expect(snap.provider).toBe('moralis')
    })
  })

  describe('type safety and validation', () => {
    it('returns TokenSnapshot with all required fields', () => {
      const raw = {
        tokenSymbol: 'SAFE',
        tokenName: 'Safe Token',
        usdPrice: 10,
      }

      const snap = mapMoralis(raw, 'SafeAddr')

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

    it('provider is always moralis', () => {
      const snap = mapMoralis({}, 'Addr')
      expect(snap.provider).toBe('moralis')
    })
  })
})
