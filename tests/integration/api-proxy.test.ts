/**
 * Alpha Issue 1: Edge Proxies
 * Integration tests for API proxy routes
 *
 * NOTE: These tests require mock service worker (msw) or similar
 */

import { describe, it, expect } from 'vitest';
import { fetchWithTimeout } from '@/lib/net/withTimeout';

describe('API Proxy Integration', () => {
  it.skip('proxies DexPaprika requests', async () => {
    // TODO: Implement with msw mock
    // const response = await fetch('/api/dexpaprika/tokens/So11111111111111111111111111111111111111112');
    // expect(response.ok).toBe(true);
    // const data = await response.json();
    // expect(data.provider).toBe('dexpaprika');
  });

  it.skip('proxies Moralis requests', async () => {
    // TODO: Implement with msw mock
    // const response = await fetch('/api/moralis/token/So11111111111111111111111111111111111111112');
    // expect(response.ok).toBe(true);
    // const data = await response.json();
    // expect(data.provider).toBe('moralis');
  });

  it('handles timeout correctly', async () => {
    const slowPromise = new Promise(resolve => setTimeout(resolve, 2000));

    await expect(
      fetchWithTimeout('http://example.com', {}, 100, 0)
    ).rejects.toThrow();
  });
});
