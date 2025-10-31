// tests/e2e/deploy.spec.ts
import { test, expect } from "@playwright/test";

const BASE = process.env.VERIFY_BASE_URL!;

test.describe("Sparkfined Deploy Smoke", () => {
  test("PWA installability & app shell", async ({ page, request }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();

    // Manifest
    const maniRes = await request.get(`${BASE}/manifest.webmanifest`);
    expect(maniRes.status()).toBe(200);
    const mani = await maniRes.json();
    expect(mani.name).toBeTruthy();
    expect(Array.isArray(mani.icons)).toBeTruthy();

    // Service worker ready (heuristic)
    await page.addInitScript(() => {
      // @ts-expect-error - Adding test helper to window
      window.__swReady = navigator.serviceWorker?.ready || Promise.resolve(null);
    });
    const swReady = await page.evaluate(async () => {
      // @ts-expect-error - Accessing test helper
      return !!(await window.__swReady)
    });
    expect(swReady).toBeTruthy();
  });

  test("Access page renders", async ({ page }) => {
    await page.goto(`${BASE}/access`, { waitUntil: "networkidle" });
    await expect(page.locator("body")).toBeVisible();
    // Minimal smoke check; adjust to your UI copy
    await expect(page.locator("text=Access").first()).toBeVisible();
  });
});
