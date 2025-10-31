# Sparkfined TA-PWA

> **Production-grade Progressive Web App for Technical Analysis**  
> Vite + React + TypeScript + Solana + Vercel

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-success.svg)](https://web.dev/progressive-web-apps/)

---

## ?? Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Performance Budgets](#performance-budgets)
- [License](#license)

---

## ? Features

- **?? Progressive Web App**: Installable, offline-capable, app-like experience
- **? Lightning Fast**: Vite build system, code splitting, optimized bundles
- **?? Web3 Native**: Solana wallet integration, NFT gating, token analytics
- **?? Real-time Market Data**: DexPaprika, Moralis, Dexscreener integration
- **?? Modern UI**: Tailwind CSS, responsive design, dark mode
- **?? Fully Tested**: Unit, integration, and E2E tests with Vitest & Playwright
- **?? Vercel-Ready**: Serverless API functions, edge caching, auto-deployments

---

## ??? Architecture

```
???????????????????????????????????????????????
?           PWA Client (React)                ?
?  ????????????  ????????????  ????????????  ?
?  ? Analysis ?  ?  Journal ?  ?  Access  ?  ?
?  ?   Page   ?  ?   Page   ?  ?   Page   ?  ?
?  ????????????  ????????????  ????????????  ?
?         ?             ?             ?        ?
?         ?????????????????????????????        ?
?                   ?                          ?
?            ???????????????                   ?
?            ? IndexedDB   ?                   ?
?            ?  (Dexie)    ?                   ?
?            ???????????????                   ?
???????????????????????????????????????????????
                  ?
        ?????????????????????
        ?  Vercel Functions ?
        ?   (/api/*)        ?
        ?????????????????????
                  ?
     ???????????????????????????
     ?            ?            ?
???????????  ???????????  ???????????
?DexPaprika?  ? Moralis ?  ? Solana  ?
???????????  ???????????  ???????????
```

### Tech Stack

**Frontend**
- React 18.3 (UI framework)
- TypeScript 5.6 (type safety)
- Vite 6.0 (build tool)
- React Router 6.28 (routing)
- Tailwind CSS 3.4 (styling)
- Dexie (IndexedDB wrapper)

**Backend**
- Vercel Functions (serverless)
- Solana Web3.js (blockchain)
- @metaplex-foundation/js (NFTs)

**Testing**
- Vitest (unit/integration)
- Playwright (E2E)
- Testing Library (React)

**PWA**
- vite-plugin-pwa (service worker)
- Workbox (caching strategies)

---

## ?? Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0 (or npm >= 9.0.0)
- **Git**

Optional:
- **Solana CLI** (for keypair generation)
- **Playwright** browsers (auto-installed on first run)

---

## ?? Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sparkfined-ta-pwa.git
cd sparkfined-ta-pwa

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API keys
```

---

## ?? Development

```bash
# Start dev server (http://localhost:5173)
pnpm dev

# Run type checking
pnpm typecheck

# Lint code
pnpm lint

# Format code
pnpm format

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development Workflow

1. **Make changes** in `src/`
2. **Check types**: `pnpm typecheck`
3. **Run tests**: `pnpm test`
4. **Lint & format**: `pnpm lint && pnpm format`
5. **Build**: `pnpm build`
6. **Preview**: `pnpm preview`

---

## ?? Testing

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests only
pnpm test:integration

# Run E2E tests (requires built app)
pnpm build && pnpm test:e2e

# Watch mode (development)
pnpm test:watch

# Verify API health
pnpm verify:api

# Verify E2E deployment
pnpm verify:e2e
```

### Test Coverage

- **Unit**: Components, utilities, services (`tests/unit/`)
- **Integration**: API proxies, database (`tests/integration/`)
- **E2E**: Full user flows (`tests/e2e/`)

---

## ?? Environment Variables

### Required Variables

Create `.env.local` from `.env.example`:

#### Server-Side (?? Never expose to client)

```bash
# Solana keypair for signing (64-byte array)
SOLANA_KEYPAIR_JSON=[1,2,3,...]

# API Keys
MORALIS_API_KEY=your_moralis_key
DEXPAPRIKA_API_KEY=your_dexpaprika_key

# Access Pass Configuration
ACCESS_TOKEN_MINT=So11111111111111111111111111111111111111112
ACCESS_OG_SYMBOL=OGPASS
```

#### Client-Side (VITE_* prefix)

```bash
# Solana Network
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Data Provider Orchestration
VITE_DATA_PRIMARY=dexpaprika,moralis
VITE_DATA_FALLBACKS=dexscreener,pumpfun

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

### Environment Matrix

| Variable | Development | Preview | Production | Required |
|----------|-------------|---------|------------|----------|
| `SOLANA_KEYPAIR_JSON` | Test keypair | Test keypair | Production keypair | ? |
| `MORALIS_API_KEY` | Optional | Optional | Required | ?? |
| `VITE_SOLANA_NETWORK` | `devnet` | `devnet` | `mainnet-beta` | ? |
| `VITE_ENABLE_DEBUG` | `true` | `false` | `false` | ? |

See [`.env.example`](./.env.example) for complete list.

---

## ?? Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   pnpm add -g vercel
   
   # Login and link project
   vercel login
   vercel link
   ```

2. **Set Environment Variables**
   ```bash
   # Via CLI
   vercel env add SOLANA_KEYPAIR_JSON
   vercel env add MORALIS_API_KEY
   # ... (repeat for all required vars)
   
   # Or via Vercel Dashboard
   # Settings ? Environment Variables
   ```

3. **Deploy**
   ```bash
   # Preview deployment
   vercel
   
   # Production deployment
   vercel --prod
   ```

4. **Verify Deployment**
   ```bash
   VERIFY_BASE_URL=https://your-app.vercel.app pnpm verify:e2e
   ```

### CI/CD (GitHub Actions)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

---

## ?? Project Structure

```
sparkfined-ta-pwa/
??? api/                    # Vercel serverless functions
?   ??? access/            # Access pass endpoints
?   ??? dexpaprika/        # DexPaprika proxy
?   ??? moralis/           # Moralis proxy
??? public/                # Static assets (PWA icons, manifest)
??? src/
?   ??? components/        # React components
?   ?   ??? access/       # Access pass UI
?   ?   ??? layout/       # Layout components
?   ?   ??? ui/           # Reusable UI components
?   ??? config/           # App configuration
?   ??? hooks/            # Custom React hooks
?   ??? lib/              # Core libraries
?   ?   ??? adapters/    # API adapters
?   ?   ??? ai/          # AI analysis
?   ?   ??? analysis/    # TA algorithms
?   ?   ??? data/        # Data providers
?   ?   ??? ocr/         # OCR service
?   ??? pages/            # Page components
?   ??? store/            # State management
?   ??? styles/           # Global styles
?   ??? types/            # TypeScript types
??? tests/
?   ??? unit/             # Unit tests
?   ??? integration/      # Integration tests
?   ??? e2e/              # E2E tests
??? .env.example          # Environment template
??? package.json          # Dependencies & scripts
??? playwright.config.ts  # E2E config
??? tailwind.config.js    # Tailwind config
??? tsconfig.json         # TypeScript config
??? vercel.json           # Vercel config
??? vite.config.ts        # Vite config
??? vitest.config.ts      # Vitest config
```

---

## ? Performance Budgets

| Metric | Budget | Measurement |
|--------|--------|-------------|
| **App Start (TTI)** | < 2000ms | Lighthouse |
| **API Median Response** | < 400ms | P50 |
| **AI Teaser P95** | < 800ms | P95 |
| **Journal Save** | < 150ms | - |
| **Journal Grid Render** | < 500ms | - |
| **Replay Open P95** | < 300ms | P95 |
| **Export ZIP P95** | < 1500ms | P95 |

Monitor via `PERF_BUDGET_*` environment variables.

---

## ?? License

[MIT](./LICENSE)

---

## ?? Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## ?? Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/sparkfined-ta-pwa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/sparkfined-ta-pwa/discussions)

---

**Built with ?? by the Sparkfined Team**
