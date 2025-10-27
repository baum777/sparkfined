# Sparkfined TA-PWA — Guardrails & AI Agent Rules

## 🎯 Mission
Build a **modular, performant, offline-ready PWA** for technical analysis with mobile-first UX and sub-second perceived latency.

## 📐 Core Principles

### 1. **Plan → Diff → Review** Workflow
- **Small, atomic diffs** (< 200 lines per commit preferred)
- Always explain *why* before *what*
- Link changes to user stories/issues
- No breaking changes without explicit approval

### 2. **TypeScript Strict Mode**
- `strict: true` non-negotiable
- No `any` — use `unknown` or proper types
- Explicit return types on public functions
- Interfaces over type aliases for objects

### 3. **Code Quality Gates**
```bash
pnpm fmt       # Prettier formatting (must pass)
pnpm lint      # ESLint (zero warnings tolerated)
pnpm typecheck # TypeScript compilation (strict)
pnpm build     # Production build (must succeed)
```
**All must pass before commits.**

### 4. **Mobile-First & Performance**
- Design for 360–414px viewport first
- Perceived latency ≤ 1s (skeletons < 200ms)
- Lazy load routes/components
- Bundle size budget: initial < 150KB gzipped

### 5. **Accessibility (A11y)**
- Semantic HTML (`<nav>`, `<main>`, `<section>`)
- ARIA labels where needed
- Keyboard navigation (Tab/Enter/Escape)
- Touch targets ≥ 44×44px

### 6. **Package Management**
- **pnpm only** (no npm/yarn)
- Lock file committed (`pnpm-lock.yaml`)
- Node 22 LTS required

## 🤖 AI Agent Rules (Cursor/Claude)

### DO ✅
- Read existing code before editing
- Use `MultiStrReplace` for multi-location edits
- Run `pnpm fmt && pnpm lint && pnpm typecheck` after edits
- Update related tests/docs when changing APIs
- Ask clarifying questions if requirements unclear

### DON'T ❌
- Make unrelated changes in same commit
- Skip type annotations
- Ignore linter errors
- Create files without explicit request
- Use deprecated APIs without migration path

## 🌿 Branch & Commit Strategy

### Branches
- `main` — production-ready
- `feat/*` — new features
- `fix/*` — bug fixes
- `chore/*` — tooling/docs/refactors

### Commit Format (Conventional Commits)
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`

**Examples:**
```
feat(analyze): add chart drop zone with file validation
fix(journal): correct date filtering in entry list
chore(deps): update vite to 6.0.1
```

## 🚫 .cursorignore & Security
- **Never commit:**
  - `.env` files (only `.env.example`)
  - API keys, tokens, secrets
  - `node_modules/`, `dist/`, build artifacts
  - Large binary files

## 📦 Dependency Rules
- Prefer native Web APIs over libraries
- Justify new dependencies (bundle size, maintenance)
- Use `pnpm add -D` for dev-only packages
- Pin major versions, allow minor/patch updates

## 🧪 Testing Requirements
- Critical paths: unit tests (Vitest)
- Components: basic render/interaction tests
- E2E: manual smoke tests before major releases
- **No PR merge without passing tests**

## 📚 Documentation Updates
- Update `README.md` for user-facing changes
- Update `docs/SETUP.md` for env/config changes
- Add inline comments for complex logic
- Keep `CONTRIBUTING.md` current

---

**Last Updated:** 2025-10-25  
**Enforced By:** ESLint, TypeScript, Prettier, CI/CD (GitHub Actions)
