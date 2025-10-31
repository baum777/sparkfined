# 🚀 Vercel Deployment Guide — Sparkfined Access MVP

**Purpose:** Complete guide for deploying Sparkfined with Access Pass MVP to Vercel

**Status:** Ready for Deployment  
**Build:** ✅ Local build successful  
**ENV:** All variables documented below

---

## 📋 Pre-Deployment Checklist

- [ ] Solana keypair generated (devnet)
- [ ] Token mint deployed (or using SOL for testing)
- [ ] All required ENV vars prepared
- [ ] Vercel project created and connected to GitHub

---

## 🔑 Environment Variables Setup

### Method 1: Vercel Dashboard (Recommended)

1. Go to **Vercel Dashboard** → Your Project
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below (set for Preview + Production)

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Pull current env (optional, to compare)
vercel env pull .env.vercel

# Add new variables (interactive)
vercel env add SOLANA_KEYPAIR_JSON production
# Paste value when prompted

# Or bulk import from .env.local
vercel env add SOLANA_RPC_URL production < .env.local
```

---

## 🔐 Required Environment Variables

### 1. Solana Configuration

#### `VITE_SOLANA_NETWORK`
- **Type:** Client-side (exposed to browser)
- **Value:** `devnet` or `mainnet-beta`
- **Environments:** Preview, Production
- **Example:**
  ```
  devnet
  ```

#### `VITE_SOLANA_RPC_URL`
- **Type:** Client-side (exposed to browser)
- **Value:** Solana RPC endpoint URL
- **Environments:** Preview, Production
- **Examples:**
  ```
  https://api.devnet.solana.com
  https://api.mainnet-beta.solana.com
  https://solana-mainnet.g.alchemy.com/v2/YOUR-API-KEY
  ```

#### `SOLANA_KEYPAIR_JSON`
- **Type:** ⚠️ **SERVER-SIDE ONLY** (never exposed to client)
- **Value:** Keypair as JSON array (64 numbers)
- **Environments:** Preview, Production
- **Format:**
  ```json
  [1,2,3,4,5,6,...,255]
  ```
- **How to generate:**
  ```bash
  # Generate new keypair
  solana-keygen new --outfile keypair.json
  
  # Get as compact JSON (single line, no spaces)
  cat keypair.json | jq -c '.'
  
  # Copy output and paste in Vercel
  ```
- **⚠️ IMPORTANT:** 
  - Use devnet keypair for Preview
  - Use separate mainnet keypair for Production
  - Fund keypair with SOL for transactions

---

### 2. Access Pass Configuration

#### `ACCESS_TOKEN_MINT`
- **Type:** ⚠️ **SERVER-SIDE ONLY**
- **Value:** SPL Token mint address
- **Environments:** Preview, Production
- **Default (for testing):**
  ```
  So11111111111111111111111111111111111111112
  ```
  (SOL native token, for hold checks)
- **Production:** Replace with your project's token mint

#### `ACCESS_OG_SYMBOL`
- **Type:** ⚠️ **SERVER-SIDE ONLY**
- **Value:** NFT symbol for OG Pass (max 10 chars)
- **Environments:** Preview, Production
- **Example:**
  ```
  OGPASS
  ```

#### `METAPLEX_COLLECTION_MINT` (Optional)
- **Type:** ⚠️ **SERVER-SIDE ONLY**
- **Value:** Metaplex verified collection mint address
- **Environments:** Preview, Production
- **Example:**
  ```
  7Xq3H5YoqLwmPqViNQ1R8V1JnWHzUZZZZ...
  ```
- **Leave empty if no verified collection**

---

### 3. Optional: Market Data APIs (Existing Features)

#### `DEXPAPRIKA_BASE`
- **Type:** ⚠️ **SERVER-SIDE ONLY**
- **Value:** `https://api.dexpaprika.com`
- **Environments:** Preview, Production

#### `DEXPAPRIKA_API_KEY` (Optional)
- **Type:** ⚠️ **SERVER-SIDE ONLY**
- **Value:** API key (if required)
- **Environments:** Preview, Production

