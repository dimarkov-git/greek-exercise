# Getting started guide

This guide will help you set up the development environment for the project.

## 📋 Prerequisites

### System requirements

- **macOS**: 12.0 (Monterey) or later

### Required software

#### 1. Install Homebrew (package manager)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install Node.js (via Homebrew)

```bash
# Install Node.js LTS version
brew install node

# Verify installation
node --version  # Should show v20.x.x or later
npm --version   # Should show v10.x.x or later
```

#### 3. Install pnpm (package manager)

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version  # Should show v10.x.x or later
```

#### 4. Install Git (if not already installed)

```bash
# Check if Git is installed
git --version

# If not installed:
brew install git
```

## 🚀 Project setup

### 1. Clone the repository

```bash
# Navigate to your projects directory
cd ~/Projects  # or your preferred location

# Clone the repository
git clone <repository-url> greek-exercise
cd greek-exercise
```

### 2. Install dependencies

```bash
# Install all project dependencies
pnpm install
```

### 3. Start development server

```bash
# Start the development server
pnpm dev
```

The application will automatically open in your browser at `http://localhost:5173`

## 🧪 Testing setup

### Run tests

```bash
# Run unit/integration tests (watch mode)
pnpm test

# Run tests once (CI mode)
pnpm test:ci

# Run E2E tests with UI
pnpm test:e2e

# Run E2E tests headlessly
pnpm test:e2e:ci
```

### Install Playwright browsers (for E2E tests)

```bash
# Install required browsers for Playwright
npx playwright install
```

## 🔧 Development workflow

### Available commands

```bash
# Development
pnpm dev          # Start dev server with hot reload
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run TypeScript check + Biome linting
pnpm lint:tsc     # TypeScript check only
pnpm lint:biome   # Biome linting with auto-fix
pnpm format       # Format code with Biome

# Testing
pnpm test         # Unit tests (watch mode)
pnpm test:ci      # Unit tests (once)
pnpm test:e2e     # E2E tests (UI mode)
pnpm test:e2e:ci  # E2E tests (headless)

# Full Validation
pnpm validate     # Run lint + test:ci + test:e2e:ci
```

### File structure overview

```
greek-exercise/
├── docs/                 # Documentation (English only)
├── .notes/              # Personal notes (Russian OK, git-ignored)
├── src/                 # Source code
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── api/             # API functions
│   ├── mocks/           # MSW mocks for development
│   └── utils/           # Utilities and hooks
├── tests/               # E2E tests
└── public/              # Static assets
```

## 🎯 Next steps

1. **Explore the codebase**: Check out `docs/architecture/project-structure.md`
2. **Run the application**: `pnpm dev` and browse to `http://localhost:5173`
3. **Run tests**: `pnpm test` to see the testing setup
4. **Make your first change**: Try modifying a component and see hot reload in action

## 🚨 Troubleshooting

### Port already in use

If port 5173 is already in use:

```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or start on different port
pnpm dev --port 3000
```

### pnpm command not found

```bash
# Reinstall pnpm
npm install -g pnpm

# Or use corepack (Node.js 16+)
corepack enable
corepack prepare pnpm@latest --activate
```

### Node version issues

```bash
# Check current version
node --version

# Update to latest LTS
brew upgrade node

# Or use nvm for version management
brew install nvm
nvm install --lts
nvm use --lts
```

### TypeScript errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
pnpm install

# Restart TypeScript server in VS Code
# Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

### Test failures

```bash
# Clear test cache
rm -rf node_modules/.cache
pnpm test:ci

# Update Playwright browsers
npx playwright install
```

## 📚 Additional resources

- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

## 💡 Tips for backend developers

- **Components are like functions**: Take props as input, return JSX as output
- **State management**: Use React Query for server state, useState for local UI state
- **Styling**: Tailwind uses utility classes instead of writing custom CSS
- **Testing**: Jest-like syntax with Vitest, but for React components
- **Hot reload**: Save any file and see changes instantly in browser
- **TypeScript**: Provides type safety similar to strongly-typed backend languages

Happy coding! 🎉
