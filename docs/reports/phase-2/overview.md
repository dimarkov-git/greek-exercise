# Phase 2 overview

## Current architecture summary
- Exercise data is modelled in `src/domain/exercises`, which now exposes focused modules for adapters, selectors, query options, and type definitions. The adapters normalise DTOs, enrich exercises with defaults, and derive metadata used by both the library and the learn/exercise flows.
- TanStack Query powers data fetching through `useExercises`/`useExercise`, sharing cache configuration and memoised selectors. Word-form exercises are the only supported runtime type and are normalised before reaching the UI.
- The learn experience is rendered through composable presentation components (`JsonView`, `TableView`, `ViewToggle`) with the page shell delegating layout state to `useLayout` and translation lookups to `useTranslations`.
- Exercise library presentation consumes the domain view model and filtering selectors, keeping feature logic isolated within `src/pages/exercise-library`.

## Goals
1. Finish the Learn page refactor so Biome's 50-line guardrails pass without suppressions while retaining the previous UI/UX.
2. Document the domain/data-layer boundaries that were introduced for Phase 2 and communicate how feature code should interact with them.
3. Produce reproducible QA artefacts (lint/test/build/e2e logs, bundle/coverage reports, audit results) to support `pnpm validate` as the single CI entry point.

## Deliverables & tasks
- Implement `UnsupportedExerciseNotice` and `LearnPageContent` helper components, wiring header/actions/content into composable subcomponents.
- Surface the new domain adapters/selectors through explicit imports (no barrel file) across hooks, mocks, and tests.
- Extend Playwright configuration to exercise Chromium, Firefox, and WebKit targets in CI.
- Integrate `rollup-plugin-visualizer` and expose a `build:analyze` script that emits HTML+JSON bundle artefacts under `docs/reports/phase-2/assets/`.
- Author Phase 2 ADR(s), execution report, and update README/ROADMAP references alongside a dated changelog entry.
- Capture lint/unit/e2e/build/validate logs, coverage summary, depcheck/audit output, and bundle metrics (≤5% size delta) inside `docs/reports/phase-2/`.

## In scope
- UI refactor of `LearnPage` into smaller typed components.
- Domain module usage updates, Playwright matrix expansion, and tooling/documentation work that substantiates Phase 2.
- Accessibility checks through `@axe-core/playwright` and JSX linting (Biome + jsx-a11y rules already enforced).

## Out of scope
- New exercise types beyond `word-form` or changes to exercise execution flows.
- Translation registry redesign (Phase 3) and settings store modernisation.
- Server/API changes outside of typed fetch integration.

## Dependencies
- TanStack Query, Biome, Vitest, Playwright, Tailwind, and the new domain adapters/selectors.
- Build analysis relies on `rollup-plugin-visualizer`; dep hygiene uses `depcheck` and `pnpm audit`.
- E2E runs depend on Playwright browsers being installed via `pnpm playwright install --with-deps`.

## Risks & mitigations
- **Bundle regressions**: visualizer assets could bloat the repo. Mitigate by scoping outputs to documentation artefacts and monitoring gzip/brotli deltas (≤5%).
- **Test flakiness**: Expanding the Playwright matrix increases runtime; run sequentially in CI (`workers: 1`) and capture logs to diagnose failures quickly.
- **Domain coupling**: Without the barrel, incorrect import paths may surface. Enforce via TypeScript errors and update guides to document canonical entry points.
- **A11y regressions**: UI refactor might drop semantics. Guard with the new axe-powered tests and jsx-a11y lint rules.

## Effort estimate
- **Size**: Medium (M).
- **Estimated range**: 12–18 hours, covering UI refactor (4–6h), tooling upgrades (3–4h), documentation/reporting (3–4h), and validation runs (2–4h).