#### `MORALIS_BASE`
- **Type:** ⚠️ **SERVER-SIDE ONLY**
- **Value:** `https://deep-index.moralis.io/api/v2`
- **Environments:** Preview, Production

#### `MORALIS_API_KEY` (Optional)
- **Type:** ⚠️ **SERVER-SIDE ONLY**
- **Value:** Moralis API key
- **Environments:** Preview, Production

---

### 4. Optional: Future Integrations

#### `STREAMFLOW_API_BASE`
- **Value:** `https://api.streamflow.finance`
- **Currently:** MVP uses mock lock, not full Streamflow integration

#### `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`
- **Currently:** MVP uses file-based rank storage (`.data/og_rank.json`)
- **Future:** Issue #6 migrates to Supabase

#### `PICKET_API_KEY`
- **Currently:** Not used in MVP
- **Future:** Issue #4 for token gating

---

## 📝 Deployment Steps

### Step 1: Prepare Keypair (One-Time Setup)

```bash
# Install Solana CLI (if not already)
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Generate Devnet keypair
solana-keygen new --outfile devnet-keypair.json

# Get public key (for airdrop)
solana-keygen pubkey devnet-keypair.json

# Airdrop SOL (for transaction fees)
solana airdrop 2 $(solana-keygen pubkey devnet-keypair.json) --url https://api.devnet.solana.com

# Convert to JSON array for Vercel
cat devnet-keypair.json | jq -c '.'
# Output: [1,2,3,...,255]
# Copy this for SOLANA_KEYPAIR_JSON
```

### Step 2: Set Environment Variables in Vercel

```
Dashboard → Settings → Environment Variables → Add Variable

For each variable:
1. Name: SOLANA_KEYPAIR_JSON
2. Value: [paste JSON array]
3. Environments: ✅ Production, ✅ Preview, ⬜ Development
4. Click "Save"

Repeat for all required variables.
```

### Step 3: Trigger Deployment

#### Option A: Push to GitHub
```bash
git add .
git commit -m "fix(deploy): add environment variables and deployment guide"
git push origin <branch-name>

# Vercel auto-deploys from GitHub
```

#### Option B: Manual via CLI
```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Step 4: Verify Deployment

1. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Latest → View Function Logs
   - Look for errors like "process.env.X is undefined"

2. **Test Deployment URL:**
   ```bash
   # Get deployment URL from Vercel dashboard
   export DEPLOY_URL=https://sparkfined-xyz.vercel.app
   
   # Test homepage
   curl $DEPLOY_URL/
   
   # Test API endpoints
   curl "$DEPLOY_URL/api/access/status?wallet=HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH"
   ```

3. **Check PWA:**
   - Open deployment URL in Chrome
   - DevTools → Application → Manifest (should be valid)
   - DevTools → Application → Service Workers (should be registered)

---

## 🧪 API Health Checks

### 1. Access Status Endpoint

```bash
# Test with devnet wallet
curl "https://sparkfined-xyz.vercel.app/api/access/status?wallet=HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH"

# Expected response:
{
  "status": "none",
  "details": {
    "rank": null,
    "nftMint": null,
    "tokenBalance": 0,
    "note": "No access. Options: (1) Lock tokens to get OG rank, or (2) Hold ≥100,000 tokens."
  }
}
```

### 2. Lock Endpoint (POST)

```bash
# Create a lock
curl -X POST "https://sparkfined-xyz.vercel.app/api/access/lock" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
    "amount": 4620000
  }'

# Expected response:
{
  "ok": true,
  "rank": 1,
  "lockId": "sf_1730000000000_HN7cABqL"
}
```

### 3. Mint NFT Endpoint (POST)

```bash
# Mint OG Pass NFT (rank must be ≤ 333)
curl -X POST "https://sparkfined-xyz.vercel.app/api/access/mint-nft" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
    "rank": 1
  }'

