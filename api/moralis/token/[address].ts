/**
 * Alpha Issue 1: Edge Proxies - Moralis
 *
 * NOTE: This is a serverless/edge function placeholder.
 * Deployment options:
 * - Vercel Edge Functions
 * - Netlify Edge Functions
 * - Cloudflare Workers
 * - AWS Lambda@Edge
 *
 * Purpose: Proxy Moralis API requests to protect API keys
 * Route: /api/moralis/token/[address]
 *
 * TODO (Issue 1 implementation):
 * - Add timeout wrapper (6s)
 * - Add 1x retry logic
 * - Set X-API-Key header from env
 * - Forward 4xx/5xx status codes
 * - Validate Solana address input
 */

export interface MoralisProxyRequest {
  address: string;
  chain?: string;
}

export interface MoralisProxyResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  provider: 'moralis';
}

// Placeholder for edge function handler
export default async function handler(req: Request): Promise<Response> {
  throw new Error('Not implemented - Issue 1');
}
