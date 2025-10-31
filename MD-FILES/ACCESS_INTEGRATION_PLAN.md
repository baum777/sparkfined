# 🎫 Sparkfiend Access Pass Integration Plan

**Version:** v1.1.0-access  
**Base:** v1.0.0 (Main Launch - Stable)  
**Target:** Token-Lock + NFT + Hold-Gating on Solana  
**Timeline:** 10 Issues (Sequential Implementation)

---

## 🎯 Project Goals

1. **Fair OG-Gating:** 333 slots based on MCAP-dynamic lock amount
2. **Hold-Check:** Secondary access via ≥100k token hold
3. **Soulbound NFT:** Lifetime access pass (non-transferable)
4. **Dashboard Integration:** Seamless UI in Sparkfined (Mobile + Desktop)
5. **100% TypeScript:** Type-safe, server-secured APIs
6. **Privacy-First:** No PII, wallet-based access only

---

## 📊 Issue Bundle Overview

| # | Issue | Owner | Priority | Est. Time | Status |
|---|-------|-------|----------|-----------|--------|
| **#1** | Access Dashboard UI | R1 (UI/UX) | High | 4-6h | 🟡 Pending |
| **#2** | MCAP-Oracle API (Pyth) | R2 (Backend) | High | 2-3h | 🟡 Pending |
| **#3** | Lock & NFT Mint Flow | R3 (Smart Integration) | Critical | 6-8h | 🟡 Pending |
| **#4** | Hold-Check (Picket) | R2 (Backend) | High | 3-4h | 🟡 Pending |
| **#5** | AccessStatus Hook | R1 (Frontend) | High | 3-4h | 🟡 Pending |
| **#6** | Leaderboard & DB | R4 (Data) | Medium | 4-5h | 🟡 Pending |
| **#7** | SBT-Enforcement | R5 (Contract) | Medium | 2-3h | 🟡 Pending |
| **#8** | QA & E2E Tests | R6 (QA) | High | 4-5h | 🟡 Pending |
| **#9** | Docs & Launch Guide | R7 (Docs) | Medium | 3-4h | 🟡 Pending |
| **#10** | Monitoring & Telemetry | R8 (Ops) | Low | 2-3h | 🟡 Pending |

**Total Estimated Time:** 33-45 hours (4-6 days with testing)

---

## 🛠️ Technical Stack

### Frontend
- **Framework:** React 18 + TypeScript (existing Sparkfined app)
- **Routing:** React Router 6 (add `/access` route)
- **Styling:** Tailwind CSS (existing design system)
- **Wallet:** `@solana/wallet-adapter-react` (Phantom, Backpack)
- **State:** Context API (`AccessProvider`)

### Backend (New)
- **Runtime:** Vercel Edge Functions (Node.js)
- **Database:** Supabase (PostgreSQL)
- **APIs:**
  - `/api/mcap` → Pyth price feed
  - `/api/lock` → Streamflow lock creation
  - `/api/mint-nft` → Metaplex NFT mint
  - `/api/hold-check` → Picket token balance
  - `/api/leaderboard` → Top 333 locks

### Blockchain (Solana)
- **Network:** Devnet (testing) → Mainnet (production)
- **SDK:** `@solana/web3.js` v1.87+
- **Lock:** `@streamflow/stream` (token streaming/locking)
- **NFT:** `@metaplex-foundation/js` (Metaplex JS SDK)
- **Oracle:** Pyth Network (`@pythnetwork/client`)
- **Verification:** Picket API (token gating)

### Optional On-Chain (Rust/Anchor)
- **AccessRegistry:** Track OG counter (333 max)
- **VerifyHold:** On-chain hold validation
- **Events:** `OGLockCreated`, `NFTMinted`

---

## 📦 New Dependencies

### Add to `package.json`
```json
{
  "dependencies": {
    "@solana/web3.js": "^1.87.6",
    "@solana/wallet-adapter-react": "^0.15.35",
    "@solana/wallet-adapter-react-ui": "^0.9.35",
    "@solana/wallet-adapter-wallets": "^0.19.32",
    "@streamflow/stream": "^5.3.0",
    "@metaplex-foundation/js": "^0.19.4",
    "@pythnetwork/client": "^2.18.0",
    "@supabase/supabase-js": "^2.39.3"
  },
  "devDependencies": {
    "@types/node": "^20.10.0"
  }
}
```

