/**
 * Alpha Issue 5: OCR Stabilization
 * Tests for OCR parsing and label extraction
 */

import { describe, it, expect } from 'vitest';

describe('OCR Service', () => {
  it.skip('extracts at least one label from sample image', async () => {
    // TODO: Load sample image
    // const res = await parseOcr(samplePng);
    // expect(res.labels.length).toBeGreaterThan(0);
    // expect(res.confidence).toBeGreaterThan(0);
  });

  it.skip('completes within performance budget (p95 <= 1.2s)', async () => {
    // TODO: Performance test with multiple samples
  });

  it.skip('extracts RSI values correctly', async () => {
    // TODO: Test RSI pattern matching
  });

  it.skip('extracts price levels correctly', async () => {
    // TODO: Test price pattern matching
  });

  it.skip('extracts moving averages (EMA/SMA)', async () => {
    // TODO: Test MA pattern matching
  });

  it.skip('handles OCR errors gracefully', async () => {
    // TODO: Test error handling
  });
});
