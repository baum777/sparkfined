/**
 * Image Utils Tests
 */

import { describe, it, expect } from 'vitest'
import { validateImageFile } from '../imageUtils'

describe('Image Utils', () => {
  it('should validate image file types', () => {
    const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
    const result = validateImageFile(validFile)
    
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should reject non-image files', () => {
    const invalidFile = new File([''], 'test.pdf', { type: 'application/pdf' })
    const result = validateImageFile(invalidFile)
    
    expect(result.valid).toBe(false)
    expect(result.error).toBe('File must be an image')
  })

  it('should reject unsupported image types', () => {
    const invalidFile = new File([''], 'test.bmp', { type: 'image/bmp' })
    const result = validateImageFile(invalidFile)
    
    expect(result.valid).toBe(false)
    expect(result.error).toContain('not supported')
  })

  it('should reject files that are too large', () => {
    const largeData = new Uint8Array(11 * 1024 * 1024) // 11MB
    const largeFile = new File([largeData], 'test.jpg', { type: 'image/jpeg' })
    const result = validateImageFile(largeFile)
    
    expect(result.valid).toBe(false)
    expect(result.error).toContain('too large')
  })

  it('should accept valid PNG files', () => {
    const pngFile = new File([''], 'test.png', { type: 'image/png' })
    const result = validateImageFile(pngFile)
    
    expect(result.valid).toBe(true)
  })

  it('should accept valid WebP files', () => {
    const webpFile = new File([''], 'test.webp', { type: 'image/webp' })
    const result = validateImageFile(webpFile)
    
    expect(result.valid).toBe(true)
  })
})
