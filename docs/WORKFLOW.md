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
**Current Status:** ✅ Module 0 complete, Module 1 in progress
