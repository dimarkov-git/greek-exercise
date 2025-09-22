# Internationalization system

This document describes the translation and internationalization (i18n) system in the **Learn Greek** application.

## Overview

The application supports multiple interface languages and uses a modern, type-safe translation system built on:

- **Zustand store** for state management
- **TanStack Query** for efficient translation data fetching and caching
- **MSW** for mocked translation API during development
- **Valibot** for translation schema validation
- **Fallback system** for resilient translation handling

## Supported languages

The application supports 3 interface languages:

- **Greek** (`el`) - Default language, primary language of the learning content
- **English** (`en`) - International language for wider accessibility
- **Russian** (`ru`) - Additional language support

## Architecture components

### 1. Settings store (`src/stores/settings.ts`)

**Purpose**: Manages UI language selection and persistence

```typescript
interface SettingsStore {
  uiLanguage: Language // Current interface language
  setUiLanguage: (language: Language) => void
  // ... other settings
}
```

**Features**:
- Persists language choice in localStorage via Zustand persist middleware
- Default language: `'el'` (Greek)
- Triggers re-renders when language changes

### 2. Translation hook (`src/hooks/useI18n.ts`)

**Purpose**: Main translation hook used throughout the application

```typescript
export function useI18n() {
  return {
    t: (key: string) => string,     // Translation function
    currentLanguage: Language,      // Current UI language
    isLoading: boolean             // Loading state
  }
}
```

**Features**:
- Automatic language detection from settings store
- Efficient caching with TanStack Query (30 minutes stale time)
- Fallback system: translations → hardcoded fallbacks → key
- Retry mechanism (3 attempts) for failed translation requests

### 3. Translation API (`src/api/texts.ts`)

**Purpose**: Type-safe API functions for fetching translations

```typescript
export async function getTranslations(
  language: SupportedLanguage,
  keys: string[],
): Promise<Translations>
```

**Features**:
- Valibot schema validation for runtime type safety
- Standardized error handling via the shared HTTP client
- RESTful API endpoints: `GET /api/translations?lang=<code>&keys=<comma-separated>` with automatic POST fallback

### 4. Translation data (`src/mocks/data/translations/`)

**Structure**:
```
src/mocks/data/translations/
├── el.json    # Greek translations (default)
├── en.json    # English translations
└── ru.json    # Russian translations
```

**Translation format**:
```json
{
  "app.title": "Learn Greek",
  "navigation.home": "Home",
  "navigation.library": "Library",
  "buttons.start": "Start",
  // ... more key-value pairs
}
```

### 5. MSW handlers (`src/mocks/handlers.ts`)

**Purpose**: Development-time translation API mocking

```typescript
http.get('/api/translations', async ({request}) => {
  const url = new URL(request.url)
  const lang = url.searchParams.get('lang')
  const keys = url.searchParams.get('keys')?.split(',') ?? []
  // ...filter translations
  return HttpResponse.json({ translations: filteredTranslations })
})
```

## Usage patterns

### Basic translation

```typescript
import { useI18n } from '@/hooks/useI18n'

function MyComponent() {
  const { t } = useI18n()

  return <h1>{t('app.title')}</h1>
}
```

### Language switching

```typescript
import { useSettingsStore } from '@/stores/settings'

function LanguageSelector() {
  const { uiLanguage, setUiLanguage } = useSettingsStore()

  return (
    <select value={uiLanguage} onChange={e => setUiLanguage(e.target.value)}>
      <option value="el">Ελληνικά</option>
      <option value="en">English</option>
      <option value="ru">Русский</option>
    </select>
  )
}
```

### Loading state handling

```typescript
function MyComponent() {
  const { t, isLoading } = useI18n()

  if (isLoading) return <div>Loading translations...</div>

  return <h1>{t('welcome')}</h1>
}
```

## Fallback system

The translation system implements a 3-level fallback hierarchy:

1. **Primary**: Translation from JSON file for current language
2. **Secondary**: Hardcoded fallback translations in `useI18n.ts`
3. **Tertiary**: Raw translation key (development aid)

Example fallback flow:
```typescript
t('app.title')
// 1. Try: el.json['app.title'] → 'Μάθε Ελληνικά'
// 2. Fallback: fallbackTranslations['app.title'] → 'Greek Learning App'
// 3. Last resort: 'app.title'
```

## Translation key conventions

### Naming structure

Use dot notation for hierarchical organization:

```json
{
  "navigation.home": "Home",
  "navigation.library": "Library",
  "buttons.start": "Start",
  "buttons.cancel": "Cancel",
  "messages.error": "Something went wrong",
  "forms.required": "Required field"
}
```

### Key categories