# Expected response:
{
  "ok": true,
  "mintAddress": "7Xq3H5YoqLwmPqViNQ1R8V1JnWHzUZZZZ...",
  "symbol": "OGPASS",
  "name": "Sparkfined OG Pass #1"
}
```

---

## ⚠️ Common Deployment Issues

### Issue 1: "process.env.SOLANA_KEYPAIR_JSON is undefined"

**Cause:** Variable not set in Vercel or wrong environment selected

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Find `SOLANA_KEYPAIR_JSON`
3. Ensure it's checked for **Production** and **Preview**
4. Click "Redeploy" to pick up changes

### Issue 2: "Unexpected token" when parsing SOLANA_KEYPAIR_JSON

**Cause:** JSON array has formatting issues

**Fix:**
```bash
# Ensure single-line, compact JSON
cat keypair.json | jq -c '.'

# Should output: [1,2,3,...] with NO newlines or extra spaces
# Copy EXACTLY this output to Vercel
```

### Issue 3: "Failed to mint NFT" / RPC errors

**Cause:** Keypair has no SOL or wrong network

**Fix:**
```bash
# Check balance
solana balance $(solana-keygen pubkey devnet-keypair.json) --url https://api.devnet.solana.com

# If 0, airdrop more SOL
solana airdrop 5 $(solana-keygen pubkey devnet-keypair.json) --url https://api.devnet.solana.com
```

### Issue 4: Build succeeds but `/access` shows errors

**Cause:** Client-side trying to access server-only vars

**Fix:**
- Ensure all Solana RPC calls are in `/api` routes, NOT client components
- Check `src/config/access.ts` uses `VITE_` prefix for client vars
- Server vars (no `VITE_`) should ONLY be used in `/api` or `/src/server`

### Issue 5: "Access-Control-Allow-Origin" CORS errors

**Cause:** API routes not configured for CORS (if calling from external domain)

**Fix:** Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,OPTIONS" }
      ]
    }
  ]
}
```

---

## 📊 Post-Deployment Verification

### Lighthouse Audit

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit on deployment
lhci healthcheck --url https://sparkfined-xyz.vercel.app

# Or use web UI: https://pagespeed.web.dev/
```

**Expected Scores:**
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90
- **PWA: 100** ✅

### Manual PWA Test

1. Open deployment URL in Chrome (Desktop)
2. Address bar should show **install icon (⊕)**
3. Click icon → "Install Sparkfined"
4. App opens in standalone window
5. Go offline (DevTools → Network → Offline)
6. Refresh app → Should still work (offline shell)

---

## 🔄 Update Flow Test (Double-Deploy)

### Deploy #1: Baseline
```bash
git commit -m "test: baseline deploy"
git push
# Wait for deployment to complete
# Open app → SW registers
```

### Deploy #2: Trigger Update
```bash
# Make trivial change
echo "// Deploy test" >> src/main.tsx

git commit -m "test: trigger update"
git push
# Wait for deployment

# Keep browser tab OPEN from Deploy #1
# Wait 60-90 seconds
# Update banner should appear: "New version available!"
# Click "Update Now" → Page reloads with new version
```

**✅ Success:** Update banner appears, no silent reload

---

## 🗂️ File Storage Note (MVP)

**Current:** Rank data stored in `.data/og_rank.json` (file-based)

**⚠️ Limitation:** Vercel Edge Functions are **stateless**. File writes won't persist across deployments.

**Workaround for MVP:**
- Use Vercel KV (key-value store): https://vercel.com/docs/storage/vercel-kv
- Or migrate to Supabase (Issue #6)

**To enable Vercel KV:**
```bash
# Install
pnpm add @vercel/kv

# Update src/server/streamflow/lock.ts to use KV instead of fs
```

---

## 📞 Support

**Build Errors:** Check Vercel Function Logs  
**API Errors:** Check Network tab (DevTools → Console)  
**ENV Issues:** Verify in Vercel Dashboard → Environment Variables  
**Solana Errors:** Check RPC URL + keypair balance

---

**🚀 Ready to Deploy!**

Follow the steps above to deploy Sparkfined Access MVP to Vercel.
