# Project Structure - Sparkfined TA-PWA

Detailed guide to the project's file organization and architecture.

## Directory Overview

```
sparkfined-ta-pwa/
├── .github/                    # GitHub-specific files
│   ├── workflows/              # CI/CD workflows
│   │   └── ci.yml              # Automated testing and build
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/                       # Documentation
│   ├── SETUP.md                # Setup instructions
│   ├── ROADMAP.md              # Development roadmap
│   └── PROJECT_STRUCTURE.md    # This file
│
├── public/                     # Static assets (served as-is)
│   └── vite.svg                # Favicon and icons
│
├── src/                        # Source code
│   ├── components/             # Reusable UI components
│   │   ├── __tests__/          # Component tests
│   │   │   └── Logo.test.tsx
│   │   └── Logo.tsx
│   │
│   ├── pages/                  # Page components (route handlers)
│   │   └── HomePage.tsx
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── useDarkMode.ts
│   │
│   ├── lib/                    # Utilities and helpers
│   │   └── config.ts           # App configuration
│   │
│   ├── styles/                 # Global styles
│   │   ├── index.css           # Tailwind imports + base styles
│   │   └── App.css             # App-specific styles
│   │
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── server/                 # Server/API integration (future)
│   │
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Application entry point
│   └── vite-env.d.ts           # Vite environment types
│
├── .cursorignore               # Files to ignore in Cursor AI
├── .env.example                # Environment variable template
├── .eslintrc.cjs               # ESLint configuration
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier configuration
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── pnpm-lock.yaml              # Lockfile (pnpm)
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript config for build tools
├── vite.config.ts              # Vite configuration
├── vitest.config.ts            # Vitest testing configuration
├── README.md                   # Project overview
└── LICENSE                     # MIT License

```

## Core Directories

### `/src`
Main source code directory. All application code lives here.

**Rules:**
- Use absolute imports via `@/` alias (configured in `tsconfig.json`)
- Keep files focused and single-responsibility
- Export components as default, utilities as named exports

### `/src/components`
Reusable UI components that are used across multiple pages.

**Naming Convention:**
- PascalCase for component files: `ButtonPrimary.tsx`
- Test files: `ComponentName.test.tsx` in `__tests__` folder
- Story files (future): `ComponentName.stories.tsx`

**Component Structure:**
```typescript
// components/Button.tsx
export default function Button() {
  return <button>Click me</button>
}
```

### `/src/pages`
Page-level components that map to routes.

**Naming Convention:**
- PascalCase with "Page" suffix: `HomePage.tsx`, `DashboardPage.tsx`
- One page per file
- Pages compose components from `/components`

**Example:**
```typescript
// pages/HomePage.tsx
import Layout from '@/components/Layout'
import Hero from '@/components/Hero'

export default function HomePage() {
  return (
    <Layout>
      <Hero />
    </Layout>
  )
}
```

### `/src/hooks`
Custom React hooks for shared logic.

**Naming Convention:**
- camelCase with "use" prefix: `useDarkMode.ts`, `useFetch.ts`
- One hook per file

**Example:**
```typescript
// hooks/useFetch.ts
export function useFetch<T>(url: string) {
  // ... implementation
  return { data, loading, error }
}
```

### `/src/lib`
Utility functions, helpers, and non-React code.

**Contents:**
- API clients
- Data transformers
- Constants
- Configuration
- Pure functions

**Naming Convention:**
- camelCase for files: `config.ts`, `apiClient.ts`
- Named exports preferred

### `/src/types`
TypeScript type definitions and interfaces.

**Contents:**
- Global types
- API response types
- Component prop types (if complex)
- Enums and constants

**Example:**
```typescript
// types/index.ts
export interface User {
  id: string
  email: string
  name: string
}

export type Theme = 'light' | 'dark'
```

### `/src/styles`
Global CSS and Tailwind configuration.

