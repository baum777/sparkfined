<<<<<<< HEAD
<<<<<<< HEAD
# Development Workflow

Guide for human developers and AI agents working on Sparkfined TA-PWA.

---

## Quick Reference

### Quality Gates (Before Every Commit)
```bash
pnpm fmt && pnpm lint && pnpm typecheck && pnpm build
```

### Branch → Commit → PR Flow
```bash
git checkout -b feat/my-feature
# ... make changes ...
pnpm check  # Runs all quality gates
git add -A
git commit -m "feat(scope): description"
git push origin feat/my-feature
# Create PR on GitHub
```

---

## Agent Modes: Ask vs Edit vs PR

### 1. Ask Mode (Planning)
**When:** Understanding requirements, clarifying scope, exploring options

**Agent:** 
- Read existing code
- Ask clarifying questions
- Propose solutions
- Estimate impact

**Human:**
- Provide context
- Make decisions
- Approve direction

**Example:**
```
Human: "We need to add RSI indicator support"
Agent: "Should RSI be:
  1. Real-time calculated or cached?
  2. Configurable period (default 14)?
  3. Shown as overlay or separate panel?"
```

### 2. Edit Mode (Implementation)
**When:** Making focused code changes

**Agent:**
- Plan → Diff → Review workflow
- Small diffs (< 200 lines per file)
- Follow existing patterns
- Update related docs

**Human:**
- Review diffs
- Test changes locally
- Approve or request changes

**Example:**
```bash
# Agent makes changes
# Agent runs: pnpm check
# Agent commits: feat(indicators): add RSI calculation
# Human reviews and approves
```

### 3. PR Mode (Integration)
**When:** Ready to merge feature into main branch

**Agent:**
- Create PR with clear description
- Link related issues
- Add screenshots (UI changes)
- Note breaking changes

**Human:**
- Review PR
- Test on staging
- Approve and merge

---

## Workflow Patterns

### Pattern 1: New Feature
```
1. Ask → Clarify requirements
2. Edit → Implement in feat/* branch
3. Edit → Add tests
4. Edit → Update docs
5. PR → Review and merge
```

### Pattern 2: Bug Fix
```
1. Ask → Reproduce and diagnose
2. Edit → Fix in fix/* branch
3. Edit → Add regression test
4. PR → Fast-track review
```

### Pattern 3: Refactoring
```
1. Ask → Propose refactor plan
2. Ask → Get approval (breaking changes?)
3. Edit → Small, incremental changes
4. Edit → Ensure tests still pass
5. PR → Detailed review
```

### Pattern 4: Documentation
```
1. Edit → Update docs directly
2. Commit → docs: description
3. PR → Quick review (typos, accuracy)
```

---

## AI Agent Guidelines

### Before Making Changes

**Read First:**
```bash
# Understand the codebase
cat src/pages/AnalyzePage.tsx
cat src/components/Header.tsx
cat docs/PROJECT_STRUCTURE.md
```

**Check Patterns:**
- How are other components structured?
- What's the existing state management pattern?
- Are there similar features to reference?

### During Changes

**Keep Diffs Small:**
- Max 200 lines per file
- Max 5 files per commit
- Extract separate commits if larger

**Follow Conventions:**
```typescript
// Good: Follows existing patterns
import { useState } from 'react'
import Button from '@/components/Button'
import type { ChartData } from '@/types'

export default function AnalyzePage() {
  const [data, setData] = useState<ChartData | null>(null)
  // ...
}

// Avoid: Mixing styles
const AnalyzePage = () => {
  let data: any
  // ...
}
```

**Update Related Files:**
- Component → Test
- Public API → Documentation
- New route → Navigation links

### After Changes

**Quality Gates:**
```bash
pnpm fmt        # ✓ Formatting
pnpm lint       # ✓ Linting
pnpm typecheck  # ✓ Type safety
pnpm build      # ✓ Build succeeds
pnpm test       # ✓ Tests pass
```

