# i18n API Reference

Complete API documentation for the Learn Greek autonomous internationalization system.

## 🎛️ Core APIs

### `loadTranslations(dictionary, options?)`

Main hook for loading and using translations in components.

```typescript
function loadTranslations<T extends TranslationDictionary>(
  dictionary: T,
  options?: LoadTranslationsOptions
): LoadTranslationsResult<T>
```

**Parameters:**
- `dictionary` - Translation dictionary object (required)
- `options.language?` - Override app language (optional)

**Returns:** `LoadTranslationsResult<T>` object with:
- `t` - Translation function
- `language` - Current language
- `isLoading` - Loading state
- `error` - Error object (if any)
- `missingKeys` - Array of keys without translations
- `status` - Translation status

**Example:**
```typescript
const translations = {
  title: 'page.title',
  greeting: {
    key: 'page.greeting',
    translations: {
      en: 'Hello',
      el: 'Γεια'
    }
  }
} as const satisfies TranslationDictionary

function Component() {
  const { t, status, missingKeys } = loadTranslations(translations)

  if (status === 'loading') return <Skeleton />

  return (
    <div>
      <h1>{t(translations.title)}</h1>
      <p>{t(translations.greeting)}</p>
    </div>
  )
}
```

**Behavior:**
- Collects service keys from dictionary entries
- Fetches translations via TanStack Query
- Caches with infinite stale time
- Returns translations with smart fallback chain
- Tracks loading state and missing keys

---

### `t(entry)`

Translation function returned by `loadTranslations()`.

```typescript
type TranslationFunction = (
  entry: string | TranslationEntry
) => string
```

**Parameters:**
- `entry` - String key or TranslationEntry object

**Returns:** Translated string

**Resolution Chain:**
1. Service translation in app language
2. Inline translation in app language
3. Inline translation in default language
4. Fallback value or key

**Example:**
```typescript
const { t } = loadTranslations(translations)

// Simple key
t(translations.title) // → "Page Title"

// Full entry
t(translations.greeting) // → "Hello" (en) or "Γεια" (el)

// With fallback
t(translations.customLabel) // → Falls back through chain
```

---

## 📋 Type Definitions

### `TranslationDictionary`

Record type for translation dictionaries.

```typescript
type TranslationDictionary = Record<string, string | TranslationEntry>
```

**Usage:**
```typescript
const translations = {
  // String: service key
  title: 'page.title',

  // TranslationEntry: full entry
  subtitle: {
    key: 'page.subtitle',
    translations: {
      en: 'Subtitle',
      el: 'Υπότιτλος'
    }
  }
} as const satisfies TranslationDictionary
```

---

### `TranslationEntry`

Full translation entry with optional service key and inline translations.

```typescript
interface TranslationEntry {
  /**
   * Key for service request (optional)
   * If not provided, no service request is made
   */
  key?: string

  /**
   * Inline fallback translations for different languages
   */
  translations?: Partial<Record<SupportedLanguage, string>>

  /**
   * Ultimate fallback value when no translation is found
   * If not provided, uses key or dictionary key as fallback
   */
  fallback?: string

  /**
   * Default language to use if app language not found
   * Overrides app language for this specific entry
   */
  defaultLanguage?: SupportedLanguage
}
```

**Examples:**

```typescript
// Service key only
{ key: 'app.title' }

// Inline translations only
{
  translations: {
    en: 'Hello',
    el: 'Γεια'
  },
  fallback: 'Hi'
}

// Service + inline + default language
{
  key: 'app.greeting',
  translations: {
    en: 'Hello',
    el: 'Γεια σας'
  },
  fallback: 'Hi',
  defaultLanguage: 'en'
}

// Default language override
{
  translations: {
    el: 'Φτιαγμένο με αγάπη',
    en: 'Made with love'
  },
  defaultLanguage: 'el' // Always prefer Greek
}
```

---

### `LoadTranslationsOptions`

Options for `loadTranslations()` hook.

```typescript
interface LoadTranslationsOptions {
  /**
   * Override app language
   * Default: current uiLanguage from settings store
   */
  readonly language?: SupportedLanguage
}
```

**Example:**
```typescript
// Use current app language (default)
const { t } = loadTranslations(translations)

// Override to specific language
const { t } = loadTranslations(translations, { language: 'el' })
```

---

### `LoadTranslationsResult<T>`

Result object returned by `loadTranslations()`.

