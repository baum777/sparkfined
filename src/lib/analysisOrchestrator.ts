/**
 * Analysis Orchestrator
 * 
 * Coordinates the complete analysis pipeline:
 * 1. Image preprocessing
 * 2. OCR extraction
 * 3. Market data fetch
 * 4. Heuristic analysis
 * 5. Teaser insights generation
 */

import { compressImage } from './imageUtils'
import { extractLabelsFromChart, type OCRResult } from './ocr'
import { fetchMarketData, type MarketData } from './marketData'
import { performHeuristicAnalysis } from './heuristicAnalysis'
import { generateAnalysisResult } from './teaserAnalysis'
import type { AnalysisResult } from '@/types/analysis'

export interface AnalysisProgress {
  stage: 'preprocessing' | 'ocr' | 'market_data' | 'heuristics' | 'insights' | 'complete'
  progress: number // 0-100
  message: string
}

export type AnalysisProgressCallback = (progress: AnalysisProgress) => void

/**
 * Analyze chart image (full pipeline)
 */
export async function analyzeChartImage(
  imageFile: File,
  onProgress?: AnalysisProgressCallback
): Promise<AnalysisResult> {
  // Stage 1: Preprocessing
  onProgress?.({
    stage: 'preprocessing',
    progress: 10,
    message: 'Compressing image...',
  })
  
  const compressed = await compressImage(imageFile, 1, 0.85)
  
  // Stage 2: OCR
  onProgress?.({
    stage: 'ocr',
    progress: 30,
    message: 'Extracting chart labels...',
  })
  
  let ocrResult: OCRResult | undefined
  try {
    ocrResult = await extractLabelsFromChart(imageFile)
  } catch (error) {
    console.warn('[analysis] OCR failed, continuing without labels:', error)
  }
  
  // Stage 3: Market Data (if CA detected)
  onProgress?.({
    stage: 'market_data',
    progress: 50,
    message: 'Fetching market data...',
  })
  
  const contractAddress = ocrResult?.labels.find(l => l.name === 'ContractAddress')?.value
  const marketData = contractAddress
    ? await fetchMarketData(contractAddress)
    : await getMockMarketData()
  
  // Stage 4: Heuristic Analysis
  onProgress?.({
    stage: 'heuristics',
    progress: 70,
    message: 'Analyzing price action...',
  })
  
  const heuristics = performHeuristicAnalysis({
    marketData,
    ocrLabels: ocrResult,
    timeframe: '1h',
  })
  
  // Stage 5: Generate Insights
  onProgress?.({
    stage: 'insights',
    progress: 90,
    message: 'Generating insights...',
  })
  
  const result = generateAnalysisResult(
    heuristics,
    marketData,
    ocrResult,
    compressed.dataUrl
  )
  
  // Complete
  onProgress?.({
    stage: 'complete',
    progress: 100,
    message: 'Analysis complete',
  })
  
  return result
}

/**
 * Analyze by Contract Address only
 */
export async function analyzeByContractAddress(
  contractAddress: string,
  onProgress?: AnalysisProgressCallback
): Promise<AnalysisResult> {
  // Stage 1: Market Data
  onProgress?.({
    stage: 'market_data',
    progress: 30,
    message: 'Fetching token data...',
  })
  
  const marketData = await fetchMarketData(contractAddress)
  
  // Stage 2: Heuristic Analysis
  onProgress?.({
    stage: 'heuristics',
    progress: 60,
    message: 'Analyzing price action...',
  })
  
  const heuristics = performHeuristicAnalysis({
    marketData,
    timeframe: '1h',
  })
  
  // Stage 3: Generate Insights
  onProgress?.({
    stage: 'insights',
    progress: 90,
    message: 'Generating insights...',
  })
  
  const result = generateAnalysisResult(heuristics, marketData)
  
  // Complete
  onProgress?.({
    stage: 'complete',
    progress: 100,
    message: 'Analysis complete',
  })
  
  return result
}

/**
 * Get mock market data for demo/testing
 */
async function getMockMarketData(): Promise<MarketData> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    address: 'mock_btc_address',
    chain: 'solana',
    price: 42850,
    priceChange24h: 3.2,
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
}

/**
 * Quick analysis for demo mode
 */
export async function getDemoAnalysis(): Promise<AnalysisResult> {
  const marketData = await getMockMarketData()
  
  const heuristics = performHeuristicAnalysis({
    marketData,
    timeframe: '4h',
  })
  
  return generateAnalysisResult(heuristics, marketData)
}