**Commit Message:**
```bash
git commit -m "feat(analyze): add symbol search autocomplete

- Implement debounced search input
- Add API integration for symbol lookup
- Display results with ticker + name
- Handle loading and error states

Closes #42"
```

---

## Human Developer Guidelines

### Starting Work

```bash
# Get latest code
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/symbol-search

# Ensure clean slate
pnpm install
pnpm check
```

### During Development

**Incremental Testing:**
```bash
# Keep dev server running
pnpm dev

# Keep tests running (separate terminal)
pnpm test:watch

# Manual testing in browser
# http://localhost:5173/
```

**Frequent Checks:**
```bash
# Quick check (every few changes)
pnpm typecheck

# Full check (before commit)
pnpm check
```

### Before Committing

**Self-Review Checklist:**
- [ ] Code follows project patterns
- [ ] No TypeScript errors
- [ ] No console.log() left behind
- [ ] Tests added/updated
- [ ] Docs updated (if needed)
- [ ] Commit message follows convention

**Final Verification:**
```bash
pnpm check  # All quality gates
git status  # Review staged files
git diff    # Review exact changes
```

---

## Common Workflows

### Adding a New Component

```bash
# 1. Create files
touch src/components/SymbolSearch.tsx
touch src/components/__tests__/SymbolSearch.test.tsx

# 2. Implement component (use existing patterns)
# - Default export for component
# - TypeScript props interface
# - Mobile-first responsive design

# 3. Add tests
# - Basic render test
# - User interaction tests
# - Error state tests

# 4. Verify
pnpm check

# 5. Commit
git add src/components/
git commit -m "feat(components): add SymbolSearch component"
```

### Adding a New Route

```bash
# 1. Create page component
touch src/pages/SettingsPage.tsx

# 2. Add route in App.tsx
# <Route path="/settings" element={<SettingsPage />} />

# 3. Add navigation link (if needed)
# Update Header or BottomNav

# 4. Test navigation
pnpm dev  # Navigate to /settings

# 5. Verify
pnpm check

# 6. Commit
git commit -m "feat(routes): add settings page"
```

### Updating Dependencies

```bash
# Check for updates
pnpm outdated

# Update specific package
pnpm update <package-name>

# Verify everything still works
pnpm check

# Commit
git commit -m "chore(deps): update <package-name> to vX.Y.Z"
```

### Fixing a Bug

```bash
# 1. Create fix branch
git checkout -b fix/rsi-calculation-error

# 2. Add failing test (reproduce bug)
# Edit src/lib/__tests__/indicators.test.ts

# 3. Fix the bug
# Edit src/lib/indicators.ts

# 4. Verify test now passes
pnpm test

# 5. Full check
pnpm check

# 6. Commit
git commit -m "fix(indicators): correct RSI calculation for edge cases

- Handle NaN when price changes are zero
- Add test for flat price periods

Fixes #123"
```

---

## Performance Testing

### Local Performance Check

```bash
# Build production bundle
pnpm build

# Check bundle sizes
ls -lh dist/assets/

# Preview production build
pnpm preview

# Test with Chrome DevTools:
# 1. Open DevTools → Performance
# 2. Throttle: Fast 3G
# 3. Record page load
# 4. Verify < 400ms initial render
```

### Mobile Testing

```bash
# Start dev server
pnpm dev

# Open DevTools → Toggle device toolbar
# Test devices:
# - iPhone SE (375px width)
# - Pixel 5 (393px width)
# - iPad (768px width)

# Verify:
# - Touch targets ≥ 44px
# - Thumb-reach zones
# - Safe area insets
```

---

## Troubleshooting

### Build Fails

```bash
# Clean and reinstall
rm -rf node_modules dist
pnpm install

# Check for type errors
pnpm typecheck

# Check for lint errors
pnpm lint
```

