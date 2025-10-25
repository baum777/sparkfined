# Guardrails for Sparkfined TA-PWA

## Development Workflow

### Plan → Diff → Review
1. **Plan**: Describe what needs to change and why
2. **Diff**: Make small, focused changes (< 200 lines per file)
3. **Review**: Verify build/lint/tests before commit

### Package Manager
- **ALWAYS use pnpm** (never npm or yarn)
- Lock file must be committed
- No direct `node_modules` edits

### TypeScript Strict Mode
- `strict: true` is non-negotiable
- No `any` types (use `unknown` if needed)
- All path aliases must use `@/*` convention

### Breaking Changes
- Require explicit approval before:
  - Changing public APIs
  - Modifying component props (non-backward compatible)
  - Altering data structures in localStorage/IndexedDB
  - Updating major dependencies

## Code Quality

### Small Diffs
- Max 200 lines per file change
- Max 5 files per commit (feature work)
- Extract to separate commits if larger

### Conventions
- **Commits**: Conventional Commits format
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` documentation
  - `chore:` maintenance
  - `refactor:` code restructuring
  - `test:` add/update tests
  - `perf:` performance improvement

- **Branches**: 
  - `feat/*` for features
  - `fix/*` for bug fixes
  - `chore/*` for maintenance

### Before Every Commit
```bash
pnpm fmt && pnpm lint && pnpm typecheck && pnpm build
```

## AI Agent Guidelines

### When Using Cursor/Claude
1. **Read existing code** before editing
2. **Preserve patterns** already established
3. **Ask before refactoring** large sections
4. **Keep imports organized**: External → Internal → Types → Styles
5. **Update docs** when changing public APIs

### Prefer
- Composition over inheritance
- Pure functions over stateful logic
- Named exports for utilities, default for components
- Explicit types over inference (for public APIs)

### Avoid
- Large auto-generated code blocks
- Mixing concerns (keep UI/logic/data separate)
- Deep prop drilling (use Context or state management)
- Premature optimization

## Performance Budgets

- Initial render: **< 400ms** (p50)
- Route transition: **< 200ms** (perceived)
- Skeleton → content: **< 1s**
- Bundle size: **< 200 KB** (main chunk, gzipped)

## Security

- **Never commit** `.env`, keys, tokens
- **Always use** `import.meta.env.VITE_*` for env vars
- **Validate** all user input
- **Sanitize** before rendering user content

## Mobile-First

- Design for **360px** width minimum
- Touch targets: **44px × 44px** minimum
- Test with iOS/Android safe areas
- Thumb-reach zone for primary actions

## Documentation

- Update `README.md` for user-facing changes
- Update `docs/SETUP.md` for dev environment changes
- Add JSDoc for complex functions
- Keep `CHANGELOG.md` current (on release)

---

**Last Updated**: 2025-10-25  
**Enforced by**: ESLint, TypeScript, Prettier, CI
