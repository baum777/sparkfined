/**
 * Alpha Issue 4: Provider Muxing + SWR Cache
 * Tests for provider fallback logic
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTokenSnapshot, clearSnapshotCache } from '@/lib/data/getTokenSnapshot'
import * as dexpaprikaAdapter from '@/lib/adapters/dexpaprikaAdapter'
import * as moralisAdapter from '@/lib/adapters/moralisAdapter'
import type { TokenSnapshot } from '@/types/data'

// Mock config to control provider selection
vi.mock('@/lib/config/flags', () => ({
  pickProvider: () => ({
    primary: 'dexpaprika',
    secondary: 'moralis',
    ai: 'none',
  }),
}))

describe('Provider Muxing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearSnapshotCache() // Clear cache between tests
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses primary provider when available', async () => {
    const mockSnapshot: TokenSnapshot = {
      address: 'So11111111111111111111111111111111111111112',
      symbol: 'SOL',
      name: 'Solana',
      price: 150,
      high24: 155,
      low24: 145,
      volume24: 1000000,
      liquidity: 5000000,
      timestamp: Date.now(),
      provider: 'dexpaprika',
    }

    // Mock primary provider success
    vi.spyOn(dexpaprikaAdapter, 'getDexPaprikaToken').mockResolvedValue(mockSnapshot)

    const result = await getTokenSnapshot('So11111111111111111111111111111111111111112')

    expect(result.snapshot.provider).toBe('dexpaprika')
    expect(result.meta.fallback).toBe(false)
    expect(result.meta.cached).toBe(false)
    expect(dexpaprikaAdapter.getDexPaprikaToken).toHaveBeenCalledTimes(1)
  })

  it('falls back to secondary on primary error', async () => {
    const mockSnapshot: TokenSnapshot = {
      address: 'So11111111111111111111111111111111111111112',
      symbol: 'SOL',
      name: 'Solana',
      price: 151,
      high24: 156,
      low24: 146,
      volume24: 900000,
      liquidity: 4500000,
      timestamp: Date.now(),
      provider: 'moralis',
    }

    // Mock primary fail, secondary success
    vi.spyOn(dexpaprikaAdapter, 'getDexPaprikaToken').mockRejectedValue(
      new Error('DexPaprika API error')
    )
    vi.spyOn(moralisAdapter, 'getMoralisToken').mockResolvedValue(mockSnapshot)

    const result = await getTokenSnapshot('So11111111111111111111111111111111111111112')

    expect(result.snapshot.provider).toBe('moralis')
    expect(result.meta.fallback).toBe(true)
    expect(dexpaprikaAdapter.getDexPaprikaToken).toHaveBeenCalledTimes(1)
    expect(moralisAdapter.getMoralisToken).toHaveBeenCalledTimes(1)
  }, 20000) // Extended timeout for retries

  it('throws error when both providers fail', async () => {
    // Mock both providers failing
    vi.spyOn(dexpaprikaAdapter, 'getDexPaprikaToken').mockRejectedValue(
      new Error('DexPaprika API error')
    )
    vi.spyOn(moralisAdapter, 'getMoralisToken').mockRejectedValue(
      new Error('Moralis API error')
    )

    await expect(
      getTokenSnapshot('So11111111111111111111111111111111111111112')
    ).rejects.toThrow('Failed to fetch token snapshot')

    expect(dexpaprikaAdapter.getDexPaprikaToken).toHaveBeenCalledTimes(1)
    expect(moralisAdapter.getMoralisToken).toHaveBeenCalledTimes(1)
  }, 20000) // Extended timeout for retries

  it('caches results for subsequent requests', async () => {
    const mockSnapshot: TokenSnapshot = {
      address: 'TestAddr123',
      symbol: 'TEST',
      name: 'Test Token',
      price: 100,
      high24: 110,
      low24: 90,
      volume24: 50000,
      liquidity: 200000,
      timestamp: Date.now(),
      provider: 'dexpaprika',
    }

    vi.spyOn(dexpaprikaAdapter, 'getDexPaprikaToken').mockResolvedValue(mockSnapshot)

    // First call - should hit adapter
    const result1 = await getTokenSnapshot('TestAddr123')
    expect(result1.meta.cached).toBe(false)
    expect(dexpaprikaAdapter.getDexPaprikaToken).toHaveBeenCalledTimes(1)

    // Second call - should hit cache
    const result2 = await getTokenSnapshot('TestAddr123')
    expect(result2.meta.cached).toBe(true)
    expect(result2.snapshot.provider).toBe('dexpaprika')
    // Adapter should not be called again
    expect(dexpaprikaAdapter.getDexPaprikaToken).toHaveBeenCalledTimes(1)
  })

  it('bypasses cache after clearSnapshotCache', async () => {
    const mockSnapshot: TokenSnapshot = {
      address: 'TestAddr456',
      symbol: 'TEST2',
      name: 'Test Token 2',
      price: 50,
      high24: 55,
      low24: 45,
      volume24: 30000,
      liquidity: 150000,
      timestamp: Date.now(),
      provider: 'dexpaprika',
    }

    vi.spyOn(dexpaprikaAdapter, 'getDexPaprikaToken').mockResolvedValue(mockSnapshot)

    // First call
    await getTokenSnapshot('TestAddr456')
    expect(dexpaprikaAdapter.getDexPaprikaToken).toHaveBeenCalledTimes(1)

    // Clear cache
    clearSnapshotCache('TestAddr456')

    // Second call should hit adapter again
    await getTokenSnapshot('TestAddr456')
    expect(dexpaprikaAdapter.getDexPaprikaToken).toHaveBeenCalledTimes(2)
  })

  it('clears all cache entries when no address specified', async () => {
    const mockSnapshot1: TokenSnapshot = {
      address: 'Addr1',
      symbol: 'T1',
      name: 'Token 1',
      price: 10,
      high24: 11,
      low24: 9,
      volume24: 1000,
      liquidity: 10000,
      timestamp: Date.now(),
      provider: 'dexpaprika',
    }

    const mockSnapshot2: TokenSnapshot = {
      address: 'Addr2',
      symbol: 'T2',
      name: 'Token 2',
      price: 20,
      high24: 22,
      low24: 18,
      volume24: 2000,
      liquidity: 20000,
      timestamp: Date.now(),
      provider: 'dexpaprika',
    }

    vi.spyOn(dexpaprikaAdapter, 'getDexPaprikaToken')
      .mockResolvedValueOnce(mockSnapshot1)
      .mockResolvedValueOnce(mockSnapshot2)
      .mockResolvedValueOnce(mockSnapshot1)
      .mockResolvedValueOnce(mockSnapshot2)

    // Cache two different addresses
    await getTokenSnapshot('Addr1')
    await getTokenSnapshot('Addr2')
    expect(dexpaprikaAdapter.getDexPaprikaToken).toHaveBeenCalledTimes(2)

    // Clear all cache
    clearSnapshotCache()

    // Both should hit adapter again
    await getTokenSnapshot('Addr1')
    await getTokenSnapshot('Addr2')
    expect(dexpaprikaAdapter.getDexPaprikaToken).toHaveBeenCalledTimes(4)
  })

  it('includes latency metadata', async () => {
    const mockSnapshot: TokenSnapshot = {
      address: 'LatencyTest',
      symbol: 'LAT',
      name: 'Latency Token',
      price: 75,
      high24: 80,
      low24: 70,
      volume24: 25000,
      liquidity: 100000,
      timestamp: Date.now(),
      provider: 'dexpaprika',
    }

    vi.spyOn(dexpaprikaAdapter, 'getDexPaprikaToken').mockResolvedValue(mockSnapshot)

    const result = await getTokenSnapshot('LatencyTest')

    expect(result.meta.latencyMs).toBeGreaterThanOrEqual(0)
    expect(result.meta.timestamp).toBeLessThanOrEqual(Date.now())
    expect(result.meta.timestamp).toBeGreaterThan(Date.now() - 1000)
  })
})