**Files:**
- `index.css` - Tailwind imports, base styles, custom CSS
- `App.css` - App-specific global styles

### `/src/server`
Server-side code (future: Hono proxy, API routes).

**Purpose:**
- API route handlers
- Server middleware
- Proxy configuration

## Configuration Files

### `vite.config.ts`
Vite build tool configuration.

**Key Settings:**
- Plugins (React, PWA)
- Path aliases (`@/` → `./src/`)
- Dev server (port, proxy)
- Build options

### `tsconfig.json`
TypeScript compiler configuration.

**Key Settings:**
- Strict mode enabled
- Path mapping (`@/*`)
- JSX mode: `react-jsx`
- Target: ES2020

### `tailwind.config.js`
Tailwind CSS configuration.

**Key Settings:**
- Content paths (where to look for classes)
- Dark mode strategy: `class`
- Theme extensions
- Plugins (Typography)

### `.eslintrc.cjs`
ESLint configuration.

**Rules:**
- TypeScript recommended rules
- React hooks rules
- React refresh plugin

### `vitest.config.ts`
Vitest testing configuration.

**Settings:**
- Test environment: `jsdom`
- Global test utilities
- Coverage configuration

## Import Conventions

### Absolute Imports (Preferred)
```typescript
import Button from '@/components/Button'
import { useFetch } from '@/hooks/useFetch'
import type { User } from '@/types'
```

### Relative Imports (When Necessary)
```typescript
import Component from './Component'
import helper from '../lib/helper'
```

### Import Order (Prettier)
1. External packages
2. Internal absolute imports (`@/`)
3. Relative imports
4. Type imports
5. Styles

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx`, `UserProfile.tsx` |
| Pages | PascalCase + "Page" | `HomePage.tsx`, `DashboardPage.tsx` |
| Hooks | camelCase + "use" | `useDarkMode.ts`, `useAuth.ts` |
| Utils | camelCase | `formatDate.ts`, `apiClient.ts` |
| Types | camelCase or PascalCase | `index.ts`, `User.ts` |
| Tests | `*.test.tsx` | `Button.test.tsx` |
| Styles | camelCase | `index.css`, `App.css` |
| Config | kebab-case or camelCase | `vite.config.ts`, `tailwind.config.js` |

## Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the client.

**Example:**
```bash
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your_key_here
```

**Access in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

## PWA Files

Generated by `vite-plugin-pwa`:
- `dist/sw.js` - Service worker
- `dist/manifest.webmanifest` - Web app manifest
- `dist/registerSW.js` - Service worker registration

## Testing Structure

```
src/
└── components/
    ├── Button.tsx
    └── __tests__/
        └── Button.test.tsx
```

**Test File Template:**
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from '../Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeTruthy()
  })
})
```

## Build Output

```
dist/
├── assets/              # JS and CSS bundles
├── index.html           # Entry HTML
├── manifest.webmanifest # PWA manifest
├── sw.js                # Service worker
└── workbox-*.js         # Workbox runtime
```

## Best Practices

1. **Keep files small** - Max 200-300 lines
2. **One component per file** - Easier to find and maintain
3. **Use TypeScript strictly** - No `any`, prefer `unknown`
4. **Test coverage** - Aim for >80%
5. **Document complex logic** - JSDoc for functions
6. **Consistent naming** - Follow conventions above
7. **Modular code** - Easy to extract and reuse

## Adding New Features

1. **Create feature branch**: `feature/my-feature`
2. **Add components**: `/src/components/MyFeature/`
3. **Add tests**: `/src/components/MyFeature/__tests__/`
4. **Add types**: `/src/types/myFeature.ts` (if needed)
5. **Update routing**: `/src/App.tsx` (if new page)
6. **Document**: Update relevant docs
7. **Test**: `pnpm lint && pnpm build && pnpm test`
8. **PR**: Create pull request to `develop`

---

**Last Updated:** 2025-10-25  
**Maintained by:** Sparkfined Team
