# i18n API Reference

Complete API documentation for the Learn Greek internationalization system.

## 🎛️ Core APIs

### `useDictionary()`

Global translation hook for general-purpose translations.

```typescript
function useDictionary(): (key: TranslationRegistryKey) => string

// Usage
const Component = () => {
  const t = useDictionary()
  return <h1>{t('app.title')}</h1>
}
```

**Returns**: Translation function that accepts any registry key.

### `createTranslationDictionary(keys)`

Creates a scoped translation dictionary for specific features.

```typescript
function createTranslationDictionary<T extends readonly TranslationRegistryKey[]>(
  keys: T
): TranslationDictionary<T>

// Usage
const navigationDictionary = createTranslationDictionary([
  'navigation.home',
  'navigation.library'
] as const)
```

**Parameters**:
- `keys` - Array of translation keys (readonly for type safety)

**Returns**: Dictionary object with `useTranslator()` method.

### `TranslationDictionary.useTranslator()`

Hook for using a scoped translation dictionary.

```typescript
interface TranslationDictionary<T> {
  useTranslator(): (key: T[number]) => string
}

// Usage
const HomePage = () => {
  const t = homeDictionary.useTranslator()
  return <span>{t('home.welcome')}</span>  // Typed to dictionary keys only
}
```

**Returns**: Translation function scoped to dictionary keys.

## 🏪 Store APIs

### `useSettingsStore()`

Zustand store for application settings including language preferences.

```typescript
interface SettingsStore {
  // State
  uiLanguage: Language
  userLanguage: Language
  theme: Theme

  // Actions
  setUiLanguage: (language: Language) => void
  setUserLanguage: (language: Language) => void
  setTheme: (theme: Theme) => void
}

// Usage
const LanguageSwitcher = () => {
  const { uiLanguage, setUiLanguage } = useSettingsStore()

  return (
    <select value={uiLanguage} onChange={(e) => setUiLanguage(e.target.value as Language)}>
      <option value="en">English</option>
      <option value="el">Ελληνικά</option>
      <option value="ru">Русский</option>
    </select>
  )
}
```

**Persistence**: Automatically persists to localStorage as 'settings-storage'.

### `useSettingsSync()`

SSR-safe hook for synchronizing settings with DOM attributes.

```typescript
function useSettingsSync(): void

// Usage (typically in App root)
function App() {
  useSettingsSync()  // Syncs theme and language to document
  return <Router />
}
```

**Side Effects**:
- Sets `data-theme` attribute on `document.documentElement`
- Sets `lang` attribute on `document.documentElement`
- Safe for SSR (checks for `document` availability)

## 🔍 Query APIs

### `translationQueries`

TanStack Query configuration for translation data fetching.

```typescript
export const translationQueries = {
  byLanguage: (language: Language) => ({
    queryKey: ['translations', language] as const,
    queryFn: () => fetchTranslations(language),
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: Infinity,
  })
}

// Usage
function Component() {
  const { data: translations } = useQuery(
    translationQueries.byLanguage('en')
  )
}
```

**Cache Strategy**:
- **Stale Time**: 30 minutes
- **Cache Time**: Infinite (translations rarely change)
- **Background Refetch**: Enabled

### `loadTranslations(options)`

Function for loading translations with status reporting.

```typescript
interface LoadTranslationsResult {
  t: (key: string) => string
  language: Language
  isLoading: boolean
  error: Error | null
  status: 'loading' | 'complete' | 'error'
  missingKeys: string[]
}

function loadTranslations(options: LoadTranslationsOptions): LoadTranslationsResult

// Usage
const Component = () => {
  const { t, status, missingKeys } = loadTranslations({
    dictionary: myDictionary,
    language: 'en'
  })

  if (status === 'loading') return <LoadingSpinner />
  if (missingKeys.length > 0) console.warn('Missing:', missingKeys)

  return <h1>{t('app.title')}</h1>
}
```

## 📋 Type Definitions

### `Language`

Supported language codes.

```typescript
type Language = 'el' | 'en' | 'ru'
```

### `Theme`

Supported theme options.

```typescript
type Theme = 'light' | 'dark'
```

