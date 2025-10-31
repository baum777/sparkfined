# QA Checklist — Sparkfined Alpha

Pre-deployment quality assurance checklist for alpha release.

---

## Pre-Deploy Checks

### 1. Build & Tests

- [ ] `pnpm lint` passes with 0 warnings
- [ ] `pnpm typecheck` passes with 0 errors
- [ ] `pnpm test` passes (all unit tests)
- [ ] `pnpm test:e2e` passes (Playwright tests)
- [ ] `pnpm build` completes successfully
- [ ] Build bundle size ≤ 500KB (gzip)

### 2. Configuration

- [ ] `.env.example` is up to date with all required flags
- [ ] `.env.local` contains valid API keys (do not commit!)
- [ ] Feature flags match deployment target (alpha defaults)
- [ ] Provider selection is correct (Primary/Secondary)
- [ ] AI provider is set correctly (default: none)

### 3. Security

- [ ] No API keys in client bundle (`grep -r "API_KEY" dist/`)
- [ ] Solana address validation enabled (`ENABLE_INPUT_VALIDATION=true`)
- [ ] Service Worker denylist includes `/api/*`
- [ ] No console errors or warnings in production build
- [ ] CSP configured (optional, but recommended)

### 4. Performance

- [ ] App start time ≤ 1s (Lighthouse)
- [ ] API median latency ≤ 500ms (check telemetry)
- [ ] AI teaser p95 ≤ 2s (or disabled)
- [ ] Replay modal open ≤ 350ms
- [ ] Journal save ≤ 60ms
- [ ] Journal grid render ≤ 250ms
- [ ] Export ZIP ≤ 800ms p95
- [ ] OCR parse ≤ 1.2s p95

### 5. Functionality

#### Upload Flow
- [ ] Upload PNG/JPG chart
- [ ] OCR extracts at least 1 label
- [ ] Result card displays within 2s
- [ ] S/R levels, SL/TP visible
- [ ] Provider badge shows correct provider
- [ ] Age indicator shows snapshot age

#### Provider Muxing
- [ ] Primary provider works
- [ ] Secondary fallback works on primary failure
- [ ] Error state shows when both fail
- [ ] Cache works (300s TTL)
- [ ] Telemetry logs fallback events

#### AI Teaser (if enabled)
- [ ] AI teaser completes within 2s
- [ ] Falls back to heuristic on timeout
- [ ] JSON schema validation works
- [ ] AI badge shows in result card

#### Journal v2
- [ ] Save entry with screenshot
- [ ] Presets filter correctly (W/L/B/R)
- [ ] CSV export includes teaser fields
- [ ] Grid renders within 250ms
- [ ] Delete entry works

#### Replay v2
- [ ] Modal opens within 350ms
- [ ] ←/→ keys scrub 5s
- [ ] Shift+←/→ keys scrub 20s
- [ ] Ctrl+Wheel zooms (0.5x - 3.0x)
- [ ] Ghost cursor interpolates smoothly

#### Export Bundle
- [ ] ZIP contains CSV
- [ ] ZIP contains PNG share cards (if enabled)
- [ ] Export completes within 800ms
- [ ] ZIP file is valid

### 6. Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] Screen reader compatible
- [ ] No CLS (Cumulative Layout Shift)

### 7. Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Android (latest)

### 8. PWA Features

- [ ] Service Worker installs correctly
- [ ] Offline mode works (cached data)
- [ ] App shell precached
- [ ] Install prompt works
- [ ] Manifest.json valid

### 9. Telemetry

- [ ] Events log correctly
- [ ] Performance stats calculate correctly
- [ ] CSV export works
- [ ] JSON dump works
- [ ] No PII in telemetry data

### 10. Documentation

- [ ] `ALPHA_NOTES.md` is up to date
- [ ] `API_USAGE.md` reflects current config
- [ ] `README.md` has deployment instructions
- [ ] Issue board (0-15) matches implementation
- [ ] Commit messages follow convention

---

## Deployment Steps

### 1. Pre-Deploy

1. Run full checklist above
2. Create deployment branch: `git checkout -b deploy/alpha-v1.0.0`
3. Tag release: `git tag v1.0.0-alpha`
4. Push: `git push origin deploy/alpha-v1.0.0 --tags`

### 2. Deploy

#### Option A: Vercel

```bash
pnpm build
vercel --prod
```

#### Option B: Netlify

```bash
pnpm build
netlify deploy --prod
```

#### Option C: Cloudflare Pages

```bash
pnpm build
wrangler pages deploy dist
```

### 3. Canary Rollout

1. Set canary traffic to 10-20%
2. Monitor error rate (<0.5% target)
3. Monitor performance budgets
4. Monitor telemetry for anomalies
5. Gradually increase to 100%

### 4. Post-Deploy

- [ ] Smoke test: Upload → Result → Journal → Replay → Export
- [ ] Check provider fallback works
- [ ] Verify API keys are protected
- [ ] Monitor error rate for 1 hour
- [ ] Check Lighthouse score (≥90)

---

## Rollback Plan

If error rate exceeds 0.5% or critical bug found:

1. Revert to previous deployment
2. Investigate issue in local/staging
3. Fix and re-test
4. Re-deploy with fresh canary

---

## Issue Tracking

Link issues to deployments:

```
Deploy: v1.0.0-alpha
Issues Included: #0-#15
Resolved Bugs: #X, #Y
Known Issues: #Z (non-blocking)
```

---

## Sign-Off

- [ ] **Developer:** Code reviewed, tests pass
- [ ] **QA:** Checklist complete, no blockers
- [ ] **PM:** Feature complete, ready for users
- [ ] **DevOps:** Deployment successful, monitoring active

---

**Last Updated:** 2025-10-29
**Alpha Version:** 1.0.0-alpha
**Checklist Version:** 1.0
