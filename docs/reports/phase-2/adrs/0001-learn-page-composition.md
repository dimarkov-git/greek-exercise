# ADR 0001: Learn page composition refactor

- **Status**: Accepted
- **Date**: 2025-09-22

## Context
Biome enforces a strict 50-line limit per function and flags excessive complexity. `src/pages/LearnPage.tsx` still contained a monolithic render tree that mixed navigation handlers, layout side effects, stats rendering, and conditional views. The component also duplicated logic for unsupported exercise types and depended on the removed `@/domain/exercises` barrel, causing TypeScript failures. To unlock the rest of Phase 2 (exercise domain adoption, tooling, documentation), the Learn page needed to be decomposed into smaller units without altering the user experience.

## Decision
- Introduce helper components (`UnsupportedExerciseNotice`, `LearnPageContent`, `LearnPageHero`, `ExerciseStats`, `LearnPageActions`, `ExerciseTags`) within `LearnPage.tsx` to keep each function below Biome's threshold while preserving co-location for readability.
- Add a `TranslateFn` alias and `WordFormExercise` typing so helper components receive explicit props rather than closing over outer scope state.
- Move unsupported-type handling into a dedicated notice component that reuses shared translations and layout styling with the Exercise page.
- Compose the main content from a hero (header + stats), action bar (view toggle + CTA), tags list, and the selected data view (`TableView`/`JsonView`).
- Update dependants (hooks, mocks, tests) to import from explicit domain entry points (`adapters`, `selectors`, `types`) instead of the removed barrel file.

## Alternatives considered
1. **Split into separate files** (e.g., `LearnPage/Header.tsx`, `LearnPage/Actions.tsx`). Rejected to avoid premature directory churn during an ongoing refactor and to keep related context local until the module stabilises.
2. **Disable Biome's rule** for the Learn page. Rejected because the guardrail is intentional across the codebase and enforcing it here improves long-term maintainability.
3. **Refactor into a hook-driven container** that returns render fragments. Deferred; current scope only needed presentational decomposition, and additional hooks would add indirection without new behaviour.

## Consequences
- The Learn page now satisfies Biome's complexity checks and is easier to reason about, with translation/type dependencies declared explicitly.
- Shared UI patterns (unsupported exercise notice, stats chips, view toggle wiring) can be reused in future features or extracted if they appear elsewhere.
- The absence of the domain barrel encourages granular imports, reducing accidental cross-module coupling but requiring documentation updates to guide contributors.
- Slight increase in component count raises the need for follow-up unit tests to cover new helper boundaries; existing Playwright + axe checks mitigate immediate regressions.
