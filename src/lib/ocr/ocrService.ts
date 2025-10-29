/**
 * OCR Service using Tesseract.js
 * Alpha M5: Worker Pool + Confidence Scoring Engine
 *
 * Features:
 * - Worker pool (2 threads) for parallel processing
 * - Per-indicator confidence scoring (0.0–1.0)
 * - Enhanced regex suite (RSI, BB, EMA/SMA, Price, %)
 * - Target: < 500ms OCR processing time, confidence > 0.6
 *
 * DoD: OCR latency < 500ms, Confidence > 0.6, Tests green
 */

import { createWorker, type Worker } from 'tesseract.js'
import type { OCRResult, OCRIndicatorValue } from '@/types/analysis'
import { Telemetry, TelemetryEvents } from '@/lib/TelemetryService'

// Worker pool configuration
const POOL_SIZE = 2
const workerPool: Worker[] = []
let poolInitialized = false
let currentWorkerIndex = 0

/**
 * Initialize worker pool with 2 workers
 */
async function initializeWorkerPool(): Promise<void> {
  if (poolInitialized) return

  const initPromises = []

  for (let i = 0; i < POOL_SIZE; i++) {
    const workerPromise = createWorker('eng', 1, {
      logger: (m) => {
        if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
          console.log(`[OCR Worker ${i}]`, m)
        }
      },
    }).then(async (worker) => {
      // Optimize for chart text recognition
      await worker.setParameters({
        tessedit_char_whitelist:
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.%:$-(),/',
      })
      return worker
    })

    initPromises.push(workerPromise)
  }

  workerPool.push(...(await Promise.all(initPromises)))
  poolInitialized = true
}

/**
 * Get next available worker from pool (round-robin)
 */
async function getWorker(): Promise<Worker> {
  if (!poolInitialized) {
    await initializeWorkerPool()
  }

  const worker = workerPool[currentWorkerIndex]
  currentWorkerIndex = (currentWorkerIndex + 1) % POOL_SIZE

  return worker
}

/**
 * Calculate confidence score for a regex match
 * Based on match quality, surrounding context, and value plausibility
 */
function calculateMatchConfidence(
  text: string,
  matchIndex: number,
  matchLength: number,
  expectedPattern: RegExp
): number {
  let confidence = 0.5 // Base confidence

  // Factor 1: Match is on a word boundary (+0.2)
  const beforeChar = text[matchIndex - 1]
  const afterChar = text[matchIndex + matchLength]
  if (
    (!beforeChar || /\s/.test(beforeChar)) &&
    (!afterChar || /\s|:/.test(afterChar))
  ) {
    confidence += 0.2
  }

  // Factor 2: Contains expected delimiter/separator (+0.15)
  const matchedText = text.substring(matchIndex, matchIndex + matchLength)
  if (/[:=\s]/.test(matchedText)) {
    confidence += 0.15
  }

  // Factor 3: Follows expected pattern structure (+0.15)
  if (expectedPattern.test(matchedText)) {
    confidence += 0.15
  }

  return Math.min(confidence, 1.0)
}

/**
 * Extract RSI value with confidence
 */
