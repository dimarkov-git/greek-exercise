# ADR 0001: HTTP fallback policy and MSW decoupling

## Status

Accepted – Phase 4

## Context

The shared `requestJson` helper previously always attempted to resolve a local fallback payload via `resolveFallbackResponse` whenever a network failure occurred. While useful for offline development, this made it impossible to hard-disable fallbacks for real API testing, and hid production issues when MSW was disabled. Phase 4 requires testing the matrix of MSW on/off with fallback on/off and guarantees that API failures surface correctly.

## Decision

- Introduce an explicit `enableHttpFallback` environment flag (`VITE_ENABLE_HTTP_FALLBACK`) that defaults to mirroring the MSW flag but can be toggled independently.
- Extend `requestJson` with a `fallback` option that resolves to the environment default; when disabled the client rethrows the original error without consulting `resolveFallbackResponse`.
- Add unit tests covering the four combinations of MSW/fallback state to document the intended behaviour and to prevent regressions.

## Alternatives considered

1. **Per-request opt-in only** – rejected because it would require touching every call site and encourage inconsistent defaults across the codebase.
2. **Rely solely on MSW state** – rejected because real API testing environments may require MSW off but still need the JSON fixtures for offline demos.
3. **Global try/catch suppression** – rejected because swallowing errors without context makes debugging harder and would complicate test expectations.

## Consequences

- Production and integration environments can disable fallbacks to surface genuine HTTP failures.
- Local development continues to benefit from automatic fallbacks when MSW is enabled, avoiding accidental offline states.
- The explicit tests guard against regressions in fallback/ MSW interactions and document expected outcomes for future contributors.
