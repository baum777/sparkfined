# 🔧 Sparkfined Operations Runbook

Operational guide for deploying, monitoring, and maintaining the Sparkfined PWA.

---

## Table of Contents

1. [Service Worker Update Runbook](#service-worker-update-runbook)
2. [Lighthouse CI Usage & Thresholds](#lighthouse-ci-usage--thresholds)
3. [CSP Headers Configuration](#csp-headers-configuration)
4. [Telemetry & Monitoring](#telemetry--monitoring)
5. [Deployment Checklist](#deployment-checklist)
6. [Incident Response](#incident-response)

---

## Service Worker Update Runbook

### Overview
Sparkfined uses a **manual update flow** to prevent unexpected page reloads:
- `vite-plugin-pwa` with `registerType: 'prompt'`
- Update banner shown when new SW is waiting
- User explicitly confirms update

### Update Flow

```
1. Deploy new version → Vercel/Netlify builds new SW
2. User's browser checks for update (on page load or every 60s)
3. New SW installed → enters "waiting" state
4. UpdateBanner component shows: "New version available!"
5. User clicks "Update Now" → SW receives SKIP_WAITING message
6. Page reloads → new SW takes control
```

### Troubleshooting Updates

#### Update Not Appearing

**Check 1: Verify Deployment**
```bash
# Check deployed SW version
curl -I https://sparkfined.vercel.app/sw.js
# Look for Last-Modified or ETag header
```

**Check 2: Force SW Update (Client-side)**
```js
// In browser console:
navigator.serviceWorker.getRegistration().then(reg => {
  if (reg) {
    reg.update().then(() => console.log('Update check forced'));
  }
});
```

**Check 3: Clear SW Cache (Server-side)**
- Add cache-busting header to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    }
  ]
}
```

#### Update Stuck in "Waiting" State

**Symptom:** New SW never activates despite user clicking "Update Now"

**Solution 1: Check SKIP_WAITING Handler**
```bash
# Verify SW listens for SKIP_WAITING message
grep -r "SKIP_WAITING" dist/sw.js
```

**Solution 2: Force Unregister (last resort)**
```js
// In browser console:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
// Then hard reload: Ctrl+Shift+R
```

#### Users Not Seeing Update Banner

**Possible Causes:**
1. `UpdateBanner` component not mounted
2. `swUpdater.ts` not detecting waiting SW
3. SW update polling disabled

**Debug Steps:**
```js
// Check if SW is waiting:
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Waiting SW:', reg.waiting);
  console.log('Active SW:', reg.active);
  console.log('Installing SW:', reg.installing);
});
```

---

## Lighthouse CI Usage & Thresholds

### Overview
Lighthouse CI runs on every PR to enforce performance and PWA standards.

### Configuration
File: `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "dist",
      "numberOfRuns": 3,
      "url": ["/", "/journal", "/replay"]
    },
    "assert": {
      "assertions": {
        "categories:pwa": ["error", {"minScore": 1}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}],
        "interactive": ["error", {"maxNumericValue": 3500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}
```

### Budget Thresholds

| Metric | Threshold | Severity | Rationale |
|--------|-----------|----------|-----------|
| **PWA Score** | 100 | Error | Must be installable |
| **LCP** | < 2.5s | Error | Core Web Vital |
| **TBT** | < 300ms | Error | Interactivity |
| **TTI** | < 3.5s | Error | Time to Interactive |
| **CLS** | ≤ 0.1 | Error | Layout stability |
| **FCP** | < 2.0s | Warn | First paint |
| **Speed Index** | < 3.0s | Warn | Perceived speed |

### Running LHCI Locally

```bash
# 1. Build the app
pnpm build

# 2. Install LHCI
npm install -g @lhci/cli@0.14.x

# 3. Run audit
lhci autorun --config=lighthouserc.json

# 4. View report
open .lighthouseci/lhr-*.html
```

### CI Integration

**GitHub Actions Job:**
```yaml
lighthouse-ci:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: pnpm build
    - run: npx lhci autorun
    - uses: actions/upload-artifact@v4
      with:
        name: lighthouse-report
        path: .lighthouseci
```

**Viewing Reports:**
1. Go to **Actions** tab → Select workflow run
2. Scroll to **Artifacts** → Download `lighthouse-report`
3. Open `.html` files locally

### Handling LHCI Failures

**LCP > 2.5s (Largest Contentful Paint)**
- Check image optimization (WebP, lazy loading)
- Reduce bundle size (code splitting)
- Enable CDN caching

**TBT > 300ms (Total Blocking Time)**
- Profile JavaScript with DevTools
- Use `React.lazy()` for heavy components
- Move non-critical code to Web Workers

**CLS > 0.1 (Cumulative Layout Shift)**
- Set explicit width/height on images/iframes
- Avoid inserting content above existing content
- Use CSS `aspect-ratio` for responsive images

**PWA Score < 100**
- Check `manifest.json` validity
- Verify SW is registered and active
- Ensure HTTPS (or localhost)
- Add `apple-touch-icon` for iOS

---

## CSP Headers Configuration

### Overview
Content Security Policy (CSP) prevents XSS and injection attacks.

### Current CSP (Vercel)
File: `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.dexscreener.com https://api.dexpaprika.com https://api.moralis.io; worker-src 'self' blob:"
        }
      ]
    }
  ]
}
```

### CSP Directives Explained

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Fallback for all resources |
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval'` | Allow inline scripts (for React) |
| `style-src` | `'self' 'unsafe-inline'` | Allow inline styles (for Tailwind) |
| `img-src` | `'self' data: https:` | Allow images from any HTTPS source |
| `connect-src` | `'self' https://api.*` | Allow API calls to specified domains |
| `worker-src` | `'self' blob:` | Allow service workers |

