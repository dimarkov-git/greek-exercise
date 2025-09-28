# Internationalization Overview

Type-safe translation and internationalization (i18n) system for Learn Greek application.

## 🌐 Supported Languages

The application supports three interface languages:

- **Greek** (`el`) - Primary language of the learning content
- **English** (`en`) - Default interface language
- **Russian** (`ru`) - Alternative interface language

## 🏗️ System Architecture

The i18n system uses a modern, type-safe approach with generated registries and feature-based dictionaries:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Translation Registry                        │
├─────────────────────────────────────────────────────────────────┤
│  Generated TypeScript types from English source strings        │
│  Compile-time safety • Centralized key definitions             │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Feature-based Dictionaries                    │
├─────────────────────────────────────────────────────────────────┤
│  Scoped to components • Typed translators • Tree-shakeable     │
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

### 1. **Generated Translation Registry**
- **File**: `src/i18n/generated/translation-registry.ts`
- **Purpose**: Compile-time type safety for all translation keys
- **Auto-generated**: Created by `scripts/generate-translation-registry.mjs`

### 2. **Feature-based Dictionaries**
- **Location**: `src/i18n/dictionaries/`
- **Purpose**: Scoped translation dictionaries for specific components
- **Examples**: `home.ts`, `exercise.ts`, `navigation.ts`

### 3. **SSR-Safe Settings**
- **Store**: `src/stores/settings.ts`
- **Hook**: `src/hooks/useSettingsSync.ts`
- **Purpose**: DOM-safe language and theme management

### 4. **MSW Integration**
- **Development**: Mock translation API for realistic testing
- **Testing**: Deterministic translation responses
- **Production**: Ready for real translation service integration

## 🎯 Usage Patterns

### Basic Translation
```typescript
import { useDictionary } from '@/i18n/dictionary'

function Component() {
  const t = useDictionary()
  return <h1>{t('app.title')}</h1>  // Type-safe!
}
```

### Feature Dictionary
```typescript
import { homeDictionary } from '@/i18n/dictionaries/home'

function HomePage() {
  const t = homeDictionary.useTranslator()
  return <span>{t('home.welcome')}</span>  // Scoped & typed!
}
```

### Language Switching
```typescript
import { useSettingsStore } from '@/stores/settings'

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

### Type Safety
- **Compile-time validation** of translation keys
- **Autocomplete support** in IDEs
- **Refactoring safety** with TypeScript

### Performance
- **Tree-shaking**: Only used translations loaded
- **Caching**: TanStack Query handles translation caching
- **Lazy loading**: Feature dictionaries loaded on demand

### Developer Experience
- **Generated types** prevent typos
- **Feature scoping** reduces cognitive overhead
- **MSW mocking** enables offline development

### Testing
- **Deterministic fallbacks** replace random text
- **Mock API** provides consistent test data
- **SSR compatibility** with happy-dom testing

## 🔗 Related Documentation

- **[Implementation Guide](implementation.md)** - Detailed implementation patterns
- **[API Reference](api-reference.md)** - Complete API documentation
- **[Technical Overview](../technical/overview.md)** - System architecture
- **[Development Guide](../guides/getting-started.md)** - Development setup

## 🚀 Quick Start

1. **Add new translation key**: Update English source strings
2. **Generate registry**: Run `pnpm generate:i18n`
3. **Create dictionary**: Add to appropriate feature dictionary
4. **Use in component**: Import dictionary and call translator
5. **Test**: Verify type safety and fallback behavior