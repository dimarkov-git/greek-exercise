# i18n Implementation Guide

Detailed implementation patterns and examples for the Learn Greek i18n system.

## 🛠️ Core Implementation

### Translation Registry Generation

The system automatically generates TypeScript types from English source strings:

```typescript
// Generated file: src/i18n/generated/translation-registry.ts
export const translationRegistry = {
  'app.title': { fallback: 'Learn Greek' },
  'navigation.home': { fallback: 'Home' },
  'buttons.start': { fallback: 'Start' },
  // ... more keys
}

export type TranslationRegistryKey = keyof typeof translationRegistry
```

**Generation script**: `scripts/generate-translation-registry.mjs`
```bash
# Run after adding new translation keys
pnpm generate:i18n
```

### Feature Dictionary Pattern

Create scoped dictionaries for better organization:

```typescript
// src/i18n/dictionaries/navigation.ts
import { createTranslationDictionary } from '@/i18n/dictionary'

export const navigationDictionary = createTranslationDictionary([
  'navigation.home',
  'navigation.library',
  'navigation.exercises',
  'navigation.builder'
] as const)

// Usage in component
function Navigation() {
  const t = navigationDictionary.useTranslator()
  return (
    <nav>
      <Link to="/">{t('navigation.home')}</Link>
      <Link to="/library">{t('navigation.library')}</Link>
    </nav>
  )
}
```

### Global Dictionary Usage

For general-purpose translations:

```typescript
import { useDictionary } from '@/i18n/dictionary'

function Component() {
  const t = useDictionary()
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <button>{t('buttons.start')}</button>
    </div>
  )
}
```

## 🏪 State Management Integration

### Settings Store (Zustand)

```typescript
// src/stores/settings.ts
interface SettingsStore {
  uiLanguage: Language
  userLanguage: Language  // For exercise hints
  theme: Theme
  setUiLanguage: (language: Language) => void
  setUserLanguage: (language: Language) => void
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

### SSR-Safe Synchronization

```typescript
// src/hooks/useSettingsSync.ts
export function useSettingsSync() {
  const { theme, uiLanguage } = useSettingsStore()

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.setAttribute('lang', uiLanguage)
    }
  }, [theme, uiLanguage])
}
```

## 📡 Translation Data Flow

### TanStack Query Integration

```typescript
// Translation query configuration
export const translationQueries = {
  byLanguage: (language: Language) => ({
    queryKey: ['translations', language] as const,
    queryFn: () => fetchTranslations(language),
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: Infinity,
  }),
}

// Hook implementation
function useTranslations(keys: TranslationRegistryKey[]) {
  const { uiLanguage } = useSettingsStore()

  return useQuery({
    ...translationQueries.byLanguage(uiLanguage),
    select: (data) => filterTranslations(data, keys),
  })
}
```

### MSW Mock Integration

```typescript
// src/mocks/handlers/translations.ts
import { http, HttpResponse } from 'msw'

export const translationHandlers = [
  http.get('/api/translations/:language', ({ params }) => {
    const { language } = params
    const translations = getTranslationsForLanguage(language as Language)

    return HttpResponse.json(translations, {
      // Simulate network delay
      delay: Math.random() * 200 + 100,
    })
  })
]
```

## 🔄 Fallback System

### Policy-Based Fallback Resolution

```typescript
type FallbackPolicy = 'echo' | 'fallback' | 'empty'

function resolveTranslation(
  key: TranslationRegistryKey,
  translations: Record<string, string>,
  policy: FallbackPolicy = 'fallback'
): string {
  // 1. Try direct translation
  if (translations[key]) {
    return translations[key]
  }

  // 2. Apply fallback policy
  switch (policy) {
    case 'echo':
      return key  // Development: show raw key
    case 'fallback':
      return translationRegistry[key]?.fallback || key
    case 'empty':
      return ''   // Production: empty string
  }
}
```

### Status Reporting

```typescript
interface TranslationResult {
  translations: Record<string, string>
  status: 'success' | 'partial' | 'loading' | 'error'
  missingKeys?: string[]
}

// Usage with status handling
function Component() {
  const { translations, status, missingKeys } = useTranslations([
    'app.title',
    'navigation.home'
  ])

  if (status === 'loading') return <LoadingSpinner />
  if (status === 'error') return <ErrorBoundary />
  if (status === 'partial') {
    console.warn('Missing translation keys:', missingKeys)
  }

  return <h1>{translations['app.title']}</h1>
}
```

## 📝 Translation Key Conventions

### Hierarchical Organization

```typescript
// Recommended key structure
const keyPatterns = {
  // App-level
  'app.title': 'Learn Greek',
  'app.subtitle': 'Interactive Greek learning',

  // Navigation
  'navigation.home': 'Home',
  'navigation.exercises': 'Exercises',

  // UI Actions
  'buttons.start': 'Start',
  'buttons.cancel': 'Cancel',
  'buttons.save': 'Save',

  // Messages
  'messages.success': 'Success!',
  'messages.error': 'Error occurred',

  // Forms
  'forms.required': 'Required',
  'forms.invalid': 'Invalid input',

  // Exercise-specific
  'exercise.correct': 'Correct!',
  'exercise.incorrect': 'Try again',
  'exercise.hint': 'Show hint',
}
```

### Feature Scoping

```typescript
// Group related keys by feature
export const exerciseDictionary = createTranslationDictionary([
  'exercise.correct',
  'exercise.incorrect',
  'exercise.hint',
  'exercise.progress',
  'exercise.completion',
] as const)

export const formDictionary = createTranslationDictionary([
  'forms.required',
  'forms.invalid',
  'forms.submit',
  'forms.cancel',
] as const)
```

## 🧪 Testing Implementation

### Test Setup

```typescript
// src/test-setup.ts
import { beforeEach } from 'vitest'
import { useSettingsStore } from '@/stores/settings'

beforeEach(() => {
  // Reset store state
  useSettingsStore.getState().setUiLanguage('en')
  useSettingsStore.getState().setUserLanguage('en')
  useSettingsStore.getState().setTheme('light')
})
```

### Component Testing

```typescript
import { render, screen } from '@testing-library/react'
import { TestWrapper } from '@/test-utils'

test('displays translated content', async () => {
  render(
    <TestWrapper>
      <Component />
    </TestWrapper>
  )

  // Wait for translations to load
  await screen.findByText('Learn Greek')
  expect(screen.getByText('Learn Greek')).toBeInTheDocument()
})
```

### MSW Test Handlers

```typescript
// tests/mocks/translation-handlers.ts
export const testTranslationHandlers = [
  http.get('/api/translations/en', () => {
    return HttpResponse.json({
      'app.title': 'Learn Greek',
      'navigation.home': 'Home',
    })
  }),

  http.get('/api/translations/el', () => {
    return HttpResponse.json({
      'app.title': 'Μάθε Ελληνικά',
      'navigation.home': 'Αρχική',
    })
  }),
]
```

## 📊 Performance Optimization

### Bundle Impact
- **Translation files**: Not bundled, loaded via HTTP
- **Registry size**: ~15KB (generated types + fallbacks)
- **Runtime cost**: Minimal, cached by TanStack Query

### Loading Strategy
```typescript
// Preload translations for critical languages
function App() {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Preload English translations
    queryClient.prefetchQuery(translationQueries.byLanguage('en'))
  }, [queryClient])

  return <Router />
}
```

## 🔗 Related Documentation

- **[i18n Overview](overview.md)** - System architecture and concepts
- **[API Reference](api-reference.md)** - Complete API documentation
- **[Development Guide](../guides/getting-started.md)** - Development setup