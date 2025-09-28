# Feature-Sliced Design Migration Plan

Comprehensive migration plan for **Learn Greek** application to Feature-Sliced Design (FSD) architecture.

## 1. Current State Analysis

### Current Architecture

The project partially follows FSD principles with some deviations:

**Existing structure:**

```
src/
├── app/                    # ✅ Already FSD-compliant
├── pages/                  # ✅ Already FSD-compliant
├── components/             # ❌ Needs distribution across layers
│   ├── exercises/
│   ├── layout/
│   └── ui/
├── hooks/                  # ❌ Needs distribution across layers
├── stores/                 # ❌ Move to shared/model
├── api/                    # ❌ Move to shared/api
├── contexts/               # ❌ Needs distribution across layers
├── i18n/                   # ❌ Move to shared/lib/i18n
├── types/                  # ❌ Needs distribution across layers
└── utils/                  # ❌ Move to shared/lib
```

### 1.1 Common Issues with Current Architecture

1. **Mixed architectural paradigms**
    - Current `src/` mixes historical folders (`components/`, `hooks/`, `stores/`) with evolving domain slices, slowing navigation and encouraging cross-imports
    - Components in `components/` mix UI elements of different abstraction levels

2. **Implicit public contracts**
    - Many modules are imported directly through deep relative paths (e.g., `../../components/ui/ThemeToggle`), breaking consumers during refactoring and complicating bundling
    - Missing clear Public APIs through barrel exports

3. **Global state leakage**
    - Zustand stores and TanStack Query hooks reside in top-level folders without clear ownership, increasing risk of accidental coupling between unrelated pages
    - Hooks in `hooks/` contain logic from different domains

4. **Scattered testing**
    - Unit and integration tests live alongside legacy directories, so file migration often leaves orphaned test paths that don't match Vitest glob patterns

5. **Inconsistent naming**
    - Domain logic is scattered between `domain/`, `utils/`, and `components/exercises/`, making it hard to define slice boundaries for exercises vs generic UI

### 1.2 Migration Risks to Mitigate

1. **Broken import graphs**
    - Introducing aliases and moving files may break Vitest mocks, MSW handlers, and lazy route imports if barrel exports and codemods aren't planned
    - Each step must be carefully planned

2. **Test coverage regression**
    - Reorganization without updating `pnpm test --run` focus lists or snapshot paths can drop below enforced 80% coverage threshold
    - Must maintain test functionality at each step

3. **Bundle regressions**
    - Moving shared utilities to new barrels may inadvertently pull heavy modules into more bundles (e.g., TanStack Query devtools in production) if tree-shaking boundaries compress
    - Bundle size must be monitored after each phase

4. **Translation regressions**
    - Feature extraction must keep i18n keys colocated; otherwise translation generation scripts may miss new namespaces
    - Critical for multilingual application

5. **Parallel work conflicts**
    - Large-scale moves will conflict with Renovate or feature branches; plan incremental PRs with clear ownership to avoid merge churn
    - Recommended coordination with other developers

## 2. Target Project Structure

### FSD Layers

```
src/
├── app/           # Application initialization, providers, routing
├── processes/     # Complex business processes (not used initially)
├── pages/         # Application pages
├── widgets/       # Composite interface blocks
├── features/      # Business logic functionality
├── entities/      # Business entities
└── shared/        # Reusable code without business logic
```

### Example Directory Tree for Exercise Route