### Tests Fail

```bash
# Run tests with verbose output
pnpm test --reporter=verbose

# Run specific test file
pnpm test SymbolSearch

# Debug in watch mode
pnpm test:watch
```

### Dev Server Issues

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Restart dev server
pnpm dev

# Try different port
pnpm dev --port 3000
```

---

## Phase 1 Complete ✅

**Status:** Foundation & App Shell Ready  
**Date:** 2025-10-25  
**Commit:** `feat(shell): app routes, nav, state scaffolds, sw register`

### Delivered
- ✅ Guardrails & project policies active
- ✅ App shell with Header + BottomNav
- ✅ 3 pages: Analyze, Journal, Replay
- ✅ 4-state pattern: empty, loading, error, result
- ✅ PWA manifest + SW registration
- ✅ Mobile-first layout (360px+)
- ✅ All quality gates passing
- ✅ Tests: 5/5 passing

### Verified
```bash
✅ pnpm fmt        # Code formatted
✅ pnpm lint       # No lint errors
✅ pnpm typecheck  # TypeScript strict
✅ pnpm build      # Bundle: 181.65 KB (57.76 KB gzipped)
✅ pnpm test       # 5/5 tests passing
```

---

## Phase 2 Next: Core Features / Deep Dive

**Modules 2–7** will add:

### Module 2: Chart Integration
- Lightweight charting library (recharts or lightweight-charts)
- Candlestick, line, and area charts
- Zoom, pan, crosshair interactions
- Real-time data updates

### Module 3: Technical Indicators
- RSI, MACD, Moving Averages
- Bollinger Bands, Volume indicators
- Indicator overlays and panels
- Configurable parameters

### Module 4: Symbol Search
- Debounced search input
- API integration for symbol lookup
- Autocomplete with ticker + name
- Recent searches cache

### Module 5: Journal System
- Create, edit, delete entries
- Rich text editor (markdown)
- Tags and categories
- Search and filter

### Module 6: Replay Engine
- Historical data playback
- Bar-by-bar progression
- Prediction tracking
- Win rate calculation

### Module 7: Data Layer
- IndexedDB for offline storage
- API client with retry logic
- Optimistic updates
- Sync status indicators

**Tracking:** See GitHub Issue "Phase 2 — Core Feature / Deep Dive"

### Prerequisites
Before starting Phase 2:
1. Phase 1 complete (this document updated)
2. All quality gates green
3. App boots and navigates correctly
4. Decision on charting library made

---

## Resources

- **Guardrails:** `.cursor/rules/00-guardrails.md`
- **Contributing:** `CONTRIBUTING.md`
- **Setup:** `docs/SETUP.md`
- **Structure:** `docs/PROJECT_STRUCTURE.md`
- **Roadmap:** `docs/ROADMAP.md`
=======
=======
>>>>>>> origin/pr/8
# Development Workflow — Sparkfined TA-PWA

## 🎯 Overview
This document describes the development workflow for **human developers** and **AI agents** working on Sparkfined TA-PWA.

## 🧑‍💻 Human Developer Workflow

### Daily Development Loop
```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feat/your-feature

# 3. Code → Test → Commit cycle
pnpm dev              # Start dev server (http://localhost:5173)
# ... make changes ...
pnpm fmt              # Format code
pnpm lint             # Check for errors
pnpm typecheck        # TypeScript validation
pnpm test             # Run tests

# 4. Commit with conventional format
git add .
git commit -m "feat(scope): description"

