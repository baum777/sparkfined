# 🧪 Double-Deploy Test Guide (Manual Update Banner Verification)

**Purpose:** Verify that the manual service worker update flow works correctly after deploying a new version.

**Owner:** Release Operator (R4)  
**Prerequisites:** Production deployment capability (Vercel/Netlify)

---

## Test Scenario

The manual update flow ensures users are **never surprised by auto-reloads**. Instead:
1. A new SW version is detected
2. A blue banner appears: "New version available!"
3. User clicks "Update Now" → page reloads with new version

---

## Test Steps

### Deploy #1: Initial Baseline

1. **Ensure clean state:**
   ```bash
   git checkout cursor/complete-main-launch-fixes-and-stabilize-4f83
   git pull --ff-only
   ```

2. **Deploy to production:**
   - **Vercel:** Push to `main` or trigger manual deployment
   - **Netlify:** Deploy from Git branch
   - **Manual:** Upload `dist/` folder

3. **Wait for deployment to complete:**
   - Check deployment status in dashboard (green checkmark)
   - Note the deployment URL: `https://sparkfined-xyz.vercel.app`

4. **Open app in browser (Desktop + Mobile):**
   - **Desktop:** Chrome/Edge (latest)
   - **Mobile:** Android Chrome (latest)
   - Clear cache: `Ctrl+Shift+R` (desktop) or hard refresh

5. **Verify service worker registered:**
   ```js
   // Open DevTools → Console
   navigator.serviceWorker.getRegistration().then(reg => {
     console.log('SW Active:', reg.active);
     console.log('SW Waiting:', reg.waiting); // Should be null
   });
   ```

6. **Expected State:**
   - ✅ App loads successfully
   - ✅ No update banner visible
   - ✅ SW registered and active
   - ✅ `reg.waiting` is `null`

---

### Deploy #2: New Version with Update Banner

1. **Make a trivial change (to trigger new SW build):**
   ```bash
   # Option A: Bump version in manifest
   # Edit vite.config.ts or package.json version field
   
   # Option B: Add a comment to main.tsx
   echo "// Deploy #2 test" >> src/main.tsx
   
   git add .
   git commit -m "chore: trigger deploy #2 for banner test"
   git push
   ```

2. **Wait for new deployment:**
   - Watch deployment dashboard (green checkmark)
   - Ensure new deployment URL is live

3. **Return to browser (keep existing tab open):**
   - **DO NOT RELOAD YET**
   - Wait 60-90 seconds (SW update polling interval)

4. **Check for update banner:**
   - ✅ Blue banner should appear at top: **"New version available!"**
   - Banner should have two buttons:
     - **"Update Now"** (primary, white background)
     - **"✕"** (dismiss button)

5. **Test Banner Interactions:**

   **Test A: Dismiss Banner**
   ```
   1. Click "✕" button
   2. Banner disappears
   3. App continues to work with old version
   4. Refresh page manually (Ctrl+R) → banner reappears
   ```

   **Test B: Apply Update**
   ```
   1. Ensure banner is visible
   2. Click "Update Now"
   3. Button shows spinner: "Updating..."
   4. Page reloads automatically (within 1-2 seconds)
   5. Banner disappears (new version active)
   ```

6. **Verify new version active:**
   ```js
   // DevTools → Console
   navigator.serviceWorker.getRegistration().then(reg => {
     console.log('SW Active:', reg.active);
     console.log('SW Waiting:', reg.waiting); // Should be null again
   });
   ```

---

### Deploy #3 (Optional): Re-verify Flow

1. **Make another trivial change:**
   ```bash
   echo "// Deploy #3 test" >> src/main.tsx
   git add . && git commit -m "chore: deploy #3 re-verify"
   git push
   ```

2. **Repeat steps from Deploy #2**
   - Confirm banner appears again
   - Test both "Dismiss" and "Update Now" paths

---

## Expected Results

### ✅ Success Criteria

| Test | Expected Behavior | Status |
|------|-------------------|--------|
| **Deploy #1** | App loads, SW active, no banner | ✅ |
| **Deploy #2** | Banner appears after 60-90s | ✅ |
| **Dismiss Banner** | Banner hides, app works, reappears on refresh | ✅ |
| **Update Now** | Page reloads, new version active, banner gone | ✅ |
| **No Silent Reload** | App never auto-reloads without user action | ✅ |
| **Mobile (Android)** | Banner works on mobile Chrome | ✅ |
| **Desktop (Chrome)** | Banner works on desktop Chrome/Edge | ✅ |

---

## Troubleshooting

### Banner Never Appears

**Possible Causes:**
1. SW not polling for updates (check `swUpdater.ts` logic)
2. New deployment has same SW hash (no actual change)
3. Browser cache too aggressive

