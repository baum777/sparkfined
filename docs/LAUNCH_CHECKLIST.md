# Launch Checklist - Beta Teaser (Wave 1)

**Project:** Sparkfined TA-PWA  
**Version:** v0.1.0-beta  
**Launch Date:** Nov 07, 2025 @ 10:00 AM EST  
**Status:** 🟡 Pre-Launch

---

## 📅 Timeline Overview

| Phase | Date Range | Status |
|-------|------------|--------|
| Pre-Launch Prep | Nov 03-05 | 🟡 In Progress |
| Final Testing | Nov 06 | ⏳ Pending |
| Launch Day | Nov 07 | ⏳ Pending |
| Post-Launch | Nov 08-14 | ⏳ Pending |

---

## ✅ Pre-Launch Checklist (Nov 03-05)

### 📦 Build & Quality Assurance

- [ ] **Run full test suite**
  ```bash
  pnpm test
  # Expected: All tests passing (7/7)
  ```

- [ ] **Type checking**
  ```bash
  pnpm typecheck
  # Expected: No TypeScript errors
  ```

- [ ] **Lint checking**
  ```bash
  pnpm lint
  # Expected: No ESLint warnings/errors
  ```

- [ ] **Production build**
  ```bash
  pnpm build
  # Expected: Build succeeds, bundle < 70 KB gzipped
  ```

- [ ] **Preview production build locally**
  ```bash
  pnpm preview
  # Expected: App loads at http://localhost:4173
  ```

---

### 🔌 PWA Functionality

- [ ] **Service Worker Registration**
  - Open DevTools → Application → Service Workers
  - Verify SW status: "activated and running"
  - Check precache entries (should be 6+ files)

- [ ] **Install Prompt**
  - Mobile Safari: Verify "Add to Home Screen" appears in share menu
  - Mobile Chrome: Verify install banner appears after engagement
  - Desktop: Verify install icon in address bar

- [ ] **Offline Mode**
  - Enable airplane mode or DevTools → Network → Offline
  - Navigate between all 4 pages: Home, Analyze, Journal, Replay
  - Expected: All routes load, no console errors

- [ ] **Offline Indicator**
  - Toggle offline/online in DevTools
  - Verify badge appears when offline
  - Verify toast notification on reconnect
  - Expected: Auto-hides after 3 seconds

- [ ] **Cache Behavior**
  - DevTools → Application → Cache Storage
  - Verify caches exist:
    - `workbox-precache-v2-[hash]`
    - `dexscreener-api-cache`
    - `runtime-cache`
  - Clear cache, reload, verify re-population

---

### 📱 Cross-Device Testing

#### Mobile Devices

- [ ] **iOS Safari (iPhone)**
  - Resolution: 375x667 (SE), 390x844 (14 Pro)
  - Verify: Install prompt, offline mode, dark mode
  - Swipe gestures: Bottom nav, modal close
  
- [ ] **Android Chrome (Pixel/Samsung)**
  - Resolution: 412x915 (Pixel 5)
  - Verify: Install banner, offline mode, dark mode
  - Back button: Modal close, navigation

#### Desktop Browsers

- [ ] **Chrome (latest)**
  - Verify: All features functional, responsive breakpoints
  
- [ ] **Firefox (latest)**
  - Verify: All features functional, service worker
  
- [ ] **Safari (latest, macOS)**
  - Verify: All features functional, install prompt

#### Responsive Breakpoints

- [ ] **Mobile (320px-767px)** - Bottom nav, stacked layout
- [ ] **Tablet (768px-1023px)** - Hybrid layout
- [ ] **Desktop (1024px+)** - Full layout (not optimized, but functional)

---

### 🗄️ Database & Storage

- [ ] **IndexedDB Schema**
  - DevTools → Application → IndexedDB → `sparkfined-ta-db`
  - Verify stores exist: `trades`, `sessions`, `metrics`, `feedback`
  - Verify version: `v2`

- [ ] **Trade CRUD Operations**
  - Create: Save a trade from Analyze page → Check Journal
  - Read: View saved trade in Journal
  - Update: Edit trade notes → Verify changes persist
  - Delete: Delete trade → Verify removed from list

- [ ] **Metrics Collection**
  - Perform 3-5 key actions (drop, save, replay)
  - DevTools → Application → IndexedDB → `metrics` store
  - Verify event counters increment

- [ ] **Feedback Submission**
  - Click 💬 → Select "Idea" → Write feedback → Submit
  - DevTools → Application → IndexedDB → `feedback` store
  - Verify entry with status "queued"

- [ ] **Export Functionality**
  - Click 📊 → Export JSON
  - Verify file downloads with correct structure
  - Click "Export CSV" → Verify readable format
  - Click "Copy to Clipboard" → Paste and verify

---

### 🎨 UI/UX Polish

