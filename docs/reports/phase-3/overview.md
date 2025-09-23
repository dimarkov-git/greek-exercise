# Phase 3 overview

## Current architecture snapshot
- A generated translation registry (`scripts/generate-translation-registry.mjs`) now normalises all keys from English source strings and manual fallbacks into `src/i18n/generated/translation-registry.ts`, providing compile-time key safety.
- Feature-oriented translation dictionaries live under `src/i18n/dictionaries/` and are instantiated through `createTranslationDictionary`, giving components typed translators and memoised request payloads.
- `useTranslations` coordinates fetching, missing-key accounting, and deterministic fallback selection while exposing explicit status codes (`loading`, `error`, `complete`, `partial`, `missing`).
- Settings persistence remains in a lightweight Zustand store, but DOM mutations have been moved into the new `useSettingsSync` hook for SSR safety and easier testing.
- Supporting utilities (`TranslationStatus`, `TranslationRequest`, `TranslationMissingPolicy`) align the i18n workflow with strict TypeScript/React Query usage.

## Goals
1. Remove ad-hoc translation arrays and replace them with typed dictionaries so components consume translators instead of raw key lists.
2. Provide deterministic missing-key handling that favours manual fallbacks or key echoing (opt-in) and surfaces coverage gaps to developers.
3. Decouple DOM side effects from the Zustand store, relocating theme and language attribute management into React effects guarded for non-browser runtimes.
4. Expand unit coverage with negative scenarios for translations and settings synchronisation.
5. Document the updated i18n pipeline, registry generation, and settings synchronisation approach.

## Deliverables & tasks
- Implemented generated translation registry, dictionary utilities, and per-feature dictionary modules.
- Refactored pages, components, and hooks to consume typed translators and report translation status codes.
- Extracted DOM attribute mutations into `useSettingsSync`, keeping the persisted store browser-agnostic.
- Added Vitest suites for `useTranslations` (error, partial, missing, policy variants) and `useSettingsSync` (DOM updates, SSR guard).
- Authored Phase 3 overview, ADR, execution report, and linked documentation indices.

## In scope
- Internationalisation pipeline refactor (registry generation, typed dictionaries, deterministic fallbacks).
- Settings synchronisation via hooks with SSR-safe guards.
- Unit tests, docs, and ADRs covering the new architecture.

## Out of scope
- New exercise types, gameplay features, or additional UI redesigns beyond translation integration.
- API contract changes outside of translation key lookup payloads.
- Performance and DX improvements earmarked for later roadmap phases.

## Dependencies
- React Query for translation fetching and cache management.
- Generated registry artefacts in `src/i18n/generated/translation-registry.ts`.
- Zustand persist middleware for settings storage.
- Vitest + Testing Library for unit coverage.

## Risks & mitigations
- **Key drift**: New translations must run the generator; CI scripts (`pnpm validate`) enforce TypeScript and lint checks so stale registries surface quickly.
- **SSR attribute mismatches**: `useSettingsSync` guards against `document` access when unavailable and defaults to light/Greek until hydration.
- **Translation coverage gaps**: The registry + status reporting surfaces missing keys, and tests exercise partial/missing paths to prevent silent regressions.
- **Increased bundle surface**: Dictionaries are tree-shakeable and imported per feature, keeping the registry centralised without inflating route bundles.

## Effort estimate
- **Size**: Medium.
- **Estimate**: 10–14 hours covering registry generation, hook refactors, settings synchronisation, tests, and documentation/reporting updates.
