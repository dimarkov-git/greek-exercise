# Learn Greek refactor roadmap

This document captures the refactor-first plan for aligning the Learn Greek application with modern frontend standards, simpler architecture, and comprehensive test coverage.

## 1. Current state

### 1.1 Architecture
- The application is orchestrated from `App`, which lazily mounts top-level routes and exposes layout context for the header configuration.
- The entry point now boots through an environment-aware pipeline (Phase 0) that only starts MSW/Devtools when enabled and defaults to a production-safe router.

### 1.2 Data and internationalization
- The Zustand settings store manipulates `document.documentElement` inside setters and persistence callbacks, which tightly couples it to the browser and complicates testing or SSR.
- Translations are fetched via `useTranslations`, forcing every page to enumerate long key lists manually; missing keys fall back to pseudo-random placeholder text.
- Exercise fetching relies on ad-hoc `fetch` calls with Valibot validation but lacks a shared HTTP client, typed error handling, or retry logic.

### 1.3 Testing footprint
- Only a handful of unit and integration specs remain active, mostly checking navigation and JSON mock loading.
- Numerous `.old` specs linger in the repository, obscuring the real coverage baseline and encouraging outdated patterns.
- The Playwright suite covers smoke navigation paths but skips critical exercise flows (hints, incorrect answers, auto-advance) and settings persistence.

## 2. Key problems to solve
- **Production readiness**: Mock Service Worker and Devtools are hardwired into the bootstrap, preventing real API traffic and blurring environment boundaries.
- **Browser-only side effects**: The settings store directly mutates DOM attributes, making state transitions untestable without a DOM and unsafe for SSR.
- **Translation ergonomics**: Manual key enumeration and whimsical fallbacks waste developer time and create inconsistent UI strings.
- **Monolithic exercise pages**: The exercise library page mixes layout, filtering, language selection, and rendering logic in one large component, while the word-form exercise flow spreads state across loosely coupled hooks.
- **Testing gaps**: Unit coverage is thin, `.old` artefacts create noise, and E2E scenarios omit mission-critical behaviour.

## 3. Guiding objectives
- Preserve correctness, accessibility, localization, and strict Biome/TypeScript compliance.
- Keep the UX fast by respecting bundle budgets (≤250 KB main, ≤150 KB per route) and measuring LCP regressions.
- Achieve dependable automation: unit-test flake <1%, deterministic MSW mocks, and full coverage (unit, integration, E2E) for core learning journeys.
- Apply Feature-Sliced Design (FSD) principles pragmatically—encapsulate features and enforce boundaries—while avoiding a disruptive tree-wide rename until modules stabilize.
- Maintain developer productivity with reproducible environments (Node 24 LTS, pnpm 10) and a single `pnpm validate` entry point.

## 4. Phase roadmap

### Phase 0 – Foundations *(completed)*
1. ✅ Introduce environment-aware bootstrap: optional MSW/Devtools, production-safe router, and error boundaries prepared for real API integration.
   - Normalize environment flag access to use typed `import.meta.env` properties and Vitest runtime detection helpers.
2. ✅ Establish a shared HTTP layer (typed `fetch` wrapper) with retry/error policies aligned with MSW mocks.
3. ✅ Audit dependencies, remove dead packages, lock versions, and document runtime requirements in the setup guides.

### Phase 1 – Architecture decomposition
1. ✅ Break the exercise library into page, container, filter panel, card list, and data adapters; establish slice-like boundaries inspired by FSD and document the new directory layout.
2. ✅ Extract the word-form exercise state into a dedicated reducer with explicit events, selectors, and memoized derivations; expose a view-model hook that feeds the renderer without leaking internal state mutations.
   - Reducer logic now routes through small, intention-revealing handlers (`handleAnswerCorrect`, `handleAdvance`, etc.) to satisfy Biome's complexity guardrails and keep future unit tests focused.
   - The `useWordFormExercise` view-model is composed from dedicated helper hooks (initialisation, derived selectors, timers, and event handlers) that isolate side effects while honouring React's Rules of Hooks.
   - Presentation is split into thin render helpers, keeping `ExerciseRenderer` under the 50-line limit and allowing completion/error states to be reused in Playwright/Vitest harnesses.
3. Standardize layout and shell components, limit cross-module imports, and prepare for route-based code splitting.

### Phase 2 – Domain and data layer
1. Define exercise domain models and adapters that transform raw JSON or API payloads into view models shared by exercises and library listings.
2. Implement cache-aware selectors for filtering (tags, difficulty, language) that integrate with TanStack Query and memoization.
3. Provide validation utilities (Valibot or similar) to guarantee exercise data integrity across API, mocks, and tests.

### Phase 3 – Internationalization and settings modernization
1. Build a generated translation registry (union types or codegen) so components import typed dictionaries instead of enumerating key arrays.
2. Refactor `useTranslations` to return deterministic fallbacks, expose status codes for missing keys, and remove random filler text in production.
3. Move DOM side effects (theme attributes, language toggles) out of the Zustand store into React effects guarded by environment checks and add SSR-safe defaults.

### Phase 4 – Testing and QA expansion
1. Convert `.old` specs into current Vitest/Playwright coverage or retire them after documenting extracted learnings.
2. Add unit tests for the settings store, translation hook, exercise state machine, and filtering selectors; use fake timers where required.
3. Extend Playwright scenarios to cover full exercise completion (correct/incorrect answers, hints, navigation, settings persistence) following page object patterns.

### Phase 5 – Performance, DX, and governance
1. Measure bundle sizes, apply route-based code splitting, and lazy-load heavy exercise assets to stay within budgets.
2. Enhance CI with parallel lint/test/e2e jobs, coverage reports, and flake tracking (<1%) while keeping runtimes manageable.
3. Update contributor docs, add accessibility/performance checklists, and ensure the changelog reflects refactor milestones.

## 5. Testing coverage strategy
- **Unit/integration**: settings persistence, translation registry, exercise reducers/selectors, API adapters, layout components.
- **E2E**: navigation smoke, exercise workflow (success/failure/hints), settings persistence across reloads, translation switching, responsive layout checks.
- **Tooling**: configure coverage gates (≥90% baseline, rising toward 100% for core modules), capture Playwright traces on failure, and monitor flake statistics in CI.

## 6. Documentation deliverables
- Publish this refactor roadmap under `docs/ROADMAP.md` and link it from `docs/README.md` and the root `README.md` for discoverability.
- Provide companion guides: environment bootstrapping, translation workflow, exercise module conventions, and testing strategy updates.
- Keep all documentation in English with sentence-case headings, mirroring the rest of the docs set.

## 7. Immediate next steps
1. Update documentation indexes to point to the refreshed roadmap.
2. Schedule working sessions to execute each phase sequentially and monitor metrics against the guardrails.
3. Track progress through GitHub issues or project boards to keep the refactor transparent.
