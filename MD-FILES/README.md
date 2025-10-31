# Sparkfined TA-PWA

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-blue)](https://vitejs.dev/)
[![Beta](https://img.shields.io/badge/Status-Beta-green)](docs/CHANGELOG.md)

**Drop. Analyze. Replay.** 🎯

A mobile-first, offline-ready Progressive Web App for crypto chart analysis. Drop a screenshot, get instant S/R levels and volatility insights, save trades to your journal, and replay market moments—all without tracking or backends.

> 🚀 **Beta Teaser (Wave 1)** is now live! [Try the demo](#) • [Read the changelog](docs/CHANGELOG.md)

## 🚀 Stack

- **Frontend:** React 18 + TypeScript (strict mode)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3 + Typography plugin + Dark mode
- **PWA:** vite-plugin-pwa + Workbox
- **Routing:** React Router 6
- **Code Quality:** ESLint + Prettier
- **Testing:** Vitest
- **Package Manager:** pnpm 10
- **Node:** 22 LTS

## 📦 Quick Start

### Prerequisites

- Node.js 22 LTS
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/<USERNAME>/sparkfined-ta-pwa.git
cd sparkfined-ta-pwa

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173/`

## 🛠️ Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production (includes typecheck)
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm fmt          # Format code with Prettier (shorthand)
pnpm format       # Format code with Prettier
pnpm typecheck    # Type-check without building
pnpm test         # Run tests with Vitest
pnpm test:watch   # Run tests in watch mode
```

## 📁 Project Structure

```
sparkfined-ta-pwa/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and helpers
│   ├── styles/          # Global styles and Tailwind config
│   ├── types/           # TypeScript type definitions
│   ├── server/          # Server/API integration (Hono proxy)
│   ├── App.tsx          # Root component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── docs/                # Documentation
├── .github/             # GitHub workflows and templates
└── index.html           # HTML entry point
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file from the template:

```bash
cp .env.example .env
```

See `.env.example` for all available environment variables:

- `VITE_API_BASE_URL` - Base URL for API requests
- `VITE_API_KEY` - API authentication key (required for production)
- `VITE_ENABLE_ANALYTICS` - Enable analytics tracking (default: false)
- `VITE_ENABLE_DEBUG` - Enable debug mode (default: false)
- `VITE_ENABLE_OFFLINE_MODE` - Enable offline mode (default: true)

### Dark Mode

Dark mode is implemented using Tailwind's `class` strategy. Toggle via the UI or programmatically:

```typescript
document.documentElement.classList.toggle('dark')
```

## 🚀 Deployment

The app can be deployed to any static hosting service:

```bash
pnpm build
# Upload the `dist/` folder to your hosting service
```

Recommended platforms:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

## 📝 Development Guidelines

- **TypeScript:** Use strict mode, avoid `any`
- **Components:** Functional components with hooks
- **Styling:** Tailwind utility classes, custom components in `@layer`
- **State Management:** React hooks + Context (add Redux/Zustand as needed)
- **Code Quality:** Run `pnpm lint` and `pnpm format` before commits

## 🧪 Testing

```bash
pnpm test        # Run all tests
pnpm test:watch  # Run tests in watch mode
```

## ✨ Features

### Core Features (Beta v0.1)
- **📸 Screenshot Drop Analysis** - Drag & drop chart screenshots for instant analysis
- **📊 S/R + Volatility Detection** - Client-side technical analysis (placeholder algorithm)
- **📝 Trade Journal** - Offline-first storage with JSON/CSV export
- **🎬 Replay Mode** - Frame-by-frame chart replay with time controls
- **💬 Privacy-First Feedback** - Anonymous telemetry, local-only storage
- **📶 Offline Ready** - Service worker caching with Stale-While-Revalidate
- **🎨 Dark Mode** - Neon-green accents on dark palette
- **⚡ Fast** - 64 KB gzipped bundle, <1s initial load

### Launch Fixes (v1.0.0-alpha)
- **🔄 Manual Update Flow** - User-controlled SW updates (no silent reloads)
- **📈 Lighthouse CI** - Performance budgets enforced (LCP < 2.5s, PWA Score 100)
- **🧪 E2E PWA Tests** - Playwright smoke tests for offline, install, WCO
- **📚 Complete Documentation** - Install guide, ops runbook, alpha status

## 🎯 Beta Scope

**What's Working:**
- ✅ Full offline PWA experience
- ✅ Screenshot analysis flow (demo data)
- ✅ Trade journal CRUD operations
- ✅ Replay controls and annotations
- ✅ Feedback modal and metrics export

**What's Coming (Alpha v0.2):**
- 🔜 Live Dexscreener API integration
- 🔜 Production S/R detection algorithm
- 🔜 Multi-chart comparison mode
- 🔜 Social sharing with privacy controls
- 🔜 Community feature voting

## 📋 Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full development plan.

**Current Status:** ✅ Phase 5 - Beta Teaser Launch (Wave 1)  
**Next Phase:** Alpha Release (Live API + Enhanced Analysis)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Privacy Guarantee

- ✅ **No tracking scripts** - Zero third-party analytics
- ✅ **Local-only data** - All storage in IndexedDB
- ✅ **No PII** - Anonymous event counters only
- ✅ **User-controlled export** - Data never auto-uploads

See [docs/PHASE4_COMPLETE.md](docs/PHASE4_COMPLETE.md) for full privacy posture.

## 💬 Feedback & Community

- **In-App Feedback:** Click the 💬 button (140 char, Twitter-style)
- **Metrics Export:** Click the 📊 button to download JSON/CSV
- **Twitter/X:** [#Sparkfined](https://twitter.com/search?q=%23Sparkfined) [#Cryptober](https://twitter.com/search?q=%23Cryptober) [#DegenTools](https://twitter.com/search?q=%23DegenTools)
- **Discord:** Coming soon - watch for announcements
- **Issues:** [GitHub Issues](https://github.com/<USERNAME>/sparkfined-ta-pwa/issues)

## 📚 Documentation

### User Guides
- **📲 [Installation Guide](INSTALL_GUIDE.md)** - Install on Android, iOS, Desktop
- **📖 [User Documentation](docs/SETUP.md)** - Getting started

### Developer Resources
- **🔧 [Operations Runbook](OPERATIONS.md)** - Deployment, monitoring, troubleshooting
- **🤝 [Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **🎨 [Design System](DESIGN_SYSTEM.md)** - UI/UX standards
- **📡 [API Usage](API_USAGE.md)** - API integration guide

### Project Status
- **✅ [Alpha Status](ALPHA_STATUS.md)** - Complete feature list and metrics
- **📝 [Changelog](docs/CHANGELOG.md)** - Version history
- **🗺️ [Roadmap](docs/ROADMAP.md)** - Future plans

## 🔗 Links

- **Live Demo:** [Add URL after deployment]
- **Beta Info:** [public/beta-info.json](public/beta-info.json)
- **Repository:** https://github.com/<USERNAME>/sparkfined-ta-pwa

---

**Built with ⚡ by the Sparkfined team • Cryptober 2025**