```typescript
interface LoadTranslationsResult<T extends TranslationDictionary> {
  /**
   * Translation function
   * Accepts dictionary entries and returns translated strings
   */
  readonly t: (entry: T[keyof T]) => string

  /**
   * Current language being used
   */
  readonly language: SupportedLanguage

  /**
   * Loading state
   * true while fetching translations from service
   */
  readonly isLoading: boolean

  /**
   * Error object if translation fetch failed
   */
  readonly error: Error | null

  /**
   * Array of dictionary keys that have no translation
   * Useful for debugging missing translations
   */
  readonly missingKeys: readonly (keyof T)[]

  /**
   * Translation status
   * - 'loading': Fetching translations
   * - 'complete': All translations loaded
   * - 'partial': Some translations missing
   * - 'error': Fetch failed
   */
  readonly status: TranslationStatus
}
```

**Example:**
```typescript
const {
  t,           // Translation function
  language,    // 'en' | 'el' | 'ru'
  isLoading,   // boolean
  error,       // Error | null
  missingKeys, // readonly string[]
  status       // 'loading' | 'complete' | 'partial' | 'error'
} = loadTranslations(translations)

// Handle different states
if (isLoading) return <Skeleton />
if (error) console.error('Translation error:', error)
if (status === 'partial') console.warn('Missing:', missingKeys)

return <div>{t(translations.title)}</div>
```

---

### `SupportedLanguage`

Supported language codes.

```typescript
type SupportedLanguage = 'el' | 'en' | 'ru'
```

---

### `TranslationStatus`

Translation loading status.

```typescript
type TranslationStatus = 'loading' | 'complete' | 'partial' | 'error'
```

**Status Descriptions:**
- `'loading'` - Initial state, fetching translations
- `'complete'` - All service keys have translations
- `'partial'` - Some service keys missing translations (uses fallbacks)
- `'error'` - Service request failed (uses fallbacks)

---

## 🏪 Store APIs

### `useSettingsStore()`

Zustand store for application settings including language preferences.

```typescript
interface SettingsStore {
  // State
  uiLanguage: SupportedLanguage
  userLanguage: SupportedLanguage
  theme: 'light' | 'dark'

  // Actions
  setUiLanguage: (language: SupportedLanguage) => void
  setUserLanguage: (language: SupportedLanguage) => void
  setTheme: (theme: 'light' | 'dark') => void
}

const useSettingsStore: UseBoundStore<StoreApi<SettingsStore>>
```

**Example:**
```typescript
import { useSettingsStore } from '@/shared/model'

function LanguageSelector() {
  const { uiLanguage, setUiLanguage } = useSettingsStore()

  return (
    <select
      value={uiLanguage}
      onChange={(e) => setUiLanguage(e.target.value as SupportedLanguage)}
    >
      <option value="en">English</option>
      <option value="el">Ελληνικά</option>
      <option value="ru">Русский</option>
    </select>
  )
}
```

**Persistence:**
- Automatically persists to localStorage
- Storage key: `'settings-storage'`
- Hydrates on app initialization

**State Properties:**
- `uiLanguage` - Interface language (affects UI translations)
- `userLanguage` - User's native language (affects exercise hints)
- `theme` - Color theme preference

---

## 🧪 Testing Utilities

### Test Wrapper Setup

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'

function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
        cacheTime: 0  // Disable caching in tests
      }
    }
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// Usage
test('component renders translations', () => {
  const wrapper = createTestWrapper()

  render(<Component />, { wrapper })

  // Assertions...
})
```

---

### Testing with Inline Translations

```typescript
import { renderHook } from '@testing-library/react'
import { loadTranslations } from '@/shared/lib/i18n'

const translations = {
  greeting: {
    translations: {
      en: 'Hello',
      el: 'Γεια'
    }
  }
} as const satisfies TranslationDictionary

test('inline translations work without service', () => {
  const { result } = renderHook(
    () => loadTranslations(translations),
    { wrapper: createTestWrapper() }
  )

  // Inline translations available immediately
  expect(result.current.t(translations.greeting)).toBe('Hello')
  expect(result.current.status).toBe('complete')
})
```

---

### Testing Status States

```typescript
import { renderHook, waitFor } from '@testing-library/react'

test('loading state transitions', async () => {
  const translations = { title: 'test.title' }
  const { result } = renderHook(
    () => loadTranslations(translations),
    { wrapper: createTestWrapper() }
  )

  // Initially loading
  expect(result.current.status).toBe('loading')
  expect(result.current.isLoading).toBe(true)

  // Wait for completion
  await waitFor(() => {
    expect(result.current.status).toBe('complete')
    expect(result.current.isLoading).toBe(false)
  })
})
```

---

### Mocking Translation Service

```typescript
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const translationHandlers = [
  http.post('/api/translations', async ({ request }) => {
    const { language, keys } = await request.json()

    const translations: Record<string, string> = {}
    for (const key of keys) {
      translations[key] = `${key} in ${language}`
    }

    return HttpResponse.json({ translations })
  })
]