### Environment Variables (`.env.local`)
```bash
# Solana
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_NETWORK=devnet

# APIs (Server-side only)
PYTH_API_KEY=your_pyth_api_key
PICKET_API_KEY=your_picket_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Metaplex
METAPLEX_NFT_COLLECTION_MINT=your_collection_address
METAPLEX_AUTHORITY_KEYPAIR=path/to/keypair.json

# Access Pass Config
ACCESS_PASS_OG_SLOTS=333
ACCESS_PASS_HOLD_REQUIREMENT=100000
ACCESS_PASS_MCAP_FALLBACK=3500
```

---

## 🔀 Implementation Order

### Phase 1: Foundation (Issues #1-#2)
**Goal:** UI scaffold + MCAP oracle

1. **Issue #1:** Access Dashboard UI
   - Create `/access` page
   - Build components: `AccessStatusCard`, `LockCalculator`, `HoldCheck`, `LeaderboardList`
   - Integrate with existing Sparkfined theming

2. **Issue #2:** MCAP-Oracle API
   - Implement `/api/mcap` endpoint
   - Pyth Network integration
   - Fallback to 3500 MCAP on error

**Deliverable:** Static UI + working MCAP endpoint

---

### Phase 2: Core Access Logic (Issues #3-#5)
**Goal:** Lock, mint, and status tracking

3. **Issue #3:** Lock & NFT Mint Flow
   - `/api/lock` → Streamflow lock creation
   - `/api/mint-nft` → Metaplex NFT mint
   - Rank calculation (1-333)

4. **Issue #4:** Hold-Check API
   - `/api/hold-check` → Picket verification
   - Fallback to RPC balance check
   - Rate limiting (1 req/min per wallet)

5. **Issue #5:** AccessStatus Hook & Provider
   - `useAccessStatus()` → React hook
   - `<AccessProvider>` → Global context
   - Status: `og` | `holder` | `none`
   - Persist in localStorage

**Deliverable:** Functional access flow (lock → mint → status)

---

### Phase 3: Data & Enforcement (Issues #6-#7)
**Goal:** Leaderboard + SBT policy

6. **Issue #6:** Leaderboard & DB
   - Supabase table: `locks(wallet, amount, rank, created_at)`
   - `/api/leaderboard` → Top 333
   - 5-minute cache

7. **Issue #7:** SBT-Enforcement
   - NFT metadata: `"transferable": false`
   - Optional: Anchor program check
   - Documentation

**Deliverable:** Live leaderboard + non-transferable NFTs

---

### Phase 4: Testing & Docs (Issues #8-#9)
**Goal:** E2E tests + user/dev guides

8. **Issue #8:** QA & E2E Tests
   - Playwright tests: Wallet → Hold → Lock → Mint → Access
   - Edge cases: Offline, errors, retries
   - Devnet test suite

9. **Issue #9:** Docs & Launch Guide
   - `ACCESS_GUIDE.md` → User guide (how to get access)
   - `INTEGRATION_NOTES.md` → Dev guide (API docs)
   - README section: "Access Pass"

**Deliverable:** Green tests + complete documentation

---

### Phase 5: Monitoring (Issue #10)
**Goal:** Telemetry & logging

10. **Issue #10:** Post-Launch Monitoring
    - Event logging: Lock, Mint, API latency
    - Opt-in telemetry
    - Error tracking (Sentry or similar)

**Deliverable:** Production-ready monitoring

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
- `lockCalculator.test.ts` → MCAP-based lock amount
- `accessStatus.test.ts` → Status derivation logic
- `holdCheck.test.ts` → Balance verification

### Integration Tests
- `/api/mcap` → Mock Pyth response
- `/api/lock` → Mock Streamflow SDK
- `/api/mint-nft` → Mock Metaplex SDK

