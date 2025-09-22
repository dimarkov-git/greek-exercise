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
  - Providers: QueryClient, LanguageProvider, HashRouter
  - React DevTools for query debugging

### Routing and components

- **App.tsx** - root component with routing
  - Uses React Router 7 for navigation between HomePage, ExerciseLibrary, ExerciseBuilder
  - Error Boundary for error handling
  - Lazy loading for exercise pages (code splitting)
  - Suspense for loading states

### Pages (pages/)

- **HomePage.tsx** - main landing page with navigation
  - User language selector (for exercise hints)
  - Navigation cards to Exercise Library and Builder
  - Multilingual content with real-time language switching
- **ExerciseLibrary.tsx** - browse and filter available exercises
  - Exercise cards with metadata (difficulty, time, tags)
  - Tag-based filtering system
  - Integration with MSW API endpoints
- **ExerciseBuilder.tsx** - create custom exercises (placeholder)
- **ExercisePage.tsx** - exercise execution page
  - Dynamic exercise loading by ID
  - Integration with word-form exercise system
  - Progress tracking and completion handling

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
- **Header.tsx** - main application header with adaptive navigation
  - Desktop: full navigation bar with settings
  - Mobile: burger menu with dropdown navigation
  - Conditional rendering (hidden on exercise pages)
- **HeaderLogo.tsx** - custom logo with Greek letters (ΕΛ)
- **HeaderNavigation.tsx** - navigation menu for desktop and mobile
- **HeaderSettings.tsx** - compact theme and language controls
- **MainNavigation.tsx** - main navigation cards for homepage
- **SettingsPanel.tsx** - settings panel with theme and language controls (legacy)

#### UI components (components/ui/)
- **CompactThemeToggle.tsx** - minimal theme switcher for header (icon only)
- **LanguageDropdown.tsx** - dropdown language selector with flags
- **LanguageSelector.tsx** - language selection buttons with flags (legacy)
- **NavigationCard.tsx** - reusable card for navigation links
- **ThemeToggle.tsx** - theme switcher with animation (full version)
- **UserLanguageSelector.tsx** - user language preference selector

#### Exercise components (components/exercises/)

##### Shared exercise components (components/exercises/shared/)
- **ExerciseLayout.tsx** - common layout for all exercise types
- **ExerciseHeader.tsx** - exercise header with progress and controls
- **HintSystem.tsx** - adaptive hint system (hover/tap for translations)
- **PulseEffect.tsx** - animated feedback (green/red pulse effects)

##### Word-form exercise components (components/exercises/word-form/)
- **WordFormExercise.tsx** - main word-form exercise controller
- **WordFormExerciseWrapper.tsx** - wrapper for exercise page integration
- **WordFormInput.tsx** - text input with validation and feedback
- **WordFormFeedback.tsx** - answer feedback and correction display
- **CompletionScreen.tsx** - exercise completion summary
- **ExerciseContent.tsx** - exercise content renderer
- **ExerciseRenderer.tsx** - exercise state machine renderer

#### Utility components
- **Head.tsx** - page meta tags management
- **LoadingOrError.tsx** - universal loading and error state component

### Mocks and testing (mocks/)

- **browser.ts** - MSW setup for browser
- **server.ts** - MSW setup for Node.js (tests)
- **handlers.ts** - mock API endpoint handlers
  - `/api/texts/common` - translation keys endpoint
  - `/api/translations/{lang}` - localized strings by language
  - `/api/exercises` - exercise metadata endpoint
  - `/api/exercises/{id}` - specific exercise data endpoint
- **data/texts/common.json** - translation key definitions
- **data/translations/** - localized strings
  - `el.json` - Greek translations
  - `ru.json` - Russian translations
  - `en.json` - English translations
- **data/exercises/** - exercise data files
  - `verbs-be.json` - Greek verb conjugation exercise (είμαι)

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
- **useExercises.ts** - exercise data management hooks
  - `useExercises()` - fetch exercise metadata list
  - `useExercise(id)` - fetch specific exercise data
  - TanStack Query integration with caching
- **usePulseEffect.ts** - pulse animation management hook
- **useHintState.ts** - hint system state management hook

#### Contexts (contexts/)
- **LanguageContext.tsx** - React context for language management
  - Language state provider
  - Language switching utilities

### Testing setup

- **test-setup.ts** - global test environment setup
  - Initialize jest-dom matchers
  - MSW server setup for tests
- **test-utils.tsx** - utilities for component rendering in tests

### TypeScript types and schemas

#### Types (types/)
- **settings.ts** - app settings types (Language, Theme, AppSettings)
- **exercises.ts** - exercise system types (WordFormExercise, ExerciseState, etc.)

#### Schemas (schemas/)
- **exercises.ts** - Valibot validation schemas for exercise JSON data

#### Utils (utils/)
- **exercises.ts** - exercise utilities (Greek text normalization, answer validation)

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
- **React Router 7** - client-side routing with lazy loading
- **Framer Motion** - smooth animations and transitions
- **Biome** - unified linting and formatting tool

### Exercise system architecture

- **JSON-based exercises** - Structured data files for exercise configuration
- **Type-safe validation** - Valibot schemas for exercise data integrity
- **Modular components** - Reusable exercise components (shared/word-form)
- **State machines** - Predictable exercise state transitions
- **Greek text handling** - Unicode normalization and tone-aware comparison
- **Hint system** - Adaptive UI (hover/tap) for multilingual hints

### Internationalization architecture

- **JSON-based translations** - Structured data files for scalability
- **API-driven loading** - Dynamic translation loading via MSW endpoints
- **Multi-level fallbacks** - Graceful degradation for missing translations
- **Language persistence** - User preferences stored in localStorage
- **Real-time switching** - Instant UI updates without page reload
- **Dual language system** - UI language + user language for exercise hints

### State and data management

- **TanStack Query** - server state caching and synchronization
- **Zustand** - client state management for settings persistence
- **Valibot** - data validation (lightweight Zod alternative)
- **MSW** - comprehensive API mocking (translations + exercises)
- **React Context** - language state management across components
- **LocalStorage** - settings persistence with automatic synchronization

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