- `navigation.*` - Navigation menu items
- `buttons.*` - Button labels
- `messages.*` - User feedback messages
- `forms.*` - Form labels and validation
- `header.*` - Header component text
- Top-level keys for main app text (`app.title`, `settings`, etc.)

## Performance considerations

### Caching strategy

- **TanStack Query**: 30-minute cache for translation data
- **Zustand persist**: Language preference saved in localStorage
- **Bundle optimization**: Translations loaded on-demand, not bundled

### Bundle impact

- Translation files are not included in main JavaScript bundle
- Loaded via HTTP requests with efficient caching
- Each translation file: ~1-2KB compressed

## Testing approach

### Unit tests

Translation system is tested via:
- Settings store state management tests
- Hook integration tests with mocked data
- Fallback behavior verification

### Test environment setup

```typescript
// src/test-setup.ts
beforeEach(() => {
  useSettingsStore.getState().resetSettings()
  useSettingsStore.getState().setUiLanguage('en') // English for tests
})
```

### MSW integration

Tests use MSW to mock translation API endpoints:
- Consistent translation responses
- Network error simulation
- Language-specific response testing

## Development workflow

### Adding new translations

1. **Add key to all language files**:
   ```json
   // el.json, en.json, ru.json
   {
     "newFeature.title": "Translation in respective language"
   }
   ```

2. **Use in component**:
   ```typescript
   const { t } = useI18n()
   return <h2>{t('newFeature.title')}</h2>
   ```

3. **Add fallback** (if critical):
   ```typescript
   // src/hooks/useI18n.ts
   const fallbackTranslations = {
     'newFeature.title': 'Default English Title'
   }
   ```

### Translation validation

Valibot schemas ensure runtime type safety:

```typescript
// Automatic validation on fetch
const translations = await getTranslations('en', ['app.title', 'navigation.home'])
```

## Key design decisions

### Why Zustand over React Context?

- **Performance**: Zustand avoids unnecessary re-renders
- **Persistence**: Built-in localStorage integration
- **Simplicity**: Less boilerplate than Context + useReducer
- **DevTools**: Excellent debugging experience

### Why TanStack Query for translations?

- **Caching**: Intelligent cache management with stale-time
- **Retry logic**: Automatic retry on network failures
- **Loading states**: Built-in loading/error state management
- **Background updates**: Seamless translation updates

### Why MSW for mocking?

- **Realistic testing**: Same network requests as production
- **Development speed**: Instant translation responses
- **API contract**: Validates API interface design
- **Offline development**: No backend dependency

## Common patterns and examples

### Conditional text based on language

```typescript
function WelcomeMessage() {
  const { t, currentLanguage } = useI18n()

  return (
    <div>
      <h1>{t('welcome')}</h1>
      {currentLanguage === 'el' && (
        <p>{t('greekSpecificMessage')}</p>
      )}
    </div>
  )
}
```

### Pluralization handling

```typescript
// Translation files include plural forms
{
  "items.count.zero": "No items",
  "items.count.one": "1 item",
  "items.count.many": "{{count}} items"
}

// Component usage
function ItemCount({ count }: { count: number }) {
  const { t } = useI18n()

  const key = count === 0 ? 'items.count.zero'
            : count === 1 ? 'items.count.one'
            : 'items.count.many'

  return <span>{t(key).replace('{{count}}', count.toString())}</span>
}
```

### Error boundary integration

```typescript
function TranslationErrorBoundary({ children }) {
  const { t, isLoading } = useI18n()

  if (isLoading) {
    return <div>{t('loading') || 'Loading...'}</div>
  }

  return (
    <ErrorBoundary fallback={<div>{t('messages.error')}</div>}>
      {children}
    </ErrorBoundary>
  )
}
```

## Troubleshooting

### Missing translations

**Problem**: Key returns the raw key instead of translation
**Solution**: Check translation files for missing keys, verify fallback system

### Language not switching

**Problem**: UI doesn't update after language change
**Solution**: Ensure components use `useI18n()` hook, check Zustand store updates

### Performance issues

**Problem**: Slow translation loading
**Solution**: Verify TanStack Query cache settings, check network tab for repeated requests

### Type errors

**Problem**: TypeScript errors with translation types
**Solution**: Run Valibot validation, ensure translation files match schema

## Future considerations

### Potential enhancements

- **ICU message format** for advanced pluralization
- **Lazy translation loading** for large applications
- **Translation management UI** for non-technical users
- **RTL language support** for Arabic/Hebrew
- **Translation validation CI** to catch missing keys

### Scalability notes

- Current system handles 100+ translation keys efficiently
- For 1000+ keys, consider namespace-based code splitting
- Memory usage scales linearly with translation file size
- Network requests scale with number of supported languages