### E2E Tests (Playwright)
1. **Wallet Connection** → Connect Phantom (devnet)
2. **Hold Check** → Verify ≥100k token balance
3. **Lock Flow** → Create lock, get rank
4. **NFT Mint** → Mint OG pass (rank < 334)
5. **Access Visible** → Dashboard shows "OG Access"

---

## 🔒 Security Considerations

### Secrets Management
- ✅ All API keys in `.env.local` (not `.env`)
- ✅ Server-side only: Pyth, Picket, Supabase service keys
- ✅ Metaplex authority keypair: Never in client bundle

### Access Control
- ✅ Wallet signature verification (all API calls)
- ✅ Rate limiting: 1 lock/mint per wallet per day
- ✅ Rank validation: Only ≤333 get NFT

### Privacy
- ✅ No PII collected (only wallet addresses)
- ✅ Telemetry opt-in (localStorage flag)
- ✅ Leaderboard: Truncated wallets (e.g., `ABC...XYZ`)

---

## 📈 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Lock Flow Latency** | < 5s | API response time |
| **NFT Mint Success Rate** | > 95% | Successful mints / attempts |
| **Hold Check Accuracy** | 100% | False positives = 0 |
| **Dashboard LCP** | < 2.5s | Lighthouse CI |
| **E2E Test Pass Rate** | 100% | Playwright green |
| **API Uptime** | > 99% | Vercel analytics |

---

## 🚀 Deployment Plan

### Devnet Deployment (After Issue #8)
1. Deploy backend APIs to Vercel
2. Test with devnet wallets
3. Verify all flows work end-to-end
4. Fix bugs, iterate

### Mainnet Deployment (After Issue #10)
1. Switch `VITE_SOLANA_NETWORK=mainnet`
2. Update RPC URLs (use private RPC for reliability)
3. Deploy Metaplex collection (if not exists)
4. Announce to community
5. Monitor for 24-48h

---

## 🔄 Rollback Plan

If critical issues arise:

1. **Disable Access Feature:**
   ```typescript
   // In src/config.ts
   export const ACCESS_ENABLED = false;
   ```

2. **Revert Deployment:**
   ```bash
   vercel rollback <deployment-id>
   ```

3. **Fix & Re-deploy:**
   - Fix issue locally
   - Test on devnet
   - Re-deploy to mainnet

---

## 📝 Commit Convention

**Format:** `<type>(scope): <description>`

**Types:**
- `feat` → New feature (e.g., `feat(access): add dashboard ui`)
- `fix` → Bug fix (e.g., `fix(api): handle mcap timeout`)
- `test` → Add/update tests (e.g., `test(e2e): verify lock flow`)
- `docs` → Documentation (e.g., `docs(access): add integration guide`)
- `chore` → Maintenance (e.g., `chore(deps): install solana sdk`)

**Examples:**
```bash
feat(access): add dashboard ui and hooks
feat(api): implement mcap oracle with pyth
feat(api): implement lock and nft mint endpoints
feat(api): add hold-check via picket
feat(access): add useAccessStatus hook and provider
feat(api): add leaderboard with supabase
feat(contract): enforce sbt policy for nfts
test(e2e): verify access flow works on devnet
docs(access): add integration and launch guide
feat(telemetry): add lock and mint event tracking
```

---

## ✅ Acceptance Matrix

| Criteria | Target | Status |
|----------|--------|--------|
| **Build & Lint** | 0 Errors | 🟡 Pending |
| **Lock Flow** | < 5s Latency | 🟡 Pending |
| **NFT Mint** | Devnet/Mainnet ✅ | 🟡 Pending |
| **Hold Check** | Picket API Resolves | 🟡 Pending |
| **Dashboard LCP** | < 2.5s | 🟡 Pending |
| **E2E Tests** | All Green | 🟡 Pending |
| **Docs** | Screenshots + Tokenomics | 🟡 Pending |

---

## 🎯 Next Actions

1. **Review this plan** → Confirm scope & approach
2. **Install dependencies** → Solana SDKs + Supabase
3. **Start Issue #1** → Access Dashboard UI
4. **Sequential commits** → One issue at a time
5. **Test after each issue** → `pnpm lint && pnpm typecheck && pnpm test`

---

**Ready to start? Let's build the Access Pass! 🚀**