# 5. Push and open PR
git push origin feat/your-feature
```

### Quality Gates (Run Before Every Commit)
```bash
pnpm fmt && pnpm lint && pnpm typecheck && pnpm build
```
**All must pass ✅ — no exceptions.**

### Code Review Checklist
- [ ] Diff is focused (< 200 lines preferred)
- [ ] Tests pass locally
- [ ] Mobile responsive (360–414px tested)
- [ ] Dark mode works
- [ ] No console errors
- [ ] Accessibility: keyboard + screen reader tested
- [ ] Documentation updated

## 🤖 AI Agent Workflow (Cursor/Claude)

### Interaction Modes

#### **1. Ask Mode** (No Code Changes)
*Use when:* User asks questions, needs explanations, or wants suggestions.

```
User: "How does the chart analysis work?"
Agent: [Explains with code references, no edits]
```

#### **2. Edit Mode** (Code Changes)
*Use when:* User requests implementation, fixes, or refactors.

**Process:**
1. **Read** relevant files first
2. **Plan** changes (explain approach)
3. **Execute** using `MultiStrReplace` or `Write` tools
4. **Verify** with quality checks:
   ```bash
   pnpm fmt && pnpm lint && pnpm typecheck
   ```
5. **Summarize** what was changed and why

**Example:**
```
User: "Add a loading spinner to the chart component"

Agent:
1. Read Chart.tsx
2. Plan: Add LoadingSpinner component, show during data fetch
3. Execute edits (imports, state, conditional render)
4. Run: pnpm fmt && pnpm lint && pnpm typecheck ✅
5. Summary: "Added spinner that appears while chart data loads"
```

#### **3. PR Mode** (Pull Request Creation)
*Use when:* User asks to commit/push changes.

**Process:**
1. Review all changes (`git status`, `git diff`)
2. Stage relevant files
3. Create conventional commit:
   ```bash
   git commit -m "feat(analyze): add chart loading spinner"
   ```
4. Push to branch
5. Generate PR description with:
   - Summary of changes
   - Test plan
   - Screenshots (if UI)

### Agent Best Practices

#### DO ✅
- **Small diffs**: One logical change at a time
- **Read first**: Always check existing code before editing
- **Run checks**: Execute `pnpm fmt && pnpm lint && pnpm typecheck` after edits
- **Update tests**: Modify tests when changing APIs
- **Ask questions**: Clarify ambiguous requirements

#### DON'T ❌
- **Skip types**: Never use `any`, always type properly
- **Ignore errors**: Fix linter/TS errors immediately
- **Make unrelated changes**: Stay focused on the task
- **Assume**: Ask if requirements are unclear

### Debugging Failed Quality Checks

#### ESLint Errors
```bash
pnpm lint
# Read error messages, fix issues, re-run
```

#### TypeScript Errors
```bash
pnpm typecheck
# Address type mismatches, add missing types
```

#### Build Failures
```bash
pnpm build
# Check for import errors, missing dependencies
```

## 📁 File Organization

### Where to Add New Code

| Type | Location | Example |
|------|----------|---------|
| UI Components | `src/components/` | `ChartUpload.tsx` |
| Pages/Routes | `src/pages/` | `JournalPage.tsx` |
| Custom Hooks | `src/hooks/` | `useChartData.ts` |
| Utilities | `src/lib/` | `chartParser.ts` |
| Types | `src/types/` | `chart.types.ts` |
| Global Styles | `src/styles/` | `App.css` |
| Tests | `src/**/__tests__/` | `ChartUpload.test.tsx` |

### Naming Conventions
- **Components**: PascalCase (`ChartUpload.tsx`)
- **Hooks**: camelCase with `use` prefix (`useChartData.ts`)
- **Utils**: camelCase (`parseChartData.ts`)
- **Types**: PascalCase interfaces (`ChartData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 🧪 Testing Strategy

### Test Pyramid
```
       /\
      /E2E\        ← Manual smoke tests
     /______\
    /  Unit  \     ← Vitest tests (80% coverage goal)
   /__________\
```

### When to Write Tests
- **Always**: Critical logic (data parsing, validation)
- **Often**: Reusable components, hooks
- **Sometimes**: Simple presentational components
- **Never**: Trivial wrappers, one-off scripts

