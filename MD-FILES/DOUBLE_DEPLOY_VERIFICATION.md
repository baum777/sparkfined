# 🔄 Double-Deploy Verification Guide

**Purpose:** Verify the manual service worker update flow works correctly after deployment

**Owner:** QA Engineer (R3)  
**Duration:** ~10 minutes  
**Prerequisites:** Production or preview deployment URL

---

## 🎯 Test Objective

Verify that:
1. ✅ Service Worker registers successfully
2. ✅ Update banner appears when new version deployed
3. ✅ **No silent reload** (user must click "Update Now")
4. ✅ Page reloads with new version after user confirmation

---

## 📋 Test Procedure

### Deploy #1: Baseline Deployment

#### Step 1.1: Ensure Clean State
```bash
# Current branch should be deployed
git status
# Should show: "nothing to commit, working tree clean"
```

#### Step 1.2: Trigger Deployment
```bash
# Push to GitHub (triggers Vercel auto-deploy)
git push origin <branch-name>

# Or manual via Vercel CLI
vercel --prod  # for production
# or
vercel         # for preview
```

#### Step 1.3: Wait for Deployment
- Go to Vercel Dashboard → Deployments
- Wait for status: ✅ Ready
- Copy deployment URL

#### Step 1.4: Open in Browser
```
Open: https://sparkfined-xyz.vercel.app
```

#### Step 1.5: Verify Service Worker Registered
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in sidebar
4. Should see:
   ```
   ✅ Activated and is running
   Source: /sw.js
   Status: activated
   ```

#### Step 1.6: Check Initial State
- **Update banner should NOT be visible**
- App works normally
- No console errors

**✅ Checkpoint 1:** Service Worker active, no update banner

---

### Deploy #2: Trigger Update

#### Step 2.1: Make Trivial Code Change
```bash
# Add a comment to trigger rebuild
echo "// Deploy #2 test - $(date)" >> src/main.tsx

# Commit
git add src/main.tsx
git commit -m "test: trigger deploy #2 for update banner verification"
```

#### Step 2.2: Push to Trigger Deployment
```bash
git push origin <branch-name>
```

#### Step 2.3: Wait for New Deployment
- Vercel Dashboard → Deployments
- New deployment should appear
- Wait for status: ✅ Ready

#### Step 2.4: **KEEP BROWSER TAB OPEN**
⚠️ **CRITICAL:** Do NOT reload the page manually!

The browser tab from Deploy #1 should still be open.

#### Step 2.5: Wait for Update Detection
- Keep the tab open and in focus
- Wait **60-90 seconds** (SW polling interval)
- Watch for update banner to appear

#### Step 2.6: Verify Update Banner Appears
After ~60-90 seconds, you should see:

```
┌─────────────────────────────────────────────────────────┐
│ 🔄 New version available!                               │
│ Update now to get the latest features and improvements  │
│                                                          │
│ [Update Now]  [✕]                                       │
└─────────────────────────────────────────────────────────┘
```

**Banner should:**
- ✅ Appear at top of page
- ✅ Have blue gradient background
- ✅ Show "New version available!" text
- ✅ Have "Update Now" and dismiss (✕) buttons

**✅ Checkpoint 2:** Update banner visible

---

### Test 1: Dismiss Banner

#### Step 3.1: Click Dismiss (✕) Button
- Click the **✕** button in top-right corner
- Banner should disappear

#### Step 3.2: Verify App Still Works
- Navigate to different routes: `/`, `/journal`, `/access`
- App should work normally with **old version**

#### Step 3.3: Manual Reload (Ctrl+R)
- Press `Ctrl+R` (or `Cmd+R` on Mac)
- Banner should **reappear** (SW is still waiting)

**✅ Test 1 Result:** Banner can be dismissed, reappears on reload

---

### Test 2: Apply Update

#### Step 4.1: Click "Update Now" Button
- Banner should still be visible
- Click **"Update Now"** button

#### Step 4.2: Observe Update Process
- Button text changes to **"Updating..."** with spinner
- After ~1-2 seconds, page **reloads automatically**

#### Step 4.3: Verify New Version Active
After reload:
1. **Banner should NOT be visible** (new version is now active)
2. DevTools → Console → Check for log:
   ```
   ✅ Service Worker activated
   ```

#### Step 4.4: Verify SW Status in DevTools
- DevTools → Application → Service Workers
- Should show: `activated and is running`
- The SW should be the new version (check timestamp if available)

**✅ Test 2 Result:** Update applied successfully, page reloaded

---

## 🧪 Edge Cases to Test

### Edge Case 1: Multiple Tabs

1. Open app in **2 tabs** (Tab A and Tab B)
2. Deploy new version
3. Wait for banner in Tab A
4. Click "Update Now" in Tab A
5. **Expected:** Both tabs reload (SW updates globally)

