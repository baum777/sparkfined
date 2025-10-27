/**
 * Heuristic Analysis Tests
 */

import { describe, it, expect } from 'vitest'
import { performHeuristicAnalysis } from '../heuristicAnalysis'
import type { MarketData } from '../marketData'

describe('Heuristic Analysis', () => {
  const mockMarketData: MarketData = {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    address: 'test_address',
    chain: 'solana',
    price: 42850,
    priceChange24h: 3.5,
    priceChange1h: 0.8,
    volume24h: 1250000,
    liquidity: 850000,
    marketCap: 840000000000,
    high24h: 43500,
    low24h: 42100,
    open24h: 42500,
    timestamp: Date.now(),
    source: 'mock',
  }

  it('should calculate support and resistance levels', () => {
    const result = performHeuristicAnalysis({ marketData: mockMarketData })
    
    expect(result.supportLevel).toBeDefined()
    expect(result.resistanceLevel).toBeDefined()
    expect(result.supportLevel).toBeLessThan(result.resistanceLevel)
    expect(result.supportLevel).toBeLessThanOrEqual(mockMarketData.low24h)
    expect(result.resistanceLevel).toBeGreaterThanOrEqual(mockMarketData.high24h)
  })

  it('should determine bullish bias for rising market', () => {
    const bullishData: MarketData = {
      ...mockMarketData,
      priceChange24h: 8.5,
    }
    
    const result = performHeuristicAnalysis({ marketData: bullishData })
    expect(result.bias).toBe('Bullish')
  })

  it('should determine bearish bias for falling market', () => {
    const bearishData: MarketData = {
      ...mockMarketData,
      priceChange24h: -7.2,
    }
    
    const result = performHeuristicAnalysis({ marketData: bearishData })
    expect(result.bias).toBe('Bearish')
  })

  it('should calculate volatility', () => {
    const result = performHeuristicAnalysis({ marketData: mockMarketData })
    
    expect(result.volatility24h).toBeGreaterThan(0)
    expect(result.volatility24h).toBeLessThan(100)
  })

  it('should determine range size', () => {
    const result = performHeuristicAnalysis({ marketData: mockMarketData })
    
    expect(['Low', 'Medium', 'High']).toContain(result.rangeSize)
  })

  it('should calculate entry/exit zones', () => {
    const result = performHeuristicAnalysis({ marketData: mockMarketData })
    
    if (result.entryZone) {
      expect(result.entryZone.min).toBeLessThan(result.entryZone.max)
    }
    
    if (result.stopLoss) {
      expect(result.stopLoss).toBeGreaterThan(0)
    }
    
    if (result.takeProfit1) {
      expect(result.takeProfit1).toBeGreaterThan(0)
    }
  })

  it('should have confidence score between 0 and 1', () => {
    const result = performHeuristicAnalysis({ marketData: mockMarketData })
    
    expect(result.confidence).toBeGreaterThanOrEqual(0)
    expect(result.confidence).toBeLessThanOrEqual(1)
  })

  it('should calculate key fibonacci levels', () => {
    const result = performHeuristicAnalysis({ marketData: mockMarketData })
    
    expect(Array.isArray(result.keyLevels)).toBe(true)
    
    result.keyLevels.forEach(level => {
      expect(level).toBeGreaterThan(0)
      expect(level).toBeGreaterThan(result.supportLevel)
      expect(level).toBeLessThan(result.resistanceLevel)
    })
  })

  it('should handle low liquidity markets', () => {
    const lowLiquidityData: MarketData = {
      ...mockMarketData,
      liquidity: 10000,
    }
    
    const result = performHeuristicAnalysis({ marketData: lowLiquidityData })
    
    // Lower liquidity should reduce confidence
    expect(result.confidence).toBeLessThan(0.8)
  })
})
