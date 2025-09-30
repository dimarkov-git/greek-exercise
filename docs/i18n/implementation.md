# i18n Implementation Guide

Detailed implementation patterns and examples for the Learn Greek autonomous i18n system.

## 🛠️ Core Implementation

### Translation File Structure

Create a `translations.ts` file co-located with your component:

```typescript
// src/features/exercise-header/ui/translations.ts
import type { TranslationDictionary } from '@/shared/lib/i18n'

export const translations = {
  backArrow: 'exercise.backArrow',
  backToLibrary: 'exercise.backToLibrary',
  autoAdvanceEnabled: 'exercise.autoAdvanceEnabled',
  autoAdvanceDisabled: 'exercise.autoAdvanceDisabled',
  progress: 'exercise.progress',
  progressOf: 'exercise.progressOf'
} as const satisfies TranslationDictionary

export type TranslationKey = keyof typeof translations
```

### Component Usage

```typescript
// src/features/exercise-header/ui/ExerciseHeader.tsx
import { loadTranslations } from '@/shared/lib/i18n'
import { translations } from './translations'

export function ExerciseHeader() {
  const { t, status } = loadTranslations(translations)

  return (
    <header>
      <button>{t(translations.backArrow)} {t(translations.backToLibrary)}</button>
      <div>{t(translations.progress)}</div>
    </header>
  )
}
```

## 📋 Translation Patterns

### Pattern 1: Simple Service Keys

Use when you need translations from the service only:

```typescript
const translations = {
  title: 'page.title',
  subtitle: 'page.subtitle',
  description: 'page.description'
} as const satisfies TranslationDictionary
```

**When to use:**
- Service provides all translations
- No need for offline functionality
- Simplest approach

**Fallback behavior:** Uses the service key itself as fallback.

### Pattern 2: Inline Translations with Service Key

Use when you want offline support with optional service enhancement:

```typescript
const translations = {
  greeting: {
    key: 'app.greeting',
    translations: {
      en: 'Hello and welcome!',
      el: 'Γεια σας και καλώς ήρθατε!',
      ru: 'Здравствуйте и добро пожаловать!'
    }
  },
  subtitle: {
    key: 'app.subtitle',
    translations: {
      en: 'Interactive exercises for learning Greek',
      el: 'Διαδραστικές ασκήσεις για εκμάθηση ελληνικών',
      ru: 'Интерактивные упражнения для изучения греческого'
    }
  }
} as const satisfies TranslationDictionary
```

**When to use:**
- Component needs to work offline
- Service can provide enhanced translations
- Want immediate rendering with inline, update with service

**Fallback behavior:**
1. Service translation (if available)
2. Inline translation in app language
3. Service key as ultimate fallback

### Pattern 3: Pure Inline Translations

Use when you don't need service translations at all:

```typescript
const translations = {
  loadingLabel: {
    translations: {
      en: 'Loading...',
      el: 'Φόρτωση...',
      ru: 'Загрузка...'
    },
    fallback: 'Loading...'
  },
  errorLabel: {
    translations: {
      en: 'Error',
      el: 'Σφάλμα',
      ru: 'Ошибка'
    },
    fallback: 'Error'
  }
} as const satisfies TranslationDictionary
```

**When to use:**
- Simple UI labels
- No service translation needed
- 100% offline functionality
- Fixed translations that won't change

**Fallback behavior:**
1. Inline translation in app language
2. Inline translation in default language (if specified)
3. Fallback value

### Pattern 4: Mixed Approach

Combine patterns as needed:

```typescript
const translations = {
  // Simple service key
  pageTitle: 'home.title',

  // Inline with service
  welcomeMessage: {
    key: 'home.welcome',
    translations: {
      en: 'Welcome to Learn Greek!',
      el: 'Καλώς ήρθατε στο Μάθετε Ελληνικά!',
      ru: 'Добро пожаловать в Learn Greek!'
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
```

## 🏪 State Management Integration

### Settings Store (Zustand)

```typescript
// src/shared/model/settings.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  uiLanguage: SupportedLanguage
  userLanguage: SupportedLanguage  // For exercise hints
  theme: Theme
  setUiLanguage: (language: SupportedLanguage) => void
  setUserLanguage: (language: SupportedLanguage) => void
  setTheme: (theme: Theme) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      uiLanguage: 'en',
      userLanguage: 'en',
      theme: 'light',
      setUiLanguage: (uiLanguage) => set({ uiLanguage }),
      setUserLanguage: (userLanguage) => set({ userLanguage }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'settings-storage',
    }
  )
)
```

