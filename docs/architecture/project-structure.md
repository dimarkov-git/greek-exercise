# Project structure

This document explains the purpose of each file in the **Learn Greek** application.

## 🏗️ Root configuration files

### package.json

**Purpose**: Central npm/pnpm package configuration file for Learn Greek app

- **Name**: `learn-greek` - Interactive Greek language learning application
- Defines project dependencies (React 19, TanStack Query, React Router 7, Zustand, Valibot)
- Contains scripts for development, building, testing
- Settings for pnpm and MSW (Mock Service Worker) for translation API mocking
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
  - MSW (Mock Service Worker) initialization for translation API mocks
  - Providers: QueryClient, LanguageProvider, BrowserRouter
  - React DevTools for query debugging

### Routing and components

- **App.tsx** - root component with routing
  - Uses React Router 7 for navigation between HomePage, ExerciseLibrary, ExerciseBuilder
  - Error Boundary for error handling
  - Lazy loading for exercise pages (code splitting)
  - Suspense for loading states

### Pages (pages/)

- **HomePage.tsx** - main landing page with navigation
  - Settings panel with theme and language controls
  - Navigation cards to Exercise Library and Builder
  - Multilingual content with real-time language switching
- **ExerciseLibrary.tsx** - browse available exercises (placeholder)
- **ExerciseBuilder.tsx** - create custom exercises (placeholder)

### API layer (api/)

- **texts.ts** - translation and internationalization API
  - Uses Valibot for data schema validation
  - Type-safe API with automatic TypeScript type generation
  - Functions: `getCommonTexts()`, `getTranslations(lang)`
  - Supported languages: Greek (el), Russian (ru), English (en)
  - Fetch request error handling with TanStack Query integration

### Components (components/)

#### Layout components (components/layout/)
- **Footer.tsx** - application footer with copyright and GitHub link
- **MainNavigation.tsx** - main navigation cards for homepage
- **SettingsPanel.tsx** - settings panel with theme and language controls

#### UI components (components/ui/)
- **LanguageSelector.tsx** - language selection buttons with flags
- **NavigationCard.tsx** - reusable card for navigation links
- **ThemeToggle.tsx** - theme switcher with animation
- **UserLanguageSelector.tsx** - user language preference selector

#### Utility components
- **Head.tsx** - page meta tags management
- **LoadingOrError.tsx** - universal loading and error state component

### Mocks and testing (mocks/)

- **browser.ts** - MSW setup for browser
- **server.ts** - MSW setup for Node.js (tests)
- **handlers.ts** - mock API endpoint handlers for translations
  - `/api/texts/common` - translation keys endpoint
  - `/api/translations/{lang}` - localized strings by language
- **data/texts/common.json** - translation key definitions
- **data/translations/** - localized strings
  - `el.json` - Greek translations
  - `ru.json` - Russian translations
  - `en.json` - English translations

### State management and hooks

#### Stores (stores/)
- **settings.ts** - Zustand store for app settings
  - Theme persistence (light/dark)
  - UI language (el/ru/en)
  - User language preferences
  - Local storage integration

#### Hooks (hooks/)
- **useI18n.ts** - main internationalization hook
  - Integration with TanStack Query for translation loading
  - Fallback translations for critical UI elements
  - Translation function `t(key)` with caching
- **useTranslation.ts** - alternative translation hook (unused)

#### Contexts (contexts/)
- **LanguageContext.tsx** - React context for language management
  - Language state provider
  - Language switching utilities

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

- **React 19** - latest stable version with concurrent features
- **TypeScript 5** - strict typing for better developer experience
- **Vite 7** - fast build and HMR
- **Tailwind CSS v4** - utility-first styles with CSS-in-JS support

### Internationalization architecture

- **JSON-based translations** - Structured data files for scalability
- **API-driven loading** - Dynamic translation loading via MSW endpoints
- **Multi-level fallbacks** - Graceful degradation for missing translations
- **Language persistence** - User preferences stored in localStorage
- **Real-time switching** - Instant UI updates without page reload

### State and data management

- **TanStack Query** - server state caching and synchronization for translations
- **Zustand** - client state management for settings persistence
- **Valibot** - data validation (lightweight Zod alternative)
- **MSW** - API mocking for translation endpoints in development
- **React Context** - language state management across components

### Code quality

- **100% test coverage** - mandatory requirement
- **Biome** - unified tool for linting and formatting
- **Strict TypeScript** - maximum type safety
- **Component testing** - Comprehensive unit and integration tests
- **E2E testing** - Playwright tests for critical user flows

### Performance optimizations

- **Lazy loading** - code splitting for exercise pages
- **Font preloading** - Inter font optimization
- **React Suspense** - optimistic UI with loading states
- **Translation caching** - 30-minute cache for translation API calls
- **Minimal bundle size** - Tree-shaking and efficient imports
