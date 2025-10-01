# Learn Greek

**Learn Greek** is a production-ready interactive language learning application for Greek language practice with a
modern React architecture, comprehensive testing, and multilingual support.

## Features

- **📚 Exercise system** — Exercises with real-time validation and hints
- **🌍 Type-safe internationalization** — Translation registry supporting Greek, Russian, and English
- **🎯 Advanced state management** — TanStack Query for server state, Zustand for client state with persistence
- **🌓 Theme & accessibility** — Dark/light mode with WCAG AA compliance
- **⚡ Performance optimized** — Bundle analysis, code splitting, and strict performance budgets
- **📱 Responsive design** — Mobile-first approach with touch-friendly interactions
- **🚀 Modern architecture** — React 19, TypeScript 5, Vite 7, Tailwind CSS v4
- **🧪 Comprehensive testing** — 93%+ coverage with Vitest, Testing Library, Playwright, and MSW
- **✅ Quality governance** — Biome linting, TypeScript strict mode, coverage thresholds

## Architecture highlights

### Frontend stack

- **React 19** — Concurrent features and modern hooks
- **TypeScript 5** — Strict typing with project references
- **Vite 7** — Fast development and optimized production builds
- **Tailwind CSS v4** — Utility-first with CSS-in-JS support

### State & data management

- **TanStack Query** — Server state with intelligent caching
- **Zustand** — Client state with localStorage persistence
- **Provided i18n system** — Type-safe translations with deterministic fallbacks
- **Valibot** — Runtime validation and schema definitions

### Testing & quality

- **Vitest** — Unit and integration tests with 93%+ coverage
- **Testing Library** — Component testing with accessibility focus
- **Playwright** — E2E testing across multiple browsers
- **MSW** — API mocking for development and testing
- **Biome** — Fast linting, formatting, and code quality

### Key patterns

- **Feature-Sliced Design** — Modular architecture with clear boundaries
- **Component composition** — Reusable UI components with accessibility built-in
- **HTTP client with fallbacks** — Configurable offline support
- **SSR-safe effects** — DOM mutations handled safely for server rendering

## Getting started

**Prerequisites:** Node.js 24.x LTS, PNPM 10

```bash
# Enable package manager and verify versions
corepack enable && pnpm -v && node -v

# Clone and setup
git clone <repository-url>
cd greek-exercise
pnpm install

# Start development server (auto-opens browser)
pnpm dev
```

**Complete setup:** See [docs/guides/getting-started.md](docs/guides/getting-started.md)

## Development commands

### Primary workflows

```bash
pnpm dev          # Development server with hot reload
pnpm build        # Production build → dist/
pnpm preview      # Preview production build locally
pnpm validate     # Full validation (lint + test + e2e)
```

### Testing

```bash
pnpm test         # Unit/integration tests (watch mode)
pnpm test:ci      # All tests in CI mode
pnpm test:e2e     # E2E tests with Playwright UI
pnpm test:e2e:ci  # E2E tests headless
```

### Code quality

```bash
pnpm lint         # TypeScript + Biome checks
pnpm format       # Auto-format with Biome
pnpm knip         # Find unused dependencies and exports
pnpm audit        # Security audit
```

### Analysis

```bash
pnpm build:analyze # Bundle analysis with visualizer
```

## Documentation

- **[Documentation index](docs/README.md)** — Project documentation