**Debug Steps:**
```js
// Force SW update check:
navigator.serviceWorker.getRegistration().then(reg => {
  reg.update().then(() => console.log('Update check triggered'));
});

// Check if new SW is waiting:
setTimeout(() => {
  navigator.serviceWorker.getRegistration().then(reg => {
    console.log('Waiting SW:', reg.waiting);
    if (reg.waiting) {
      console.log('✅ Update detected but banner not shown!');
    }
  });
}, 5000);
```

**Solution:**
1. Hard refresh: `Ctrl+Shift+R`
2. Verify `UpdateBanner` component is mounted in `App.tsx`
3. Check browser console for errors

---

### Banner Appears But "Update Now" Doesn't Work

**Debug Steps:**
```js
// Check if SKIP_WAITING message is sent:
navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('SW Message:', event.data);
});

// Manually trigger update:
navigator.serviceWorker.getRegistration().then(reg => {
  reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
});
```

**Solution:**
1. Verify `applyUpdate()` function in `swUpdater.ts`
2. Check SW listens for `SKIP_WAITING` message (in generated `sw.js`)
3. Ensure `vite-plugin-pwa` config has `registerType: 'prompt'`

---

### Banner Appears Immediately (No 60s Delay)

**Expected Behavior:** If you hard-refresh the page after Deploy #2, the banner should appear immediately (because the new SW is already waiting).

**Not a Bug:** This is correct behavior. The 60s polling is for detecting updates while the app is open.

---

## Test Report Template

```markdown
### Double-Deploy Test Report

**Date:** YYYY-MM-DD  
**Tester:** [Name]  
**Environment:** Vercel Production / Netlify Production  
**Browsers Tested:** Chrome 120, Edge 120, Mobile Chrome (Android 13)

#### Deploy #1 (Baseline)
- [ ] App loads successfully
- [ ] SW registered and active
- [ ] No update banner visible
- [ ] Console shows no errors

#### Deploy #2 (Update Banner)
- [ ] Banner appears within 60-90s
- [ ] Banner text: "New version available!"
- [ ] "Update Now" button works (page reloads)
- [ ] Dismiss button works (banner hides)
- [ ] Banner reappears on manual refresh after dismiss

#### Mobile Testing
- [ ] Banner visible on mobile (Android Chrome)
- [ ] Banner buttons tappable (no layout issues)
- [ ] Update flow works on mobile

#### Edge Cases
- [ ] Multiple tabs: Banner syncs across tabs
- [ ] Offline mode: Banner doesn't appear when offline
- [ ] Install flow: Banner works in installed PWA

**Overall Result:** ✅ PASS / ❌ FAIL

**Notes:**
[Any observations or issues encountered]
```

---

## Rollback Plan (If Test Fails)

If the update banner doesn't work:

1. **Immediate Fix (Rollback Deploy #2):**
   ```bash
   # On Vercel:
   vercel rollback <deployment-url>
   
   # Or revert git commit:
   git revert HEAD
   git push
   ```

2. **Debug Locally:**
   ```bash
   pnpm build
   pnpm preview
   # Open http://localhost:5173
   # Trigger update manually via DevTools
   ```

3. **Re-deploy After Fix:**
   ```bash
   # Fix swUpdater.ts or UpdateBanner.tsx
   git add . && git commit -m "fix(sw): resolve update banner issue"
   git push
   ```

---

## Automation (Future)

This test can be automated with Playwright:

```typescript
// tests/e2e/update-banner.spec.ts
test('update banner appears after new deployment', async ({ page, context }) => {
  // 1. Load app (Deploy #1)
  await page.goto('/');
  await page.waitForSelector('body');
  
  // 2. Simulate new SW deployment
  await context.addServiceWorker({
    url: '/sw-new.js', // Mock new SW
    scope: '/',
  });
  
  // 3. Wait for banner
  await page.waitForSelector('[data-testid="update-banner"]', {
    timeout: 90000,
  });
  
  // 4. Click "Update Now"
  await page.click('button:has-text("Update Now")');
  
  // 5. Verify reload
  await page.waitForLoadState('load');
  await expect(page.locator('[data-testid="update-banner"]')).not.toBeVisible();
});
```

---

## Sign-Off

After successful testing:

- [ ] Deploy #1 completed successfully
- [ ] Deploy #2 triggered update banner
- [ ] Banner interactions work correctly
- [ ] Mobile and desktop tested
- [ ] No console errors or CSP violations
- [ ] Ready for production release

**Signed:** _________________________ **Date:** _____________

---

**Next Step:** Proceed to **Step 6: Tag & Release** (v1.0.0)