```
src/
├── app/
│   ├── providers/
│   │   ├── query.tsx
│   │   └── index.ts
│   ├── router/
│   │   ├── routes.tsx
│   │   └── index.ts
│   └── index.ts
├── pages/
│   └── exercise/
│       ├── ui/
│       │   └── exercise-page.tsx
│       ├── model/
│       │   └── use-exercise-state.ts
│       └── index.ts
├── widgets/
│   ├── exercise-header/
│   │   ├── ui/
│   │   │   └── exercise-header.tsx
│   │   └── index.ts
│   └── exercise-layout/
│       ├── ui/
│       │   └── exercise-layout.tsx
│       └── index.ts
├── features/
│   ├── word-form-exercise/
│   │   ├── ui/
│   │   │   ├── word-form-input.tsx
│   │   │   ├── word-form-feedback.tsx
│   │   │   └── completion-screen.tsx
│   │   ├── model/
│   │   │   └── exercise-store.ts
│   │   ├── api/
│   │   │   └── exercise-api.ts
│   │   └── index.ts
│   └── hint-system/
│       ├── ui/
│       │   └── hint-tooltip.tsx
│       ├── model/
│       │   └── use-hint-state.ts
│       └── index.ts
├── entities/
│   ├── exercise/
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   └── validation.ts
│   │   ├── api/
│   │   │   └── exercise-api.ts
│   │   └── index.ts
│   └── user/
│       ├── model/
│       │   └── types.ts
│       └── index.ts
└── shared/
    ├── ui/
    │   ├── button/
    │   │   ├── button.tsx
    │   │   └── index.ts
    │   ├── input/
    │   │   ├── input.tsx
    │   │   └── index.ts
    │   └── index.ts
    ├── api/
    │   ├── http-client.ts
    │   └── index.ts
    ├── lib/
    │   ├── react-query.ts
    │   ├── validation.ts
    │   ├── i18n/
    │   └── index.ts
    ├── config/
    │   ├── constants.ts
    │   └── index.ts
    └── model/
        ├── store.ts
        └── index.ts
```

### Example Public API through index.ts

**entities/exercise/index.ts**

```typescript
export { type Exercise, type ExerciseState } from './model/types'
export { exerciseSchema } from './model/validation'
export { useExercise, useExercises } from './api/exercise-api'
```

**features/word-form-exercise/index.ts**

```typescript
export { WordFormInput } from './ui/word-form-input'
export { WordFormFeedback } from './ui/word-form-feedback'
export { CompletionScreen } from './ui/completion-screen'
export { useExerciseStore } from './model/exercise-store'
```

**shared/ui/index.ts**

```typescript
export { Button } from './button'
export { Input } from './input'
export { ThemeToggle } from './theme-toggle'
export { LanguageSelector } from './language-selector'
```

## 3. Import Rules and Linting

### Aliases in tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/processes/*": ["./src/processes/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/features/*": ["./src/features/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

### ESLint Rules for FSD

Install `@feature-sliced/eslint-config`:

```bash
pnpm add -D @feature-sliced/eslint-config
```

**biome.json** (ESLint configuration replacement):

```json
{
  "linter": {
    "rules": {
      "style": {
        "useImportType": "error"
      },
      "correctness": {
        "noUnusedImports": "error"
      }
    }
  },
  "organizeImports": {
    "enabled": true
  }
}
```

### Using `@feature-sliced/steiger`

Install and configure Steiger for architecture validation:

```bash
pnpm add -D @feature-sliced/steiger
```

**.steiger.config.js**

```javascript
module.exports = {
  rules: {
    'fsd/layers-slices': 'error',
    'fsd/no-cross-import': 'error',
    'fsd/public-api': 'error',
    'fsd/no-reserved-folder-names': 'error'
  }
}
```

**package.json scripts**

```json
{
  "scripts": {
    "lint:fsd": "steiger src",
    "lint:boundaries": "depcruise --config dependency-cruiser.config.cjs src",
    "lint": "pnpm lint:tsc && pnpm lint:biome && pnpm lint:fsd && pnpm lint:boundaries"
  }
}
```

### Dependency Cruiser for Boundary Control

Add `dependency-cruiser` configuration (`dependency-cruiser.config.cjs`):

```bash
pnpm add -D dependency-cruiser
```

**dependency-cruiser.config.cjs**

