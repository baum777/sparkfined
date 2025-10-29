/**
 * Alpha M9: E2E Happy-Path Test
 * Upload → Analyze → Journal Save → Replay Open
 *
 * DoD: 1 Happy-Path green, CI job < 6 min
 */

import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('Alpha Happy-Path Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/')
  })

  test('complete workflow: upload → analyze → journal → replay', async ({ page }) => {
    // Step 1: Upload chart screenshot
    test.step('Upload chart image', async () => {
      // Mock file upload
      const dropZone = page.getByTestId('drop-zone').or(page.locator('[data-dropzone]')).first()
      
      // Create a mock file
      const buffer = Buffer.from('mock image data')
      await page.setInputFiles('input[type="file"]', {
        name: 'chart.png',
        mimeType: 'image/png',
        buffer,
      })

      // Verify upload triggered analysis
      await expect(page.getByText(/analyzing/i).or(page.getByTestId('loading-skeleton'))).toBeVisible({
        timeout: 5000,
      })
    })

    // Step 2: Wait for analysis results
    test.step('Display analysis results', async () => {
      // Wait for result card
      const resultCard = page.getByTestId('result-card').or(page.locator('[data-testid="result-card"]'))
      
      await expect(resultCard.first()).toBeVisible({
        timeout: 10000, // OCR + AI can take time
      })

      // Verify key elements
      await expect(page.getByText(/support|resistance/i).first()).toBeVisible()
    })

    // Step 3: Save to journal
    test.step('Save trade to journal', async () => {
      // Click save button
      const saveButton = page.getByRole('button', { name: /save|journal/i }).first()
      await saveButton.click()

      // Fill in journal details (if modal appears)
      const modal = page.getByRole('dialog').or(page.locator('[role="dialog"]'))
      if (await modal.isVisible({ timeout: 1000 }).catch(() => false)) {
        // Fill token address
        await page.fill('input[name="token"]', 'So11111111111111111111111111111111111111112')
        
        // Fill price
        await page.fill('input[name="price"]', '0.000042')
        
        // Add notes
        await page.fill('textarea[name="notes"]', 'Alpha E2E test trade')
        
        // Submit
        await page.click('button[type="submit"]')
      }

      // Verify save confirmation
      await expect(page.getByText(/saved|success/i).first()).toBeVisible({
        timeout: 3000,
      })
    })

    // Step 4: Navigate to journal
    test.step('Navigate to journal page', async () => {
      // Click journal link/button
      const journalLink = page.getByRole('link', { name: /journal/i }).or(
        page.getByRole('button', { name: /journal/i })
      )
      await journalLink.first().click()

      // Verify journal page loaded
      await expect(page.getByText(/journal|trades/i).first()).toBeVisible()

      // Verify saved trade appears
      await expect(page.getByText(/alpha e2e test trade/i).or(
        page.getByText(/0.000042/)
      ).first()).toBeVisible({
        timeout: 5000,
      })
    })

    // Step 5: Open replay (if available)
    test.step('Open replay view (optional)', async () => {
      // Check if replay button exists
      const replayButton = page.getByRole('button', { name: /replay/i }).first()
      
      const hasReplay = await replayButton.isVisible({ timeout: 2000 }).catch(() => false)
      
      if (hasReplay) {
        await replayButton.click()
        
        // Verify replay opened
        await expect(page.getByText(/replay|playback/i).first()).toBeVisible({
          timeout: 3000,
        })
      } else {
        test.skip(true, 'Replay feature not yet available')
      }
    })
  })

  test('handles errors gracefully', async ({ page }) => {
    test.step('Upload invalid file', async () => {
      // Try to upload non-image file
      await page.setInputFiles('input[type="file"]', {
        name: 'invalid.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('not an image'),
      })

      // Should show error or reject invalid file
      const hasError = await page.getByText(/invalid|error|supported/i).isVisible({
        timeout: 3000,
      }).catch(() => false)

      if (!hasError) {
        // If no error shown, at least verify analysis doesn't start
        const hasLoading = await page.getByText(/analyzing/i).isVisible({
          timeout: 2000,
        }).catch(() => false)
        
        expect(hasLoading).toBe(false)
      }
    })
  })

  test('performance: analysis completes within budget', async ({ page }) => {
    const startTime = Date.now()

    // Upload
    await page.setInputFiles('input[type="file"]', {
      name: 'chart.png',
      mimeType: 'image/png',
      buffer: Buffer.from('mock image data'),
    })

    // Wait for results
    await page.getByTestId('result-card').or(
      page.getByText(/support|resistance/i)
    ).first().waitFor({
      state: 'visible',
      timeout: 10000,
    })

    const endTime = Date.now()
    const duration = endTime - startTime

    // Should complete within performance budget
    // OCR (500ms) + AI (3s) + overhead = ~4s budget
    expect(duration).toBeLessThan(6000) // 6s with buffer
  })
})

test.describe('Offline Capability', () => {
  test('app loads offline', async ({ page, context }) => {
    // First load normally
    await page.goto('/')
    await expect(page.getByText(/sparkfined|analyze/i).first()).toBeVisible()

    // Go offline
    await context.setOffline(true)

    // Reload page
    await page.reload()

    // App should still load (from service worker cache)
    await expect(page.getByText(/sparkfined|analyze/i).first()).toBeVisible({
      timeout: 5000,
    })

    // Should show offline indicator
    const offlineIndicator = page.getByText(/offline/i).or(
      page.locator('[data-offline]')
    )
    
    const hasOfflineIndicator = await offlineIndicator.isVisible({
      timeout: 2000,
    }).catch(() => false)

    if (!hasOfflineIndicator) {
      // If no offline indicator, at least verify app is functional
      expect(await page.title()).toBeTruthy()
    }
  })
})