### Running Tests
```bash
pnpm test              # Run all tests once
pnpm test:watch        # Watch mode for TDD
pnpm test -- Chart     # Run tests matching "Chart"
```

## 🚀 Deployment Workflow

### Production Checklist
- [ ] All tests pass
- [ ] `pnpm build` succeeds
- [ ] Lighthouse score > 90 (Performance, A11y, PWA)
- [ ] Service worker registers correctly
- [ ] Offline mode functional
- [ ] Environment variables configured

### Build Command
```bash
pnpm build
# Output: dist/ folder ready for deployment
```

### Preview Production Build
```bash
pnpm preview
# Test at http://localhost:4173
```

## 📴 Testing Offline Mode (Phase 4)

### How to Test Offline Functionality

**Method 1: Browser DevTools (Recommended)**
1. Build production version: `pnpm build && pnpm preview`
2. Open http://localhost:4173 in Chrome/Edge
3. Open DevTools (F12) → **Network** tab
4. Check **"Offline"** checkbox or select **"Offline"** from throttling dropdown
5. Verify:
   - ✅ App shell loads instantly
   - ✅ Navigation works (Analyze/Journal/Replay)
   - ✅ Cached Dexscreener data displays
   - ✅ Orange "Offline Mode" badge appears at top
   - ✅ No blank screens or error states

**Method 2: Airplane Mode (Mobile Testing)**
1. Deploy to test environment or use `pnpm preview` with ngrok/local network
2. Open app on mobile device
3. Enable Airplane Mode
4. Navigate through app and verify offline resilience

**Method 3: Service Worker Inspect**
1. After build, navigate to `chrome://serviceworker-internals/`
2. Locate `http://localhost:4173` registration
3. Click **"Unregister"** → Reload → Verify re-registration
4. Check **Console** for SW lifecycle logs:
   ```
   ✅ SW registered: /
   📦 Cache updated: <url>
   ```

### Cache Behavior (Phase 4)
- **App Shell**: Pre-cached on install (HTML/CSS/JS/icons)
- **Dexscreener API**: Stale-While-Revalidate, 24h expiration
- **Other APIs**: Network-First with 5s timeout, 5min cache
- **Fonts/CDN**: Cache-First, 1 year expiration

### Cache Invalidation
- Automatic: 24h age check for Dexscreener data
- Manual: Clear via DevTools → **Application** → **Storage** → **Clear site data**

## 📊 Feedback & Metrics Export (Phase 4)

### How to Use Telemetry & Feedback System

**1. View Usage Metrics**
- Click **📊** icon in header
- See aggregated event counts:
  - `drop_to_result`: Chart analysis completed
  - `save_trade`: Trade saved to journal
  - `open_replay`: Replay modal opened
  - `export_share`: Data exported
  - `screenshot_dropped`: Screenshot uploaded
  - `demo_mode_activated`: Demo mode triggered

**2. Submit Feedback**
- Click **💬** icon in header
- Select feedback type: Bug / Idea / Other
- Write up to 140 characters
- Feedback stored **locally** (no server upload)
- Privacy: No PII collected, data stays on device

**3. Export Data**
- Open Metrics Panel (📊 icon)
- Click **"Export JSON"** or **"Export CSV"**
- File downloads with format: `sparkfined-feedback-YYYY-MM-DD.json`
- Share with community, import into analysis tools, or keep as backup

**4. Privacy Guarantees**
- ✅ All data stored in **IndexedDB** (local device only)
- ✅ **No tracking scripts**, no analytics SDKs
- ✅ **No PII** (personally identifiable information) collected
- ✅ **No server uploads** — data never leaves your device
- ✅ Export JSON/CSV shows privacy note

### Export File Structure