```javascript
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "pages-layer-boundary",
      severity: "error",
      comment: "Pages may touch widgets, features, entities, shared only",
      from: { path: "^src/pages" },
      to: { pathNot: "^src/(pages|widgets|features|entities|shared)" }
    },
    {
      name: "widgets-layer-boundary",
      severity: "error",
      comment: "Widgets may touch features, entities, shared only",
      from: { path: "^src/widgets" },
      to: { pathNot: "^src/(widgets|features|entities|shared)" }
    },
    {
      name: "features-layer-boundary",
      severity: "error",
      comment: "Features may touch entities, shared only",
      from: { path: "^src/features" },
      to: { pathNot: "^src/(features|entities|shared)" }
    },
    {
      name: "entities-layer-boundary",
      severity: "error",
      comment: "Entities may touch shared only",
      from: { path: "^src/entities" },
      to: { pathNot: "^src/(entities|shared)" }
    },
    {
      name: "no-deep-public-imports",
      severity: "error",
      comment: "Always import through slice index files",
      from: { path: "^src/(app|processes|pages|widgets|features|entities)" },
      to: {
        path: "^src/(pages|widgets|features|entities)/.+/(ui|model|api|lib)/",
        pathNot: "index\\.(ts|tsx)$"
      }
    }
  ],
  options: {
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      modules: ["src", "node_modules"]
    }
  }
};
```

## 4. Step-by-Step Migration Plan

### Phase 0: Foundation Setup (1-2 days)

1. **Introduce aliases**
   ```bash
   # Create backup
   cp tsconfig.app.json tsconfig.app.json.backup
   ```
    - Update `tsconfig.json`, Vite, Vitest, and Playwright configs with layer aliases
    - Run `pnpm lint` to confirm Biome picks up new paths

2. **Add linting guards**
   ```bash
   pnpm add -D @feature-sliced/steiger dependency-cruiser
   ```
    - Configure Biome/ESLint and dependency-cruiser
    - Add CI scripts (`"lint:boundaries": "depcruiser --config dependency-cruiser.config.cjs src"`)

3. **Update documentation**
    - Publish this plan and share migration conventions in `docs/architecture`

4. **Create basic folder structure**
   ```bash
   mkdir -p src/{widgets,features,entities}
   mkdir -p src/shared/{ui,api,lib,config,model,test}
   ```

### Phase 1: Golden Path Slices (2-3 days)

1. **Select pilot features**
    - Choose two representative flows: e.g., exercise execution and language selection

2. **Create FSD skeleton**
    - Create skeleton `features/exercise-runner`, `entities/exercise`, `shared/ui/button`, etc.
    - Move minimal code to validate imports

3. **Publish public APIs**
    - Ensure each slice exports `index.ts` barrels with stable exports
    - Update consumers to use aliases

4. **Update tests**
    - Move related unit/integration tests alongside their slices (`ui/__tests__` or `model/__tests__`)
    - Adjust Vitest `testMatch` if needed

### Phase 2: Migrate shared Layer (2-3 days)

1. **Move API module**
   ```bash
   git mv src/api/* src/shared/api/
   ```

2. **Move utilities**
   ```bash
   git mv src/utils/* src/shared/lib/
   ```

3. **Move global types**
   ```bash
   git mv src/types/settings.ts src/shared/model/
   ```

4. **Move i18n system**
   ```bash
   git mv src/i18n/* src/shared/lib/i18n/
   ```

5. **Move stores to shared/model**
   ```bash
   git mv src/stores/settings.ts src/shared/model/
   ```

6. **Create public API for shared modules**
    - `src/shared/api/index.ts`
    - `src/shared/lib/index.ts`
    - `src/shared/model/index.ts`

### Phase 3: Extract Entities (2-3 days)

1. **Create entity "exercise"**
   ```bash
   mkdir -p src/entities/exercise/{model,api}
   ```

2. **Move exercise types**
   ```bash
   git mv src/types/exercises.ts src/entities/exercise/model/
   ```

3. **Create exercise API**
    - Extract from `src/hooks/useExercises.ts` to `src/entities/exercise/api/`

4. **Create entity "user"**
   ```bash
   mkdir -p src/entities/user/model
   ```

5. **Create public API for entities**

### Phase 4: Extract UI Components to shared/ui (2-3 days)

1. **Move basic UI components**
   ```bash
   git mv src/components/ui/ThemeToggle.tsx src/shared/ui/theme-toggle/
   git mv src/components/ui/LanguageSelector.tsx src/shared/ui/language-selector/
   git mv src/components/ui/NavigationCard.tsx src/shared/ui/navigation-card/
   ```

2. **Create index.ts for each component**

3. **Update imports in existing files**

### Phase 5: Create Features (3-4 days)

