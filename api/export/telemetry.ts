/**
 * Alpha M8: Telemetry Export API
 *
 * Vercel Serverless Function
 * Route: /api/export/telemetry
 *
 * Purpose: Export telemetry data for debugging
 * - Privacy: No PII, anonymous usage data only
 * - Format: JSON or CSV
 * - Local-first: Data comes from client
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface TelemetryExportRequest {
  events: Array<{
    name: string
    value: number
    timestamp: number
    metadata?: Record<string, unknown>
  }>
  errors: Array<{
    message: string
    stack?: string
    timestamp: number
    context?: Record<string, unknown>
    severity: 'low' | 'medium' | 'high' | 'critical'
  }>
  budgets?: Array<{
    name: string
    budgetMs: number
    p95Threshold?: number
  }>
}

interface TelemetryExportResponse {
  success: boolean
  data?: {
    downloadUrl?: string
    content?: string
  }
  error?: string
}

/**
 * Generate CSV from telemetry data
 */
function generateCSV(data: TelemetryExportRequest): string {
  const lines: string[] = []

  // Header
  lines.push('# Sparkfined Alpha - Telemetry Export')
  lines.push(`# Exported at: ${new Date().toISOString()}`)
  lines.push('# Privacy: No PII collected - anonymous usage data only')
  lines.push('')

  // Events section
  lines.push('=== PERFORMANCE EVENTS ===')
  lines.push('Name,Value (ms),Timestamp,Metadata')
  data.events.forEach((e) => {
    const metadata = JSON.stringify(e.metadata || {})
    lines.push(`${e.name},${e.value},${new Date(e.timestamp).toISOString()},"${metadata}"`)
  })
  lines.push('')

  // Errors section
  lines.push('=== ERRORS ===')
  lines.push('Timestamp,Severity,Message,Stack,Context')
  data.errors.forEach((e) => {
    const escapedMessage = `"${e.message.replace(/"/g, '""')}"`
    const escapedStack = e.stack ? `"${e.stack.replace(/"/g, '""')}"` : ''
    const escapedContext = JSON.stringify(e.context || {})
    lines.push(
      `${new Date(e.timestamp).toISOString()},${e.severity},${escapedMessage},${escapedStack},"${escapedContext}"`
    )
  })
  lines.push('')

  // Budgets section (if provided)
  if (data.budgets && data.budgets.length > 0) {
    lines.push('=== PERFORMANCE BUDGETS ===')
    lines.push('Name,Budget (ms),P95 Threshold')
    data.budgets.forEach((b) => {
      lines.push(`${b.name},${b.budgetMs},${b.p95Threshold || 'N/A'}`)
    })
  }

  return lines.join('\n')
}

/**
 * Generate JSON from telemetry data
 */
function generateJSON(data: TelemetryExportRequest): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      privacyNote: 'No PII collected - anonymous usage data only',
      events: data.events.map((e) => ({
        name: e.name,
        value: e.value,
        timestamp: new Date(e.timestamp).toISOString(),
        metadata: e.metadata,
      })),
      errors: data.errors.map((e) => ({
        message: e.message,
        stack: e.stack,
        timestamp: new Date(e.timestamp).toISOString(),
        context: e.context,
        severity: e.severity,
      })),
      budgets: data.budgets || [],
      summary: {
        totalEvents: data.events.length,
        totalErrors: data.errors.length,
        errorsBySeverity: {
          low: data.errors.filter((e) => e.severity === 'low').length,
          medium: data.errors.filter((e) => e.severity === 'medium').length,
          high: data.errors.filter((e) => e.severity === 'high').length,
          critical: data.errors.filter((e) => e.severity === 'critical').length,
        },
      },
    },
    null,
    2
  )
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse<TelemetryExportResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    // Parse request body
    const body = req.body as TelemetryExportRequest & { format?: 'json' | 'csv' }

    if (!body.events || !body.errors) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: events, errors',
      })
    }

    // Validate data (no PII check)
    const hasPII = [...body.events, ...body.errors].some((item) => {
      const str = JSON.stringify(item)
      // Basic PII detection (email, phone, etc.)
      return /\b[\w.%+-]+@[\w.-]+\.[A-Z]{2,}\b/i.test(str) || /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(str)
    })

    if (hasPII) {
      return res.status(400).json({
        success: false,
        error: 'Potential PII detected in telemetry data. Please remove sensitive information.',
      })
    }

    const format = body.format || 'json'
    const content = format === 'csv' ? generateCSV(body) : generateJSON(body)

    return res.status(200).json({
      success: true,
      data: {
        content,
      },
    })
  } catch (error) {
    console.error('[Telemetry Export] Error:', error)

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
