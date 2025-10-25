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

---

**Last Updated:** 2025-10-25  
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