1. **Create feature "word-form-exercise"**
   ```bash
   mkdir -p src/features/word-form-exercise/{ui,model,api}
   ```

2. **Move exercise components**
   ```bash
   git mv src/components/exercises/word-form/* src/features/word-form-exercise/ui/
   ```

3. **Create feature "hint-system"**
   ```bash
   mkdir -p src/features/hint-system/{ui,model}
   git mv src/components/exercises/shared/HintSystem.tsx src/features/hint-system/ui/
   git mv src/hooks/useHintState.ts src/features/hint-system/model/
   ```

4. **Create feature "settings-panel"**
   ```bash
   mkdir -p src/features/settings-panel/ui
   git mv src/components/layout/SettingsPanel.tsx src/features/settings-panel/ui/
   ```

### Phase 6: Create Widgets (2-3 days)

1. **Create widget "app-header"**
   ```bash
   mkdir -p src/widgets/app-header/ui
   git mv src/components/layout/Header.tsx src/widgets/app-header/ui/
   git mv src/components/layout/Header*.tsx src/widgets/app-header/ui/
   ```

2. **Create widget "exercise-layout"**
   ```bash
   mkdir -p src/widgets/exercise-layout/ui
   git mv src/components/exercises/shared/ExerciseLayout.tsx src/widgets/exercise-layout/ui/
   ```

3. **Create widget "mobile-menu"**
   ```bash
   mkdir -p src/widgets/mobile-menu/ui
   git mv src/components/layout/MobileMenu*.tsx src/widgets/mobile-menu/ui/
   ```

### Phase 7: Update Pages (2-3 days)

1. **Reorganize existing pages**
    - Add `ui/` and `model/` segments where needed
    - Update imports to new aliases

2. **Create public API for pages**

### Phase 8: Final Cleanup and Hardening (2-3 days)

1. **Enforce boundaries**
   ```bash
   pnpm lint:boundaries
   ```
    - Run dependency-cruiser to ensure no forbidden imports
    - Fail CI on violations

2. **Update coverage maps**
    - Ensure Vitest coverage thresholds still point to new locations
    - Adjust `collectCoverageFrom` globs

3. **Clean legacy paths**
    - Remove obsolete aliases, update `tsconfig.app.json` references
    - Remove redundant re-export stubs

4. **Documentation and knowledge sharing**
    - Update `docs/architecture/project-structure.md`
    - Conduct walkthrough session

5. **Regression sweep**
    - Run `pnpm validate` and targeted manual QA testing
    - Only merge final migration PR after this

## 5. Modern React/TypeScript Integration (2025)

### 5.1 Data Layer Integration (TanStack Query)

1. **Entities own data hooks**
    - Wrap TanStack Query hooks inside `entities/<name>/model` (e.g., `useExerciseQuery`)
    - Export typed selectors and prefetch utilities through entity public API

2. **Feature mutations**
    - Features compose entity hooks with UI actions
    - Keep mutation side effects (toast, navigation) inside features to avoid leakage to entities

3. **Testing**
    - Provide MSW handlers inside `shared/test/msw` and share typed factories for deterministic fixtures

**entities/exercise/api/exercise-queries.ts**

```typescript
import { queryOptions } from '@tanstack/react-query'
import { httpClient } from '@/shared/api'

export const exerciseQueries = {
  all: () => ['exercises'] as const,
  lists: () => [...exerciseQueries.all(), 'list'] as const,
  detail: (id: string) => [...exerciseQueries.all(), 'detail', id] as const,
}

export const exerciseListOptions = queryOptions({
  queryKey: exerciseQueries.lists(),
  queryFn: () => httpClient.get('/api/exercises')
})

export const exerciseDetailOptions = (id: string) => queryOptions({
  queryKey: exerciseQueries.detail(id),
  queryFn: () => httpClient.get(`/api/exercises/${id}`)
})
```

### 5.2 Feature Flags

1. **Flag registry**
    - Maintain `shared/config/feature-flags.ts` exporting `isEnabled("flag-name")` with environment-driven sources

2. **Slice integration**
    - Pages and widgets read flags and branch to optional features via lazy-loading alternative widgets (`import("@features/experimental")`)

