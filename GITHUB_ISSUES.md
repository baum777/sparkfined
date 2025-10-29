# GitHub Issues for Alpha Board (Issues 0-15)

This document contains the content for all 16 GitHub issues that need to be created manually.

**Labels to use:** `alpha` + specific labels as noted for each issue

---

## Issue 0: Bootstrap & Flags

**Title:** `chore(alpha): Bootstrap & Flags`

**Labels:** `alpha`, `chore`, `infra`

**Description:**

Richte ENV-Flags und Basistypen ein. Stelle sicher, dass Flags via `import.meta.env` gelesen werden können.

**Dateien (neu/ändern):**
- `.env.example` ✅
- `src/lib/config/flags.ts` ✅
- `src/types/data.ts` ✅
- `tests/unit/flags.test.ts` ✅

**Checkliste:**
- [x] `.env.example` with `DATA_PROVIDER_PRIMARY/SECONDARY`, `ANALYSIS_AI_PROVIDER`, Provider BASE URLs, API Keys
- [ ] `flags.ts` (`pickProvider()`, Defaults, Guards)
- [ ] `TokenSnapshot` Type
- [ ] Unit-Test für Flag-Parsing

**DoD:** Build & Test grün; Flags in App lesbar.

**Test-Snippet (Vitest):**
```ts
import { describe,it,expect } from 'vitest';
import { pickProvider } from '@/lib/config/flags';

describe('flags',()=>{
  it('reads defaults safely',()=>{
    const f = pickProvider();
    expect(['dexpaprika','moralis','mock']).toContain(f.primary);
    expect(['moralis','none']).toContain(f.secondary);
    expect(['none','openai','grok']).toContain(f.ai);
  });
});
```

---

## Issue 1: Edge Proxies (DexPaprika, Moralis)

**Title:** `feat(api): edge proxies for DexPaprika & Moralis`

**Labels:** `alpha`, `feat`, `infra`

**Description:**

Schütze API Keys und route Client über `/api/*`.

**Dateien:**
- `api/dexpaprika/tokens/[address].ts` ✅
- `api/moralis/token/[address].ts` ✅
- `src/lib/net/withTimeout.ts` ✅
- `tests/integration/api-proxy.test.ts` ✅

**Checkliste:**
- [ ] DexPaprika passthrough mit 5s Timeout, 1× Retry
- [ ] Moralis mit `X-API-Key` Header
- [ ] Fehlercodes durchreichen (4xx/5xx)
- [ ] Keine Keys im Client-Bundle

**DoD:** curl → JSON; Preview Deploy ok.

**Test-Snippet:**
```ts
import { describe,it,expect } from 'vitest';
// Pseudotest: via msw mock fetch '/api/dexpaprika/tokens/...' → 200 JSON
```

---

## Issue 2: Adapter: DexPaprika (Primary)

**Title:** `feat(adapter): DexPaprika TokenSnapshot (primary)`

**Labels:** `alpha`, `feat`, `adapter`

**Description:**

Implementiere TokenSnapshot-Mapping aus DexPaprika.

**Dateien:**
- `src/lib/adapters/dexpaprikaAdapter.ts` (exists)
- `tests/unit/dexpaprika.adapter.test.ts` (exists)

**Checkliste:**
- [ ] `getDexPaprikaToken(address)`
- [ ] Defensive Mappings (`price/high24/low24/vol24/liquidity`)
- [ ] Zod-Guard optional

**DoD:** Tests (happy/not-found/shape drift) grün.

**Test-Snippet:**
```ts
import { describe,it,expect } from 'vitest';
import { mapDexPaprika } from '@/lib/adapters/dexpaprikaAdapter';

describe('dexPaprika adapter',()=>{
  it('maps happy path',()=>{
    const j = { symbol:'SOL', name:'Solana', priceUsd: 150, ohlcv:{h24:{high:155,low:140}}, volume24h: 123456, pool:{liquidity: 999} };
    const snap = mapDexPaprika(j,'So11111111111111111111111111111111111111112');
    expect(snap.price).toBe(150);
    expect(snap.high24).toBe(155);
    expect(snap.low24).toBe(140);
  });
});
```

