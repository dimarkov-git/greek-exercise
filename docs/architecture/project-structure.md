# Project structure

This document explains the purpose of each file in the **Learn Greek** application, reflecting the Feature-Sliced Design (FSD) architecture established through Phase 6 migration.

## Architecture overview

**Current status**: Production-ready React application with comprehensive testing (80% statements/lines/functions, 75% branches) and complete FSD architecture
**Key patterns**:

- **Feature-Sliced Design (FSD)** with clear layer boundaries and module dependencies
- **Type-safe i18n** via generated translation registry
- **HTTP client** with configurable fallback policies
- **SSR-safe effects** for DOM state synchronization
- **Architecture boundaries** enforced via dependency-cruiser and Steiger
- **Coverage governance** on critical runtime modules

## 🏗️ Root configuration files

### package.json

**Purpose**: Central npm/pnpm package configuration file for Learn Greek app

- **Name**: `learn-greek` - Interactive Greek language learning application
- Defines project dependencies (React 19, TanStack Query, React Router 7, Zustand, Valibot)
- Contains scripts for development, building, testing
- Settings for pnpm and MSW (Mock Service Worker) for translation API mocking
- Uses modern versions: React 19, TypeScript 5, Vite 7

### vite.config.ts

**Purpose**: Vite bundler configuration with coverage governance

- Configures plugins: React and Tailwind CSS v4
- Sets up `@/` alias for `src/` folder
- Configures Vitest for unit/integration tests
- **Coverage thresholds**: 80% statements/lines/functions, 75% branches
- **Scoped coverage**: All source code (excludes main.tsx, browser.ts)
- Bundle analysis integration via `rollup-plugin-visualizer`

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

## 📁 Source code structure (src/) - Feature-Sliced Design

### Entry point

- **main.tsx** – environment-aware bootstrap
    - Conditionally starts MSW mocks outside production and test environments
    - Wraps the SPA with shared providers, router selection, and the global error boundary
    - Chooses router mode (`browser`, `hash`, `memory`) via `AppRouter`
- **App.tsx** – delegates to `AppRoutes` for navigation

### FSD Layer: app/

Application initialization, routing, and global providers:

