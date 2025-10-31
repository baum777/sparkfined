# Sparkfined TA-PWA - Bootstrap Plan

**Complete Setup Guide** - Reproducible project initialization from scratch.

---

## 1. Repository Setup

### Create GitHub Repository

```bash
# On GitHub.com:
# 1. Navigate to https://github.com/new
# 2. Repository name: sparkfined-ta-pwa
# 3. Description: Technical Analysis Progressive Web App
# 4. Visibility: Public (or Private)
# 5. Initialize with: README, .gitignore (Node), License (MIT)
# 6. Create repository
```

### Clone and Initialize

```bash
git clone https://github.com/<USERNAME>/sparkfined-ta-pwa.git
cd sparkfined-ta-pwa
git checkout -b develop
```

### GitHub Configuration

```bash
# Enable Issues in Settings → General → Features
# Enable Discussions (optional)
# Add repository description and topics: react, typescript, pwa, vite, tailwindcss
```

---

## 2. Local Environment & Scaffold

### Prerequisites Verification

```bash
node --version    # Should be 22.x.x
pnpm --version    # Should be 10.x.x
```

### Initialize Project

```bash
# Initialize package.json
cat > package.json << 'EOF'
{
  "name": "sparkfined-ta-pwa",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@typescript-eslint/eslint-plugin": "^8.13.0",
    "@typescript-eslint/parser": "^8.13.0",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.14",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.47",
    "prettier": "^3.3.3",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite": "^6.0.1",
    "vite-plugin-pwa": "^0.20.5",
    "vitest": "^2.1.5",
    "workbox-window": "^7.3.0"
  }
}
EOF

# Install dependencies
pnpm install
```

### Create Directory Structure

```bash
mkdir -p src/{components/__tests__,pages,lib,hooks,styles,server,types}
mkdir -p public docs .github/{workflows,ISSUE_TEMPLATE}
```

### Create Environment Files

```bash
# .env.example
cat > .env.example << 'EOF'
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your_api_key_here
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
VITE_MARKET_DATA_API=<YOUR_MARKET_DATA_API_KEY>
VITE_CHART_SERVICE_URL=<YOUR_CHART_SERVICE_URL>
EOF

# .cursorignore
cat > .cursorignore << 'EOF'
node_modules/
dist/
.env
*.log
*.min.js
sw.js
workbox-*.js
EOF
```

---

## 3. Baseline Configuration

### TypeScript Configuration

```bash
# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# tsconfig.node.json
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
EOF
```

### Vite Configuration

```bash
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sparkfined TA-PWA',
        short_name: 'Sparkfined',
        description: 'Technical Analysis Progressive Web App',
        theme_color: '#1e293b',
        background_color: '#0f172a',
        display: 'standalone'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
EOF
```

### Tailwind Configuration

```bash
# tailwind.config.js
cat > tailwind.config.js << 'EOF'
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
EOF

# postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
```

### ESLint & Prettier

```bash
# .eslintrc.cjs
cat > .eslintrc.cjs << 'EOF'
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
}
EOF

# .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
EOF
```

### Vitest Configuration

```bash
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
EOF
```

---

## 4. Source Code Setup

### HTML Entry Point

```bash
cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sparkfined TA-PWA" />
    <title>Sparkfined TA-PWA</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF
```

### Create Styles

```bash
# src/styles/index.css
cat > src/styles/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-slate-200 dark:border-slate-700;
  }
  body {
    @apply bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
  }
  .card {
    @apply bg-white dark:bg-slate-800 rounded-lg shadow-md p-6;
  }
}
EOF

# src/styles/App.css
cat > src/styles/App.css << 'EOF'
#root {
  width: 100%;
  min-height: 100vh;
}
EOF
```

### Create Core Components

```bash
# src/main.tsx
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# src/App.tsx
cat > src/App.tsx << 'EOF'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
EOF

# src/pages/HomePage.tsx
cat > src/pages/HomePage.tsx << 'EOF'
import { useState } from 'react'
import Logo from '@/components/Logo'

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-2xl w-full text-center space-y-6">
        <Logo />
        <h1 className="text-4xl font-bold">Sparkfined TA-PWA Beta Shell</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Technical Analysis Progressive Web App
        </p>
        <button onClick={toggleDarkMode} className="btn-primary">
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
        <div className="pt-6 border-t">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Foundation ready → Proceed to <strong>Phase 1</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
EOF

# src/components/Logo.tsx
cat > src/components/Logo.tsx << 'EOF'
export default function Logo() {
  return (
    <div className="flex justify-center mb-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
        <span className="text-3xl font-bold text-white">S</span>
      </div>
    </div>
  )
}
EOF

# src/vite-env.d.ts
cat > src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />
EOF

# src/types/index.ts
cat > src/types/index.ts << 'EOF'
export interface AppConfig {
  apiBaseUrl: string
  apiKey: string
}
EOF

# src/lib/config.ts
cat > src/lib/config.ts << 'EOF'
import type { AppConfig } from '@/types'

export const config: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  apiKey: import.meta.env.VITE_API_KEY || '',
}
EOF

# src/hooks/useDarkMode.ts
cat > src/hooks/useDarkMode.ts << 'EOF'
import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return [darkMode, setDarkMode] as const
}
EOF
```

---

## 5. GitHub Workflows & Templates

### CI Workflow

```bash
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm build
      - run: pnpm test
EOF
```

---

## 6. Verification Checklist

### Run Tests

```bash
# Lint
pnpm lint
# Expected: No errors

# Build
pnpm build
# Expected: dist/ folder created, PWA files generated

# Dev server
pnpm dev
# Expected: Server at http://localhost:5173/

# Open browser to http://localhost:5173/
# Expected: "Sparkfined TA-PWA Beta Shell" displayed
```

### Commit Changes

```bash
git add -A
git commit -m "init: scaffold & config baseline"
git push origin develop
```

---

## 7. Handoff Documentation

### Create README.md

See: [`/workspace/README.md`](../README.md)

### Create Setup Guide

See: [`/workspace/docs/SETUP.md`](./SETUP.md)

### Create Roadmap

See: [`/workspace/docs/ROADMAP.md`](./ROADMAP.md)

---

## ✅ Verification Summary

After completing all steps, verify:

- [x] `pnpm install` succeeds
- [x] `pnpm lint` passes with no errors
- [x] `pnpm build` creates production bundle
- [x] `pnpm dev` starts development server
- [x] Browser displays "Sparkfined TA-PWA Beta Shell"
- [x] Dark mode toggle works
- [x] Git repository initialized with initial commit
- [x] Documentation complete

---

## 🚀 Final Command Summary

```bash
# Development
pnpm dev                # Start dev server

# Build
pnpm build              # Production build
pnpm preview            # Preview production build

# Quality
pnpm lint               # Run linter
pnpm format             # Format code
pnpm test               # Run tests
```

---

> ✅ **Bootstrap complete.**  
> Repository initialized, local environment reproducible.  
> Ready to start *Phase 1 – Foundation & Hülle*.

---

**Environment Requirements:**
- Node.js 22 LTS
- pnpm 10+
- Git

**Time to Complete:** ~15-20 minutes  
**Next Steps:** Begin Phase 1 development (Core UI & Data Layer)

