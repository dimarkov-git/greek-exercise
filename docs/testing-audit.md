# Unit testing audit

| Problem | Recommendation | Priority |
| --- | --- | --- |
| Vitest used the deprecated `happy-dom` environment without a shared setup file, coverage thresholds or MSW integration. | Switch to the jsdom preset, load shared providers via `tests/setupTests.ts`, enable MSW and raise coverage gates to branches ≥80%, functions ≥85%, lines ≥85%, statements ≥85%. | High |
| Test helpers lived in `src/test-utils.tsx`, coupled to `BrowserRouter`, shared a single `QueryClient` and leaked state between tests. | Move helpers to `tests/utils.tsx`, create an isolated `QueryClient` per render with `retry: false`, wrap components in `MemoryRouter`, and expose `render`/`renderHook` utilities that return a `user` instance. | High |
| Zustand state and timers leaked between tests, which caused inconsistent expectations (e.g. theme attribute persisted across cases). | Reset stores and timers after every test in `tests/setupTests.ts`, defaulting the UI locale to English to simplify assertions. | High |
| Legacy tests relied on implementation details (class names, direct store mocks, manual `act`) and skipped accessibility-first queries. | Rewrite tests using Testing Library semantics (`getByRole`, `userEvent`) and rely on the real store/query hooks instead of mocking internals. | High |
| Network-dependent components were tested with manual spies instead of deterministic handlers; flaky failures occurred when remote data was unavailable. | Adopt MSW in unit tests, define request handlers per suite where specific responses are required, and assert loading/success/error states explicitly. | High |
| Multiple `.old` snapshot-based files duplicated coverage while hiding regressions. | Remove `.old` files and replace them with focused behavioural tests colocated with the implementation. | Medium |
| `package.json` scripts and CI entrypoints did not expose coverage or JUnit reports, limiting observability. | Update `test:ci` to `vitest run --reporter=junit --coverage` and simplify `lint` to `biome check --write`. | Medium |
| Documentation for testing conventions was missing. | Add `tests/README.md` describing utilities, patterns and required commands. | Medium |

## Migration plan

1. **Infrastructure refresh**  
   *Diff highlights*: `vite.config.ts`, `package.json`, `tsconfig.app.json`, `tests/setupTests.ts`, `tests/utils.tsx`.  
   *Rationale*: align Vitest with jsdom, wire MSW, isolate Query Client instances, and guarantee deterministic state between tests.  
   *Commands*: `pnpm install` (if dependencies change), `pnpm test`, `pnpm test:ci`, `pnpm lint`.

2. **Core domain utilities & schemas**  
   *Diff highlights*: `src/utils/exercises.test.ts`, `src/schemas/exercises.test.ts`.  
   *Rationale*: cover text normalisation, navigation helpers and schema guards with deterministic cases (mocking `Math.random` where required).  
   *Commands*: `pnpm test -- src/utils/exercises.test.ts`, `pnpm test -- src/schemas/exercises.test.ts`.

3. **State management and UI primitives**  
   *Diff highlights*: `src/stores/settings.test.ts`, `src/components/ui/ThemeToggle.test.tsx`.  
   *Rationale*: validate Zustand behaviour plus the ThemeToggle component via MSW-backed translations and accessible selectors.  
   *Commands*: `pnpm test -- src/stores/settings.test.ts src/components/ui/ThemeToggle.test.tsx`.

4. **Word form exercise experience**  
   *Diff highlights*: tests across `src/components/exercises/word-form/**/*.{test.ts,test.tsx}`.  
   *Rationale*: verify input handling, feedback, completion flows and hooks (`useAnswerHandler`, `useWordFormExercise`) using AAA structure and fake timers for auto-advance/correction.  
   *Commands*: `pnpm test -- src/components/exercises/word-form`.

## Scenario coverage

The rewritten unit suite now exercises:

- **Loading/success/failure**: MSW handlers simulate translation failures (`ThemeToggle`), while success paths rely on default fixtures.
- **Form validation**: `WordFormInput` tests cover submission, disabled states, and correction prompts using `userEvent`.
- **Language switching**: store tests and ThemeToggle fallback checks ensure UI language defaults to English while respecting translations.
- **Global state**: Zustand store tests validate setters, reset behaviour and DOM synchronisation.
- **Navigation and flow control**: Word form hooks cover auto-advance timers, correction requirements, and handler wiring to the renderer.

Run `pnpm test:ci` three times consecutively to confirm stability; the deterministic timers and MSW responses eliminate previously observed flakiness.