- [ ] **Logo Animation**
  - Home page: Verify logo animates on load
  - Header: Verify logo visible and clickable

- [ ] **Dark Mode**
  - Verify dark mode active by default
  - Check contrast ratios (use DevTools Lighthouse)
  - Neon green (#00FF66) accent visible on all key elements

- [ ] **Modal Interactions**
  - Feedback Modal: Open/close, 2-step flow, success animation
  - Metrics Panel: Open/close, scrollable content
  - Save Trade Modal: Open/close, form validation
  - Replay Modal: Open/close, controls visible

- [ ] **Bottom Navigation**
  - All 4 tabs: Home, Analyze, Journal, Replay
  - Active state highlighting (green underline)
  - Tap targets: Minimum 44x44px (iOS guidelines)

- [ ] **Loading States**
  - Verify skeleton screens (if implemented)
  - No jarring content shifts (CLS)

- [ ] **Error States**
  - Upload invalid file → Verify error message
  - Navigate offline → Verify graceful degradation

---

### 📄 Documentation & Metadata

- [ ] **README.md**
  - [x] Updated with Beta information
  - [x] Live demo URL placeholder (update after deployment)
  - [x] Features section accurate
  - [x] Installation instructions clear

- [ ] **CHANGELOG.md**
  - [x] Created with v0.1.0-beta entry
  - [x] All features documented
  - [x] Known limitations listed

- [ ] **public/beta-info.json**
  - [x] Created with build metadata
  - [x] Commit hash accurate
  - [x] Timestamp correct
  - [x] Feature list up to date

- [ ] **Meta Tags (index.html)**
  - [ ] `<title>` updated with tagline
  - [ ] `<meta name="description">` compelling
  - [ ] Twitter Card meta tags added
  - [ ] Open Graph meta tags added
  - [ ] Favicon and PWA icons referenced

- [ ] **manifest.webmanifest**
  - [ ] `name` and `short_name` set
  - [ ] `description` accurate
  - [ ] `theme_color` = #00FF66 (neon green)
  - [ ] `background_color` = #0A0A0A (dark)
  - [ ] Icons: 192x192, 512x512 (update placeholders)

---

### 🎬 Launch Assets

- [ ] **Video Promo**
  - [ ] 15-20s clip recorded (landscape)
  - [ ] Device frame applied
  - [ ] Branding overlay (logo watermark)
  - [ ] End screen with tagline
  - [ ] Exported as MP4, <5 MB
  - [ ] Uploaded to hosting (Cloudinary/S3)

- [ ] **Screenshots (4 Core)**
  - [ ] 01-home-page.png (with device frame)
  - [ ] 02-analyze-result-card.png (with device frame)
  - [ ] 03-journal-page.png (with device frame)
  - [ ] 04-replay-page.png (with device frame)
  - [ ] Uploaded to hosting

- [ ] **Social Media Images**
  - [ ] twitter-preview.png (1200x675)
  - [ ] og-image.png (1200x630)
  - [ ] discord-banner.png (960x540, optional)
  - [ ] Uploaded to hosting
  - [ ] URLs added to meta tags

---

### 🌐 Deployment Preparation

- [ ] **Choose Hosting Platform**
  - Options: Vercel, Netlify, Cloudflare Pages, GitHub Pages
  - Recommended: Vercel (zero-config, auto-HTTPS)

- [ ] **Environment Variables**
  - [ ] `VITE_API_BASE_URL` set (if needed)
  - [ ] `VITE_ENABLE_ANALYTICS` = false
  - [ ] `VITE_ENABLE_DEBUG` = false
  - [ ] All secrets removed from code

- [ ] **Build Configuration**
  - [ ] `vite.config.ts` production-ready
  - [ ] `base` path correct (if not root)
  - [ ] Service worker enabled in production only

- [ ] **Domain Setup (Optional)**
  - [ ] Custom domain purchased (e.g., sparkfined.app)
  - [ ] DNS configured (A/CNAME records)
  - [ ] SSL/TLS certificate active (auto via Vercel)

---

## 🚀 Final Testing Checklist (Nov 06)

### Smoke Tests (15 minutes)

1. **Happy Path Flow**
   ```
   Open app → Navigate to Analyze → Drop demo screenshot → 
   View result → Save trade → Check Journal → Open Replay → 
   Control playback → Return Home
   ```
   - [ ] No console errors
   - [ ] All transitions smooth
   - [ ] Data persists after reload

2. **Offline Scenario**
   ```
   Open app (online) → Enable offline mode → 
   Navigate all pages → Attempt to drop image → 
   Check cached data → Re-enable online
   ```
   - [ ] App remains functional
   - [ ] Offline indicator appears
   - [ ] No hard crashes

3. **Feedback Loop**
   ```
   Click 💬 → Submit feedback → Click 📊 → 
   Export JSON → Verify data → Clear browser data → 
   Reload app → Verify fresh state
   ```
   - [ ] Feedback saves locally
   - [ ] Export downloads correctly
   - [ ] Fresh state has no stale data

---

### Performance Audit (Lighthouse)

Run in DevTools → Lighthouse → Mobile → Progressive Web App

**Target Scores:**
- [ ] **Performance:** 90+ (green)
- [ ] **Accessibility:** 90+ (green)
- [ ] **Best Practices:** 90+ (green)
- [ ] **SEO:** 90+ (green)
- [ ] **PWA:** All checks passing

**Key Metrics:**
- [ ] First Contentful Paint (FCP): < 1.8s
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] Time to Interactive (TTI): < 3.8s