- **providers/** – Global providers setup
    - `QueryProvider.tsx` – TanStack Query provider with devtools
    - `index.ts` – Barrel export for providers
- **router/** – Routing configuration
    - `AppRoutes.tsx` – Centralized route definitions with lazy loading
    - `index.ts` – Barrel export for router utilities
- **shell/** – Application shell components
    - `AppShell.tsx` – Header/main/footer layout wrapper
    - `AppErrorBoundary.tsx` – Top-level error boundary
    - `index.ts` – Barrel export for shell components
- **config/** – Application configuration
    - `environment.ts` – Runtime feature flags and environment variables
    - `queryClient.ts` – Shared TanStack Query client configuration
    - `index.ts` – Barrel export for configuration

### FSD Layer: pages/

Page-level components representing application routes:

- **HomePage.tsx** – Main landing page with navigation cards
- **ExercisePage.tsx** – Exercise execution page
- **ExerciseLibraryPage.tsx** – Exercise library with filtering and search
- **LearnPage.tsx** – Learning materials and vocabulary page
- **exercise-library/** – Exercise library page slice
    - `ui/ExerciseLibrary.tsx` – Main page component
    - `model/` – Page-specific state and logic
    - `hooks/useExerciseFiltering.ts` – Filtering state management
    - `constants.ts` – Page-specific constants
    - `index.ts` – Barrel export

### FSD Layer: widgets/

Composite interface blocks combining multiple features:

- **app-header/** – Main application header
    - `ui/AppHeader.tsx` – Header component with navigation
    - `index.ts` – Barrel export
- **app-footer/** – Application footer
    - `ui/AppFooter.tsx` – Footer with links and copyright
    - `index.ts` – Barrel export
- **exercise-layout/** – Common exercise page layout
    - `ui/ExerciseLayout.tsx` – Layout wrapper for exercises
    - `index.ts` – Barrel export
- **mobile-menu/** – Mobile navigation menu
    - `ui/MobileMenu.tsx` – Mobile menu component
    - `ui/MobileMenuButton.tsx` – Menu trigger button
    - `index.ts` – Barrel export
- **main-navigation/** – Main navigation component
    - `ui/MainNavigation.tsx` – Navigation cards for homepage
    - `index.ts` – Barrel export

### FSD Layer: features/

Business logic functionality with UI components:

- **word-form-exercise/** – Word form exercise implementation
    - `ui/` – Exercise UI components
        - `WordFormInput.tsx` – Text input with validation
        - `WordFormFeedback.tsx` – Answer feedback display
        - `CompletionScreen.tsx` – Exercise completion screen
        - `ExerciseContent.tsx` – Exercise content renderer
        - `ExerciseRenderer.tsx` – State machine renderer
    - `model/` – Exercise state management
        - `useExerciseStore.ts` – Zustand store for exercise state
    - `index.ts` – Barrel export with public API
- **hint-system/** – Multilingual hint system
    - `ui/HintSystem.tsx` – Adaptive hint display component
    - `ui/PulseEffect.tsx` – Animated feedback effects
    - `model/useHintState.ts` – Hint state management
    - `model/usePulseEffect.ts` – Pulse animation logic
    - `index.ts` – Barrel export
- **settings-panel/** – Application settings interface
    - `ui/SettingsPanel.tsx` – Settings configuration UI
    - `index.ts` – Barrel export
- **learn-view/** – Learning materials display
    - `ui/JsonView.tsx` – JSON data viewer
    - `ui/TableView.tsx` – Tabular data display
    - `ui/ViewToggle.tsx` – View switching controls
    - `index.ts` – Barrel export
- **exercise-header/** – Exercise page header
    - `ui/ExerciseHeader.tsx` – Header with progress and controls
    - `index.ts` – Barrel export

### FSD Layer: entities/

Business entities with their models and API interactions:

- **exercise/** – Exercise domain entity
    - `model/` – Exercise types and business logic
        - `types.ts` – Core exercise types
        - `validation.ts` – Exercise data validation
    - `api/` – Exercise data access
        - `useExercises.ts` – Exercise list query hook
        - `useExercise.ts` – Single exercise query hook
    - `index.ts` – Barrel export with public API
- **user/** – User domain entity (future expansion)
    - `model/types.ts` – User-related types
    - `index.ts` – Barrel export

### FSD Layer: shared/

Reusable code without business logic:

- **ui/** – Common UI components
    - `button/Button.tsx` – Reusable button component
    - `input/Input.tsx` – Form input component
    - `theme-toggle/ThemeToggle.tsx` – Theme switcher
    - `language-selector/LanguageSelector.tsx` – Language picker
    - `navigation-card/NavigationCard.tsx` – Navigation card
    - `loading-or-error/LoadingOrError.tsx` – Loading/error states
    - `head/Head.tsx` – Page meta tags management
    - Each component has its own directory with barrel export
    - `index.ts` – Main UI components barrel export
- **api/** – HTTP client and API utilities
    - `httpClient.ts` – Configured HTTP client with retry logic
    - `texts.ts` – Translation API functions
    - `index.ts` – Barrel export
- **lib/** – Utility libraries and helpers
    - `i18n/` – Internationalization system
        - `createTranslationDictionary.ts` – Translation dictionary factory
        - `types.ts` – i18n type definitions
        - `index.ts` – i18n barrel export
    - `validation.ts` – Common validation utilities
    - `exercises.ts` – Greek text processing utilities
    - `index.ts` – Barrel export for utilities
- **model/** – Shared state and types
    - `settings.ts` – App settings Zustand store
    - `types/` – Common type definitions
        - `settings.ts` – Settings types
        - `exercises.ts` – Exercise types (re-exported from entities)
    - `index.ts` – Barrel export
- **config/** – Configuration and constants
    - `constants.ts` – Application constants
    - `index.ts` – Barrel export
- **test/** – Testing utilities
    - `msw/handlers.ts` – Mock Service Worker handlers
    - `render.tsx` – Test rendering utilities
    - `index.ts` – Barrel export

### Testing structure

Tests are colocated with their respective layers:

- **Unit tests**: `__tests__/` directories within each slice
- **MSW mocks**: `src/shared/test/msw/handlers.ts`
- **E2E tests**: `tests/` directory at project root

### Architecture boundaries

Import rules enforced by dependency-cruiser:
- **Pages** → widgets, features, entities, shared
- **Widgets** → features, entities, shared
- **Features** → entities, shared
- **Entities** → shared only
- **Shared** → no internal dependencies

### TypeScript path aliases

- `@/app/*` → `src/app/*`
- `@/pages/*` → `src/pages/*`
- `@/widgets/*` → `src/widgets/*`
- `@/features/*` → `src/features/*`
- `@/entities/*` → `src/entities/*`
- `@/shared/*` → `src/shared/*`

## 🧪 Testing

### Unit/integration tests

- **Framework**: Vitest + Testing Library
- **Environment**: happy-dom (lightweight jsdom alternative)
- **Requirement**: 80% statements/lines/functions, 75% branches coverage
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

## 🎯 Key files and their purposes (FSD Structure)

### Application entry points

- **`src/main.tsx`** - App entry point with MSW setup and providers
- **`src/App.tsx`** - Main routing delegation to AppRoutes

### FSD Layer: app/

- **`src/app/providers/QueryProvider.tsx`** - TanStack Query provider configuration
- **`src/app/router/AppRoutes.tsx`** - Centralized routing with lazy loading
- **`src/app/shell/AppShell.tsx`** - Application layout shell
- **`src/app/config/queryClient.ts`** - Shared Query client setup

### FSD Layer: shared/

- **`src/shared/api/texts.ts`** - Translation API functions with Valibot validation
- **`src/shared/api/httpClient.ts`** - Configured HTTP client with retry logic
- **`src/shared/lib/i18n/`** - Internationalization system with type-safe dictionaries
- **`src/shared/lib/exercises.ts`** - Greek text processing utilities
- **`src/shared/model/settings.ts`** - Zustand store for app settings and language management
- **`src/shared/model/types/`** - Common type definitions

### FSD Layer: entities/

- **`src/entities/exercise/api/useExercises.ts`** - Exercise data management hooks
- **`src/entities/exercise/model/types.ts`** - Exercise domain types
- **`src/entities/exercise/model/validation.ts`** - Exercise data validation schemas

### FSD Layer: features/

- **`src/features/word-form/`** - Word form exercise implementation
- **`src/features/hint-system/`** - Multilingual hint system
- **`src/features/settings-panel/`** - Application settings interface

### FSD Layer: widgets/

- **`src/widgets/app-header/ui/AppHeader.tsx`** - Main application header
- **`src/widgets/exercise-layout/ui/ExerciseLayout.tsx`** - Exercise page layout wrapper
- **`src/widgets/mobile-menu/`** - Mobile navigation components

### FSD Layer: pages/

- **`src/pages/HomePage.tsx`** - Main landing page with navigation
- **`src/pages/ExercisePage.tsx`** - Exercise execution page
- **`src/pages/exercise-library/`** - Exercise library page slice

### Development and testing

- **`src/shared/test/msw/handlers.ts`** - MSW mock handlers for API endpoints
- **`vite.config.ts`** - Vite configuration with FSD path aliases

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

### Internationalization architecture (Phase 3)

- **Generated translation registry** - Type-safe keys with compile-time validation
- **Feature-based dictionaries** - Scoped translations via `createTranslationDictionary`
- **Deterministic fallbacks** - Policy-driven missing key resolution
- **SSR-safe state sync** - DOM mutations handled via `useSettingsSync` hook
- **Status reporting** - Explicit translation status codes for diagnostics
- **Memoized requests** - Shared cache keys for identical translation requests

### State and data management

- **TanStack Query** - server state caching and synchronization
- **Zustand** - client state management for settings persistence
- **Valibot** - data validation (lightweight Zod alternative)
- **MSW** - comprehensive API mocking (translations + exercises)
- **React Context** - language state management across components
- **LocalStorage** - settings persistence with automatic synchronization

### Performance optimizations

- **Bundle analysis** - Integrated visualizer for size monitoring
- **Lazy loading** - code splitting for exercise pages
- **Font preloading** - Inter font optimization
- **React Suspense** - optimistic UI with loading states
- **Translation caching** - 30-minute cache for translation API calls
- **Tree-shakeable dictionaries** - Feature-scoped i18n imports
- **HTTP fallback policies** - Configurable offline support (Phase 4)

### Feature-Sliced Design architecture (Phase 6)

- **Clear layer boundaries** - Each FSD layer has specific responsibilities and import rules
- **Barrel exports** - All slices provide public APIs through index.ts files
- **Architecture linting** - Dependency-cruiser and Steiger enforce FSD compliance
- **TypeScript path aliases** - Clean imports using @/layer/* syntax
- **Colocated testing** - Tests live alongside their implementations within slices
- **84% boundary violation reduction** - From 381 violations to 71 internal warnings
- **Enhanced developer experience** - Predictable structure and clear module dependencies

### Development workflow patterns

- **Environment-aware bootstrap** (Phase 0) with conditional MSW/DevTools
- **Project references** in TypeScript for faster builds
- **Bundle analysis** integrated via `pnpm build:analyze`
- **Single validation entry point** via `pnpm validate`
- **Accessibility testing** via @axe-core/playwright integration
- **Architecture validation** - `pnpm lint:boundaries` checks FSD compliance

---

**For current development priorities, see [ROADMAP.md](../ROADMAP.md)**