### Using Settings in Components

```typescript
import { useSettingsStore } from '@/shared/model'
import { loadTranslations } from '@/shared/lib/i18n'

function LanguageSelector() {
  const { uiLanguage, setUiLanguage } = useSettingsStore()
  const { t } = loadTranslations(translations)

  return (
    <select
      value={uiLanguage}
      onChange={(e) => setUiLanguage(e.target.value as SupportedLanguage)}
    >
      <option value="en">{t(translations.english)}</option>
      <option value="el">{t(translations.greek)}</option>
      <option value="ru">{t(translations.russian)}</option>
    </select>
  )
}
```

## 📡 Translation Data Flow

### How loadTranslations Works

```typescript
// 1. Component calls loadTranslations
const { t, status, missingKeys } = loadTranslations(translations)

// 2. Hook collects service keys from dictionary
//    - String values: used as service keys
//    - Objects with key property: key is used

// 3. TanStack Query fetches translations
//    - POST /api/translations with { language, keys }
//    - Cached for infinite time (staleTime: Infinity)
//    - Retries up to 2 times on failure

// 4. t() function resolves translations using fallback chain
//    - Service translation → Inline translation → Fallback value

// 5. Status and missing keys are tracked
//    - status: 'loading' | 'complete' | 'partial' | 'error'
//    - missingKeys: array of keys without translations
```

### Status Handling

```typescript
function Component() {
  const { t, status, missingKeys, error } = loadTranslations(translations)

  // Handle different states
  if (status === 'loading') {
    return <Skeleton />
  }

  if (status === 'error' && error) {
    console.error('Translation error:', error)
    // Still renders with fallbacks
  }

  if (status === 'partial' && missingKeys.length > 0) {
    console.warn('Missing translations:', missingKeys)
    // Renders with available translations + fallbacks
  }

  // status === 'complete' - all translations loaded
  return <div>{t(translations.title)}</div>
}
```

## 🔄 Fallback System

### Fallback Resolution Chain

```typescript
// Given this entry:
const entry = {
  key: 'app.greeting',
  translations: {
    en: 'Hello',
    el: 'Γεια',
    ru: 'Привет'
  },
  fallback: 'Hi',
  defaultLanguage: 'en'
}

// Resolution for app language 'ru':
function resolveTranslation(entry, appLanguage = 'ru', serviceTranslations) {
  // 1. Try service translation in app language
  if (serviceTranslations['app.greeting']) {
    return serviceTranslations['app.greeting'] // "Привет" from service
  }

  // 2. Try inline translation in app language
  if (entry.translations['ru']) {
    return entry.translations['ru'] // "Привет"
  }

  // 3. Try inline translation in default language
  if (entry.defaultLanguage && entry.translations['en']) {
    return entry.translations['en'] // "Hello"
  }

  // 4. Use fallback
  return entry.fallback // "Hi"
}
```

### Default Language Override

```typescript
const translations = {
  // This entry always prefers Greek, regardless of app language
  footerMessage: {
    translations: {
      el: 'Φτιαγμένο με αγάπη',
      en: 'Made with love'
    },
    defaultLanguage: 'el', // Prefer Greek
    fallback: 'Made with love'
  }
} as const satisfies TranslationDictionary

// When app language is 'en':
t(translations.footerMessage) // Still returns 'Φτιαγμένο με αγάπη' (Greek)
```

## 🧪 Testing Implementation

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ExerciseHeader } from './ExerciseHeader'

describe('ExerciseHeader', () => {
  it('displays translated content with inline fallbacks', () => {
    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <ExerciseHeader />
      </QueryClientProvider>
    )

    // Inline translations work immediately in tests
    expect(screen.getByText(/Back to library/i)).toBeInTheDocument()
  })
})
```

### Testing Status States

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { loadTranslations } from '@/shared/lib/i18n'

const wrapper = ({ children }) => {
  const queryClient = new QueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('loadTranslations', () => {
  it('starts in loading state', () => {
    const { result } = renderHook(
      () => loadTranslations({ title: 'test.title' }),
      { wrapper }
    )

    expect(result.current.status).toBe('loading')
  })

  it('resolves to complete state', async () => {
    const { result } = renderHook(
      () => loadTranslations({ title: 'test.title' }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.status).toBe('complete')
    })
  })
})
```

