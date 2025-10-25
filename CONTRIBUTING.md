# Contributing to Sparkfined TA-PWA

Welcome! This guide is optimized for both human developers and AI agents (Cursor, Claude, etc.).

## Quick Start

```bash
# Clone and setup
git clone https://github.com/<USERNAME>/sparkfined-ta-pwa.git
cd sparkfined-ta-pwa
pnpm install
cp .env.example .env

# Start development
pnpm dev
```

## Branch Model

```
main          # Production-ready code
├── feat/*    # New features
├── fix/*     # Bug fixes
└── chore/*   # Maintenance tasks
```

### Creating a Branch

```bash
git checkout -b feat/my-feature    # For features
git checkout -b fix/bug-name       # For bug fixes
git checkout -b chore/task-name    # For maintenance
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, no code change
- `refactor:` - Code restructuring
- `test:` - Add/update tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

### Examples
```bash
git commit -m "feat(analyze): add chart zoom controls"
git commit -m "fix(journal): prevent duplicate entries"
git commit -m "docs: update installation steps"
```

## Development Workflow

### 1. Plan → Diff → Review

**Plan**: Understand the change
- Read existing code
- Identify affected files
- Check for breaking changes

**Diff**: Make small, focused changes
- Max 200 lines per file
- Max 5 files per commit
- Keep scope minimal

**Review**: Quality gates
```bash
pnpm fmt          # Format code
pnpm lint         # Check linting
pnpm typecheck    # Verify types
pnpm build        # Ensure builds
pnpm test         # Run tests
```

### 2. Pre-Commit Checklist

Before every commit:

- [ ] `pnpm fmt` passes (Prettier formatting)
- [ ] `pnpm lint` passes (ESLint checks)
- [ ] `pnpm typecheck` passes (TypeScript strict)
- [ ] `pnpm build` succeeds (Vite build)
- [ ] Tests pass (if applicable)
- [ ] Documentation updated (if public API changed)

### 3. Pull Request Process

**Before Creating PR:**
```bash
# Ensure your branch is up to date
git fetch origin
git rebase origin/main

# Run all checks
pnpm fmt && pnpm lint && pnpm typecheck && pnpm build
```

**PR Template:**
- Clear description of changes
- Link to related issue
- Screenshots (for UI changes)
- Breaking changes noted
- Checklist completed

**Review Process:**
- At least 1 approval required
- CI must pass (lint, typecheck, build)
- No merge conflicts
- Branch will be squashed on merge

## Code Style

### TypeScript
- **Strict mode**: No `any` types
- **Path aliases**: Use `@/*` for imports
- **Explicit types**: For public APIs and complex logic

```typescript
// Good
import { Button } from '@/components/Button'
export function formatDate(date: Date): string { ... }

// Avoid
import { Button } from '../../../components/Button'
export function formatDate(date: any) { ... }
```

### React Components
- **Functional components** with hooks
- **Named exports** for utilities
- **Default exports** for components

```typescript
// Component
export default function AnalyzePage() {
  return <div>...</div>
}

// Utility
export function calculateRSI(data: number[]): number {
  // ...
}
```

### File Organization
```typescript
// 1. External imports
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 2. Internal imports
import Button from '@/components/Button'
import { formatDate } from '@/lib/utils'

// 3. Type imports
import type { User } from '@/types'

// 4. Styles
import './styles.css'
```

## Testing

### Running Tests
```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test MyComponent  # Test specific file
```

### Writing Tests
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeTruthy()
  })
})
```

## Performance Guidelines

### Budgets
- Initial render: **< 400ms** (p50)
- Route transition: **< 200ms** (perceived)
- Bundle size: **< 200 KB** (main chunk, gzipped)

### Best Practices
- Lazy load routes with `React.lazy()`
- Use `useMemo` / `useCallback` for expensive operations
- Optimize images (WebP, proper sizing)
- Code split large dependencies

## Mobile-First Development

### Design Constraints
- Minimum width: **360px**
- Touch targets: **44px × 44px** minimum
- Test on iOS/Android safe areas
- Thumb-reach zone for primary actions

### Testing
```bash
# Open dev tools → Toggle device toolbar
# Test on: iPhone SE (375px), Pixel 5 (393px)
```

## AI Agent Guidelines

### For Cursor/Claude Users

**DO:**
- ✅ Read existing code before editing
- ✅ Follow established patterns
- ✅ Keep changes small and focused
- ✅ Update documentation
- ✅ Run quality gates before committing

**DON'T:**
- ❌ Generate large code blocks (> 200 lines)
- ❌ Mix multiple concerns in one commit
- ❌ Refactor without asking
- ❌ Break existing patterns
- ❌ Skip type checking

### Agent Workflow
1. **Analyze**: Understand existing structure
2. **Plan**: Describe changes clearly
3. **Implement**: Small, focused edits
4. **Verify**: Run all quality checks
5. **Document**: Update relevant docs

## Common Tasks

### Adding a New Component
```bash
# 1. Create component file
touch src/components/MyComponent.tsx

# 2. Create test file
touch src/components/__tests__/MyComponent.test.tsx

# 3. Implement component (use existing patterns)

# 4. Add tests

# 5. Verify
pnpm fmt && pnpm lint && pnpm typecheck && pnpm test
```

### Adding a New Page
```bash
# 1. Create page component
touch src/pages/MyPage.tsx

# 2. Add route in src/App.tsx

# 3. Add navigation link (if needed)

# 4. Test navigation
pnpm dev  # Verify at http://localhost:5173/mypage
```

### Updating Dependencies
```bash
# Check outdated packages
pnpm outdated

# Update specific package
pnpm update <package-name>

# Update all (carefully!)
pnpm update --latest

# Verify everything still works
pnpm install && pnpm fmt && pnpm lint && pnpm typecheck && pnpm build
```

## Getting Help

### Resources
- **Documentation**: `/docs` folder
- **Setup Guide**: `docs/SETUP.md`
- **Workflow**: `docs/WORKFLOW.md`
- **Project Structure**: `docs/PROJECT_STRUCTURE.md`

### Issues
- **Bug Reports**: Use bug report template
- **Feature Requests**: Use feature request template
- **Questions**: GitHub Discussions

### Contact
- **GitHub Issues**: https://github.com/<USERNAME>/sparkfined-ta-pwa/issues
- **Discussions**: https://github.com/<USERNAME>/sparkfined-ta-pwa/discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Sparkfined TA-PWA! 🚀**