---

## Issue 3: Adapter: Moralis (Secondary)

**Title:** `feat(adapter): Moralis TokenSnapshot (secondary)`

**Labels:** `alpha`, `feat`, `adapter`

**Description:**

Implementiere Moralis-Adapter als Fallback.

**Dateien:**
- `src/lib/adapters/moralisAdapter.ts` (exists)
- `tests/unit/moralis.adapter.test.ts` ✅

**Checkliste:**
- [ ] `getMoralisToken(address)`
- [ ] Einheitliches TokenSnapshot Shape
- [ ] Fehlerbehandlung & Timeout

**DoD:** Fallback funktionsfähig, Tests grün.

**Test-Snippet:**
```ts
it('maps moralis snapshot',()=>{
  const j = { symbol:'SOL', name:'Solana', usdPrice: 151, volume24h: 1000, liquidity: 800 };
  const s = mapMoralis(j,'addr');
  expect(s.price).toBe(151);
});
```

---

## Issue 4: Provider Muxing + SWR Cache

**Title:** `feat(data): provider muxing with SWR cache`

**Labels:** `alpha`, `feat`, `adapter`

**Description:**

Wähle Primary→Secondary; cachte `/api/*` 300s.

**Dateien:**
- `src/lib/data/getTokenSnapshot.ts` ✅
- `vite.config.ts` (PWA workbox runtimeCaching update)
- `tests/unit/muxing.test.ts` ✅

**Checkliste:**
- [ ] try/catch Fallback
- [ ] SWR 300s für `/api/*`
- [ ] Telemetry Events (provider)

**DoD:** Offline zeigt letzten Snapshot.

**Test-Snippet:**
```ts
it('falls back to secondary on primary error', async ()=>{
  // mock primary fail → expect secondary result
});
```

---

## Issue 5: OCR Stabilisierung

**Title:** `feat(ocr): worker pool, regex suite, confidence`

**Labels:** `alpha`, `feat`, `ocr`

**Description:**

Stabilisiere OCR Laufzeit & Label-Qualität.

**Dateien:**
- `src/lib/ocr/ocrService.ts` (exists)
- `tests/unit/ocr.parse.test.ts` ✅
- `assets/ocr-samples/*.png` (3 Proben) ✅

**Checkliste:**
- [ ] Worker-Pool (1–2)
- [ ] Regex: RSI, BB, EMA/SMA, %, Price
- [ ] Confidence Score im Output

**DoD:** OCR p95 ≤1.2s; ≥1 Label bei 2/3 Proben.

**Test-Snippet:**
```ts
it('extracts at least one label', async ()=>{
  const res = await parseOcr(samplePng);
  expect(res.labels.length).toBeGreaterThan(0);
});
```

---

## Issue 6: Heuristik Fallback

**Title:** `feat(analysis): local heuristic fallback`

**Labels:** `alpha`, `feat`, `analysis`

**Description:**

Berechne S/R ±%, SL/TP deterministisch.

**Dateien:**
- `src/lib/analysis/heuristic.ts` ✅
- `tests/unit/heuristic.test.ts` ✅

**Checkliste:**
- [x] S/R ±(1.5–3.5)%
- [x] SL 5%, TP 5–10%
- [ ] Seeded Determinismus (optional)

**DoD:** <300ms; stabile Zahlen.

**Test-Snippet:**
```ts
it('produces consistent levels',()=>{
  const snap = { price: 1.0, high24: 1.1, low24: 0.9 } as any;
  const h = heuristic(snap);
  expect(h.stop_loss).toBeCloseTo(0.95, 2);
});
```

---

## Issue 7: KI-Teaser Adapter (Flagged)

**Title:** `feat(ai): teaser adapter (openai|grok|none)`

**Labels:** `alpha`, `feat`, `ai`

**Description:**

Routen KI-Provider; JSON Schema validieren; Timeout 2s.

**Dateien:**
- `src/lib/ai/teaserAdapter.ts` (exists)
- `src/types/teaser.ts` ✅
- `tests/unit/teaser.schema.test.ts` ✅

