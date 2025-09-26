# ADR 0001: Vitest coverage governance for critical modules

## Status
Accepted – Phase 5

## Context
Previous phases focused on rebuilding domain, translation, and settings architecture but left coverage thresholds permissive (≤80%), making it easy for regressions to slip in when new code was added. The Phase 5 roadmap called for enforcing ≥90% coverage on unit/integration suites for the HTTP client, translation registry, settings persistence, layout components, and exercise selectors/utilities, while deferring Playwright updates. Without codified thresholds and curated measurement scope, the team risked both missing critical regressions and over-measuring low-value files (e.g., mocks, types).

## Decision
- Update `vite.config.ts` to enable coverage for key runtime modules (`src/api/httpClient.ts`, layout shell, contexts, domain/exercises, `useTranslations`, `useLayout`, dictionaries, settings store, utilities) while excluding mocks/tests/types to keep the signal focused.
- Raise Vitest coverage thresholds to **statements ≥90%, lines ≥90%, functions ≥90%, branches ≥88%**, failing CI when the governed modules fall below those baselines.
- Backfill unit tests that exercise negative paths: HTTP retry/fallback/error handling, translation error normalisation, layout context usage, settings navigator preferences, and exercise utilities/selectors.
- Document the coverage strategy and trade-offs (this ADR + Phase 5 overview) so future contributors understand which modules are governed and why branch thresholds are slightly lower.

## Alternatives considered
1. **Global `all: true` coverage** – rejected to avoid punishing low-value files (mocks, type-only modules) and to prevent brittle 90% gates on untested legacy components.
2. **Per-package coverage configs** – considered but deferred to keep a single Vitest entry point and avoid splintering configuration across features.
3. **Maintaining 80% thresholds** – rejected because it does not align with the roadmap objective and provides insufficient guardrails for the refactored core.

## Consequences
- CI now fails when core runtime modules dip below the defined thresholds, enforcing the Phase 5 quality bar.
- Contributors have a curated include list and documentation clarifying which areas must maintain coverage, improving developer focus.
- Additional tests increase `pnpm test:ci` runtime modestly, but remain lightweight and deterministic thanks to targeted mocks/fake timers.
