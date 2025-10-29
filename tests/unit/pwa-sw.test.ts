/**
 * M-PWA-2: Service Worker Tests
 * Validates SW configuration and caching strategies
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('Service Worker Config - M-PWA-2', () => {
  it('vite.config.ts has VitePWA plugin configured', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    expect(configContent).toContain('VitePWA')
    expect(configContent).toContain('workbox')
  })

  it('has registerType set to prompt (not aggressive)', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    expect(configContent).toContain("registerType: 'prompt'")
  })

  it('has skipWaiting and clientsClaim set to false', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    expect(configContent).toContain('skipWaiting: false')
    expect(configContent).toContain('clientsClaim: false')
  })

  it('has navigateFallback configured', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    expect(configContent).toContain("navigateFallback: '/index.html'")
  })

  it('has navigateFallbackDenylist for /api routes', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    expect(configContent).toContain('navigateFallbackDenylist')
    expect(configContent).toMatch(/\/api/)
  })

  it('has runtime caching for /api/* with StaleWhileRevalidate', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    // Check for /api caching
    expect(configContent).toContain('/api/')
    expect(configContent).toContain('StaleWhileRevalidate')
    expect(configContent).toContain('api-edge-cache')
  })

  it('has runtime caching for images with CacheFirst', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    expect(configContent).toContain('images-cache')
    expect(configContent).toContain('CacheFirst')
  })

  it('has runtime caching for Google Fonts', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    expect(configContent).toContain('google-fonts')
    expect(configContent).toContain('googleapis')
    expect(configContent).toContain('gstatic')
  })

  it('caches have appropriate expiration times', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    // API cache: 300s (5 minutes)
    expect(configContent).toContain('maxAgeSeconds: 300')
    
    // Images: 30 days
    expect(configContent).toContain('maxAgeSeconds: 2592000')
    
    // Google Fonts: 1 year
    expect(configContent).toContain('maxAgeSeconds: 31536000')
  })

  it('uses external manifest.webmanifest file', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    expect(configContent).toContain("manifestFilename: 'manifest.webmanifest'")
    expect(configContent).toContain('manifest: false')
  })

  it('includes necessary assets for precaching', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    expect(configContent).toContain('includeAssets')
    expect(configContent).toContain('favicon.ico')
    expect(configContent).toContain('apple-touch-icon.png')
    expect(configContent).toContain('pwa-192x192.png')
    expect(configContent).toContain('pwa-512x512.png')
  })

  it('has glob patterns for app shell precaching', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    expect(configContent).toContain('globPatterns')
    // Should include js, css, html, fonts, images (in glob pattern)
    expect(configContent).toContain('{js,')
    expect(configContent).toContain(',css,')
    expect(configContent).toContain(',html,')
    expect(configContent).toContain('woff')
  })

  it('AI APIs use NetworkFirst (not cached long-term)', () => {
    const configPath = resolve(process.cwd(), 'vite.config.ts')
    const configContent = readFileSync(configPath, 'utf-8')

    expect(configContent).toContain('openai')
    expect(configContent).toContain('anthropic')
    expect(configContent).toContain('NetworkFirst')
    expect(configContent).toContain('maxAgeSeconds: 60') // 1 minute
  })
})
