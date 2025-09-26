# Phase 5 overview – Testing coverage strategy

## Architecture snapshot
- **Coverage governance** – Vitest coverage thresholds were raised to a 90%+ baseline for statements, lines, and functions (88% for branches) across the HTTP client, translation pipeline, layout shell, settings store, and exercise utilities to enforce the desired testing bar.
- **Translation and layout verification** – Dedicated suites validate `useTranslations`, translation dictionary generation, and layout context usage (`useLayout`, `AppShell`), ensuring that asynchronous language switches and dictionary fallbacks remain deterministic.
- **Domain and utility regression net** – Exercise selectors, adapters, and utility helpers now include memoisation, filtering, and formatting negative tests to document behaviour while keeping Feature-Sliced module boundaries intact.
- **HTTP client resiliency tests** – The shared `requestJson` helper is now exercised across retryable status codes, 204 responses, non-JSON errors, fallback errors, and body serialisation to prevent silent regressions in gateway behaviour.

## Goals
1. Establish repository-wide coverage gates that fail CI when key modules drop below 90% statements/lines coverage.
2. Backfill unit/integration tests for settings persistence, translation registry usage, layout shell, and exercise utilities to support the new gates.
3. Document the coverage strategy, decision rationale, and risk mitigations for future contributors.

## Scope
### In scope
- Raising Vitest coverage thresholds and scoping measurement to critical runtime modules.
- Adding new Vitest suites for translation dictionary normalisation, layout hooks/components, HTTP client edge cases, and exercise utilities/selectors.
- Authoring Phase 5 overview + ADR documentation describing the coverage governance approach.
- Updating roadmap, changelog, and README entries to reflect Phase 5 completion and coverage requirements.

### Out of scope
- Playwright/E2E coverage adjustments (explicitly deferred in Phase 5 plan).
- Feature work or refactors outside of testing instrumentation and documentation.
- Performance/bundle analysis (scheduled for Phase 6).

## Dependencies
- React Query (for translation fetching state and mocked status orchestration).
- Vitest + @testing-library/react for hook/component unit testing.
- Zustand persistence for settings store behaviour.
- Existing translation registry/dictionary generators and exercise domain adapters.

## Risks & mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Coverage scope misses critical runtime modules | Medium | Coverage include list targets API, translations, layout, stores, domain, and utilities; documentation enumerates the governed modules. |
| Higher thresholds cause flaky builds | Medium | Tests rely on deterministic fake timers, mocks, and controlled QueryClient instances; documentation captures follow-up when extending gates. |
| Mocked React Query modules diverge from real behaviour | Low | Tests that mock `useQuery` use `vi.doMock` with `importActual` to preserve all other exports and reset modules after each assertion. |
| Added suites slow down `pnpm test:ci` | Low | Suites remain lightweight (no DOM-heavy rendering), and coverage is restricted to critical modules to avoid unnecessary instrumentation. |

## Coverage outcome
- Overall coverage after Phase 5: **93.45% statements / 93.45% lines / 97.5% functions / 88.85% branches**.
- Enforced minimums: statements ≥90%, lines ≥90%, functions ≥90%, branches ≥88%.

## Deliverables
- Updated Vitest configuration enforcing the new thresholds and coverage scope.
- Expanded test suites for HTTP client, translation dictionaries/hooks, layout provider, settings store preferences, and exercise utilities/selectors.
- Phase 5 overview and ADR documenting the coverage governance strategy.
- README, ROADMAP, and CHANGELOG updates reflecting the completed phase and coverage requirements.