function extractRSI(text: string): OCRIndicatorValue[] {
  const results: OCRIndicatorValue[] = []
  const rsiPattern = /RSI[:\s(]*(\d+)(?:)?[:\s]*(\d+(?:\.\d+)?)/gi

  let match
  while ((match = rsiPattern.exec(text)) !== null) {
    const value = parseFloat(match[2])
    if (!isNaN(value) && value >= 0 && value <= 100) {
      const confidence = calculateMatchConfidence(
        text,
        match.index,
        match[0].length,
        /RSI.*\d+/
      )
      // Adjust confidence based on value plausibility (0-100 range)
      const adjustedConfidence = confidence * (value <= 100 ? 1.0 : 0.5)

      results.push({
        name: 'RSI',
        value,
        confidence: adjustedConfidence,
      })
    }
  }

  return results
}

/**
 * Extract Bollinger Band status with confidence
 */
function extractBollinger(text: string): OCRIndicatorValue[] {
  const results: OCRIndicatorValue[] = []

  if (/bollinger.*upper/i.test(text)) {
    const match = text.match(/bollinger.*upper/i)
    const confidence = match
      ? calculateMatchConfidence(text, match.index!, match[0].length, /bollinger.*upper/i)
      : 0.6
    results.push({ name: 'Bollinger', value: 'upper', confidence })
  } else if (/bollinger.*lower/i.test(text)) {
    const match = text.match(/bollinger.*lower/i)
    const confidence = match
      ? calculateMatchConfidence(text, match.index!, match[0].length, /bollinger.*lower/i)
      : 0.6
    results.push({ name: 'Bollinger', value: 'lower', confidence })
  } else if (/bollinger.*middle/i.test(text)) {
    const match = text.match(/bollinger.*middle/i)
    const confidence = match
      ? calculateMatchConfidence(text, match.index!, match[0].length, /bollinger.*middle/i)
      : 0.6
    results.push({ name: 'Bollinger', value: 'middle', confidence })
  }

  return results
}

/**
 * Extract EMA values with confidence
 */
function extractEMA(text: string): OCRIndicatorValue[] {
  const results: OCRIndicatorValue[] = []
  const emaPattern = /EMA[\s(]*(\d+)[\s)]*:?\s*([\d,.]+)/gi

  let match
  while ((match = emaPattern.exec(text)) !== null) {
    const value = parseFloat(match[2].replace(/,/g, ''))
    if (!isNaN(value) && value > 0) {
      const confidence = calculateMatchConfidence(
        text,
        match.index,
        match[0].length,
        /EMA.*\d+/
      )
      results.push({
        name: `EMA(${match[1]})`,
        value,
        confidence,
      })
    }
  }

  return results
}

/**
 * Extract SMA values with confidence
 */
function extractSMA(text: string): OCRIndicatorValue[] {
  const results: OCRIndicatorValue[] = []
  const smaPattern = /SMA[\s(]*(\d+)[\s)]*:?\s*([\d,.]+)/gi

  let match
  while ((match = smaPattern.exec(text)) !== null) {
    const value = parseFloat(match[2].replace(/,/g, ''))
    if (!isNaN(value) && value > 0) {
      const confidence = calculateMatchConfidence(
        text,
        match.index,
        match[0].length,
        /SMA.*\d+/
      )
      results.push({
        name: `SMA(${match[1]})`,
        value,
        confidence,
      })
    }
  }

  return results
}

/**
 * Extract price with confidence
 */
function extractPrice(text: string): OCRIndicatorValue[] {
  const results: OCRIndicatorValue[] = []
  // Enhanced price pattern: "Price: $42,850.00" or "$42850" or "42850.50"
  const pricePattern = /(?:price[:\s]*)?[$]?([\d,]+\.?\d*)/gi

  let match
  const matches: Array<{ value: number; index: number; length: number; hasLabel: boolean }> = []

  while ((match = pricePattern.exec(text)) !== null) {
    const value = parseFloat(match[1].replace(/,/g, ''))
    if (!isNaN(value) && value > 0) {
      matches.push({
        value,
        index: match.index,
        length: match[0].length,
        hasLabel: /price/i.test(match[0]),
      })
    }
  }

  // Prefer matches with "Price" label
  const labeledMatches = matches.filter((m) => m.hasLabel)
  const relevantMatches = labeledMatches.length > 0 ? labeledMatches : matches.slice(0, 3)

  for (const m of relevantMatches) {
    const baseConfidence = calculateMatchConfidence(text, m.index, m.length, /price/i)
    const confidence = m.hasLabel ? baseConfidence + 0.2 : baseConfidence
    results.push({
      name: 'Price',
      value: m.value,
      confidence: Math.min(confidence, 1.0),
    })
  }

  return results
}

/**
 * Extract volume with confidence
 */
function extractVolume(text: string): OCRIndicatorValue[] {
  const results: OCRIndicatorValue[] = []
  const volumePattern = /vol(?:ume)?[:\s]*([\d,.]+\s*[KMB]?)/gi

  let match
  while ((match = volumePattern.exec(text)) !== null) {
    const confidence = calculateMatchConfidence(
      text,
      match.index,
      match[0].length,
      /vol/i
    )
    results.push({
      name: 'Volume',
      value: match[1].trim(),
      confidence,
    })
  }

  return results
}

/**
 * Extract percentage values with confidence
 */
function extractPercentages(text: string): OCRIndicatorValue[] {
  const results: OCRIndicatorValue[] = []
  // Pattern: "24h: +5.3%" or "-2.1%"
  const percentPattern = /([+-]?[\d,.]+)\s*%/gi

  let match
  while ((match = percentPattern.exec(text)) !== null) {
    const value = parseFloat(match[1].replace(/,/g, ''))
    if (!isNaN(value)) {
      const confidence = calculateMatchConfidence(
        text,
        match.index,
        match[0].length,
        /[+-]?[\d.]+%/
      )
      results.push({
        name: 'Percentage',
        value,
        confidence,
      })
    }
  }

  return results
}

/**
 * Extract text from image using OCR with worker pool
 * @param imageFile - Chart image file
 * @returns OCR result with labels, indicators, and confidence scores
 */
export async function extractChartText(imageFile: File | string): Promise<OCRResult> {
  const startTime = performance.now()

  try {
    const worker = await getWorker()

    // Perform OCR
    const {
      data: { text, confidence },
    } = await worker.recognize(imageFile)

    const processingTime = performance.now() - startTime

    // Log telemetry
    Telemetry.log(TelemetryEvents.OCR_PARSE_MS, processingTime, {
      confidence: confidence / 100,
      textLength: text.length,
    })

    // Extract labels and indicators
    const labels = extractLabels(text)
    const indicators = parseIndicators(text)

    // Extract all indicator values with confidence
    const indicatorValues: OCRIndicatorValue[] = [
      ...extractRSI(text),
      ...extractBollinger(text),
      ...extractEMA(text),
      ...extractSMA(text),
      ...extractPrice(text),
      ...extractVolume(text),
      ...extractPercentages(text),
    ]

    // Calculate average confidence across all indicators
    const avgConfidence =
      indicatorValues.length > 0
        ? indicatorValues.reduce((sum, ind) => sum + ind.confidence, 0) /
          indicatorValues.length
        : confidence / 100

    // Log OCR confidence metric
    Telemetry.log('ocr_confidence_avg', avgConfidence, {
      indicatorCount: indicatorValues.length,
    })

    return {
      text,
      confidence: confidence / 100, // Normalize to 0-1
      labels,
      indicators,
      indicatorValues,
      processingTime,
    }
  } catch (error) {
    console.error('OCR failed:', error)

    const processingTime = performance.now() - startTime
    Telemetry.log(TelemetryEvents.OCR_PARSE_MS, processingTime, { error: true })

    // Return empty result on error
    return {
      text: '',
      confidence: 0,
      labels: [],
      indicators: {},
      indicatorValues: [],
      processingTime,
    }
  }
}

/**
 * Extract technical indicator labels from OCR text
 * Pattern: RSI, Bollinger, EMA, SMA, Price, Volume
 */
function extractLabels(text: string): string[] {
  const labelPattern = /RSI|Bollinger|EMA|SMA|Price|Volume|MACD|Stochastic|ADX/gi
  const matches = text.match(labelPattern)

  if (!matches) {
    return []
  }

  // Deduplicate and normalize
  return [...new Set(matches.map((m) => m.toUpperCase()))]
}

/**
 * Parse indicator values from OCR text (legacy format for backward compatibility)
 */
function parseIndicators(text: string): OCRResult['indicators'] {
  const indicators: OCRResult['indicators'] = {}

  // RSI pattern: "RSI: 72" or "RSI 72" or "RSI(14): 72"
  const rsiMatch = text.match(/RSI[:\s(]*(\d+)/)
  if (rsiMatch) {
    indicators.rsi = parseInt(rsiMatch[1], 10)
  }

  // Bollinger Band status
  if (/bollinger.*upper/i.test(text)) {
    indicators.bollinger = 'upper'
  } else if (/bollinger.*lower/i.test(text)) {
    indicators.bollinger = 'lower'
  } else if (/bollinger.*middle/i.test(text)) {
    indicators.bollinger = 'middle'
  }

  // EMA values: "EMA(20): 42850" or "EMA 20: 42850"
  const emaMatches = text.matchAll(/EMA[\s(]*(\d+)[\s)]*:?\s*([\d,.]+)/gi)
  const emaValues: number[] = []
  for (const match of emaMatches) {
    const value = parseFloat(match[2].replace(/,/g, ''))
    if (!isNaN(value)) {
      emaValues.push(value)
    }
  }
  if (emaValues.length > 0) {
    indicators.ema = emaValues
  }

  // SMA values: similar to EMA
  const smaMatches = text.matchAll(/SMA[\s(]*(\d+)[\s)]*:?\s*([\d,.]+)/gi)
  const smaValues: number[] = []
  for (const match of smaMatches) {
    const value = parseFloat(match[2].replace(/,/g, ''))
    if (!isNaN(value)) {
      smaValues.push(value)
    }
  }
  if (smaValues.length > 0) {
    indicators.sma = smaValues
  }

  // Price: "Price: $42,850.00" or "$42850"
  const priceMatch = text.match(/[$]?([\d,]+\.?\d*)/i)
  if (priceMatch) {
    const price = parseFloat(priceMatch[1].replace(/,/g, ''))
    if (!isNaN(price) && price > 0) {
      indicators.price = price
    }
  }

  // Volume: "Volume: 1.2M" or "Vol: 1,234,567"
  const volumeMatch = text.match(/vol(?:ume)?[:\s]*([\d,.]+\s*[KMB]?)/i)
  if (volumeMatch) {
    indicators.volume = volumeMatch[1].trim()
  }

  return indicators
}

/**
 * Batch OCR for multiple images using worker pool
 * Processes images in parallel using available workers
 */
export async function extractChartTextBatch(
  images: (File | string)[]
): Promise<OCRResult[]> {
  // Process in parallel batches of POOL_SIZE
  const results: OCRResult[] = []

  for (let i = 0; i < images.length; i += POOL_SIZE) {
    const batch = images.slice(i, i + POOL_SIZE)
    const batchResults = await Promise.all(batch.map((image) => extractChartText(image)))
    results.push(...batchResults)
  }

  return results
}

/**
 * Preprocess image for better OCR accuracy
 * - Increase contrast
 * - Convert to grayscale
 * - Enhance text regions
 */
export async function preprocessImage(imageFile: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      // Draw original image
      ctx.drawImage(img, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Convert to grayscale and increase contrast
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
        const contrast = 1.5 // Increase contrast
        const enhanced = (gray - 128) * contrast + 128

        data[i] = enhanced // R
        data[i + 1] = enhanced // G
        data[i + 2] = enhanced // B
      }

      ctx.putImageData(imageData, 0, 0)

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert canvas to blob'))
        }
      }, 'image/png')
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(imageFile)
  })
}

/**
 * Cleanup worker pool on app unmount
 */
export async function terminateOCR(): Promise<void> {
  for (const worker of workerPool) {
    await worker.terminate()
  }
  workerPool.length = 0
  poolInitialized = false
  currentWorkerIndex = 0
}
