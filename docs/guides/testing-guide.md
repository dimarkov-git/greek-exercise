# Testing guide

Comprehensive testing guidelines for the Learn Greek application using Vitest, Testing Library, and Playwright.

## Testing philosophy

### Testing priorities

Tests > Types > Lint > A11y > Perf > Docs > Style

### Coverage targets

- **Unit test coverage**: 100% with reasonable exclusions
- **Unit test flake rate**: < 1%
- **Exclusions**: Types, barrel exports, trivial index files

### Testing pyramid

1. **Unit tests** (70%): Individual components and functions
2. **Integration tests** (20%): Component interactions and hooks
3. **E2E tests** (10%): Critical user workflows

## Unit and integration testing

### Framework: Vitest + Testing Library

```bash
# Run tests in watch mode
pnpm test

# Run tests once (CI mode)
pnpm test:ci

# Run with coverage
pnpm test:ci --coverage
```

### Testing patterns

#### Component testing

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { MyComponent } from './MyComponent'

test('renders and handles user interaction', async () => {
  const user = userEvent.setup()

  render(<MyComponent />)

  // Use accessible queries (prefer role/label/text)
  const button = screen.getByRole('button', { name: 'Submit' })

  await user.click(button)

  expect(screen.getByText('Success!')).toBeInTheDocument()
})
```

#### Hook testing

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useMyHook } from './useMyHook'

test('returns expected data', async () => {
  const { result } = renderHook(() => useMyHook())

  await waitFor(() => {
    expect(result.current.data).toBeDefined()
  })
})
```

### Query priorities (Testing Library)

1. **Accessible to everyone**: `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`
2. **Semantic queries**: `getByAltText`, `getByTitle`
3. **Test IDs** (last resort): `getByTestId`

### Best practices

#### Test structure

- **One meaningful expect per test**: Keep tests focused and atomic
- **Arrange-Act-Assert**: Clear test structure
- **Descriptive names**: Test names should explain the scenario

#### User interactions

```tsx
// ✅ Good: Use userEvent for realistic interactions
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'text')

// ❌ Avoid: Direct fireEvent calls
fireEvent.click(button) // Less realistic
```

#### Async testing

```tsx
// ✅ Good: Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// ✅ Good: findBy queries are async by default
expect(await screen.findByText('Loaded')).toBeInTheDocument()
```

#### Timers and delays

```tsx
import { vi } from 'vitest'

// Mock timers when testing time-dependent code
vi.useFakeTimers()

// Fast-forward time
vi.advanceTimersByTime(1000)

// Restore real timers
vi.useRealTimers()
```

#### Mocking

```tsx
// Mock API calls with MSW (preferred)
import { setupServer } from 'msw/node'
import { handlers } from '../mocks/handlers'

const server = setupServer(...handlers)

// Mock modules when necessary
vi.mock('../utils/analytics', () => ({
  track: vi.fn()
}))
```

### Common patterns

#### Testing with providers

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}
```

#### Testing error boundaries

```tsx
test('handles errors gracefully', () => {
  const ThrowError = () => {
    throw new Error('Test error')
  }

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})
```

## End-to-end testing

### Framework: Playwright

```bash
# Run E2E tests with UI
pnpm test:e2e

# Run E2E tests headlessly (CI)
pnpm test:e2e:ci

# Install required browsers
npx playwright install
```

> **Note**
> The application automatically switches to hash-based routing when it detects
> a Playwright-driven browser session (`navigator.webdriver`). This keeps the
> generated URLs aligned with the `/#/` patterns that the E2E suite asserts
> against while leaving production builds on the standard history API router.

### Page Object Model (POM)

```typescript
// tests/pages/HomePage.ts
import { Page, expect } from '@playwright/test'

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  async clickStartExercise() {
    await this.page.getByRole('button', { name: 'Start Exercise' }).click()
  }

  async expectWelcomeMessage() {
    await expect(this.page.getByRole('heading', { name: /welcome/i })).toBeVisible()
  }
}
```

### E2E best practices

#### Reliable selectors

```typescript
// ✅ Good: Use role-based selectors
await page.getByRole('button', { name: 'Submit' }).click()
await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com')

// ✅ Good: Use data-testid for complex cases
await page.getByTestId('exercise-progress').click()

// ❌ Avoid: CSS selectors that can break easily
await page.locator('.btn-primary').click()
```

#### Waiting strategies

```typescript
// ✅ Good: Wait for specific states
await expect(page.getByRole('main')).toBeVisible()
await expect(page.getByText('Loading...')).not.toBeVisible()

// ✅ Good: Wait for network requests
await page.waitForResponse(resp => resp.url().includes('/api/exercises'))

// ❌ Avoid: Arbitrary timeouts
await page.waitForTimeout(5000) // Flaky and slow
```

#### Test isolation

```typescript
test.beforeEach(async ({ page }) => {
  // Reset state before each test
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})
```

#### Network mocking

```typescript
// Mock API responses in E2E tests
await page.route('/api/translations/*', async route => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ translations: mockData })
  })
})
```

## Testing configuration

### Vitest setup

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
})
```

### Playwright configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  }
})
```

## Debugging tests

### Vitest debugging

```bash
# Run single test file
pnpm test MyComponent.test.tsx

# Run with debug output
pnpm test --reporter=verbose

# Run with UI (experimental)
pnpm test --ui
```

### Playwright debugging

```bash
# Run in headed mode
pnpm test:e2e --headed

# Debug specific test
npx playwright test --debug login.spec.ts

# Show test trace
npx playwright show-trace test-results/trace.zip
```

### Common debugging techniques

#### Screen debugging

```tsx
import { screen } from '@testing-library/react'

// Log all rendered elements
screen.debug()

// Log specific element
screen.debug(screen.getByRole('button'))
```

#### Playwright debugging

```typescript
// Pause execution for inspection
await page.pause()

// Take screenshot
await page.screenshot({ path: 'debug.png' })

// Console logs
page.on('console', msg => console.log(msg.text()))
```

## Testing checklist

### Before writing tests

- [ ] Understand the component/feature behavior
- [ ] Identify critical user paths
- [ ] Plan test cases (happy path + edge cases)
- [ ] Set up necessary mocks and fixtures

### Writing tests

- [ ] Use descriptive test names
- [ ] Follow Arrange-Act-Assert pattern
- [ ] Use appropriate queries (prefer accessible ones)
- [ ] Test behavior, not implementation
- [ ] Keep tests isolated and independent

### Before committing

- [ ] All tests pass locally
- [ ] Coverage targets are met
- [ ] No console errors or warnings
- [ ] Tests are fast (unit tests < 100ms each)
- [ ] E2E tests cover critical workflows