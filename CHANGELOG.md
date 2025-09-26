# Changelog

## 2025-10-01

- Completed Phase 5 testing coverage strategy: enforced ≥90% Vitest thresholds (88% branches) for HTTP, translations,
  layout, settings, and exercise utilities.
- Added comprehensive unit suites for the HTTP client, translation dictionaries/hooks, layout shell, settings navigator
  fallbacks, and exercise selectors/utilities.
- Published Phase 5 overview + ADR, refreshed roadmap/README entries, and documented coverage governance in the
  changelog.

## 2025-09-23

- Completed Phase 4 testing/QA expansion: converted legacy specs, added HTTP fallback controls, and expanded
  exercise/responsive Playwright flows.
- Added deterministic Vitest coverage for the HTTP client, settings store, word-form state machine, utilities, and
  Valibot schemas.
- Published Phase 4 overview + ADR, refreshed testing guide, and marked roadmap progress; MSW/fallback matrix now
  verified in CI.

## 2025-02-14

- Completed Phase 3 i18n/settings modernization: generated translation registry, typed dictionaries, and deterministic
  fallbacks.
- Refactored `useTranslations` + component callers to surface status codes and typed translators; introduced
  `useSettingsSync` for SSR-safe DOM updates.
- Added unit tests, documentation (overview, ADR, execution report), and updated roadmap/readme entries for the new
  workflow.

## 2025-09-22

- Completed Phase 2 domain/data-layer refactor deliverables: Learn page decomposition, explicit exercise domain imports,
  and Playwright matrix expansion.
- Added tooling scripts (`build:analyze`, `depcheck`, `audit`) and integrated `rollup-plugin-visualizer` for
  reproducible bundle artefacts.
- Published Phase 2 documentation set (overview, ADR, execution report) with captured QA logs, coverage, and bundle
  analysis.