### Testing with Inline Translations

```typescript
const translations = {
  greeting: {
    translations: {
      en: 'Hello',
      el: 'Γεια'
    },
    fallback: 'Hi'
  }
} as const satisfies TranslationDictionary

describe('Component with inline translations', () => {
  it('works without mocking service', () => {
    const { result } = renderHook(
      () => loadTranslations(translations),
      { wrapper }
    )

    // Inline translations available immediately
    expect(result.current.t(translations.greeting)).toBe('Hello')
  })
})
```

## 📊 Performance Optimization

### Caching Strategy

```typescript
// TanStack Query configuration in loadTranslations:
{
  queryKey: ['translations', 'autonomous', appLanguage, sortedKeys],
  queryFn: () => fetchTranslations(appLanguage, serviceKeys),
  staleTime: Infinity,  // Never consider stale
  retry: 2,             // Retry failed requests twice
  enabled: serviceKeys.length > 0  // Only fetch if keys exist
}
```

### Minimize Service Requests

```typescript
// ❌ Bad: Every translation requests from service
const translations = {
  label1: 'ui.label1',
  label2: 'ui.label2',
  label3: 'ui.label3',
  // ... 50 more labels
}

// ✅ Good: Use inline translations for simple labels
const translations = {
  label1: { translations: { en: 'Label 1', el: 'Ετικέτα 1' } },
  label2: { translations: { en: 'Label 2', el: 'Ετικέτα 2' } },
  label3: { translations: { en: 'Label 3', el: 'Ετικέτα 3' } }
}
```

### Lazy Loading Translations

```typescript
// Component-level code splitting
const ExercisePage = lazy(() => import('@/pages/ExercisePage'))

// Each lazy-loaded component brings its own translations
// No need to preload all translations upfront
```

## 📝 Best Practices

### 1. Co-locate Translations

```
src/features/exercise-header/
├── ui/
│   ├── ExerciseHeader.tsx
│   ├── ExerciseHeader.test.tsx
│   └── translations.ts          ← Co-located
└── index.ts
```

### 2. Use Type-Safe Keys

```typescript
// ✅ Good: Type-safe reference
const { t } = loadTranslations(translations)
return <h1>{t(translations.title)}</h1>

// ❌ Bad: Magic string (no type safety)
return <h1>{t('title')}</h1>
```

### 3. Provide Inline Translations for Critical UI

```typescript
// Critical UI that must work offline
const translations = {
  errorMessage: {
    translations: {
      en: 'An error occurred',
      el: 'Προέκυψε σφάλμα',
      ru: 'Произошла ошибка'
    },
    fallback: 'An error occurred'
  },
  retryButton: {
    translations: {
      en: 'Retry',
      el: 'Δοκιμάστε ξανά',
      ru: 'Повторить'
    },
    fallback: 'Retry'
  }
} as const satisfies TranslationDictionary
```

### 4. Use satisfies for Type Safety

```typescript
// ✅ Good: Type-checked and preserves literal types
const translations = {
  title: 'page.title'
} as const satisfies TranslationDictionary

// ❌ Bad: Loses literal types
const translations: TranslationDictionary = {
  title: 'page.title'
}
```

### 5. Document Translation Structure

```typescript
/**
 * Translations for the Exercise Header component
 *
 * Service keys from 'exercise.*' namespace
 * Inline fallbacks provided for offline use
 */
export const translations = {
  // Navigation
  backArrow: 'exercise.backArrow',
  backToLibrary: 'exercise.backToLibrary',

  // Settings
  autoAdvance: 'exercise.autoAdvance',
  autoAdvanceEnabled: 'exercise.autoAdvanceEnabled'
} as const satisfies TranslationDictionary
```

## 🔗 Related Documentation

- **[i18n Overview](overview.md)** - System architecture and concepts
- **[API Reference](api-reference.md)** - Complete API documentation
- **[Development Guide](../guides/getting-started.md)** - Development setup
- **[Testing Guide](../guides/testing-guide.md)** - Testing strategies