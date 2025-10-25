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

## Phase 2 Preview

**Next:** Modules 2–7 (Core Features / Deep Dive)

After Phase 1 completion, Phase 2 will add:
- Real-time chart integration
- Technical analysis indicators
- Journal entry system
- Replay functionality
- Data persistence
- Advanced state management

**Tracking:** See GitHub Issue "Phase 2 — Core Feature / Deep Dive"

---

## Resources

- **Guardrails:** `.cursor/rules/00-guardrails.md`
- **Contributing:** `CONTRIBUTING.md`
- **Setup:** `docs/SETUP.md`
- **Structure:** `docs/PROJECT_STRUCTURE.md`
- **Roadmap:** `docs/ROADMAP.md`

---

**Last Updated:** 2025-10-25  
**Maintained by:** Sparkfined Team
