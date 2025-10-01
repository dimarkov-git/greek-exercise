# Internationalization Overview

Type-safe translation and internationalization (i18n) system for Learn Greek application.

## 🌐 Supported Languages

The application supports three interface languages:

- **Greek** (`el`) - Primary language of the learning content
- **English** (`en`) - Default interface language
- **Russian** (`ru`) - Alternative interface language

## 🏗️ System Architecture

The i18n system uses a modern, autonomous approach with component-level translations and smart fallback chains:

```
┌─────────────────────────────────────────────────────────────────┐
│                 Component Translation Files                     │
├─────────────────────────────────────────────────────────────────┤
│  Co-located translations • Simple API • Type-safe              │
│  Example: features/exercise-header/ui/translations.ts          │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  loadTranslations() Hook                        │
├─────────────────────────────────────────────────────────────────┤
│  Smart fallback chain • Works offline • Status reporting       │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TanStack Query                             │
├─────────────────────────────────────────────────────────────────┤
│  Efficient caching • Background updates • Error handling       │
└─────────────────────────────────────────────────────────────────┘
```

## ✨ Key Features

### 1. **Autonomous Translation System**
- **No code generation**: No build-time registry generation needed
- **Component-level**: Translations co-located with components
- **Simple API**: String keys or full translation entries

### 2. **Smart Fallback Chain**
The system provides a 4-level fallback resolution:
1. **Service translation** in app language (from API)
2. **Inline translations** in app language (from component file)
3. **Inline translations** in default language (if specified)
4. **Fallback value** (ultimate fallback)

### 3. **Flexible Translation Entries**
Two ways to define translations:
```typescript
{
  // Simple: service key only
  backButton: 'ui.back',

  // Full: with inline translations and fallback
  greeting: {
    key: 'app.greeting',           // Optional service key
    translations: {                 // Inline translations
      en: 'Hello',
      el: 'Γεια',
      ru: 'Привет'
    },
    fallback: 'Hello',             // Ultimate fallback
    defaultLanguage: 'en'          // Preferred language
  }
}
```

### 4. **Offline-First Design**
- **Inline translations**: Work without network connection
- **Service enhancement**: API translations enhance inline ones
- **Graceful degradation**: Falls back when service unavailable

### 5. **SSR-Safe Settings**
- **Store**: `src/shared/model/settings.ts` (Zustand)
- **Persistence**: localStorage with SSR safety checks
- **Purpose**: DOM-safe language and theme management

## 🎯 Usage Patterns

### Basic Translation with Service Keys

```typescript
import { loadTranslations } from '@/shared/lib/i18n'

const translations = {
  title: 'page.title',
  subtitle: 'page.subtitle'
} as const satisfies TranslationDictionary

function Component() {
  const { t } = loadTranslations(translations)
  return <h1>{t(translations.title)}</h1>
}
```

### Translation with Inline Fallbacks

```typescript
const translations = {
  greeting: {
    key: 'app.greeting',
    translations: {
      en: 'Hello and welcome!',
      el: 'Γεια σας και καλώς ήρθατε!',
      ru: 'Здравствуйте и добро пожаловать!'
    }
  }
} as const satisfies TranslationDictionary

function Component() {
  const { t, status } = loadTranslations(translations)

  // Works immediately with inline translations
  // Enhanced by service when available
  return <h1>{t(translations.greeting)}</h1>
}
```

### Pure Inline Translations (No Service)

```typescript
const translations = {
  // No service key - uses only inline translations
  label: {
    translations: {
      en: 'Settings',
      el: 'Ρυθμίσεις',
      ru: 'Настройки'
    },
    fallback: 'Settings'
  }
} as const satisfies TranslationDictionary
```

### Language Switching

```typescript
import { useSettingsStore } from '@/shared/model'

function LanguageSwitcher() {
  const { setUiLanguage } = useSettingsStore()
  return (
    <select onChange={(e) => setUiLanguage(e.target.value as Language)}>
      <option value="en">English</option>
      <option value="el">Ελληνικά</option>
      <option value="ru">Русский</option>
    </select>
  )
}
```

## 📊 System Benefits

### Simplicity
- **No build step**: No registry generation required
- **Direct usage**: Import and use translations immediately
- **Minimal boilerplate**: Simple object definitions

### Type Safety
- **Compile-time validation**: TypeScript ensures correct keys
- **Autocomplete support**: Full IDE integration
- **Refactoring safety**: Type errors on key changes

### Performance
- **Efficient caching**: TanStack Query handles caching
- **Lazy loading**: Translations loaded on component mount
- **Offline-ready**: Inline translations work without network

### Developer Experience
- **Co-location**: Translations near component code
- **Flexible API**: Choose simple or full format per need
- **Status reporting**: Track loading, errors, missing keys

### Testing
- **Inline fallbacks**: Predictable test output
- **No mocking needed**: Inline translations work in tests
- **Status tracking**: Test loading and error states

## 🔄 Fallback Resolution

The system resolves translations using this priority chain:

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

// Resolution (app language = 'ru'):
// 1. Service translation for 'app.greeting' in 'ru' → if available
// 2. Inline translations['ru'] → 'Привет' ✓
// 3. Inline translations['en'] → 'Hello' (if ru missing)
// 4. fallback → 'Hi' (if all else fails)
```

## 🔗 Related Documentation

- **[Implementation Guide](implementation.md)** - Detailed patterns and examples
- **[API Reference](api-reference.md)** - Complete API documentation
- **[Technical Overview](../technical/overview.md)** - System architecture
- **[Development Guide](../guides/getting-started.md)** - Development setup

## 🚀 Quick Start

1. **Create translation file**: `translations.ts` in component folder
2. **Define translations**: Use string keys or full entries
3. **Use in component**: Call `loadTranslations()` hook
4. **Render translations**: Use `t()` function with type safety
5. **Test**: Verify inline translations work without service