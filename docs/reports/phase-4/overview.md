# Phase 4 overview – Testing and QA expansion

## Architecture snapshot

- **Testing pyramid realignment** – focused on filling critical gaps in unit (settings store, word-form state machine), integration (translation hook), and end-to-end (exercise completion, responsive layout) coverage to reinforce the refactored architecture from phases 1–3.
- **HTTP client resilience** – the shared `requestJson` helper now honours explicit fallback policies, enabling deterministic behaviour in production/API-integration modes while still supporting offline MSW-driven development.
- **Automation tooling** – Playwright page objects continue to encapsulate UI details; new scenarios rely on deterministic helpers and precomputed selectors to keep suites stable in CI.

## Goals

1. Replace legacy `.old` specs with modern Vitest/Playwright coverage and remove dead test scaffolding.
2. Introduce guard-rail unit tests around persisted settings, translation fetching, domain selectors, and the word-form reducer to lock the behaviour expected by downstream features.
3. Expand E2E coverage to the full exercise workflow (correct/incorrect flows, completion) plus responsive regression checks for mobile layout controls.
4. Make MSW usage optional by default while preserving offline fallbacks for local mocks.

## Scope

### In scope

- Converting/deleting `.old` specs and replacing them with maintained tests.
- Updating the shared HTTP client to support explicit fallback toggling plus targeted tests for API failure modes.
- Adding new Vitest suites for the settings store and word-form state machine.
- Adding Playwright specs for exercise flows and responsive/mobile controls.
- Documentation updates: roadmap progress, CHANGELOG entry, testing guide refresh, and new ADR capturing the fallback policy.

### Out of scope

- Performance optimisations and bundle analysis (scheduled for Phase 5).
- New exercise types or content edits beyond ensuring existing mocks satisfy the new tests.
- Translation catalogue expansion (Phase 3 already stabilised localisation).

## Dependencies

- **MSW handlers and JSON fixtures** – reused from earlier phases to serve deterministic mocks for exercises/translations.
- **Zustand persistence** – relied upon for verifying settings hydration and reset flows.
- **Playwright page objects** – existing wrappers for navigation, exercises, and helpers.

## Risks & mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Fallback toggling breaks production fetches | High | Default fallback mode mirrors MSW flag, comprehensive unit tests validate all permutations. |
| E2E additions increase flake | Medium | Reused deterministic helpers, limited to core happy-path + one negative path, rely on auto-advance waits centralised in helper. |
| Removing `.old` specs hides missing coverage | Medium | New Vitest/Playwright suites cover previous intent; overview and ADR record rationale for dropped scenarios. |
| Persisted store tests pollute shared state | Low | Tests reset Zustand + localStorage in hooks and guard cleanups. |

## Retired artefacts

- Word-form component `.old` specs replaced with reducer-focused unit tests and Playwright coverage for the full exercise flow.
- Theme toggle `.old` suites replaced with a lightweight Vitest interaction test plus responsive Playwright checks.
- Utility and schema `.old` tests superseded by concise validation suites targeting the new adapters/validators.