**JSON Format:**
```json
{
  "exportedAt": "2025-10-25T14:30:00.000Z",
  "metrics": [
    {
      "eventType": "save_trade",
      "count": 12,
      "lastUpdated": "2025-10-25T14:29:45.000Z"
    }
  ],
  "feedback": [
    {
      "type": "Idea",
      "text": "Would love dark mode toggle on charts",
      "timestamp": "2025-10-25T12:15:00.000Z",
      "status": "exported"
    }
  ],
  "privacyNote": "No PII collected - anonymous usage data only"
}
```

**CSV Format:**
```csv
# Sparkfined TA-PWA - Metrics & Feedback Export
# Exported at: 2025-10-25T14:30:00.000Z
# Privacy: No PII collected - anonymous usage data only

=== METRICS ===
Event Type,Count,Last Updated
save_trade,12,2025-10-25T14:29:45.000Z

=== FEEDBACK ===
Type,Text,Timestamp,Status
Idea,"Would love dark mode toggle on charts",2025-10-25T12:15:00.000Z,exported
```

### Community Feedback Workflow
1. **Collect**: Use app naturally, submit feedback as ideas arise
2. **Export**: Monthly or when ready to share
3. **Share**: Post JSON/CSV to GitHub Discussions or Discord
4. **Aggregate**: Maintainers analyze trends for roadmap planning

### Debug Panel (Developer Use)
```javascript
// Open browser console and run:
const db = await indexedDB.open('sparkfined-ta-pwa', 2)
// Inspect stores: metrics, feedback, events, trades
```

## 📚 Documentation Updates

### When to Update Docs
| Change Type | Update |
|-------------|--------|
| New feature | `README.md`, inline comments |
| Config change | `docs/SETUP.md`, `.env.example` |
| Architecture decision | `docs/WORKFLOW.md`, ADR file |
| API change | Inline JSDoc, type definitions |

## 🔄 Phase Transitions

### Current Phase: **Phase 1 — Guardrails & App Shell**
**Goal:** Establish foundation, navigation structure, state scaffolds.

**Next Phase:** Phase 2 — Core Feature / Deep Dive (Modules 2–7)
- Chart analysis engine
- Journal storage
- Replay system
- API integration

### Phase Completion Checklist
- [ ] All module acceptance criteria met
- [ ] Documentation updated
- [ ] Tests passing
- [ ] No linter errors
- [ ] Branch merged to main
- [ ] Issue tracking updated
<<<<<<< HEAD
>>>>>>> origin/pr/2
=======
>>>>>>> origin/pr/8

---

**Last Updated:** 2025-10-25  
<<<<<<< HEAD
<<<<<<< HEAD
**Maintained by:** Sparkfined Team
=======
=======
>>>>>>> origin/pr/8
**Current Status:** ✅ Phase 1 Complete — Ready for Phase 2

## Phase 2 Readiness

**Phase 1 Achievements:**
- ✅ Guardrails & project policies established
- ✅ Lint/format/typecheck/build pipeline green
- ✅ App shell with 3 navigable routes
- ✅ Header + BottomNav mobile-first responsive
- ✅ 4-state pattern (empty/loading/error/result) on all pages
- ✅ PWA manifest & SW registration configured
- ✅ Bundle size: 56.53 KB gzipped (under budget)

**Next: Phase 2 — Core Feature / Deep Dive (Modules 2–7)**
- Module 2: Chart analysis engine
- Module 3: Journal storage & persistence
- Module 4: Replay system mechanics
- Module 5: API integration layer
- Module 6: Advanced state management
- Module 7: Performance optimization & testing

**How to Start Phase 2:**
```bash
# Verify current state
pnpm fmt && pnpm lint && pnpm typecheck && pnpm build

# Start dev server
pnpm dev

# Navigate to http://localhost:5173 and test:
# - Analyze page (/, chart upload placeholder)
# - Journal page (/journal, entries list)
# - Replay page (/replay, playback controls)
```
<<<<<<< HEAD
>>>>>>> origin/pr/2
=======
>>>>>>> origin/pr/8
