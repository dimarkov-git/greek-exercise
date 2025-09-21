# Testing guidelines

This project uses **Vitest**, **Testing Library**, **MSW**, and custom utilities defined in this folder. Keep the following rules in mind when writing or updating tests.

## Tooling

- `tests/setupTests.ts` bootstraps jsdom, attaches MSW and resets Zustand stores, timers and mocks after each test.
- `tests/utils.tsx` exports `render`, `renderHook`, Testing Library re-exports and `userEvent`. These helpers wrap the tree in:
  - a fresh `QueryClientProvider` (`retry: false`, `cacheTime: 0`),
  - a `MemoryRouter` (configure via `route` or `router.initialEntries`).
- Prefer `render`/`renderHook` from this folder rather than importing directly from Testing Library.

## Writing tests

- Follow the Arrange–Act–Assert (or Given–When–Then) structure.
- Query the DOM with accessible selectors (`getByRole`, `getByLabelText`, `findByRole`, etc.). Avoid relying on class names or DOM structure.
- Use `userEvent` for interactions. `fireEvent` should be reserved for rare cases that `userEvent` cannot cover.
- When asserting asynchronous behaviour, prefer `await screen.findBy…` or `await waitFor(...)` instead of polling loops.
- For timers (auto-advance, delays) call `vi.useFakeTimers()` and `vi.advanceTimersByTime(ms)` in the test; cleanup restores real timers automatically.
- Define MSW handlers inside the suite or test when specific responses (errors, edge cases) are required. Always reset handlers via `server.resetHandlers()` (the setup file already does this after each test).
- Do not mock Zustand stores or React Query by default. Use the real store/query client and reset state between tests.
- Keep tests colocated with the module under test using the `*.test.ts(x)` naming convention.

## Commands

- Run the full suite locally: `pnpm test`
- Run CI-equivalent checks: `pnpm test:ci`
- Format & lint: `pnpm lint`
- Execute a subset: `pnpm test -- path/to/file.test.tsx`