### Edge Case 2: Offline Mode

1. Open app (online)
2. Deploy new version
3. Go offline (DevTools → Network → Offline)
4. Wait 90 seconds
5. **Expected:** Banner does NOT appear (can't fetch new SW when offline)
6. Go back online
7. **Expected:** Banner appears within ~60 seconds

### Edge Case 3: Hard Refresh

1. Deploy new version
2. Before banner appears, press `Ctrl+Shift+R` (hard refresh)
3. **Expected:** Banner appears immediately (because SW is already waiting)

---

## ❌ Common Issues & Fixes

### Issue 1: Banner Never Appears

**Symptoms:**
- Deploy #2 succeeded
- 5+ minutes passed
- No banner visible

**Debug Steps:**
```javascript
// In browser console:
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Active:', reg.active);
  console.log('Waiting:', reg.waiting);
  console.log('Installing:', reg.installing);
});
```

**Expected Output:**
```javascript
Active: ServiceWorker {state: "activated", ...}
Waiting: ServiceWorker {state: "installed", ...}  // ← Should be present
Installing: null
```

**If `waiting` is `null`:**
- Check if Deploy #2 actually changed the SW
- Verify `vite.config.ts` has `registerType: 'prompt'`
- Hard refresh (`Ctrl+Shift+R`) to force re-check

**Fix:**
```javascript
// Manually trigger update check:
navigator.serviceWorker.getRegistration().then(reg => {
  reg.update();
});
```

### Issue 2: Banner Appears But "Update Now" Doesn't Work

**Symptoms:**
- Banner visible
- Click "Update Now"
- Button shows "Updating..." but nothing happens

**Debug Steps:**
```javascript
// In browser console, check for errors:
navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log('Controller changed → should reload');
});

// Manually trigger update:
navigator.serviceWorker.getRegistration().then(reg => {
  if (reg.waiting) {
    reg.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
});
```

**Fix:**
- Check `src/lib/swUpdater.ts` → `applyUpdate()` function
- Verify SW listens for `SKIP_WAITING` message (in generated `sw.js`)

### Issue 3: Page Reloads Immediately Without Banner

**Symptoms:**
- Deploy #2
- Page reloads instantly (no banner)

**Cause:** `registerType` is set to `'autoUpdate'` instead of `'prompt'`

**Fix:**
```typescript
// vite.config.ts
VitePWA({
  registerType: 'prompt',  // ← Should be 'prompt', not 'autoUpdate'
  // ...
})
```

---

## 📊 Test Report Template

```markdown
### Double-Deploy Test Report

**Date:** YYYY-MM-DD  
**Tester:** [Name]  
**Environment:** Production / Preview  
**Deployment URL:** https://sparkfined-xyz.vercel.app

#### Deploy #1 (Baseline)
- [ ] Deployment succeeded
- [ ] App loads successfully
- [ ] Service Worker registered
- [ ] No update banner visible
- [ ] Console: No errors

#### Deploy #2 (Update Trigger)
- [ ] Deployment succeeded
- [ ] Browser tab kept open
- [ ] Banner appeared within 90 seconds
- [ ] Banner text: "New version available!"
- [ ] Banner has "Update Now" and "✕" buttons

#### Test 1: Dismiss Banner
- [ ] Dismiss button works
- [ ] Banner disappears
- [ ] App continues with old version
- [ ] Banner reappears on manual reload

#### Test 2: Apply Update
- [ ] "Update Now" button works
- [ ] Button shows "Updating..." with spinner
- [ ] Page reloads automatically (~1-2s)
- [ ] Banner disappears after reload
- [ ] New version is active

#### Edge Cases (Optional)
- [ ] Multiple tabs: All reload when one updates
- [ ] Offline mode: Banner doesn't appear when offline
- [ ] Hard refresh: Banner appears immediately if SW waiting

**Overall Result:** ✅ PASS / ❌ FAIL

**Notes:**
[Any observations or issues encountered]
```

---

## ✅ Success Criteria

Test is considered **PASSED** if:

1. ✅ Service Worker registers on Deploy #1
2. ✅ Update banner appears within 90 seconds of Deploy #2
3. ✅ Banner can be dismissed (and reappears on reload)
4. ✅ "Update Now" triggers page reload (~1-2 seconds)
5. ✅ **No silent reloads** (user must confirm update)
6. ✅ New version is active after reload

---

## 🚀 Post-Test Cleanup

```bash
# Revert test commit (optional)
git revert HEAD
git push origin <branch-name>

# Or keep test commit if harmless
```

---

**Test complete! 🎉**

If all criteria passed, the manual update flow is working correctly.