---

### Security Audit

- [ ] **No hardcoded secrets** in codebase
  ```bash
  grep -r "API_KEY\|SECRET\|PASSWORD" src/
  # Expected: No matches
  ```

- [ ] **Dependencies up to date**
  ```bash
  pnpm outdated
  # Expected: No critical vulnerabilities
  ```

- [ ] **HTTPS enforced** (after deployment)
  - Test: `http://[domain]` redirects to `https://[domain]`

- [ ] **Content Security Policy (CSP)**
  - Verify CSP headers (if configured)
  - Test: No console warnings about blocked resources

---

## 🎉 Launch Day Checklist (Nov 07)

### Morning (8:00-10:00 AM EST)

- [ ] **Final Production Build**
  ```bash
  git pull origin main
  pnpm install
  pnpm build
  ```

- [ ] **Deploy to Hosting**
  - [ ] Push to `main` branch (triggers auto-deploy)
  - [ ] Verify deployment success (check hosting dashboard)
  - [ ] Test live URL: `https://[your-domain]`

- [ ] **Update README with Live URL**
  - [ ] Replace `[Add URL after deployment]` with actual URL
  - [ ] Commit: `docs(readme): add live demo url`
  - [ ] Push to main

- [ ] **Create Git Tag**
  ```bash
  git tag -a v0.1.0-beta -m "Beta Teaser Release (Wave 1)"
  git push origin v0.1.0-beta
  ```

- [ ] **GitHub Release**
  - [ ] Navigate to: `https://github.com/[user]/sparkfined-ta-pwa/releases/new`
  - [ ] Tag: `v0.1.0-beta`
  - [ ] Title: "v0.1.0-beta - Beta Teaser (Wave 1)"
  - [ ] Body: Copy from `docs/SOCIAL_COPY.md` GitHub section
  - [ ] Attach assets: Promo video, screenshots
  - [ ] Check "This is a pre-release"
  - [ ] Publish release

---

### Launch Hour (10:00-11:00 AM EST)

- [ ] **Twitter/X Thread**
  - [ ] Copy from `docs/SOCIAL_COPY.md`
  - [ ] Attach promo video to Tweet 1
  - [ ] Attach screenshot collage to Tweet 2
  - [ ] Schedule or publish manually
  - [ ] Pin main thread to profile

- [ ] **Discord Announcement**
  - [ ] Copy from `docs/SOCIAL_COPY.md`
  - [ ] Attach promo video or collage
  - [ ] Post in #announcements channel
  - [ ] Tag @everyone (if appropriate)

- [ ] **Update Social Profiles**
  - [ ] Twitter bio: Add demo URL
  - [ ] GitHub profile README: Add project link
  - [ ] Discord server description: Update status

---

### Monitoring (11:00 AM - 6:00 PM EST)

