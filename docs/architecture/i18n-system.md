# Internationalization system

This document describes the type-safe translation and internationalization (i18n) system in the project.

## Overview

The application uses a modern, type-safe translation system with a generated registry and deterministic fallbacks:

- **Generated translation registry** for compile-time type safety
- **Feature-based dictionaries** with typed translators
- **TanStack Query** for efficient translation data fetching and caching
- **SSR-safe settings sync** via `useSettingsSync` hook
- **Deterministic fallbacks** replacing random filler text
- **MSW** for mocked translation API during development

## Supported languages

The application supports three interface languages:

- **Greek** (`el`) - Primary language of the learning content
- **English** (`en`)
- **Russian** (`ru`)

## Architecture components

### 1. Generated translation registry (`src/i18n/generated/translation-registry.ts`)

**Purpose**: Compile-time type safety for all translation keys

```typescript
// Generated automatically by scripts/generate-translation-registry.mjs
export type TranslationRegistryKey = 'app.title' | 'navigation.home' | 'buttons.start' // ...
export const translationRegistry: Record<TranslationRegistryKey, string>
```

**Features**:

- Union types for all translation keys
- Normalizes keys from English source strings and manual fallbacks
- Provides compile-time errors for missing keys
- Centralizes key definitions across the application

### 2. Feature dictionaries (`src/i18n/dictionaries/`)

**Purpose**: Type-safe, feature-oriented translation dictionaries

```typescript
// Example: src/i18n/dictionaries/navigation.ts
export const navigationDictionary = createTranslationDictionary([
    'navigation.home',
    'navigation.library',
    'navigation.exercises'
] as const)

// Usage in component
const translator = navigationDictionary.useTranslator()
return <span>{translator('navigation.home'
)
}
</span>
```

**Features**:

- Scoped to specific features/components
- Memoized request payloads
- Typed translator functions with autocomplete
- Tree-shakeable imports

### 3. Settings store with SSR-safe sync (`src/stores/settings.ts` + `src/hooks/useSettingsSync.ts`)

**Purpose**: Manages settings with DOM mutations moved to React effects

```typescript
interface SettingsStore {
    uiLanguage: Language
    theme: Theme
    setUiLanguage: (language: Language) => void
    setTheme: (theme: Theme) => void
}

// SSR-safe DOM synchronization
function useSettingsSync() {
    const {theme, uiLanguage} = useSettingsStore()

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme)
            document.documentElement.setAttribute('lang', uiLanguage)
        }
    }, [theme, uiLanguage])
}
```

**Features**:

- Browser-agnostic store for SSR compatibility
- DOM mutations handled via useEffect hooks
- Default values for hydration consistency
- Testing-friendly with happy-dom

### 4. Enhanced useTranslations hook (`src/hooks/useTranslations.ts`)

**Purpose**: Coordinates fetching, missing-key accounting, and deterministic fallback selection

```typescript
export function useTranslations(request: TranslationRequest) {
    return {
        translations: Record<string, string>,
        status: TranslationStatus, // 'loading' | 'error' | 'complete' | 'partial' | 'missing'
        missingKeys: string[],
        refetch: () => void
    }
}
```

**Features**:

- Status codes for comprehensive state tracking
- Missing-key diagnostics for development
- Deterministic fallback selection (no random text)
- Memoized requests with shared cache keys
- Policy-driven missing key handling (`echo`, `fallback`, `empty`)

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
  "buttons.start": "Start"
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
    return HttpResponse.json({translations: filteredTranslations})
})
```

## Usage patterns

### Feature-based translation

```typescript
import {navigationDictionary} from '@/i18n/dictionaries/navigation'

function NavigationComponent() {
    const translator = navigationDictionary.useTranslator()

    return (
        <nav>
            <a href = "/" > {translator('navigation.home')
}
    </a>
    < a
    href = "/library" > {translator('navigation.library'
)
}
    </a>
    < /nav>
)
}
```

### Status-aware translation handling

```typescript
import {useTranslations} from '@/hooks/useTranslations'
import {createTranslationRequest} from '@/i18n/utils'

function MyComponent() {
    const request = createTranslationRequest(['app.title', 'welcome.message'])
    const {translations, status, missingKeys} = useTranslations(request)

    if (status === 'loading') return <div>Loading
...
    </div>
    if (status === 'error') return <div>Translation
    error < /div>
    if (status === 'partial') console.warn('Missing keys:', missingKeys)

    return <h1>{translations['app.title']} < /h1>
}
```

### Language switching

```typescript
import {useSettingsStore} from '@/stores/settings'

