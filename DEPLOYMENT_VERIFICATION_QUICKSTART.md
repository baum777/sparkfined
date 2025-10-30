# 🚀 Deployment Verification — Quick Start

**Status:** ✅ **READY TO USE**  
**Version:** 1.0.0  
**Last Updated:** 2025-10-29

---

## 🎯 Purpose

Automated tools to verify Vercel deployments (Preview & Production) are healthy and working correctly.

---

## ⚡ Quick Start (5 minutes)

### Step 1: Deploy to Vercel
```bash
# Push your branch
git push origin <branch-name>

# Vercel auto-deploys → Copy deployment URL
# Example: https://sparkfined-abc123.vercel.app
```

### Step 2: Run Verification
```bash
# Set deployment URL
export VERIFY_BASE_URL=https://sparkfined-abc123.vercel.app

# Run API health check
pnpm run verify:api
```

### Expected Output ✅
```
🔎 Verifying: https://sparkfined-abc123.vercel.app
✅ / 200 OK
✅ manifest.webmanifest present
ℹ️ sw.js not at root (ok if injected)
✅ CSP present
✅ /api/mcap ok: 3500000
ℹ️ VERIFY_DEV_WALLET not set → skipping /api/access-status
🎉 API & headers verification PASSED
```

---

## 🧰 Available Commands

### 1. API & Headers Check (Recommended)
```bash
VERIFY_BASE_URL=https://your-app.vercel.app pnpm run verify:api
```

**What it checks:**
- ✅ App loads (root /)
- ✅ PWA manifest exists
- ✅ Service Worker present
- ✅ CSP headers configured
- ✅ `/api/mcap` responds
- ✅ `/api/access/status` responds (optional)

**Duration:** ~5 seconds

---

### 2. E2E Smoke Tests (Optional)
```bash
VERIFY_BASE_URL=https://your-app.vercel.app pnpm run verify:e2e
```

**What it tests:**
- ✅ PWA installability
- ✅ Manifest structure
- ✅ Service Worker registration
- ✅ Access page loads

**Duration:** ~30 seconds  
**Requires:** Playwright installed (`pnpm dlx playwright install`)

---

### 3. Lighthouse Audit (Performance)
```bash
VERIFY_BASE_URL=https://your-app.vercel.app pnpm run verify:lh
```

**What it audits:**
- ✅ Performance (LCP, TBT, TTI, CLS)
- ✅ PWA score
- ✅ Accessibility
- ✅ SEO

**Duration:** ~60 seconds  
**Requires:** Lighthouse CI configured

---

## 🔐 Testing with Wallet (Optional)

To test `/api/access/status` endpoint:

```bash
export VERIFY_BASE_URL=https://your-app.vercel.app
export VERIFY_DEV_WALLET=HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH

pnpm run verify:api
```

**Expected:**
```
✅ /api/access-status ok: none
```

(Status can be: `og`, `holder`, `none`, or `loading`)

---

## 🤖 GitHub Actions (Manual Workflow)

### Trigger from GitHub UI:

1. Go to **Actions** tab
2. Select **"Verify Deploy"** workflow
3. Click **"Run workflow"**
4. Enter deployment URL: `https://sparkfined-abc123.vercel.app`
5. Click **"Run"**

**Result:** Automated verification runs in CI

---

## ⚠️ Troubleshooting

### Error: "Root not 200"
**Cause:** Deployment failed or URL is wrong  
**Fix:** Check Vercel deployment logs

### Error: "manifest missing"
**Cause:** PWA build failed  
**Fix:** Verify `vite.config.ts` has `VitePWA()` plugin

### Error: "CSP header weak/absent"
**Cause:** No Content-Security-Policy header  
**Fix:** Add CSP to `vercel.json` or response headers

### Error: "/api/mcap not 200"
**Cause:** API route not deployed  
**Fix:** Check `api/mcap.ts` exists and deployed

### Error: "VERIFY_BASE_URL is not set"
**Cause:** Environment variable missing  
**Fix:** Set before running: `export VERIFY_BASE_URL=https://...`

---

## 📊 What Gets Verified

### ✅ Endpoints
- `/` (root HTML)
- `/manifest.webmanifest` (PWA manifest)
- `/sw.js` (Service Worker, optional)
- `/api/mcap` (Market cap API)
- `/api/access/status?wallet=...` (Access API, optional)

### ✅ Headers
- `Content-Security-Policy`
- `Content-Type`
- `Cache-Control` (optional)

### ✅ PWA Requirements
- Valid manifest JSON
- Icons array present
- Name field present

### ✅ API Responses
- Status codes (200 for success)
- JSON structure validation
- Required fields present

---

## 🎯 When to Run

### After Every Deployment ✅
```bash
# Automated in CI (future)
VERIFY_BASE_URL=$DEPLOYMENT_URL pnpm run verify:api
```

### Before Promoting to Production ✅
```bash
# Verify preview first
VERIFY_BASE_URL=https://preview.vercel.app pnpm run verify:api
VERIFY_BASE_URL=https://preview.vercel.app pnpm run verify:e2e

# If all pass → promote to production
```

### After Major Changes ✅
```bash
# Full verification suite
VERIFY_BASE_URL=https://... pnpm run verify:api
VERIFY_BASE_URL=https://... pnpm run verify:e2e
VERIFY_BASE_URL=https://... pnpm run verify:lh
```

---

## 📝 Example Workflow

### Typical Deployment Verification:

```bash
# 1. Deploy
git push origin feature/my-feature

# 2. Get preview URL from Vercel dashboard
export VERIFY_BASE_URL=https://sparkfined-pr-42.vercel.app

# 3. Quick health check
pnpm run verify:api

# 4. If API passes, run E2E
pnpm run verify:e2e

# 5. If all pass → merge PR
gh pr merge --squash
```

---

## 🔄 CI/CD Integration (Future)

### Add to `.github/workflows/pr.yml`:
```yaml
- name: Deploy Preview
  id: deploy
  run: vercel deploy --token=${{ secrets.VERCEL_TOKEN }}

- name: Verify Preview
  env:
    VERIFY_BASE_URL: ${{ steps.deploy.outputs.url }}
  run: pnpm run verify:api
```

---

## 📖 Related Docs

- **Full Patch Documentation:** `VERIFICATION_PATCH_SUMMARY.md`
- **Main Deployment Guide:** `VERCEL_DEPLOYMENT_GUIDE.md`
- **API Health Check (Shell):** `scripts/api-health-check.sh`

---

## ✅ Success Criteria

Verification **PASSES** if:

- [x] ✅ All endpoints return 200
- [x] ✅ Manifest is valid JSON
- [x] ✅ CSP header present
- [x] ✅ API responses have expected structure
- [x] ✅ No assertion errors

Verification **FAILS** if:

- [ ] ❌ Any endpoint returns 4xx or 5xx
- [ ] ❌ Manifest missing or invalid
- [ ] ❌ CSP header missing
- [ ] ❌ API response missing required fields

---

## 🎉 You're Ready!

**Next Steps:**
1. Deploy to Vercel (preview or production)
2. Copy deployment URL
3. Run: `VERIFY_BASE_URL=https://... pnpm run verify:api`
4. Check output for ✅ or ❌

**Need Help?**
- Check `VERIFICATION_PATCH_SUMMARY.md` for detailed docs
- Review `TROUBLESHOOTING.md` for common issues
- Run `node scripts/verify_api.mjs` (no args) for usage help

---

**🚀 Happy Deploying!**
