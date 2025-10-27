/**
 * Export Utilities - Step 10: Export Module
 * 
 * Handles export of analysis results and charts to:
 * - PNG (chart screenshots + analysis overlay)
 * - CSV (trade journal data)
 * 
 * Status: Beta Implementation
 */

import type { AnalysisResult } from '@/types/analysis'

/**
 * Export analysis result as PNG image
 * Creates a canvas with analysis data overlaid
 */
export async function exportAnalysisAsPNG(
  analysis: AnalysisResult,
  includeChart: boolean = true
): Promise<void> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }
  
  // Set canvas size
  canvas.width = 800
  canvas.height = includeChart && analysis.imageDataUrl ? 1000 : 600
  
  // Background
  ctx.fillStyle = '#0f172a' // bg color
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  let currentY = 40
  
  // Draw chart image if available
  if (includeChart && analysis.imageDataUrl) {
    try {
      const img = await loadImage(analysis.imageDataUrl)
      const maxHeight = 400
      const scale = Math.min(canvas.width / img.width, maxHeight / img.height)
      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale
      const x = (canvas.width - scaledWidth) / 2
      
      ctx.drawImage(img, x, currentY, scaledWidth, scaledHeight)
      currentY += scaledHeight + 30
    } catch (error) {
      console.error('Failed to load chart image:', error)
    }
  }
  
  // Header
  ctx.fillStyle = '#e2e8f0'
  ctx.font = 'bold 28px Inter'
  ctx.fillText('Sparkfined TA Analysis', 40, currentY)
  currentY += 40
  
  // Token info
  if (analysis.token) {
    ctx.font = '20px monospace'
    ctx.fillStyle = '#94a3b8'
    ctx.fillText(`${analysis.token.symbol}`, 40, currentY)
    currentY += 30
    
    ctx.font = '16px monospace'
    ctx.fillText(`Price: $${analysis.token.price.toFixed(6)}`, 40, currentY)
    currentY += 25
    
    const changeColor = analysis.token.priceChange24h && analysis.token.priceChange24h > 0 ? '#10b981' : '#ef4444'
    ctx.fillStyle = changeColor
    ctx.fillText(`24h: ${analysis.token.priceChange24h?.toFixed(2)}%`, 40, currentY)
    ctx.fillStyle = '#94a3b8'
    currentY += 35
  }
  
  // Analysis details
  ctx.fillStyle = '#e2e8f0'
  ctx.font = 'bold 18px Inter'
  ctx.fillText('Analysis', 40, currentY)
  currentY += 30
  
  ctx.font = '14px monospace'
  ctx.fillStyle = '#94a3b8'
  
  const details = [
    `Bias: ${analysis.heuristics.bias}`,
    `Support: $${analysis.heuristics.supportLevel.toFixed(6)}`,
    `Resistance: $${analysis.heuristics.resistanceLevel.toFixed(6)}`,
    `Volatility 24h: ${analysis.heuristics.volatility24h.toFixed(2)}%`,
    `Range: ${analysis.heuristics.rangeSize}`,
    `Confidence: ${(analysis.heuristics.confidence * 100).toFixed(0)}%`,
  ]
  
  details.forEach((detail) => {
    ctx.fillText(detail, 40, currentY)
    currentY += 22
  })
  
  // Footer
  currentY = canvas.height - 40
  ctx.fillStyle = '#475569'
  ctx.font = '12px monospace'
  ctx.fillText(`Generated: ${new Date().toLocaleString()}`, 40, currentY)
  ctx.fillText('Sparkfined Beta - sparkfined.com', canvas.width - 280, currentY)
  
  // Download
  canvas.toBlob((blob) => {
    if (!blob) {
      throw new Error('Failed to create blob')
    }
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const filename = `sparkfined-analysis-${Date.now()}.png`
    
    link.href = url
    link.download = filename
    link.click()
    
    URL.revokeObjectURL(url)
  }, 'image/png')
}

/**
 * Load image from URL
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Export analysis as JSON
 */
