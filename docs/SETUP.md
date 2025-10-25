# Setup Guide - Sparkfined TA-PWA

Complete setup instructions for local development and deployment.

## 🔧 Prerequisites

### Required

- **Node.js:** 22 LTS or higher
- **pnpm:** 10.0.0 or higher
- **Git:** Latest version

### Verification

```bash
node --version    # Should output v22.x.x
pnpm --version    # Should output 10.x.x
git --version     # Any recent version
```

## 📦 Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/<USERNAME>/sparkfined-ta-pwa.git
cd sparkfined-ta-pwa
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies listed in `package.json`.

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and replace placeholders with actual values:

```env
# API Configuration
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your_actual_api_key

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# External Services
VITE_MARKET_DATA_API=<YOUR_MARKET_DATA_API_KEY>
VITE_CHART_SERVICE_URL=<YOUR_CHART_SERVICE_URL>
```

⚠️ **Never commit `.env` to version control!**

### 4. Start Development Server

```bash
pnpm dev
```

Open `http://localhost:5173/` in your browser.

## 🏗️ Build for Production

### Build Command

```bash
pnpm build
```

This will:
1. Run TypeScript compiler (`tsc`)
2. Build optimized assets with Vite
3. Generate PWA service worker
4. Output to `dist/` directory

### Preview Production Build

```bash
pnpm preview
```

Access at `http://localhost:4173/`

## 🧪 Testing

### Run Tests

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode for development
```

### Linting

```bash
pnpm lint          # Check for linting errors
pnpm format        # Format code with Prettier
```

## 🔍 Troubleshooting

### Common Issues

#### Port 5173 Already in Use

```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or specify a different port
pnpm dev --port 3000
```

#### Dependencies Not Installing

```bash
# Clear pnpm cache and reinstall
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

#### PWA Not Working Locally

PWAs require HTTPS in production. For local development:
- Service workers work on `localhost` without HTTPS
- Use `pnpm build && pnpm preview` to test PWA features

## 🌐 Deployment

### Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
pnpm add -g netlify-cli

# Deploy
netlify deploy --prod
```

### Manual Deployment

1. Build the project: `pnpm build`
2. Upload `dist/` folder to your hosting service
3. Ensure the server serves `index.html` for all routes (SPA mode)

## 📝 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Commit Convention

Follow conventional commits:

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Run `pnpm lint` and `pnpm build` locally
4. Push and create PR to `develop`
5. Wait for CI checks to pass
6. Request review

## 🔒 Security

- Never commit `.env` files
- Use environment variables for secrets
- Keep dependencies updated: `pnpm update --latest`
- Run security audits: `pnpm audit`

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PWA Guide](https://web.dev/progressive-web-apps/)

## 🆘 Getting Help

- **Issues:** https://github.com/<USERNAME>/sparkfined-ta-pwa/issues
- **Discussions:** https://github.com/<USERNAME>/sparkfined-ta-pwa/discussions
- **Email:** support@sparkfined.com

---

✅ **Setup complete!** Ready to start Phase 1 development.
