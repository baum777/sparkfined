# Sparkfined PWA - Operations Guide

**Target Audience:** Developers & DevOps  
**Version:** 1.0.0-alpha  
**Last Updated:** 2025-10-29

---

## 🏗️ Build & Deployment

### Local Development

```bash
# Install dependencies
pnpm install

# Install Playwright browsers (for E2E tests)
pnpm dlx playwright install chromium

# Start dev server (SW disabled in dev)
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Unit tests
pnpm test

# E2E tests (requires build)
pnpm build
pnpm preview  # In one terminal
pnpm test:e2e # In another terminal
```

### Production Build

```bash
# Full build with typecheck
pnpm build

# Preview production build
pnpm preview

# Run Lighthouse audit locally
pnpm dlx lighthouse http://localhost:5173 \
  --view \
  --preset=desktop \
  --output=html \
  --output-path=./lighthouse-report.html
```

### Bundle Analysis

```bash
# Build and analyze
pnpm build

# Check bundle size
du -sh dist/

# Detailed analysis (install vite-bundle-visualizer)
pnpm add -D vite-bundle-visualizer
# Add to vite.config.ts plugins array
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
# Data Providers
VITE_DATA_PRIMARY=dexpaprika
VITE_DATA_SECONDARY=moralis

# AI Analysis (optional)
VITE_ANALYSIS_AI_PROVIDER=none  # none | openai | grok | anthropic
VITE_ENABLE_AI_TEASER=false

# API Keys (server-side only, in Vercel dashboard)
OPENAI_API_KEY=sk-...
GROK_API_KEY=xai-...
ANTHROPIC_API_KEY=sk-ant-...
DEXPAPRIKA_API_KEY=...
MORALIS_API_KEY=...

# Performance Budgets
PERF_BUDGET_START_MS=1000
PERF_BUDGET_API_MEDIAN_MS=500
PERF_BUDGET_AI_TEASER_P95_MS=2000

# Debug
VITE_ENABLE_DEBUG=false
```

### Feature Flags

Edit `src/lib/config/flags.ts` to change defaults.

---

## 🚀 Deployment (Vercel)

### Initial Setup

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy
vercel --prod
```

### Environment Variables (Vercel Dashboard)

Add these in Vercel project settings:

**Server-side (API Keys):**
- `OPENAI_API_KEY`
- `GROK_API_KEY`
- `ANTHROPIC_API_KEY`
- `DEXPAPRIKA_API_KEY`
- `MORALIS_API_KEY`

**Client-side (Feature Flags):**
- `VITE_ANALYSIS_AI_PROVIDER` → `none` (default)
- `VITE_ENABLE_AI_TEASER` → `false` (default)
- `VITE_DATA_PRIMARY` → `dexpaprika`
- `VITE_DATA_SECONDARY` → `moralis`

### Deployment Checklist

- [ ] All tests passing (`pnpm test && pnpm test:e2e`)
- [ ] Build successful (`pnpm build`)
- [ ] Bundle size < 85 KB
- [ ] No API keys in client bundle (check `dist/`)
- [ ] Environment variables configured in Vercel
- [ ] CSP headers configured (`vercel.json`)
- [ ] Service worker scope correct (`/`)
- [ ] Manifest accessible (`/manifest.webmanifest`)

---

## 📊 Monitoring

### Telemetry Export

Users can export telemetry data from Settings:

1. Settings → Export Telemetry
2. Downloads JSON/CSV with:
   - Performance events (OCR, AI, API latency)
   - Error events (with stack traces)
   - Install/WCO metrics
   - No PII

### Key Metrics to Monitor

| Metric | Target | How to Check |
|--------|--------|--------------|
| OCR Parse Time | < 500ms | Telemetry export → `ocr_parse_ms` p95 |
| AI Analysis | < 3s | Telemetry export → `ai_teaser_ms` p95 |
| Install Rate | > 10% | `pwa_installed` / `install_prompt_shown` |
| Error Rate | < 1% | Count errors by severity |
| Offline Usage | Track | `offline_mode` events |

### Performance Budgets

Configured in `.lighthouserc.json`:

- **LCP** (Largest Contentful Paint): < 2.5s
- **FCP** (First Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **TBT** (Total Blocking Time): < 300ms

**Enforcement:** Lighthouse CI runs on every PR/push.

---

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage (if configured)
pnpm test -- --coverage
```

**Test Suites:**
- OCR Service (15 tests)
- AI Integration (17 tests)
- Telemetry (23 tests)
- PWA Manifest (8 tests)
- Service Worker (13 tests)
- Security CSP (13 tests)

**Total:** 89+ unit tests

### E2E Tests

```bash
# Headless
pnpm test:e2e

# Headed (see browser)
pnpm test:e2e:headed

# UI mode (interactive)
pnpm test:e2e:ui
```

**Test Suites:**
- Alpha happy-path (upload → journal → replay)
- PWA offline/install
- Settings persistence

### Manual Testing

**Desktop PWA (Chrome/Edge):**
1. Install app
2. Verify custom titlebar appears
3. Test drag-and-drop on titlebar
4. Toggle titlebar in Settings
5. Test offline mode (DevTools → Network → Offline)

**Mobile PWA (Android):**
1. Install app from Chrome
2. Verify splash screen
3. Test offline mode
4. Verify theme color in task switcher

**iOS (Safari):**
1. Add to home screen
2. Verify icon and splash
3. Test standalone mode
4. Verify status bar style (black-translucent)

---

## 🔐 Security

### API Key Management

**Never commit API keys to repository!**