const server = setupServer(...translationHandlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## 📊 Performance APIs

### Caching Configuration

The system uses TanStack Query with the following configuration:

```typescript
{
  queryKey: [
    'translations',
    'autonomous',
    appLanguage,
    sortedKeys.join(',')
  ],
  queryFn: () => fetchTranslations(appLanguage, serviceKeys),
  staleTime: Infinity,  // Never mark as stale
  retry: 2,             // Retry failed requests twice
  enabled: serviceKeys.length > 0  // Only fetch if needed
}
```

**Cache Characteristics:**
- **Infinite stale time**: Translations never refetch automatically
- **Keyed by language + keys**: Separate cache per language and key combination
- **Retry policy**: Retries failed requests up to 2 times
- **Conditional fetching**: Only fetches when service keys exist

---

### Memory Usage

```typescript
// Typical memory usage per component:
const memoryProfile = {
  translationDictionary: '~1KB',   // Dictionary object
  queryCache: '~2KB',              // Cached translations
  hookOverhead: '~500B',           // React hook state
  totalPerComponent: '~3.5KB'      // Total memory footprint
}
```

---

### Bundle Impact

```typescript
// Production bundle sizes:
const bundleImpact = {
  loadTranslationsHook: '~3KB',      // Main hook implementation
  typeDefinitions: '~1KB',           // TypeScript types
  translationFiles: '~0.5KB each',  // Per-component translations
  totalRuntime: '~4KB + 0.5KB per component'
}
```

---

## 🔧 Configuration

### Environment Variables

No environment variables required. All configuration is runtime-based.

---

### Build Configuration

No build-time configuration needed. The system works without code generation.

---

### Runtime Configuration

Configure via settings store:

```typescript
import { useSettingsStore } from '@/shared/model'

// Set default language
useSettingsStore.getState().setUiLanguage('en')

// Set user language for hints
useSettingsStore.getState().setUserLanguage('ru')
```

---

## 🔗 Related Documentation

- **[i18n Overview](overview.md)** - System concepts and architecture
- **[Implementation Guide](implementation.md)** - Usage patterns and examples
- **[Technical Overview](../technical/overview.md)** - System integration

---

## 📚 Examples

### Complete Component Example

```typescript
import { loadTranslations } from '@/shared/lib/i18n'
import type { TranslationDictionary } from '@/shared/lib/i18n'

const translations = {
  // Service keys
  title: 'home.title',
  description: 'home.description',

  // Inline with service
  welcomeMessage: {
    key: 'home.welcome',
    translations: {
      en: 'Welcome!',
      el: 'Καλώς ήρθατε!',
      ru: 'Добро пожаловать!'
    }
  },

  // Pure inline
  loadingText: {
    translations: {
      en: 'Loading...',
      el: 'Φόρτωση...',
      ru: 'Загрузка...'
    },
    fallback: 'Loading...'
  }
} as const satisfies TranslationDictionary

export function HomePage() {
  const { t, status, missingKeys } = loadTranslations(translations)

  // Show loading state
  if (status === 'loading') {
    return <div>{t(translations.loadingText)}</div>
  }

  // Log missing translations in development
  if (process.env.NODE_ENV === 'development' && missingKeys.length > 0) {
    console.warn('Missing translations:', missingKeys)
  }

  return (
    <div>
      <h1>{t(translations.title)}</h1>
      <p>{t(translations.description)}</p>
      <p>{t(translations.welcomeMessage)}</p>
    </div>
  )
}
```

---

### Language Switcher Example

```typescript
import { useSettingsStore } from '@/shared/model'
import { loadTranslations } from '@/shared/lib/i18n'

const translations = {
  selectLanguage: {
    translations: {
      en: 'Select Language',
      el: 'Επιλογή Γλώσσας',
      ru: 'Выберите язык'
    }
  },
  english: { translations: { en: 'English', el: 'Αγγλικά', ru: 'Английский' } },
  greek: { translations: { en: 'Greek', el: 'Ελληνικά', ru: 'Греческий' } },
  russian: { translations: { en: 'Russian', el: 'Ρωσικά', ru: 'Русский' } }
} as const satisfies TranslationDictionary

export function LanguageSwitcher() {
  const { uiLanguage, setUiLanguage } = useSettingsStore()
  const { t } = loadTranslations(translations)

  return (
    <div>
      <label>{t(translations.selectLanguage)}</label>
      <select
        value={uiLanguage}
        onChange={(e) => setUiLanguage(e.target.value as SupportedLanguage)}
      >
        <option value="en">{t(translations.english)}</option>
        <option value="el">{t(translations.greek)}</option>
        <option value="ru">{t(translations.russian)}</option>
      </select>
    </div>
  )
}
```