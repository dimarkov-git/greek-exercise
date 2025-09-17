# Project structure

This document explains the purpose of each file in the project.

## 🏗️ Root configuration files

### package.json

**Purpose**: Central npm/pnpm package configuration file

- Defines project dependencies (React 19, TanStack Query, React Router 7)
- Contains scripts for development, building, testing
- Settings for pnpm and MSW (Mock Service Worker)
- Uses modern versions: React 19, TypeScript 5, Vite 7

### vite.config.ts

**Purpose**: Vite bundler configuration

- Configures plugins: React and Tailwind CSS v4
- Sets up `@/` alias for `src/` folder
- Configures Vitest for unit/integration tests
- Requires 100% code coverage
- Excludes from coverage: `main.tsx` and `mocks/browser.ts`

### tsconfig.json, tsconfig.app.json, tsconfig.node.json

**Purpose**: TypeScript configuration

- `tsconfig.json` - root configuration with references
- `tsconfig.app.json` - application settings with strict rules
- `tsconfig.node.json` - settings for Node.js scripts
- Includes strictest TypeScript settings for safety

### biome.json

**Purpose**: Biome linter and formatter configuration (ESLint + Prettier replacement)

- Configured for tabs instead of spaces
- Enables all rules: a11y, security, performance, correctness
- Special settings for tests and configuration files
- Automatic import and property sorting

### playwright.config.ts

**Purpose**: E2E testing configuration with Playwright

- Testing on Desktop Chrome and Mobile Chrome
- Automatic dev server startup for tests
- HTML reporter for test reports
- Retry logic for CI/CD

## 📁 Source code structure (src/)

### Entry point

- **main.tsx** - main application entry point
  - React Query Client setup for API request caching
  - MSW (Mock Service Worker) initialization for API mocks in development
  - Providers: QueryClient, BrowserRouter
  - React DevTools for query debugging

### Routing and components

- **App.tsx** - root component with routing
  - Uses React Router 7 for navigation
  - Error Boundary for error handling
  - Lazy loading for Details page (code splitting)
  - Suspense for loading states

### Pages (pages/)

- **Gallery.tsx** - main page with fruit gallery
  - Uses Suspense Query for automatic loading/error states
  - Grid layout with responsive design (1-3 columns)
- **Details.tsx** - detailed page for individual fruit

### API layer (api/)

- **fruits.ts** - functions for fruits API
  - Uses Valibot for data schema validation
  - Type-safe API with automatic TypeScript type generation
  - Fetch request error handling

### Components (components/)

- **Fruit.tsx** - fruit card in gallery
- **Head.tsx** - page meta tags management
- **ImageAttribution.tsx** - image attribution
- **LoadingOrError.tsx** - universal state component

### Mocks and testing (mocks/)

- **browser.ts** - MSW setup for browser
- **server.ts** - MSW setup for Node.js (tests)
- **handlers.ts** - mock API endpoint handlers
- **data/fruits.json** - test fruit data

### Utils and hooks (utils/)

- **useMediaQuery.ts** - custom hook for media queries
- **useMediaQuery.test.ts** - tests for the hook

### Testing setup

- **test-setup.ts** - global test environment setup
  - Initialize jest-dom matchers
  - MSW server setup for tests
- **test-utils.tsx** - utilities for component rendering in tests

### Styles

- **global.css** - global CSS styles with Tailwind CSS
- **vite-env.d.ts** - types for Vite environment

## 🧪 Testing

### Unit/integration tests

- **Framework**: Vitest + Testing Library
- **Environment**: happy-dom (lightweight jsdom alternative)
- **Requirement**: 100% code coverage
- **Files**: `src/**/*.test.ts(x)`

### E2E tests

- **Framework**: Playwright
- **Files**: `tests/app.spec.ts`
- **Browsers**: Chrome Desktop + Mobile

## 🗂️ Other files

### HTML and static files

- **index.html** - main HTML template
  - Inter font setup with preload
  - PWA meta tags (manifest, icons)
  - Dark mode support via CSS classes

### Public files

- **mockServiceWorker.js** - Service Worker for MSW mocks

### IDE settings

- **.vscode/** - VS Code settings (extensions, formatting)
- **.zed/** - Zed editor settings

### Git and ignore files

- **.gitignore** - Git exclusions (node_modules, dist, .env, etc.)

## 🎯 Architectural decisions

### Modern technologies

- **React 19** - latest stable version
- **TypeScript 5** - strict typing
- **Vite 7** - fast build and HMR
- **Tailwind CSS v4** - utility-first styles

### State and data management

- **TanStack Query** - server state caching and synchronization
- **Valibot** - data validation (lightweight Zod alternative)
- **MSW** - API mocking in development

### Code quality

- **100% test coverage** - mandatory requirement
- **Biome** - unified tool for linting and formatting
- **Strict TypeScript** - maximum type safety

### Performance optimizations

- **Lazy loading** - code splitting for pages
- **Image preloading** - font loading optimization
- **React Suspense** - optimistic UI