- ✅ Server-side: Environment variables in Vercel dashboard
- ✅ Client-side: Only feature flags (`VITE_*`)
- ✅ Edge proxies: All API calls go through `/api/*` routes

**Audit command:**
```bash
# Check for leaked keys
grep -r "sk-" dist/
grep -r "API_KEY" dist/

# Should return no results
```

### CSP Violations

Check browser console for CSP violations:

```javascript
// DevTools Console
// Look for: "Refused to load... because it violates CSP"
```

If violations occur:
1. Identify the source/resource
2. Update CSP in `vercel.json` if legitimate
3. Remove resource if not needed

### Security Headers

Configured in `vercel.json`:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

---

## 📦 Service Worker

### Update Behavior

**Strategy:** `registerType: 'prompt'` (manual)

- **skipWaiting:** `false` - Don't force update
- **clientsClaim:** `false` - Don't take control immediately
- **Update prompt:** User sees notification, clicks to update

### Cache Strategies

| Resource | Strategy | TTL |
|----------|----------|-----|
| App Shell | Precache | Immutable |
| /api/* | StaleWhileRevalidate | 5 min |
| External APIs | StaleWhileRevalidate | 5 min |
| AI APIs | NetworkFirst | 1 min |
| Images | CacheFirst | 30 days |
| Google Fonts | CacheFirst | 1 year |

### Debugging Service Worker

```bash
# Chrome DevTools
chrome://inspect/#service-workers

# Check registration
Application → Service Workers

# View caches
Application → Cache Storage

# Network tab
Filter: "Served from ServiceWorker"
```

### Clear Service Worker Cache

**DevTools:**
1. Application → Clear storage
2. Check all boxes
3. Click "Clear site data"

**Programmatic:**
```javascript
// In browser console
caches.keys().then(names => {
  names.forEach(name => caches.delete(name))
})
```

---

## 🎨 Customization

### Theme Color

Edit `manifest.webmanifest` and `index.html`:

```json
// manifest.webmanifest
"theme_color": "#0A0A0A",
"background_color": "#0A0A0A"
```

```html
<!-- index.html -->
<meta name="theme-color" content="#0A0A0A" />
```

### Icons

Replace files in `public/`:
- `pwa-192x192.png` - Android/Desktop small
- `pwa-512x512.png` - Android/Desktop large  
- `apple-touch-icon.png` - iOS (180x180)
- `favicon.ico` - Browser tab
- `mask-icon.svg` - Safari pinned tab

**Requirements:**
- Use **maskable icon** safe zone (80% of canvas)
- Transparent or solid background
- SVG for mask-icon (monochrome)

### Shortcuts

Edit `manifest.webmanifest`:

```json
"shortcuts": [
  {
    "name": "New Analysis",
    "url": "/analyze",
    "icons": [...]
  }
]
```

---

## 🐛 Known Issues

### Window Controls Overlay

- **Limited browser support:** Chrome/Edge 105+ only
- **OS support:** Windows 10+, macOS 10.15+, Linux (varies)
- **Not available in:** Firefox, Safari, iOS

### iOS Limitations

- **No beforeinstallprompt event** - Must use Share → Add to Home Screen
- **No custom install prompt** - System-driven only
- **Limited service worker features** - Some caching strategies not supported

### Android Variations

- **Different prompt styles** - Varies by Chrome version and OEM customization
- **WebAPK generation** - May take a few seconds after install
- **Update behavior** - Android may auto-update without prompt in some cases

---

## 📈 Performance Optimization

### Reduce Bundle Size

1. **Code splitting** - Already configured (Vite default)
2. **Tree shaking** - Remove unused exports
3. **Dynamic imports** - Lazy load heavy components
4. **Image optimization** - Use WebP, compress PNGs

### Improve Lighthouse Scores

1. **Preload critical resources** - Fonts, above-fold images
2. **Defer non-critical scripts** - Analytics, chat widgets
3. **Optimize images** - Compress, use appropriate formats
4. **Minimize layout shifts** - Reserve space for dynamic content

### Service Worker Best Practices

1. **Precache selectively** - Only app shell
2. **Use runtime caching** - For API responses
3. **Set appropriate TTLs** - Balance freshness vs. performance
4. **Clean up old caches** - In SW activation event

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**Jobs:**
1. **lint-and-typecheck** (< 5 min)
   - ESLint
   - TypeScript type checking
2. **unit-tests** (< 10 min)
   - 89+ unit tests
   - Coverage upload
3. **e2e-tests** (< 10 min)
   - Playwright tests
   - Alpha happy-path
   - PWA offline/install
4. **build** (< 5 min)
   - Production build
   - Bundle size check (< 85 KB)
5. **lighthouse** (< 10 min)
   - PWA audit
   - Performance budgets
   - Multiple pages tested

**Total CI time:** < 40 minutes

### Manual Deployment

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Promote preview to production
vercel promote <deployment-url>
```

---

## 📝 Maintenance

### Regular Tasks

**Weekly:**
- [ ] Check CI status
- [ ] Review Lighthouse scores
- [ ] Monitor error rates (telemetry exports)

**Monthly:**
- [ ] Dependency updates (`pnpm update`)
- [ ] Security audit (`pnpm audit`)
- [ ] Test installation flow on all platforms
- [ ] Review performance metrics

**Quarterly:**
- [ ] Review and update CSP
- [ ] Audit service worker cache strategies
- [ ] Update documentation
- [ ] User feedback review

---

**For more details, see:**
- `INSTALL_GUIDE.md` - User installation instructions
- `ALPHA_STATUS.md` - Current development status
- `security/review-alpha.md` - Security review documentation
