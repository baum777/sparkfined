# Sparkfined TA-PWA

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-blue)](https://vitejs.dev/)

**Technical Analysis Progressive Web App** - A lightweight, modular PWA for financial technical analysis built with modern web technologies.

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
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm test         # Run tests with Vitest
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

See `.env.example` for all available environment variables:

- `VITE_API_BASE_URL` - Base URL for API requests
- `VITE_API_KEY` - API authentication key
- `VITE_ENABLE_ANALYTICS` - Enable analytics tracking
- `VITE_ENABLE_DEBUG` - Enable debug mode

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

## 📋 Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full development plan.

**Current Status:** ✅ Foundation & Hülle complete  
**Next Phase:** Phase 1 - Core UI & Data Layer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation:** [docs/SETUP.md](docs/SETUP.md)
- **GitHub Issues:** Report bugs and feature requests
- **Repository:** https://github.com/<USERNAME>/sparkfined-ta-pwa

---

**Built with ⚡ by the Sparkfined team**