function LanguageSelector() {
    const {uiLanguage, setUiLanguage} = useSettingsStore()

    return (
        <select value = {uiLanguage}
    onChange = {e
=>
    setUiLanguage(e.target.value)
}>
    <option value = "el" > Ελληνικά < /option>
        < option
    value = "en" > English < /option>
        < option
    value = "ru" > Русский < /option>
        < /select>
)
}
```

### Loading state handling

```typescript
function MyComponent() {
    const {t, isLoading} = useI18n()

    if (isLoading) return <div>Loading
    translations
...
    </div>

    return <h1>{t('welcome'
)
}
    </h1>
}
```

## Deterministic fallback system

The translation system implements policy-driven fallback handling:

1. **Translation registry lookup**: From generated registry with manual fallbacks
2. **Policy-based resolution**: `echo` (key), `fallback` (manual), or `empty` string
3. **Status reporting**: Explicit status codes for missing translations

Example fallback flow:

```typescript
// With 'fallback' policy (default)
const {translations, status} = useTranslations(request)
// 1. Try: el.json['app.title'] → 'Μάθε Ελληνικά'
// 2. Fallback: translationRegistry['app.title'] → 'Learn Greek'
// 3. Status: 'partial' with missingKeys: ['app.title']

// With 'echo' policy (development)
// Returns raw key for missing translations: 'app.title'

// With 'empty' policy (production)
// Returns empty string for missing translations
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

### Translation registry generation

Generate the translation registry after adding new keys:

```bash
# Run the registry generator
node scripts/generate-translation-registry.mjs

# This updates src/i18n/generated/translation-registry.ts
# with all keys from English source + manual fallbacks
```

The generator:

- Scans English translation files
- Merges with manual fallback definitions
- Generates TypeScript union types
- Creates centralized registry object
- Enforced via `pnpm validate` in CI

## Key design decisions

### Why Zustand over React Context?

- **Performance**: Zustand avoids unnecessary re-renders
- **Persistence**: Built-in localStorage integration
- **Simplicity**: Less boilerplate than Context + useReducer
- **DevTools**: Excellent debugging experience

### Why generated translation registry?

- **Type safety**: Compile-time errors for missing keys
- **Centralization**: Single source of truth for all keys
- **Performance**: Eliminates runtime key enumeration
- **Development experience**: Autocomplete and refactoring support
- **CI integration**: Automated validation prevents stale registries

### Why feature-based dictionaries?

- **Modularity**: Scoped translations per feature/component
- **Tree shaking**: Only load required translations
- **Memoization**: Shared cache keys for identical requests
- **Type inference**: Precise typing for dictionary-specific keys

### Why MSW for mocking?

- **Realistic testing**: Same network requests as production
- **Development speed**: Instant translation responses
- **API contract**: Validates API interface design
- **Offline development**: No backend dependency

## Common patterns and examples

### Conditional text based on language

```typescript
function WelcomeMessage() {
    const {t, currentLanguage} = useI18n()

    return (
        <div>
            <h1>{t('welcome')
}
    </h1>
    {
        currentLanguage === 'el' && (
            <p>{t('greekSpecificMessage')
    }
        </p>
    )
    }
    </div>
)
}
```

### Pluralization handling

```typescript
// Translation files include plural forms
{
    "items.count.zero"
:
    "No items",
        "items.count.one"
:
    "1 item",
        "items.count.many"
:
    "{{count}} items"
}

// Component usage
function ItemCount({count}: { count: number }) {
    const {t} = useI18n()

    const key = count === 0 ? 'items.count.zero'
        : count === 1 ? 'items.count.one'
            : 'items.count.many'

    return <span>{t(key).replace('{{count}}', count.toString())} < /span>
}
```

### Error boundary integration

```typescript
function TranslationErrorBoundary({children}) {
    const {t, isLoading} = useI18n()

    if (isLoading) {
        return <div>{t('loading'
    ) ||
        'Loading...'
    }
        </div>
    }

    return (
        <ErrorBoundary fallback = { < div > {t('messages.error')
}
    </div>}>
    {
        children
    }
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

### Architectural benefits

- **Type safety**: Compile-time validation of translation keys
- **Developer experience**: Autocomplete, refactoring, and clear error messages
- **Performance**: Memoized requests and tree-shakeable imports
- **Maintainability**: Centralized registry with deterministic fallbacks
- **SSR compatibility**: DOM mutations moved to React effects
- **Testing**: Deterministic behavior with controlled missing-key policies

## Future considerations (Phase 6+)

### Potential enhancements

- **Translation management UI** for updating registry via web interface
- **Lazy dictionary loading** for large feature sets
- **ICU message format** integration for advanced pluralization
- **Translation coverage analysis** in CI pipeline
- **Hot-reload** of translations during development

### Scalability notes

- Registry generation scales to 1000+ keys efficiently
- Dictionary system supports feature-based code splitting
- Memory usage optimized via tree-shaking and memoization
- CI validation prevents registry drift as team grows
