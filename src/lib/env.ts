/**
 * Environment Variable Validation & Type Safety
 * 
 * This module validates required environment variables at startup
 * and provides type-safe access to configuration values.
 * 
 * @module lib/env
 */

// ============================================================================
// Type Definitions
// ============================================================================

interface EnvConfig {
  // Solana Configuration
  solana: {
    network: 'devnet' | 'mainnet-beta'
    rpcUrl: string
  }

  // Data Provider Configuration
  data: {
    primary: string[]
    secondary: string[]
    fallbacks: string[]
  }

  // API Configuration
  api: {
    baseUrl: string
    key?: string
  }

  // Feature Flags
  features: {
    analytics: boolean
    metrics: boolean
    debug: boolean
    aiTeaser: boolean
  }

  // AI Provider Configuration
  ai: {
    provider: 'none' | 'openai' | 'grok' | 'anthropic'
  }

  // Environment Detection
  env: {
    isDev: boolean
    isProd: boolean
  }
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Get environment variable with validation
 */
function getEnv(key: string, defaultValue?: string): string {
  const value = import.meta.env[key]
  
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    console.warn(`?? Environment variable ${key} is not set`)
    return ''
  }
  
  return value
}

/**
 * Get required environment variable (throws if missing)
 */
function getRequiredEnv(key: string): string {
  const value = import.meta.env[key]
  
  if (value === undefined || value === '') {
    throw new Error(`? Required environment variable ${key} is not set`)
  }
  
  return value
}

/**
 * Get boolean environment variable
 */
function getBoolEnv(key: string, defaultValue = false): boolean {
  const value = getEnv(key, String(defaultValue))
  return value === 'true' || value === '1'
}

/**
 * Parse comma-separated list
 */
function parseList(value: string): string[] {
  return value
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0)
}

// ============================================================================
// Environment Configuration
// ============================================================================

/**
 * Validate and load environment configuration
 * 
 * Critical variables (marked ?) will throw if missing.
 * Optional variables will use defaults or log warnings.
 */
export const env: EnvConfig = {
  // Solana Configuration (? Required)
  solana: {
    network: getRequiredEnv('VITE_SOLANA_NETWORK') as 'devnet' | 'mainnet-beta',
    rpcUrl: getRequiredEnv('VITE_SOLANA_RPC_URL'),
  },

  // Data Provider Configuration
  data: {
    primary: parseList(getEnv('VITE_DATA_PRIMARY', 'dexpaprika,moralis')),
    secondary: parseList(getEnv('VITE_DATA_SECONDARY', 'dexscreener')),
    fallbacks: parseList(getEnv('VITE_DATA_FALLBACKS', 'dexscreener,pumpfun')),
  },

  // API Configuration
  api: {
    baseUrl: getEnv('VITE_API_BASE_URL', '/api'),
    key: getEnv('VITE_API_KEY', ''),
  },

  // Feature Flags
  features: {
    analytics: getBoolEnv('VITE_ENABLE_ANALYTICS', false),
    metrics: getBoolEnv('VITE_ENABLE_METRICS', false),
    debug: getBoolEnv('VITE_ENABLE_DEBUG', false),
    aiTeaser: getBoolEnv('VITE_ENABLE_AI_TEASER', false),
  },

  // AI Provider
  ai: {
    provider: (getEnv('VITE_ANALYSIS_AI_PROVIDER', 'none') as 'none' | 'openai' | 'grok' | 'anthropic'),
  },

  // Environment Detection
  env: {
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },
}

// ============================================================================
// Validation at Startup
// ============================================================================

/**
 * Validate environment configuration at module load
 */
function validateEnv(): void {
  const errors: string[] = []
  
  // Validate Solana network
  if (!['devnet', 'mainnet-beta'].includes(env.solana.network)) {
    errors.push(`Invalid VITE_SOLANA_NETWORK: ${env.solana.network} (must be 'devnet' or 'mainnet-beta')`)
  }
  
  // Validate RPC URL format
  if (!env.solana.rpcUrl.startsWith('http')) {
    errors.push(`Invalid VITE_SOLANA_RPC_URL: ${env.solana.rpcUrl} (must start with http:// or https://)`)
  }
  
  // Validate AI provider
  if (!['none', 'openai', 'grok', 'anthropic'].includes(env.ai.provider)) {
    errors.push(`Invalid VITE_ANALYSIS_AI_PROVIDER: ${env.ai.provider}`)
  }
  
  // Log warnings for production
  if (env.env.isProd) {
    if (env.solana.network === 'devnet') {
      console.warn('?? Running on devnet in production mode')
    }
    
    if (env.features.debug) {
      console.warn('?? Debug mode enabled in production')
    }
  }
  
  // Throw if critical errors
  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`)
  }
}

// Run validation
validateEnv()

// ============================================================================
// Export Helpers
// ============================================================================

/**
 * Check if running in development mode
 */
export const isDev = env.env.isDev

/**
 * Check if running in production mode
 */
export const isProd = env.env.isProd

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof EnvConfig['features']): boolean {
  return env.features[feature]
}

/**
 * Get API URL with base
 */
export function getApiUrl(path: string): string {
  const base = env.api.baseUrl.replace(/\/$/, '')
  const cleanPath = path.replace(/^\//, '')
  return `${base}/${cleanPath}`
}

/**
 * Log environment info (development only)
 */
export function logEnvInfo(): void {
  if (!isDev) return
  
  console.group('?? Environment Configuration')
  console.log('Network:', env.solana.network)
  console.log('RPC:', env.solana.rpcUrl)
  console.log('Data Primary:', env.data.primary.join(', '))
  console.log('Data Fallbacks:', env.data.fallbacks.join(', '))
  console.log('AI Provider:', env.ai.provider)
  console.log('Debug Mode:', env.features.debug)
  console.log('Analytics:', env.features.analytics)
  console.groupEnd()
}

// Auto-log in development
if (isDev && env.features.debug) {
  logEnvInfo()
}
