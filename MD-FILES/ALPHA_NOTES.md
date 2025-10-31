# Sparkfined Alpha — Implementation Notes

**Version:** 1.0.0-alpha
**Target:** Production-ready Alpha with provider muxing, AI teaser, and enhanced UX
**Status:** Scaffolded (Issues 0-15)

---

## Overview

This document provides implementation context for the Sparkfined Alpha release. The alpha introduces:

- **Data Provider Muxing** (Primary/Secondary fallback)
- **AI Teaser Analysis** (Optional, flagged)
- **Enhanced Journal v2** (Screenshots, presets, CSV export)
- **Replay v2** (Scrubber, zoom, ghost cursor)
- **Performance Budgets** (Telemetry & monitoring)
- **Security Hardening** (Input validation, API shielding)

---

## Issue Board (0-15)

### Phase 1: Data Infrastructure (Issues 0-4)

**Issue 0 — Bootstrap & Flags**
- Feature flags in `.env.example` and `flags.ts`
- `TokenSnapshot` type for normalized data
- Defaults: Primary=dexpaprika, Secondary=moralis, AI=none

**Issue 1 — Edge Proxies**
- `/api/dexpaprika/tokens/[address]` — 5s timeout, 1× retry
- `/api/moralis/token/[address]` — 6s timeout, X-API-Key header
- Protects API keys from client exposure

**Issue 2 — DexPaprika Adapter**
- Maps DexPaprika response to `TokenSnapshot`
- Defensive field extraction (price, high24, low24, volume, liquidity)
- Optional Zod validation

**Issue 3 — Moralis Adapter**
- Maps Moralis response to `TokenSnapshot`
- Secondary/fallback provider
- Same interface as DexPaprika

**Issue 4 — Provider Muxing + SWR Cache**
- `getTokenSnapshot()` tries Primary → Secondary
- SWR cache 300s for `/api/*` routes
- Telemetry events: `provider_fallback`, `snapshot_age_s`

### Phase 2: Analysis (Issues 5-7)

**Issue 5 — OCR Stabilization**
- Worker pool (1-2 workers)
- Regex suite: RSI, BB, EMA/SMA, %, Price
- Confidence scoring
- Target: p95 ≤ 1.2s

**Issue 6 — Heuristic Fallback**
- Local S/R calculation (±1.5-3.5%)
- SL at -5%, TP at +5-10%
- Deterministic, <300ms
- Always available (no API calls)

**Issue 7 — AI Teaser Adapter**
- Router: none | openai | grok | anthropic
- Timeout: 2s (never blocks UI)
- JSON schema validation (Zod)
- Fallback to heuristic on failure/timeout

### Phase 3: UX Enhancements (Issues 8-11)

**Issue 8 — Result Card v2**
- Provider badge (dexpaprika/moralis)
- AI badge (when AI is used)
- Snapshot age indicator
- Collapsible advanced analysis
- Target: CLS-free, skeleton <200ms

**Issue 9 — Journal v2**
- Screenshots stored in IndexedDB (Blob)
- Presets: Winners/Losers/Breakouts/Range
- CSV export includes teaser fields (SL/TP/indicators)
- Target: Save ≤60ms, Grid ≤250ms

**Issue 10 — Replay v2**
- Keyboard: ←/→ (5s), Shift+←/→ (20s)
- Ctrl+Wheel zoom (0.5x - 3.0x)
- Ghost cursor interpolation
- Target: Open ≤350ms p95

**Issue 11 — Export Bundle**
- ZIP with CSV + PNG share cards
- Pre-scale large images
- Target: <800ms p95

### Phase 4: Production Ready (Issues 12-15)

**Issue 12 — Performance & Telemetry**
- Budgets: Start ≤1s, API median ≤500ms, AI teaser p95 ≤2s
- Events: `ai_teaser_ms`, `replay_open_ms`, `journal_save_ms`, etc.
- Workbox precache for app shell

**Issue 13 — Security & Guardrails**
- Solana address validation (Base58 regex)
- Service Worker denylist for `/api/*`
- No keys in client bundle
- Optional CSP

**Issue 14 — Test Suites & E2E**
- Unit tests: Adapters, heuristic, teaser schema, replay math
- E2E: Upload→result, fallback, replay scrubber
- Target: ≥80% coverage, CI <6min

**Issue 15 — Docs & Canary**
- `ALPHA_NOTES.md` (this file)
- `API_USAGE.md` (provider configs)
- `QA_CHECKLIST.md` (pre-deploy)
- Canary rollout: 10-20% traffic

---

## Feature Flags

Key flags in `.env.example`:

```bash
# Data Providers
VITE_DATA_PRIMARY=dexpaprika
VITE_DATA_SECONDARY=moralis

# AI Analysis
VITE_ANALYSIS_AI_PROVIDER=none  # none | openai | grok
VITE_ENABLE_AI_TEASER=false

# Performance
PERF_BUDGET_START_MS=1000
PERF_BUDGET_API_MEDIAN_MS=500
PERF_BUDGET_AI_TEASER_P95_MS=2000
```

---

## Performance Budgets

| Metric | Budget | Enforcement |
|--------|--------|-------------|
| App Start | ≤1s | Lighthouse CI |
| API Median | ≤500ms | Telemetry alerts |
| AI Teaser p95 | ≤2s | Timeout + fallback |
| Replay Open p95 | ≤350ms | Profiling |
| Journal Save | ≤60ms | Unit tests |
| Journal Grid | ≤250ms | E2E tests |
| Export ZIP p95 | ≤800ms | Integration tests |

---

## Deployment Checklist

See `QA_CHECKLIST.md` for full pre-deploy checklist.

**Quick pre-flight:**
1. ✅ Build passes: `pnpm lint && pnpm typecheck && pnpm build`
2. ✅ Tests pass: `pnpm test && pnpm test:e2e`
3. ✅ No API keys in bundle: `grep -r "API_KEY" dist/`
4. ✅ Feature flags configured correctly
5. ✅ Canary % set (10-20%)

---

## Known Limitations (Alpha)

- **AI Teaser:** Optional, defaults to 'none' (heuristic only)
- **Edge Functions:** Require serverless deployment (Vercel/Netlify/Cloudflare)
- **OCR:** Best effort, confidence scoring added
- **E2E Tests:** Playwright required, some tests skipped in scaffold

---

## Next Steps (Post-Alpha)

1. **Beta Phase:** Enable AI teaser by default (with user opt-in)
2. **Phase 6:** OrderFlow & WalletFlow providers
3. **Phase 7:** Multi-chain support (Ethereum, BSC, etc.)
4. **Phase 8:** Collaborative features (shared setups)

---

## Support & Feedback

- Issues: https://github.com/baum777/sparkfined/issues
- Docs: `API_USAGE.md`, `QA_CHECKLIST.md`
- CI Status: `.github/workflows/ci.yml`

---

**Last Updated:** 2025-10-29
**Scaffold Completed:** Issue Board 0-15
**Ready for:** M1 (Edge Proxies) implementation
