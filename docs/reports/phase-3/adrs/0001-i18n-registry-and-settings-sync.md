# ADR 0001: Generated translation registry and settings synchronisation hook

- **Status:** Accepted
- **Date:** 2025-02-14

## Context
Phase 2 left the application with array-based translation requests, randomised filler strings for missing keys, and a Zustand store mutating `document.documentElement`. This hindered type safety, obscured coverage gaps, and blocked SSR because the store touched the DOM during initialisation. We needed a deterministic, typed translation pipeline and a settings architecture that defers DOM mutations to the browser.

## Decision
- Generate a single translation registry from English source strings plus manual fallbacks. The registry emits `translationRegistry`, `TranslationRegistryKey`, and key arrays consumed by dictionary helpers.
- Introduce `createTranslationDictionary` and per-feature dictionary modules so components receive typed translator functions instead of enumerating raw key lists.
- Refactor `useTranslations` to request keys per dictionary, normalise missing results, expose status codes, and honour a `missingPolicy` option.
- Move theme and language DOM mutations into a `useSettingsSync` hook that runs in `useEffect`, guarding against undefined `document` for SSR/test environments.

## Alternatives considered
- **Static JSON imports per component:** rejected because it duplicated key definitions and bloated bundles; the registry centralises de-duplication.
- **Keeping DOM mutations inside the Zustand store:** rejected due to SSR incompatibility and untestable side effects.
- **Runtime schema validation of translation responses only:** insufficient for compile-time safety; generating a registry provides both build-time and runtime guarantees.

## Consequences
- Components import dictionaries rather than arrays, gaining autocomplete, compile-time errors for missing keys, and consistent fallbacks.
- Translation fetches share memoised cache keys and missing-key lists, enabling diagnostics and negative tests.
- Settings synchronisation becomes a declarative effect, simplifying testing (happy-dom) and preventing server runtime crashes.
- Adding new translations requires re-running the generator, but CI (`pnpm validate`) enforces fresh artefacts, and documentation now captures the workflow.
