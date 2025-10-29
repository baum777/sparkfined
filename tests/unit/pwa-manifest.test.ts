/**
 * M-PWA-1: Manifest & Icons Tests
 * Validates PWA manifest configuration
 */

import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('PWA Manifest - M-PWA-1', () => {
  it('manifest.webmanifest exists and is valid JSON', () => {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.webmanifest')
    expect(fs.existsSync(manifestPath)).toBe(true)

    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)

    expect(manifest).toBeDefined()
  })

  it('has required PWA manifest fields', () => {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.webmanifest')
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)

    // Required fields
    expect(manifest.name).toBe('Sparkfined TA-PWA')
    expect(manifest.short_name).toBe('Sparkfined')
    expect(manifest.start_url).toBe('/')
    expect(manifest.scope).toBe('/')
    expect(manifest.display).toBe('standalone')
    expect(manifest.theme_color).toBe('#0A0A0A')
    expect(manifest.background_color).toBe('#0A0A0A')
  })

  it('has display_override with window-controls-overlay', () => {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.webmanifest')
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)

    expect(manifest.display_override).toBeDefined()
    expect(Array.isArray(manifest.display_override)).toBe(true)
    expect(manifest.display_override).toContain('window-controls-overlay')
    expect(manifest.display_override).toContain('standalone')
  })

  it('has maskable icons (192x192 and 512x512)', () => {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.webmanifest')
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)

    expect(manifest.icons).toBeDefined()
    expect(Array.isArray(manifest.icons)).toBe(true)
    expect(manifest.icons.length).toBeGreaterThan(0)

    // Check for 192x192 maskable icon
    const icon192 = manifest.icons.find((icon: any) => icon.sizes === '192x192')
    expect(icon192).toBeDefined()
    expect(icon192.purpose).toContain('maskable')

    // Check for 512x512 maskable icon
    const icon512 = manifest.icons.find((icon: any) => icon.sizes === '512x512')
    expect(icon512).toBeDefined()
    expect(icon512.purpose).toContain('maskable')
  })

  it('has app shortcuts (Analyze, Journal)', () => {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.webmanifest')
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)

    expect(manifest.shortcuts).toBeDefined()
    expect(Array.isArray(manifest.shortcuts)).toBe(true)
    expect(manifest.shortcuts.length).toBeGreaterThanOrEqual(2)

    const analyzeShortcut = manifest.shortcuts.find((s: any) => s.name === 'Analyze')
    expect(analyzeShortcut).toBeDefined()
    expect(analyzeShortcut.url).toBe('/analyze')

    const journalShortcut = manifest.shortcuts.find((s: any) => s.name === 'Journal')
    expect(journalShortcut).toBeDefined()
    expect(journalShortcut.url).toBe('/journal')
  })

  it('icon files exist in public directory', () => {
    const publicDir = path.join(process.cwd(), 'public')

    expect(fs.existsSync(path.join(publicDir, 'pwa-192x192.png'))).toBe(true)
    expect(fs.existsSync(path.join(publicDir, 'pwa-512x512.png'))).toBe(true)
    expect(fs.existsSync(path.join(publicDir, 'apple-touch-icon.png'))).toBe(true)
    expect(fs.existsSync(path.join(publicDir, 'favicon.ico'))).toBe(true)
    expect(fs.existsSync(path.join(publicDir, 'mask-icon.svg'))).toBe(true)
  })

  it('has categories and orientation fields', () => {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.webmanifest')
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)

    expect(manifest.categories).toBeDefined()
    expect(Array.isArray(manifest.categories)).toBe(true)
    expect(manifest.categories).toContain('finance')

    expect(manifest.orientation).toBeDefined()
    expect(manifest.orientation).toBe('any')
  })

  it('has launch_handler for navigate-existing', () => {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.webmanifest')
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)

    expect(manifest.launch_handler).toBeDefined()
    expect(manifest.launch_handler.client_mode).toBe('navigate-existing')
  })
})