### `TranslationRegistryKey`

Auto-generated union type of all available translation keys.

```typescript
// Generated automatically
type TranslationRegistryKey =
  | 'app.title'
  | 'app.subtitle'
  | 'navigation.home'
  | 'navigation.library'
  | 'buttons.start'
  // ... all other keys
```

### `LocalizedString`

Interface for multi-language content in exercise data.

```typescript
interface LocalizedString {
  el?: string  // Greek
  en?: string  // English
  ru?: string  // Russian
}

// Usage in exercise data
interface ExerciseCase {
  question: string
  questionI18n?: LocalizedString
  explanation?: string
  explanationI18n?: LocalizedString
}
```

## 🎛️ Utility Functions

### `createTranslationRequest(keys)`

Creates optimized request payload for translation fetching.

```typescript
function createTranslationRequest(
  keys: TranslationRegistryKey[]
): TranslationRequest

// Usage
const request = createTranslationRequest(['app.title', 'welcome.message'])
const { t } = loadTranslations({
  dictionary: myDictionary,
  language: 'en'
})
```

### `resolveTranslation(key, translations, policy)`

Low-level translation resolution with fallback policies.

```typescript
type FallbackPolicy = 'echo' | 'fallback' | 'empty'

function resolveTranslation(
  key: TranslationRegistryKey,
  translations: Record<string, string>,
  policy: FallbackPolicy = 'fallback'
): string

// Usage
const resolved = resolveTranslation(
  'missing.key',
  {},
  'fallback'  // Returns fallback from registry
)
```

## 🧪 Testing Utilities

### `TestWrapper`

Provides i18n context for component testing.

```typescript
interface TestWrapperProps {
  language?: Language
  translations?: Record<string, string>
  children: React.ReactNode
}

function TestWrapper({ language = 'en', translations, children }: TestWrapperProps)

// Usage
test('component displays translated text', () => {
  render(
    <TestWrapper language="en" translations={{ 'app.title': 'Test Title' }}>
      <Component />
    </TestWrapper>
  )
})
```

### Mock Handlers

MSW handlers for testing translation API.

```typescript
// Test-specific handlers
export const testTranslationHandlers = [
  http.get('/api/translations/:language', ({ params }) => {
    const { language } = params
    return HttpResponse.json(getTestTranslations(language))
  })
]

// Usage in tests
const server = setupServer(...testTranslationHandlers)
```

## 📊 Performance APIs

### Bundle Analysis

Check translation system impact on bundle size.

```typescript
// Development analysis
const bundleImpact = {
  registryTypes: '~15KB',      // Generated TypeScript definitions
  runtimeCode: '~8KB',         // Translation hooks and utilities
  mockHandlers: '~5KB',        // MSW handlers (dev only)
  totalDevBundle: '~28KB'      // Total development impact
}
```

### Memory Profiling

Monitor translation cache memory usage.

```typescript
// Access query cache for memory analysis
function analyzeTranslationCache() {
  const queryClient = useQueryClient()
  const cache = queryClient.getQueryCache()

  const translationQueries = cache.findAll(['translations'])
  return {
    cachedLanguages: translationQueries.length,
    memoryEstimate: translationQueries.length * 2000 // ~2KB per language
  }
}
```

## 🔧 Configuration

### Environment Variables

```typescript
// Available configuration
interface I18nConfig {
  VITE_DEFAULT_LANGUAGE?: 'el' | 'en' | 'ru'      // Default: 'en'
  VITE_FALLBACK_POLICY?: 'echo' | 'fallback' | 'empty'  // Default: 'fallback'
  VITE_ENABLE_I18N_DEBUG?: 'true' | 'false'       // Default: 'false'
}
```

### Build-time Configuration

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    __I18N_FALLBACK_POLICY__: JSON.stringify('fallback'),
    __I18N_DEBUG__: process.env.NODE_ENV === 'development'
  }
})
```

## 🔗 Related Documentation

- **[i18n Overview](overview.md)** - System concepts and architecture
- **[Implementation Guide](implementation.md)** - Usage patterns and examples
- **[Technical Overview](../technical/overview.md)** - System integration