3. **Runtime safety**
    - Wrap experimental code paths with `Suspense`/`ErrorBoundary` to avoid breaking existing flows

**shared/config/feature-flags.ts**

```typescript
export const FEATURE_FLAGS = {
  NEW_EXERCISE_BUILDER: import.meta.env.VITE_FEATURE_NEW_BUILDER === 'true',
  ADVANCED_HINTS: import.meta.env.VITE_FEATURE_ADVANCED_HINTS === 'true',
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS

export const isEnabled = (flag: FeatureFlag): boolean => FEATURE_FLAGS[flag]
```

### 5.3 Testing Strategy Alignment

1. **Unit tests**
    - Store alongside implementation (`model/__tests__`, `ui/__tests__`)
    - Use `@shared/test/render` utilities for consistent setup

2. **Integration tests**
    - Place in page or widget slices to capture composite behavior
    - Ensure coverage budgets continue working through `pnpm test`

3. **E2E tests**
    - Organize Playwright specs by route under `tests/e2e/pages/<route>.spec.ts`, mapping to `pages/` slices
    - Run `pnpm test:e2e:ci` in pipelines

Testing follows FSD structure:

```
src/
├── entities/
│   └── exercise/
│       ├── model/
│       │   ├── __tests__/
│       │   │   ├── types.test.ts
│       │   │   └── validation.test.ts
│       └── api/
│           └── __tests__/
│               └── exercise-api.test.ts
├── features/
│   └── word-form-exercise/
│       ├── ui/
│       │   └── __tests__/
│       │       ├── word-form-input.test.tsx
│       │       └── completion-screen.test.tsx
│       └── model/
│           └── __tests__/
│               └── exercise-store.test.ts
└── shared/
    ├── api/
    │   └── __tests__/
    │       └── http-client.test.ts
    ├── lib/
    │   └── __tests__/
    │       └── validation.test.ts
    └── test/
        ├── msw/
        │   └── handlers.ts
        └── render.tsx
```

### 5.4 Route-based Code Splitting

1. **Lazy pages**
    - Keep route-level lazy imports inside `app/router/config.ts`, using dynamic `import("@pages/exercise")` for bundle splitting

2. **Widget-level chunks**
    - For heavy widgets (exercise builder), wrap with `lazy()` and `Suspense` inside page to defer optional functionality

**app/router/routes.tsx**

```typescript
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

const HomePage = lazy(() => import('@/pages/home'))
const ExercisePage = lazy(() => import('@/pages/exercise'))
const ExerciseLibraryPage = lazy(() => import('@/pages/exercise-library'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    loader: async () => {
      // Prefetch critical data for homepage
      return null;
    }
  },
  {
    path: '/exercises',
    element: <ExerciseLibraryPage />,
  },
  {
    path: '/exercises/:id',
    element: <ExercisePage />,
    loader: async ({ params }) => {
      // Prefetch exercise data
      const { queryClient } = await import('@/app/providers/query-client');
      const { exerciseDetailOptions } = await import('@/entities/exercise/api');
      return queryClient.ensureQueryData(exerciseDetailOptions(params.id!));
    }
  },
])
```

**Vite configuration for code splitting:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'query': ['@tanstack/react-query'],
          'router': ['react-router-dom'],
          'forms': ['react-hook-form', '@hookform/resolvers'],
          'validation': ['valibot', 'zod']
        }
      }
    }
  }
})
```

## Timeline and Benefits

FSD migration will take approximately **15-20 working days** across 8 phases. Key benefits after migration:

1. **Clear separation of concerns** between layers
2. **Simplified code navigation** through standardized slice boundaries
3. **Controlled dependencies** between modules through enforced import rules
4. **Better scalability** as project grows with new features
5. **Unified approaches** to organizing new features through established patterns
6. **Improved bundle efficiency** through better boundaries for tree-shaking
7. **Enhanced developer experience** through predictable project structure

**Implementation advice:** Execute migration as sequence of incremental PRs (≤500 LOC each) to maintain fast `pnpm validate`, ensure reviewability, and avoid destabilizing production deployments.

Important to maintain test functionality at each step and use automated architecture checking tools to prevent regression. After migration completion, project will be ready for further scaling with clear architectural foundation.