**Checkliste:**
- [ ] Router by Flag
- [ ] Kurz-Prompt (System/User)
- [ ] zod-Validierung
- [ ] Fallback = Heuristik

**DoD:** UI nie blockiert; ≤2s p95; Schema ok.

**Test-Snippet:**
```ts
it('validates teaser json',()=>{
  const j = { sr_levels:[{label:'S1',price:1.01}], stop_loss:0.95, tp:[1.05], indicators:['RSI:70'], teaser_text:'bullish'};
  expect(TeaserSchema.safeParse(j).success).toBe(true);
});
```

---

## Issue 8: Result-Card v2

**Title:** `feat(ui): result card v2 (badges, advanced)`

**Labels:** `alpha`, `feat`, `ui`

**Description:**

Kompakte Darstellung der Analyse mit Advanced-Bereich.

**Dateien:**
- `src/components/ResultCard.tsx` (exists)
- `tests/unit/result-card.render.test.tsx` ✅

**Checkliste:**
- [ ] Badges: provider/ai
- [ ] Key Levels, SL/TP, Indicators
- [ ] "age" Hinweis
- [ ] A11y & Skeleton

**DoD:** Kein CLS; Axe-Check ok.

**Test-Snippet:**
```tsx
import { render,screen } from '@testing-library/react';
import ResultCard from '@/components/ResultCard';

test('renders key levels',()=>{
  render(<ResultCard data={{ sr_levels:[{label:'S1',price:1.01}], stop_loss:0.95, tp:[1.05], indicators:[], teaser_text:'' }} />);
  expect(screen.getByText('S1')).toBeInTheDocument();
});
```

---

## Issue 9: Journal v2

**Title:** `feat(journal): screenshot store + presets + csv`

**Labels:** `alpha`, `feat`, `ui`

**Description:**

Screenshots lokal speichern, Presets, CSV Export mit Teaserfeldern.

**Dateien:**
- `src/lib/JournalService.ts` ✅
- `src/pages/JournalPage.tsx` (exists)
- `tests/unit/journal.crud.test.ts` ✅

**Checkliste:**
- [ ] Blob-Store (IndexedDB)
- [ ] Presets (W/L/Breakout/Range)
- [ ] CSV Export erweitert

**DoD:** Save ≤60ms; Grid ≤250ms p95.

**Test-Snippet:**
```ts
it('saves and filters entries', async ()=>{
  const id = await JournalService.save({ token:'SOL', price:150, status:'winner' });
  const rows = await JournalService.query({ preset:'W' });
  expect(rows.find(r=>r.id===id)).toBeTruthy();
});
```

---

## Issue 10: Replay v2

**Title:** `feat(replay): scrubber + zoom + ghost cursor`

**Labels:** `alpha`, `feat`, `ui`

**Description:**

Besseres Playback mit Tastenkürzeln & Zoom.

**Dateien:**
- `src/components/ReplayModal.tsx` (check if exists)
- `src/lib/ReplayService.ts` ✅
- `tests/unit/replay.math.test.ts` ✅

**Checkliste:**
- [x] ←/→ 5s, Shift=20s
- [ ] Ctrl+Wheel Zoom
- [x] Ghost Cursor Interpolation

**DoD:** Open ≤350ms p95; Scrub flüssig.

**Test-Snippet:**
```ts
it('calculates scrub jumps',()=>{
  expect(jump(10,'left')).toBe(5);
  expect(jump(10,'shift-right')).toBe(30);
});
```

---

## Issue 11: Export Bundle (ZIP)

**Title:** `feat(export): zip bundle (csv + png)`

**Labels:** `alpha`, `feat`, `ui`

**Description:**

Ein Klick Export für Sharing/Archiv.

**Dateien:**
- `src/lib/ExportService.ts` ✅
- `tests/unit/export.zip.test.ts` ✅

**Checkliste:**
- [ ] ZIP mit CSV + PNG Share-Card
- [ ] Pre-scale große PNGs

**DoD:** <800ms p95; Bundle valid.