### Tightening CSP (Production Hardening)

**Remove `'unsafe-inline'` for scripts:**
1. Use `nonce` or `hash` for inline scripts
2. Extract all inline scripts to external files
3. Update CSP: `script-src 'self' 'nonce-{random}'`

**Remove `'unsafe-eval'`:**
- Avoid `new Function()` or `eval()`
- Use strict mode for all dependencies

**Example Strict CSP:**
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'sha256-{hash}';
  img-src 'self' data: https://cdn.example.com;
  connect-src 'self' https://api.dexscreener.com;
  worker-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

### Testing CSP

```bash
# Test locally with HTTP headers
curl -I https://sparkfined.vercel.app | grep -i content-security

# Or check in browser DevTools → Network → Response Headers
```

**Report-Only Mode (for testing):**
```json
{
  "key": "Content-Security-Policy-Report-Only",
  "value": "default-src 'self'; report-uri /csp-report"
}
```

---

## Telemetry & Monitoring

### Overview
Sparkfined uses `TelemetryService` for client-side event tracking.

### Key Metrics

| Event | Type | Purpose |
|-------|------|---------|
| `app_load` | Performance | Track app boot time |
| `sw_registered` | PWA | SW registration success |
| `sw_updated` | PWA | New version deployed |
| `offline_mode` | Network | User went offline |
| `analysis_completed` | Feature | OCR analysis finished |
| `trade_saved` | Feature | Trade saved to journal |

### Exporting Telemetry

```js
// In browser console:
import { TelemetryService } from './lib/TelemetryService';

// Export all events
const events = await TelemetryService.exportEvents();
console.log(JSON.stringify(events, null, 2));

// Filter by date range
const filtered = events.filter(e => 
  e.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000 // last 7 days
);
```

### Integration with Analytics (Future)

**Google Analytics 4:**
```js
// In TelemetryService.ts
gtag('event', event.type, {
  category: event.category,
  label: event.metadata?.label,
  value: event.metadata?.value,
});
```

**PostHog:**
```js
posthog.capture(event.type, event.metadata);
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Run `pnpm lint` → no errors
- [ ] Run `pnpm typecheck` → no errors
- [ ] Run `pnpm test` → all pass
- [ ] Run `pnpm build` → dist/ created
- [ ] Test locally: `pnpm preview`
- [ ] Check lighthouse score: `lhci autorun`
- [ ] Review git diff for sensitive data

### Deployment

- [ ] Merge PR to `main` branch
- [ ] Vercel auto-deploys (check dashboard)
- [ ] Wait for deployment success (green checkmark)
- [ ] Test on production URL

### Post-Deployment

- [ ] Verify SW is registered: `navigator.serviceWorker.controller`
- [ ] Check update flow: Deploy again, verify banner appears
- [ ] Test offline mode: DevTools → Network → Offline
- [ ] Monitor errors: Check Vercel logs or Sentry
- [ ] Announce update (optional): Twitter, Discord, etc.

---

## Incident Response

### Critical Issues

#### 1. App Not Loading (White Screen)

**Check:**
1. Vercel deployment status (dashboard)
2. Browser console errors (F12)
3. SW registration status

**Fix:**
```bash
# Roll back deployment
vercel rollback <deployment-id>

# Or force cache clear
curl -X PURGE https://sparkfined.vercel.app/
```

#### 2. Service Worker Causes Infinite Loop

**Symptom:** App keeps reloading automatically

**Fix:**
1. Unregister SW:
```js
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
```
2. Clear cache: Ctrl+Shift+R
3. Fix SW code, redeploy

#### 3. Update Banner Never Disappears

**Symptom:** Banner shows on every load despite updating

**Fix:**
1. Check if `localStorage` is corrupted:
```js
localStorage.clear();
window.location.reload();
```
2. Verify SW update logic in `swUpdater.ts`

---

### Non-Critical Issues

#### Slow Performance (LCP > 3s)

**Debug:**
```bash
# Run Lighthouse
npx lhci autorun

# Profile in DevTools
# Performance tab → Record → Analyze bottlenecks
```

**Common Fixes:**
- Lazy load images: `loading="lazy"`
- Code split routes: `React.lazy()`
- Use CDN for static assets

---

#### Offline Mode Not Working

**Debug:**
```js
// Check SW cache
caches.keys().then(keys => console.log('Cache keys:', keys));

// Check cache contents
caches.open('workbox-precache-v2-...').then(cache => {
  cache.keys().then(keys => console.log('Cached URLs:', keys));
});
```

**Fix:**
- Re-register SW: Clear cache and reload
- Check `navigateFallback` in `vite.config.ts`

---

## Support Contacts

| Issue Type | Contact |
|------------|---------|
| Deployment | Vercel Support / DevOps team |
| Performance | Frontend Lead |
| Security | Security team / CISO |
| User reports | support@sparkfined.com |

---

## Version History

| Version | Date       | Changes                          |
|---------|------------|----------------------------------|
| v1.0.0  | 2025-10-29 | Initial operations runbook |

---

**For urgent issues, escalate to on-call engineer.**
