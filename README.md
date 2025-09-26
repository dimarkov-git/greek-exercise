# Learn Greek

**Learn Greek** is an interactive language learning application focused on Greek language exercises and practice.

## Features

- **📚 Exercise library** —- Interactive language learning exercises
- **🌍 Multilingual interface** — Greek, Russian, and English UI support
- **🧾 Typed translations** — Generated registry with per-feature dictionaries and deterministic fallbacks
- **🌓 Theme support** — Light and dark mode switching
- **💾 Persistent settings** — User preferences saved locally
- **🔄 Real-time language switching** — Instant interface language changes
- **📱 Responsive design** — Modern React-based user interface
- **🚀 Modern tech stack** — Built
  with [Vite 7](https://vitejs.dev), [React 19](https://reactjs.org), [TypeScript 5](https://www.typescriptlang.org)
- **🎨 Tailwind CSS v4** — Modern styling framework
- **📊 TanStack query** — Efficient data fetching and caching
- **🛠️ Development tools** - [Biome V2](https://next.biomejs.dev) for linting and formatting
- **🧪 Comprehensive testing
  ** - [Vitest 3](https://vitest.dev/) + [Testing Library 16](https://testing-library.com/) + [Playwright](https://playwright.dev)
- **✅ Coverage governance** — Vitest thresholds enforce ≥80% statements/lines/functions (75% branches) across core
  runtime modules.

## Tech stack

- **React 19** + **TypeScript 5** — Modern UI framework with strict typing
- **React Router 7** — Client-side routing and navigation
- **Tailwind CSS v4** — Utility-first styling framework
- **TanStack Query** — Efficient data fetching and caching
- **Valibot** - Runtime validation and type safety
- **Zustand** - Lightweight state management
- **Vitest** + **Testing Library** — Unit and integration testing
- **Playwright** - End-to-end testing
- **Biome v2** — Fast linting and code formatting
- **MSW** — API mocking for development and testing

## Getting started

**Prerequisites:** Node.js 20.19.4 (Active LTS, tested) or newer, PNPM 10

Clone the repository and install dependencies:

```bash
corepack enable && pnpm -v
git clone <repository-url>
cd greek-exercise
pnpm install
```

Start the development server:

```bash
pnpm dev
```

**Full setup guide:** [docs/guides/getting-started.md](docs/guides/getting-started.md)

### Environment configuration

Set optional environment variables in `.env.local` to customise the runtime:

- `VITE_ENABLE_MSW` (default: `false`; set to `true` to start MSW, Playwright automation enables it automatically) –
  toggle Mock Service Worker.
- `VITE_ENABLE_QUERY_DEVTOOLS` (default: `true` in development) – load React Query Devtools lazily.
- `VITE_ENABLE_HTTP_FALLBACK` (default: mirrors MSW flag) – control whether the HTTP client resolves local fallback
  responses when network requests fail.
- `VITE_ROUTER_MODE` (default: `browser`, `memory` for Vitest) – choose between browser/history/hash routers.

## Scripts

- `pnpm dev` - start a development server with hot reload.
- `pnpm build` - build for production. The generated files will be on the `dist` folder.
- `pnpm build:analyze` - generate bundle analysis artefacts (HTML + JSON) under `docs/reports/phase-2/assets`.
- `pnpm preview` - locally preview the production build.
- `pnpm test` - run unit and integration tests related to changed files based on git.
- `pnpm test:ci` - run all unit and integration tests in CI mode.
- `pnpm test:e2e` - run all e2e tests with Playwright.
- `pnpm test:e2e:ci` - run all e2e tests headlessly.
- `pnpm format` - format all files with Biome Formatter.
- `pnpm lint` - runs TypeScript and Biome.
- `pnpm validate` - runs `lint`, `test:ci` and `test:e2e:ci`.
- `pnpm depcheck` - detect unused or missing dependencies.
- `pnpm audit` - run a production dependency security audit.

## Documentation

- [Project documentation index](docs/README.md)