**Test-Snippet:**
```ts
it('builds a zip bundle', async ()=>{
  const zip = await ExportService.bundle([{token:'SOL', price:150}]);
  expect(zip.size).toBeGreaterThan(0);
});
```

---

## Issue 12: Performance & Telemetry

**Title:** `feat(perf): budgets + telemetry events`

**Labels:** `alpha`, `feat`, `perf`

**Description:**

Metriken & Budgets verdrahten.

**Dateien:**
- `src/lib/TelemetryService.ts` ✅
- `vite.config.ts` (workbox precache)
- `tests/unit/telemetry.test.ts` ✅

**Checkliste:**
- [ ] Budgets: Start ≤1s; API ≤500ms median; Teaser ≤2s p95
- [ ] Events: `ai_teaser_ms`, `snapshot_age_s`, `replay_open_ms`

**DoD:** Exportierbare JSON/CSV; Budgets grün auf Testdaten.

**Test-Snippet:**
```ts
it('records teaser timing',()=>{
  Telemetry.log('ai_teaser_ms', 1200);
  expect(Telemetry.dump().events.length).toBeGreaterThan(0);
});
```

---

## Issue 13: Security & Guardrails

**Title:** `chore(security): input validation + api shielding`

**Labels:** `alpha`, `chore`, `security`

**Description:**

Härten der Inputs & SW Einstellungen.

**Dateien:**
- `src/lib/validation/address.ts` ✅
- `vite.config.ts` (PWA navigateFallbackDenylist) - Already done
- `tests/unit/validation.address.test.ts` ✅

**Checkliste:**
- [x] Solana Base58 Regex
- [x] SW Denylist `/^/api/`
- [ ] Keys nur Server/Edge

**DoD:** Kein Key im Bundle, negative Tests ok.

**Test-Snippet:**
```ts
it('validates solana address',()=>{
  expect(isSolAddress('So11111111111111111111111111111111111111112')).toBe(true);
  expect(isSolAddress('0xdeadbeef')).toBe(false);
});
```

---

## Issue 14: Testsuites & E2E

**Title:** `test(e2e): upload→result + fallback + replay`

**Labels:** `alpha`, `tests`

**Description:**

E2E Smoke abdecken.

**Dateien:**
- `tests/e2e/upload.spec.ts` ✅
- `tests/e2e/fallback.spec.ts` ✅
- `tests/e2e/replay.spec.ts` ✅
- `.github/workflows/ci.yml` (ensure run)

**Checkliste:**
- [ ] Upload→Analyze sichtbare ResultCard
- [ ] Provider-Fallback (mock primary fail)
- [ ] Replay Scrub Keys funktionieren

**DoD:** CI <6min; 80%+ Coverage.

**Test-Snippet (Playwright):**
```ts
import { test, expect } from '@playwright/test';

test('upload to result', async ({ page }) => {
  await page.goto('/');
  await page.setInputFiles('input[type=file]', 'tests/fixtures/chart.png');
  await expect(page.getByTestId('result-card')).toBeVisible();
});
```

---

## Issue 15: Docs & Canary

**Title:** `docs(alpha): notes, api usage, qa checklist + canary rollout`

**Labels:** `alpha`, `docs`

**Description:**

Dokumentation & sicherer Rollout.

**Dateien:**
- `ALPHA_NOTES.md` ✅
- `API_USAGE.md` ✅
- `QA_CHECKLIST.md` ✅

**Checkliste:**
- [x] Flags/Provider erklären
- [x] Limits/Kosten/Rate-Limits nennen
- [ ] Canary 10–20% + Monitoring Plan

**DoD:** Deployer <30min lauffähig; Error-Rate <0.5% im Canary.

---

## Summary

- **Infrastructure & Data (0-4):** 5 issues
- **Analysis (5-7):** 3 issues
- **UX (8-11):** 4 issues
- **Production (12-15):** 4 issues

**Total:** 16 issues

**Scaffold Status:** ✅ All files created, unit tests passing, build green

**Next Step:** Implement Issue 1 (Edge Proxies) on separate branch.
