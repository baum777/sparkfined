/**
 * Market Data Tests
 */

import { describe, it, expect } from 'vitest'
import { 
  fetchMarketData, 
  formatPrice, 
  formatLargeNumber,
  calculatePriceChange,
  isPumpFunToken,
  clearMarketDataCache,
  getCacheSize,
} from '../marketData'

describe('Market Data', () => {
  it('should fetch market data for valid CA', async () => {
    const ca = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
    const data = await fetchMarketData(ca)
    
    expect(data).toBeDefined()
    expect(data.address).toBe(ca)
    expect(data.price).toBeGreaterThan(0)
    expect(data.chain).toBe('solana')
  })

  it('should cache market data', async () => {
    clearMarketDataCache()
    
    const ca = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
    
    // First fetch
    const data1 = await fetchMarketData(ca)
    expect(data1.cached).toBeUndefined()
    expect(getCacheSize()).toBe(1)
    
    // Second fetch should be from cache
    const data2 = await fetchMarketData(ca)
    expect(data2.cached).toBe(true)
    expect(getCacheSize()).toBe(1)
  })

  it('should format prices correctly', () => {
    expect(formatPrice(42850.12345)).toBe('42,850.12')
    expect(formatPrice(0.000123)).toBe('0.0001230')
    expect(formatPrice(0.00000001)).toBe('1.00e-8')
  })

  it('should format large numbers with suffixes', () => {
    expect(formatLargeNumber(1_500_000_000)).toBe('1.50B')
    expect(formatLargeNumber(42_500_000)).toBe('42.50M')
    expect(formatLargeNumber(125_000)).toBe('125.00K')
    expect(formatLargeNumber(500)).toBe('500.00')
  })

  it('should calculate price change percentage', () => {
    expect(calculatePriceChange(110, 100)).toBe(10)
    expect(calculatePriceChange(90, 100)).toBe(-10)
    expect(calculatePriceChange(100, 100)).toBe(0)
    expect(calculatePriceChange(100, 0)).toBe(0)
  })

  it('should identify pump.fun tokens', async () => {
    const lowLiquidityCA = 'test_low_liquidity'
    const data = await fetchMarketData(lowLiquidityCA)
    
    // Manually set low liquidity and high volatility
    data.liquidity = 20000
    data.priceChange24h = 35
    
    expect(isPumpFunToken(data)).toBe(true)
  })

  it('should handle mock data generation', async () => {
    const ca = 'mock_token_12345'
    const data = await fetchMarketData(ca)
    
    expect(data.source).toBe('mock')
    expect(data.symbol).toContain('SOL-')
    expect(data.high24h).toBeGreaterThanOrEqual(data.price)
    expect(data.low24h).toBeLessThanOrEqual(data.price)
  })
})