export function exportAnalysisAsJSON(analysis: AnalysisResult): void {
  const json = JSON.stringify(analysis, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const filename = `sparkfined-analysis-${Date.now()}.json`
  
  link.href = url
  link.download = filename
  link.click()
  
  URL.revokeObjectURL(url)
}

/**
 * Export trade journal as CSV (re-export from db.ts for convenience)
 */
export { exportTradesToCSV, downloadCSV } from './db'

/**
 * Export chart screenshot only (without analysis overlay)
 */
export function exportChartScreenshot(imageDataUrl: string): void {
  const link = document.createElement('a')
  const filename = `chart-screenshot-${Date.now()}.png`
  
  link.href = imageDataUrl
  link.download = filename
  link.click()
}

/**
 * Share analysis via native Web Share API (if available)
 */
export async function shareAnalysis(analysis: AnalysisResult): Promise<boolean> {
  if (!navigator.share) {
    console.warn('Web Share API not available')
    return false
  }
  
  try {
    const text = formatAnalysisForSharing(analysis)
    
    await navigator.share({
      title: `Sparkfined Analysis: ${analysis.token?.symbol || 'Token'}`,
      text,
    })
    
    return true
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Share failed:', error)
    }
    return false
  }
}

/**
 * Format analysis for text sharing (Twitter, Telegram, etc.)
 */
function formatAnalysisForSharing(analysis: AnalysisResult): string {
  const lines: string[] = []
  
  if (analysis.token) {
    lines.push(`📊 ${analysis.token.symbol} Analysis`)
    lines.push(``)
    lines.push(`Price: $${analysis.token.price.toFixed(6)}`)
    if (analysis.token.priceChange24h) {
      const emoji = analysis.token.priceChange24h > 0 ? '📈' : '📉'
      lines.push(`24h: ${emoji} ${analysis.token.priceChange24h.toFixed(2)}%`)
    }
  }
  
  lines.push(``)
  lines.push(`${analysis.heuristics.bias === 'Bullish' ? '🟢' : analysis.heuristics.bias === 'Bearish' ? '🔴' : '🟡'} Bias: ${analysis.heuristics.bias}`)
  lines.push(`Support: $${analysis.heuristics.supportLevel.toFixed(6)}`)
  lines.push(`Resistance: $${analysis.heuristics.resistanceLevel.toFixed(6)}`)
  lines.push(``)
  lines.push(`⚡ Powered by Sparkfined Beta`)
  
  return lines.join('\n')
}

/**
 * Copy analysis to clipboard
 */
export async function copyAnalysisToClipboard(analysis: AnalysisResult): Promise<boolean> {
  try {
    const text = formatAnalysisForSharing(analysis)
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Generate shareable image URL (for social media)
 * This creates a simple text-based image without chart
 */
export async function generateShareableImageURL(
  analysis: AnalysisResult
): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) throw new Error('Canvas context not available')
  
  // Twitter/OG image size
  canvas.width = 1200
  canvas.height = 630
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#0f172a')
  gradient.addColorStop(1, '#1e293b')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Content
  ctx.fillStyle = '#e2e8f0'
  ctx.font = 'bold 48px Inter'
  ctx.fillText('Sparkfined Analysis', 60, 100)
  
  if (analysis.token) {
    ctx.font = 'bold 64px monospace'
    ctx.fillText(analysis.token.symbol, 60, 200)
    
    ctx.font = '36px monospace'
    ctx.fillStyle = '#94a3b8'
    ctx.fillText(`$${analysis.token.price.toFixed(6)}`, 60, 260)
    
    if (analysis.token.priceChange24h) {
      const color = analysis.token.priceChange24h > 0 ? '#10b981' : '#ef4444'
      ctx.fillStyle = color
      ctx.fillText(`${analysis.token.priceChange24h.toFixed(2)}%`, 60, 320)
    }
  }
  
  // Bias indicator
  const biasY = 420
  ctx.fillStyle = '#e2e8f0'
  ctx.font = 'bold 32px Inter'
  ctx.fillText(`Bias: ${analysis.heuristics.bias}`, 60, biasY)
  
  // Footer
  ctx.fillStyle = '#64748b'
  ctx.font = '24px monospace'
  ctx.fillText('sparkfined.com', 60, 570)
  
  return canvas.toDataURL('image/png')
}
