# Contributing to Sparkfined TA-PWA

## 🤝 Welcome
Thank you for contributing! This guide is optimized for both **human developers** and **AI agents** (Cursor/Claude).

## 🚀 Quick Start for Developers

### Prerequisites
- **Node.js 22 LTS** (check with `node -v`)
- **pnpm 10+** (install: `npm install -g pnpm`)
- Git configured with your name/email

### Setup
```bash
# Clone and install
git clone https://github.com/<USERNAME>/sparkfined-ta-pwa.git
cd sparkfined-ta-pwa
pnpm install

# Copy environment config
cp .env.example .env

# Verify setup
pnpm fmt && pnpm lint && pnpm typecheck && pnpm build
```

If all scripts pass ✅, you're ready!

## 📋 Contribution Workflow

### 1. **Pick or Create an Issue**
- Check [GitHub Issues](https://github.com/<USERNAME>/sparkfined-ta-pwa/issues)
- Comment to claim an issue
- If proposing a feature, open a discussion first

### 2. **Create a Branch**
```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming:**
- `feat/*` — new features
- `fix/*` — bug fixes
- `chore/*` — tooling, docs, refactors
- `test/*` — test additions/updates

### 3. **Make Changes**
- **Small, focused commits** (ideally < 200 lines)
- Follow [Conventional Commits](https://www.conventionalcommits.org/):
  ```
  feat(analyze): add chart upload validation
  fix(journal): resolve date range filter bug
  chore(deps): update tailwindcss to 3.4.14
  ```

### 4. **Test Locally**
```bash
# Format & lint
pnpm fmt && pnpm lint

# Type check
pnpm typecheck

# Run tests
pnpm test

# Build for production
pnpm build

# Manual test in browser
pnpm dev
```

### 5. **Push & Open PR**
```bash
git push origin feat/your-feature-name
```

Then open a Pull Request with:
- **Clear title** (e.g., "feat: add offline chart storage")
- **Description** explaining *why* (not just *what*)
- **Screenshots** for UI changes
- Link to related issue(s)

### 6. **PR Checklist**
Before requesting review, ensure:
- [ ] `pnpm fmt && pnpm lint && pnpm typecheck && pnpm build` all pass
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated (`README.md`, `docs/`, inline comments)
- [ ] No console errors/warnings in browser
- [ ] Mobile responsiveness tested (360–414px viewport)
- [ ] Dark mode works correctly
- [ ] Accessibility: keyboard navigation + screen reader tested

## 🎨 Code Style

### TypeScript
- **Strict mode** enforced (`"strict": true`)
- No `any` — use `unknown` or proper types
- Explicit return types on public functions
- Interfaces for objects, type aliases for unions

**Good:**
```typescript
interface ChartData {
  timestamp: number;
  value: number;
}

function parseChart(data: unknown): ChartData[] {
  // validation logic
  return validated;
}
```

**Bad:**
```typescript
function parseChart(data: any) {
  return data.map(x => x); // 🚫 No type safety
}
```

### React Components
- **Functional components** with hooks
- Prop interfaces exported separately
- Use `React.FC` sparingly (explicit types preferred)

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

### Styling
- **Tailwind utility classes** first
- Custom components via `@layer components` in CSS
- Mobile-first responsive design

```tsx
<div className="flex flex-col gap-4 md:flex-row md:gap-6">
  {/* Mobile: column, Desktop: row */}
</div>
```

## 🤖 AI Agent Guidelines

### For Cursor/Claude Agents
- **Read before editing**: Always use `Read` tool on files before modifications
- **Atomic changes**: One logical change per tool call
- **Run quality checks**: Execute `pnpm fmt && pnpm lint && pnpm typecheck` after edits
- **Update tests**: Modify related test files when changing APIs
- **Ask, don't assume**: Request clarification if requirements are ambiguous

### Commit Strategy for Agents
```bash
# Good: focused, clear scope
git commit -m "feat(analyze): add chart file type validation"

# Bad: vague, multiple concerns
git commit -m "updates and fixes"
```

## 🧪 Testing Standards

### Unit Tests (Vitest)
- Test critical logic (data transformations, validations)
- Mock external dependencies
- Aim for > 80% coverage on core modules

### Component Tests
- Basic render + interaction tests
- Accessibility checks (`role`, `aria-label`)
- Snapshot tests for complex layouts

**Example:**
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
});
```

## 📚 Documentation

### When to Update Docs
- **README.md** — user-facing features, setup instructions
- **docs/SETUP.md** — environment variables, configuration
- **docs/WORKFLOW.md** — development processes, architecture decisions
- **Inline comments** — complex algorithms, non-obvious logic

### Doc Style
- Use **clear, concise language**
- Include code examples for APIs
- Keep up-to-date with implementation

## 🚫 Don't

- ❌ Commit `node_modules/` or `dist/`
- ❌ Push `.env` files (only `.env.example`)
- ❌ Ignore linter warnings
- ❌ Make breaking changes without discussion
- ❌ Copy-paste code without attribution

## 📞 Getting Help

- **Issues:** For bugs/features, open a GitHub issue
- **Discussions:** For questions/ideas, use GitHub Discussions
- **Documentation:** Check `docs/` folder first

---

**Code of Conduct:** Be respectful, collaborative, and constructive. We're building something great together! 🌟
