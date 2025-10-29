/**
 * Alpha Issue 4: Provider Muxing + SWR Cache
 * Token snapshot retrieval with provider fallback
 */

import type { TokenSnapshot, TokenSnapshotWithMeta, ProviderMetadata } from '@/types/data';
import { pickProvider } from '@/lib/config/flags';
import { getDexPaprikaToken } from '@/lib/adapters/dexpaprikaAdapter';
import { getMoralisToken } from '@/lib/adapters/moralisAdapter';
import { Telemetry } from '@/lib/TelemetryService';

// Simple in-memory cache with TTL
interface CacheEntry {
  snapshot: TokenSnapshot;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 300 * 1000; // 300s = 5min

/**
 * Get token snapshot with provider muxing (Primary -> Secondary)
 * @param address - Solana token address
 * @returns TokenSnapshot with provider metadata
 *
 * Strategy:
 * 1. Try primary provider (DexPaprika by default)
 * 2. On error, fall back to secondary provider (Moralis by default)
 * 3. Cache successful results for 300s
 * 4. Log telemetry events for provider selection and latency
 */
export async function getTokenSnapshot(
  address: string
): Promise<TokenSnapshotWithMeta> {
  const config = pickProvider();
  const startTime = performance.now();

  // Check cache first
  const cached = cache.get(address);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    const age = Math.floor((Date.now() - cached.timestamp) / 1000);
    Telemetry.log('snapshot_cache_hit', age, { provider: cached.snapshot.provider });
    
    return {
      snapshot: cached.snapshot,
      meta: {
        provider: cached.snapshot.provider,
        timestamp: cached.timestamp,
        latencyMs: performance.now() - startTime,
        cached: true,
        fallback: false,
      },
    };
  }

  let snapshot: TokenSnapshot | null = null;
  let usedFallback = false;
  let lastError: Error | undefined;

  // Try primary provider
  if (config.primary === 'dexpaprika') {
    try {
      snapshot = await getDexPaprikaToken(address);
      const latency = performance.now() - startTime;
      Telemetry.log('provider_success', latency, { provider: 'dexpaprika', fallback: false });
    } catch (error) {
      lastError = error as Error;
      Telemetry.log('provider_failure', 0, { 
        provider: 'dexpaprika', 
        error: lastError.message 
      });
    }
  } else if (config.primary === 'moralis') {
    try {
      snapshot = await getMoralisToken(address);
      const latency = performance.now() - startTime;
      Telemetry.log('provider_success', latency, { provider: 'moralis', fallback: false });
    } catch (error) {
      lastError = error as Error;
      Telemetry.log('provider_failure', 0, { 
        provider: 'moralis', 
        error: lastError.message 
      });
    }
  }

  // Try secondary provider on primary failure
  if (!snapshot && config.secondary !== 'none') {
    usedFallback = true;
    
    if (config.secondary === 'moralis') {
      try {
        snapshot = await getMoralisToken(address);
        const latency = performance.now() - startTime;
        Telemetry.log('provider_success', latency, { provider: 'moralis', fallback: true });
        Telemetry.log('provider_fallback', latency, { 
          from: config.primary, 
          to: 'moralis' 
        });
      } catch (error) {
        lastError = error as Error;
        Telemetry.log('provider_failure', 0, { 
          provider: 'moralis', 
          error: lastError.message,
          fallback: true 
        });
      }
    } else if (config.secondary === 'dexpaprika') {
      try {
        snapshot = await getDexPaprikaToken(address);
        const latency = performance.now() - startTime;
        Telemetry.log('provider_success', latency, { provider: 'dexpaprika', fallback: true });
        Telemetry.log('provider_fallback', latency, { 
          from: config.primary, 
          to: 'dexpaprika' 
        });
      } catch (error) {
        lastError = error as Error;
        Telemetry.log('provider_failure', 0, { 
          provider: 'dexpaprika', 
          error: lastError.message,
          fallback: true 
        });
      }
    }
  }

  // If both failed, throw error
  if (!snapshot) {
    const totalLatency = performance.now() - startTime;
    Telemetry.log('snapshot_failure', totalLatency, { 
      primary: config.primary,
      secondary: config.secondary,
      error: lastError?.message 
    });
    throw new Error(`Failed to fetch token snapshot: ${lastError?.message || 'All providers failed'}`);
  }

  // Cache successful result
  cache.set(address, {
    snapshot,
    timestamp: Date.now(),
  });

  // Log snapshot age telemetry
  const snapshotAge = Math.floor((Date.now() - snapshot.timestamp) / 1000);
  Telemetry.log('snapshot_age_s', snapshotAge, { provider: snapshot.provider });

  const totalLatency = performance.now() - startTime;
  
  const meta: ProviderMetadata = {
    provider: snapshot.provider,
    timestamp: Date.now(),
    latencyMs: totalLatency,
    cached: false,
    fallback: usedFallback,
  };

  return {
    snapshot,
    meta,
  };
}

/**
 * Clear snapshot cache for a specific address or all
 * @param address - Optional address to clear, or undefined for all
 */
export function clearSnapshotCache(address?: string): void {
  if (address) {
    cache.delete(address);
  } else {
    cache.clear();
  }
}
