/**
 * Alpha M7: AI Integration - Edge Proxy
 *
 * Vercel Serverless Function
 * Route: /api/ai/analyze
 *
 * Purpose: Proxy AI provider requests to protect API keys
 * - Timeout: 3s (never blocks UI)
 * - Providers: OpenAI, Grok, Anthropic
 * - Validates request payload
 * - Sanitizes response
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const TIMEOUT_MS = 3000
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
const GROK_API_KEY = process.env.GROK_API_KEY || ''
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''

type AIProvider = 'openai' | 'grok' | 'anthropic'

interface AIAnalyzeRequest {
  provider: AIProvider
  imageDataUrl?: string
  systemPrompt: string
  userPrompt: string
  maxTokens?: number
}

interface AIAnalyzeResponse {
  success: boolean
  data?: {
    content: string
    provider: AIProvider
    processingTime: number
  }
  error?: string
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  )

  return Promise.race([promise, timeout])
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  imageDataUrl?: string,
  maxTokens: number = 500
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
  ]

  if (imageDataUrl) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: userPrompt },
        { type: 'image_url', image_url: { url: imageDataUrl } },
      ],
    })
  } else {
    messages.push({ role: 'user', content: userPrompt })
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.7,
    max_tokens: maxTokens,
    response_format: { type: 'json_object' },
  })

  return response.choices[0]?.message?.content || '{}'
}

/**
 * Call Grok API
 */
async function callGrok(
  systemPrompt: string,
  userPrompt: string,
  imageDataUrl?: string,
  maxTokens: number = 500
): Promise<string> {
  if (!GROK_API_KEY) {
    throw new Error('Grok API key not configured')
  }

  const grok = new OpenAI({
    apiKey: GROK_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  })

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
  ]

  if (imageDataUrl) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: userPrompt },
        { type: 'image_url', image_url: { url: imageDataUrl } },
      ],
    })
  } else {
    messages.push({ role: 'user', content: userPrompt })
  }

  const response = await grok.chat.completions.create({
    model: 'grok-vision-beta',
    messages,
    temperature: 0.7,
    max_tokens: maxTokens,
  })

  return response.choices[0]?.message?.content || '{}'
}

/**
 * Call Anthropic API
 */
async function callAnthropic(
  systemPrompt: string,
  userPrompt: string,
  _imageDataUrl?: string, // Anthropic has limited vision support
  maxTokens: number = 1024
): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || '{}'
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse<AIAnalyzeResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  const startTime = Date.now()

  try {
    // Parse and validate request body
    const body = req.body as AIAnalyzeRequest

    if (!body.provider || !body.systemPrompt || !body.userPrompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: provider, systemPrompt, userPrompt',
      })
    }

    const { provider, imageDataUrl, systemPrompt, userPrompt, maxTokens } = body

    // Validate provider
    if (!['openai', 'grok', 'anthropic'].includes(provider)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid provider. Must be: openai, grok, or anthropic',
      })
    }

    // Call appropriate AI provider with timeout
    let content: string

    const aiCall = (async () => {
      switch (provider) {
        case 'openai':
          return await callOpenAI(systemPrompt, userPrompt, imageDataUrl, maxTokens)
        case 'grok':
          return await callGrok(systemPrompt, userPrompt, imageDataUrl, maxTokens)
        case 'anthropic':
          return await callAnthropic(systemPrompt, userPrompt, imageDataUrl, maxTokens)
        default:
          throw new Error('Unsupported provider')
      }
    })()

    content = await fetchWithTimeout(aiCall, TIMEOUT_MS)

    const processingTime = Date.now() - startTime

    return res.status(200).json({
      success: true,
      data: {
        content,
        provider,
        processingTime,
      },
    })
  } catch (error) {
    console.error('[AI Analyze Proxy] Error:', error)

    const processingTime = Date.now() - startTime

    // Check for timeout
    if (error instanceof Error && error.message === 'Request timeout') {
      return res.status(504).json({
        success: false,
        error: 'AI request timeout (3s limit)',
      })
    }

    // Generic error
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
