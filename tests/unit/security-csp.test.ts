/**
 * M-PWA-9: Security CSP & SW Denylist Tests
 * Validates security headers and service worker configuration
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('Security - M-PWA-9', () => {
  describe('CSP Headers (vercel.json)', () => {
    it('vercel.json has headers configured', () => {
      const vercelPath = resolve(process.cwd(), 'vercel.json')
      const vercelContent = readFileSync(vercelPath, 'utf-8')
      const vercel = JSON.parse(vercelContent)

      expect(vercel.headers).toBeDefined()
      expect(Array.isArray(vercel.headers)).toBe(true)
      expect(vercel.headers.length).toBeGreaterThan(0)
    })

    it('has Content-Security-Policy header', () => {
      const vercelPath = resolve(process.cwd(), 'vercel.json')
      const vercelContent = readFileSync(vercelPath, 'utf-8')
      const vercel = JSON.parse(vercelContent)

      const mainHeaders = vercel.headers.find((h: any) => h.source === '/(.*)')
      expect(mainHeaders).toBeDefined()

      const cspHeader = mainHeaders.headers.find((h: any) => h.key === 'Content-Security-Policy')
      expect(cspHeader).toBeDefined()
      expect(cspHeader.value).toContain("default-src 'self'")
    })

    it('CSP allows required API domains', () => {
      const vercelPath = resolve(process.cwd(), 'vercel.json')
      const vercelContent = readFileSync(vercelPath, 'utf-8')
      const vercel = JSON.parse(vercelContent)

      const mainHeaders = vercel.headers.find((h: any) => h.source === '/(.*)')
      const cspHeader = mainHeaders.headers.find((h: any) => h.key === 'Content-Security-Policy')

      // Check for required AI API domains
      expect(cspHeader.value).toContain('api.openai.com')
      expect(cspHeader.value).toContain('api.x.ai')
      expect(cspHeader.value).toContain('api.anthropic.com')
      
      // Check for data provider domains
      expect(cspHeader.value).toContain('api.dexscreener.com')
      expect(cspHeader.value).toContain('moralis.io')
    })

    it('CSP allows Google Fonts', () => {
      const vercelPath = resolve(process.cwd(), 'vercel.json')
      const vercelContent = readFileSync(vercelPath, 'utf-8')
      const vercel = JSON.parse(vercelContent)

      const mainHeaders = vercel.headers.find((h: any) => h.source === '/(.*)')
      const cspHeader = mainHeaders.headers.find((h: any) => h.key === 'Content-Security-Policy')

      expect(cspHeader.value).toContain('fonts.googleapis.com')
      expect(cspHeader.value).toContain('fonts.gstatic.com')
    })

    it('CSP allows data: and blob: for images', () => {
      const vercelPath = resolve(process.cwd(), 'vercel.json')
      const vercelContent = readFileSync(vercelPath, 'utf-8')
      const vercel = JSON.parse(vercelContent)

      const mainHeaders = vercel.headers.find((h: any) => h.source === '/(.*)')
      const cspHeader = mainHeaders.headers.find((h: any) => h.key === 'Content-Security-Policy')

      expect(cspHeader.value).toMatch(/img-src.*data:/)
      expect(cspHeader.value).toMatch(/img-src.*blob:/)
    })

    it('has X-Frame-Options header', () => {
      const vercelPath = resolve(process.cwd(), 'vercel.json')
      const vercelContent = readFileSync(vercelPath, 'utf-8')
      const vercel = JSON.parse(vercelContent)

      const mainHeaders = vercel.headers.find((h: any) => h.source === '/(.*)')
      const xFrameHeader = mainHeaders.headers.find((h: any) => h.key === 'X-Frame-Options')

      expect(xFrameHeader).toBeDefined()
      expect(xFrameHeader.value).toBe('DENY')
    })

    it('has X-Content-Type-Options header', () => {
      const vercelPath = resolve(process.cwd(), 'vercel.json')
      const vercelContent = readFileSync(vercelPath, 'utf-8')
      const vercel = JSON.parse(vercelContent)

      const mainHeaders = vercel.headers.find((h: any) => h.source === '/(.*)')
      const nosniffHeader = mainHeaders.headers.find((h: any) => h.key === 'X-Content-Type-Options')

      expect(nosniffHeader).toBeDefined()
      expect(nosniffHeader.value).toBe('nosniff')
    })

    it('has Referrer-Policy header', () => {
      const vercelPath = resolve(process.cwd(), 'vercel.json')
      const vercelContent = readFileSync(vercelPath, 'utf-8')
      const vercel = JSON.parse(vercelContent)

      const mainHeaders = vercel.headers.find((h: any) => h.source === '/(.*)')
      const referrerHeader = mainHeaders.headers.find((h: any) => h.key === 'Referrer-Policy')

      expect(referrerHeader).toBeDefined()
      expect(referrerHeader.value).toContain('strict-origin')
    })

    it('has Service Worker headers configured', () => {
      const vercelPath = resolve(process.cwd(), 'vercel.json')
      const vercelContent = readFileSync(vercelPath, 'utf-8')
      const vercel = JSON.parse(vercelContent)

      const swHeaders = vercel.headers.find((h: any) => h.source === '/sw.js')
      expect(swHeaders).toBeDefined()

      const cacheControl = swHeaders.headers.find((h: any) => h.key === 'Cache-Control')
      expect(cacheControl.value).toContain('max-age=0')
      expect(cacheControl.value).toContain('must-revalidate')
    })
  })

  describe('Service Worker Denylist', () => {
    it('SW has navigateFallbackDenylist configured', () => {
      const vitePath = resolve(process.cwd(), 'vite.config.ts')
      const viteContent = readFileSync(vitePath, 'utf-8')

      expect(viteContent).toContain('navigateFallbackDenylist')
    })

    it('SW denylist includes /api routes', () => {
      const vitePath = resolve(process.cwd(), 'vite.config.ts')
      const viteContent = readFileSync(vitePath, 'utf-8')

      // Should deny /api routes from being served by SW
      expect(viteContent).toMatch(/navigateFallbackDenylist.*\/api/)
    })

    it('SW denylist includes static file extensions', () => {
      const vitePath = resolve(process.cwd(), 'vite.config.ts')
      const viteContent = readFileSync(vitePath, 'utf-8')

      // Should deny certain file types (check for pattern presence)
      expect(viteContent).toContain('json')
      expect(viteContent).toContain('txt')
      expect(viteContent).toContain('xml')
    })
  })

  describe('Manifest Headers', () => {
    it('manifest has correct Content-Type header', () => {
      const vercelPath = resolve(process.cwd(), 'vercel.json')
      const vercelContent = readFileSync(vercelPath, 'utf-8')
      const vercel = JSON.parse(vercelContent)

      const manifestHeaders = vercel.headers.find((h: any) => h.source === '/manifest.webmanifest')
      expect(manifestHeaders).toBeDefined()

      const contentType = manifestHeaders.headers.find((h: any) => h.key === 'Content-Type')
      expect(contentType.value).toBe('application/manifest+json')
    })
  })
})