- [ ] **Real-Time Monitoring**
  - [ ] Check hosting logs for errors
  - [ ] Monitor Twitter mentions (#Sparkfined)
  - [ ] Respond to comments within 2 hours

- [ ] **Analytics Check**
  - [ ] Hosting dashboard: Unique visitors, page views
  - [ ] GitHub: Stars, forks, issues
  - [ ] Twitter: Impressions, engagements

- [ ] **Bug Triage**
  - [ ] New issues on GitHub → Label and prioritize
  - [ ] Critical bugs → Hotfix and redeploy
  - [ ] Minor bugs → Add to Alpha backlog

---

## 📊 Post-Launch Checklist (Nov 08-14)

### Day 1-2 (Nov 08-09)

- [ ] **Feedback Collection**
  - [ ] Read all in-app feedback submissions
  - [ ] Categorize: Bug, Idea, Other
  - [ ] Respond on Twitter/Discord

- [ ] **Engagement**
  - [ ] Share user testimonials (with permission)
  - [ ] Post meme tweet (see `SOCIAL_COPY.md`)
  - [ ] Amplify community content (retweets, replies)

- [ ] **Metrics Summary**
  - [ ] Week 1 snapshot:
    - Total installs (estimate from hosting)
    - Tweet impressions
    - GitHub stars
    - In-app feedback count

---

### Week 1 Summary (Nov 14)

- [ ] **Create Retrospective Doc**
  - Template: `docs/BETA_RETROSPECTIVE.md`
  - Sections: What worked, What didn't, Learnings, Next steps

- [ ] **Update Roadmap**
  - Prioritize Alpha features based on feedback
  - Update `docs/ROADMAP.md` with new timeline

- [ ] **Thank You Post**
  - Twitter thread summarizing Week 1
  - Thank beta testers
  - Tease Alpha features

---

## 🚨 Rollback Plan (If Needed)

### Critical Bug Detected

1. **Assess Severity**
   - Critical: App unusable, data loss, privacy breach → Rollback immediately
   - High: Core feature broken, no workaround → Hotfix within 2 hours
   - Medium: Minor UX issue, workaround available → Fix in next release
   - Low: Cosmetic issue → Add to backlog

2. **Rollback Steps**
   ```bash
   # Revert to previous tag
   git checkout v0.0.9  # (if exists)
   pnpm build
   # Deploy via hosting platform
   ```

3. **Communication**
   - Twitter: "We detected an issue and rolled back to a previous version. Fix incoming!"
   - Discord: Same message + more details
   - GitHub: Close release notes, add disclaimer

4. **Hotfix Process**
   ```bash
   git checkout -b hotfix/critical-bug
   # Fix bug
   pnpm test && pnpm build
   git commit -m "fix(critical): describe fix"
   git checkout main
   git merge hotfix/critical-bug
   git tag v0.1.0-beta-hotfix1
   git push --all && git push --tags
   ```

---

## ✅ Definition of Done (Phase 5 Complete)

All checkboxes below must be ticked:

### Code & Build
- [x] All tests passing (7/7)
- [x] No TypeScript errors
- [x] No ESLint warnings
- [x] Production build successful
- [x] Bundle size under budget (< 70 KB gzipped)

### PWA Functionality
- [ ] Service worker registers correctly
- [ ] Install prompt works (mobile Safari + Chrome)
- [ ] Offline mode fully functional
- [ ] Offline indicator appears/disappears correctly
- [ ] Cache strategies working (StaleWhileRevalidate, NetworkFirst)

### Documentation
- [x] README updated with beta info and live URL
- [x] CHANGELOG.md created
- [x] beta-info.json created
- [x] LAUNCH_ASSETS.md created
- [x] SOCIAL_COPY.md created
- [x] LAUNCH_CHECKLIST.md created (this file)
- [ ] Phase 5 completion doc created

### Assets
- [ ] Promo video (15-20s) created and uploaded
- [ ] 4 core screenshots with device frames created
- [ ] Twitter card preview image created
- [ ] Open Graph image created
- [ ] All assets hosted and URLs added to meta tags

### Deployment
- [ ] Deployed to production hosting
- [ ] Live demo URL accessible
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Meta tags verified (Twitter card, OG)

### Launch
- [ ] Git tag `v0.1.0-beta` created
- [ ] GitHub release published
- [ ] Twitter thread posted and pinned
- [ ] Discord announcement posted
- [ ] Social profiles updated with demo URL

### Post-Launch
- [ ] First user feedback received and acknowledged
- [ ] Week 1 metrics tracked
- [ ] Retrospective doc planned
- [ ] Alpha roadmap updated

---

## 📞 Emergency Contacts

**Technical Issues:**
- Hosting Support: [Add contact]
- Domain Registrar: [Add contact]

**Community Issues:**
- Twitter/X Support: https://help.twitter.com
- Discord Server Owner: [Add contact]

**Team Communication:**
- Slack/Discord: #sparkfined-launch
- Email: team@sparkfined.dev (if applicable)

---

## 📚 Reference Links

- **Project Repo:** https://github.com/<USERNAME>/sparkfined-ta-pwa
- **Hosting Dashboard:** [Add URL after deployment]
- **Live Demo:** [Add URL after deployment]
- **Asset Hosting:** [Add Cloudinary/S3 URL]
- **Analytics:** [Add if configured]

---

**Checklist Owner:** Sparkfined Team  
**Last Updated:** 2025-10-25  
**Next Review:** Nov 06, 2025 (Pre-Launch Final Check)

---

## 🎯 Quick Reference: Day-Of Commands

```bash
# Final build and deploy (Vercel example)
git pull origin main
pnpm install
pnpm test && pnpm typecheck && pnpm lint
pnpm build
git add -A
git commit -m "chore(release): v0.1.0-beta final build"
git push origin main
# Auto-deploys via Vercel

# Create and push tag
git tag -a v0.1.0-beta -m "Beta Teaser Release (Wave 1)"
git push origin v0.1.0-beta

# Check deployment
curl -I https://[your-domain]
# Should return: HTTP/2 200
```

---

**LFG! 🚀**
