/**
 * Alpha Issue 6: Heuristic Fallback
 * Local deterministic analysis without AI
 */

import type { TokenSnapshot } from '@/types/data';

export interface HeuristicResult {
  sr_levels: Array<{ label: string; price: number }>;
  stop_loss: number;
  take_profit: number[];
  confidence: number;
  timestamp: number;
}

/**
 * Seeded pseudo-random number generator (for deterministic S/R levels)
 * Uses price as seed for consistent results
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/**
 * Calculate support/resistance levels using price action
 * @param snapshot - Token snapshot data
 * @returns Heuristic analysis result
 *
 * Strategy:
 * - S/R levels: ±(1.5-3.5)% around current price
 * - Stop Loss: -5% from current price
 * - Take Profit: +5%, +10% from current price
 * - Deterministic: Uses price as seed for consistent results
 * - Performance: <300ms execution time
 */
export function heuristic(snapshot: TokenSnapshot): HeuristicResult {
  const { price, high24, low24 } = snapshot

  // Use price range to inform S/R calculation
  const range24 = high24 - low24
  const midRange = (high24 + low24) / 2
  
  // Seeded randomness for S/R variance (1.5-3.5%)
  // Use price * 1000 as integer seed for determinism
  const seed = Math.floor(price * 1000)
  const r1Offset = 0.015 + seededRandom(seed) * 0.02 // 1.5-3.5%
  const r2Offset = 0.02 + seededRandom(seed + 1) * 0.015 // 2.0-3.5%
  const s1Offset = 0.015 + seededRandom(seed + 2) * 0.02 // 1.5-3.5%
  const s2Offset = 0.02 + seededRandom(seed + 3) * 0.015 // 2.0-3.5%

  // Calculate S/R levels around mid-range (or current price if range is small)
  const basePrice = range24 > price * 0.05 ? midRange : price
  
  const r1 = basePrice * (1 + r1Offset)
  const r2 = basePrice * (1 + r2Offset)
  const s1 = basePrice * (1 - s1Offset)
  const s2 = basePrice * (1 - s2Offset)

  // Stop Loss: -5% from current price
  const stop_loss = price * 0.95

  // Take Profit: +5%, +10% from current price
  const tp1 = price * 1.05
  const tp2 = price * 1.10
  const take_profit = [tp1, tp2]

  // Confidence based on data quality
  let confidence = 0.6
  if (range24 > 0 && snapshot.volume24 > 0) {
    confidence = 0.7
  }
  if (snapshot.liquidity > snapshot.volume24) {
    confidence = Math.min(0.8, confidence + 0.1)
  }

  return {
    sr_levels: [
      { label: 'R2', price: r2 },
      { label: 'R1', price: r1 },
      { label: 'S1', price: s1 },
      { label: 'S2', price: s2 },
    ],
    stop_loss,
    take_profit,
    confidence,
    timestamp: Date.now(),
  }
}
