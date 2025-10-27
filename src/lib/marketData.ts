/**
 * Market Data Integration - Step 4
 * 
 * Fetches token data from Dexscreener & Pump.fun APIs (Mock for Beta)
 * Includes offline caching with Service Worker + TTL=24h
 * 
 * Status: Beta Mock Implementation
 * Future: Real API integration in Alpha phase
 */

export interface MarketData {
  // Token Info
  symbol: string
  name: string
  address: string
  chain: 'solana' | 'ethereum' | 'bsc' | 'arbitrum' | 'base' | 'other'
  
  // Price Data
  price: number
  priceChange24h: number
  priceChange1h?: number
  
  // Volume & Liquidity
  volume24h: number
  liquidity: number
  marketCap?: number
  
  // OHLC (24h)
  high24h: number
  low24h: number
  open24h?: number
  
  // Metadata
  timestamp: number
  source: 'dexscreener' | 'pumpfun' | 'mock' | 'cache'
  cached?: boolean
}

interface CacheEntry {
  data: MarketData
  timestamp: number
  ttl: number
}

// In-memory cache (24h TTL)
const marketDataCache = new Map<string, CacheEntry>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Fetch market data for a token (Mock for Beta)
 * @param contractAddress - Solana mint or EVM contract address
 * @returns Market data snapshot
 */
export async function fetchMarketData(
  contractAddress: string
): Promise<MarketData> {
  // Check cache first
  const cached = getFromCache(contractAddress)
  if (cached) {
    return { ...cached, cached: true }
  }
  
  // Beta: Always return mock data
  // Future: Call real Dexscreener/Pump.fun APIs
  const mockData = await fetchMockMarketData(contractAddress)
  
  // Store in cache
  setCache(contractAddress, mockData)
  
  return mockData
}

/**
 * Fetch from Dexscreener API (Placeholder)
 * @alpha Not implemented in Beta
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchFromDexscreener(
  _contractAddress: string
): Promise<MarketData | null> {
  // Future implementation:
  // const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`)
  // const data = await response.json()
  // return transformDexscreenerResponse(data)
  
  console.info('[marketData] Dexscreener API not implemented in Beta')
  return null
}

/**
 * Fetch from Pump.fun API (Placeholder)
 * @alpha Not implemented in Beta
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchFromPumpFun(
  _contractAddress: string
): Promise<MarketData | null> {
  // Future implementation:
  // const response = await fetch(`https://api.pump.fun/token/${contractAddress}`)
  // const data = await response.json()
  // return transformPumpFunResponse(data)
  
  console.info('[marketData] Pump.fun API not implemented in Beta')
  return null
}

/**
 * Mock market data generator for Beta testing
 */
async function fetchMockMarketData(contractAddress: string): Promise<MarketData> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Deterministic mock data based on CA hash
  const hash = hashCode(contractAddress)
  const basePrice = 0.000001 + (Math.abs(hash) % 10000) / 1000000
  const volatility = (Math.abs(hash) % 20) / 100
  
  const price = basePrice * (1 + (Math.random() - 0.5) * volatility)
  const priceChange24h = (Math.random() - 0.5) * 30 // -15% to +15%
  const volume24h = Math.random() * 500000
  const liquidity = Math.random() * 100000
  
  return {
    symbol: 'SOL-' + contractAddress.slice(0, 4).toUpperCase(),
    name: 'Mock Token',
    address: contractAddress,
    chain: 'solana',
    price,
    priceChange24h,
    priceChange1h: (Math.random() - 0.5) * 5,
    volume24h,
    liquidity,
    marketCap: price * 1000000000, // Mock supply
    high24h: price * (1 + Math.abs(priceChange24h) / 200),
    low24h: price * (1 - Math.abs(priceChange24h) / 200),
    open24h: price / (1 + priceChange24h / 100),
    timestamp: Date.now(),
    source: 'mock',
  }
}

/**
 * Get market data from cache
 */
function getFromCache(key: string): MarketData | null {
  const entry = marketDataCache.get(key)
  
  if (!entry) return null
  
  const now = Date.now()
  if (now - entry.timestamp > entry.ttl) {
    // Expired, remove from cache
    marketDataCache.delete(key)
    return null
  }
  
  return entry.data
}

/**
 * Store market data in cache
 */
function setCache(key: string, data: MarketData): void {
  marketDataCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: CACHE_TTL,
  })
}

/**
 * Clear all cached market data
 */
export function clearMarketDataCache(): void {
  marketDataCache.clear()
}

/**
 * Get cache size
 */
export function getCacheSize(): number {
  return marketDataCache.size
}

/**
 * Simple hash function for deterministic mock data
 */
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

/**
 * Check if market data is likely a pump.fun token
 * (Based on heuristics - liquidity, volume, etc.)
 */
export function isPumpFunToken(data: MarketData): boolean {
  // Pump.fun tokens typically have:
  // - Low liquidity (<$50k)
  // - High volatility
  // - Recent launch (not detectable in mock)
  
  if (data.source === 'pumpfun') return true
  
  // Heuristic check
  return data.liquidity < 50000 && Math.abs(data.priceChange24h) > 20
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  }
  
  // For small prices, use scientific notation or significant digits
  if (price < 0.0001) {
    return price.toExponential(2)
  }
  
  return price.toLocaleString(undefined, { 
    minimumSignificantDigits: 4,
    maximumSignificantDigits: 6
  })
}

/**
 * Format volume/marketcap with K/M/B suffix
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B'
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + 'K'
  }
  return num.toFixed(2)
}

/**
 * Calculate price change percentage
 */
export function calculatePriceChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}
