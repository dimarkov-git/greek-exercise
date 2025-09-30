# Internationalization Documentation

Complete guide to the autonomous i18n system in Learn Greek application.

## 📚 Documentation Index

### Core Documentation
- **[Overview](overview.md)** - System architecture, supported languages, and key features
- **[Implementation Guide](implementation.md)** - Detailed patterns and code examples
- **[API Reference](api-reference.md)** - Complete API documentation and type definitions

### Integration Guides
- **[Development Setup](../guides/getting-started.md)** - Environment configuration
- **[Testing Strategies](../guides/testing-guide.md)** - Testing i18n functionality

## 🚀 Quick Start

### 1. Create Translation File

```typescript
// src/features/my-feature/ui/translations.ts
import type { TranslationDictionary } from '@/shared/lib/i18n'

export const translations = {
  // Simple service keys
  title: 'feature.title',
  description: 'feature.description',

  // Inline translations for offline support
  buttonLabel: {
    translations: {
      en: 'Click Me',
      el: 'Κάντε κλικ',
      ru: 'Нажми'
    }
  }
} as const satisfies TranslationDictionary
```

### 2. Use in Component

```typescript
// src/features/my-feature/ui/MyComponent.tsx
import { loadTranslations } from '@/shared/lib/i18n'
import { translations } from './translations'

export function MyComponent() {
  const { t } = loadTranslations(translations)

  return (
    <div>
      <h1>{t(translations.title)}</h1>
      <p>{t(translations.description)}</p>
      <button>{t(translations.buttonLabel)}</button>
    </div>
  )
}
```

### 3. Language Switching

```typescript
import { useSettingsStore } from '@/shared/model'

function LanguageSelector() {
  const { uiLanguage, setUiLanguage } = useSettingsStore()

  return (
    <select
      value={uiLanguage}
      onChange={(e) => setUiLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="el">Ελληνικά</option>
      <option value="ru">Русский</option>
    </select>
  )
}
```

## 🏗️ System Architecture

```
Component Translation Files (co-located)
                │
                ▼
    loadTranslations() Hook
                │
                ▼
    Smart Fallback Chain
    1. Service translation
    2. Inline translation
    3. Fallback value
                │
                ▼
        TanStack Query
        (Caching & Updates)
```

## ✨ Key Features

### 🔒 **Type Safety**
- **Compile-time validation** of translation keys
- **Auto-complete support** with TypeScript
- **Refactoring safety** with type checking

### 🎯 **Autonomous System**
- **No code generation**: No build-time registry
- **Component-level**: Translations co-located with components
- **Flexible API**: String keys or full translation entries

### ⚡ **Performance**
- **Infinite caching** via TanStack Query
- **Lazy loading** of translations per component
- **Offline-ready** with inline translations

### 🧪 **Developer Experience**
- **Co-location**: Translations near component code
- **Simple API**: Minimal boilerplate
- **Status reporting**: Track loading, errors, missing keys
- **Testing-friendly**: Inline translations work without mocks

## 📋 Supported Languages

| Code | Language | Status | Usage |
|------|----------|--------|--------|
| `el` | Ελληνικά (Greek) | ✅ Active | Primary learning content |
| `en` | English | ✅ Active | Default interface language |
| `ru` | Русский (Russian) | ✅ Active | Alternative interface |

## 🔄 Translation Patterns

### Pattern 1: Simple Service Keys

Use for translations from service only:

```typescript
const translations = {
  title: 'page.title',
  subtitle: 'page.subtitle'
} as const satisfies TranslationDictionary
```

**Pros:** Simplest approach
**Cons:** Requires network connection

### Pattern 2: Inline Translations

Use for offline support:

```typescript
const translations = {
  greeting: {
    translations: {
      en: 'Hello',
      el: 'Γεια',
      ru: 'Привет'
    },
    fallback: 'Hi'
  }
} as const satisfies TranslationDictionary
```

**Pros:** Works offline immediately
**Cons:** Larger translation files

### Pattern 3: Hybrid Approach

Combine service + inline:

```typescript
const translations = {
  // Service key with inline fallback
  welcomeMessage: {
    key: 'app.welcome',
    translations: {
      en: 'Welcome!',
      el: 'Καλώς ήρθατε!',
      ru: 'Добро пожаловать!'
    }
  }
} as const satisfies TranslationDictionary
```

**Pros:** Best of both worlds
**Cons:** More verbose

## 📊 System Benefits

### Simplicity
- No build step required
- Direct usage without code generation
- Minimal boilerplate

### Type Safety
- Compile-time key validation
- IDE autocomplete
- Refactoring safety

### Performance
- Efficient caching (TanStack Query)
- Lazy loading per component
- Offline-ready operation

### Testing
- Inline translations work in tests
- No service mocking needed
- Predictable fallback behavior

## 🧪 Testing Support

### Basic Test

```typescript
import { render, screen } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { MyComponent } from './MyComponent'

test('renders translated content', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MyComponent />
    </QueryClientProvider>
  )

  // Inline translations work immediately
  expect(screen.getByText('Click Me')).toBeInTheDocument()
})
```

### Status Testing

```typescript
const { t, status, missingKeys } = loadTranslations(translations)

expect(status).toBe('loading') // Initial
// ... wait for completion
expect(status).toBe('complete') // All loaded
expect(missingKeys).toHaveLength(0) // No missing keys
```

## 📈 Performance Metrics

### Bundle Impact
- **Hook implementation**: ~3KB
- **Type definitions**: ~1KB
- **Per-component translations**: ~0.5KB
- **Total runtime**: ~4KB + 0.5KB per component

### Runtime Performance
- **Cache duration**: Infinite (translations never refetch)
- **Memory per component**: ~3.5KB
- **Load time**: <50ms for translation switching

## 🔗 File Structure

```
src/
├── shared/
│   └── lib/
│       └── i18n/
│           ├── loadTranslations.ts      # Main hook
│           ├── translation-types.ts     # Type definitions
│           └── index.ts                 # Public exports
│
├── features/
│   └── exercise-header/
│       └── ui/
│           ├── ExerciseHeader.tsx
│           ├── ExerciseHeader.test.tsx
│           └── translations.ts          # Co-located translations
│
└── pages/
    ├── HomePage.tsx
    └── translations.ts                  # Page-level translations
```

## 🆘 Common Issues & Solutions

### Issue: Missing Translation Keys

**Problem:** TypeScript error about missing key

```typescript
// ❌ Error: Key not in dictionary
t('nonexistent.key')
```

**Solution:** Use type-safe references

```typescript
// ✅ Type-safe reference
t(translations.title)
```

---

### Issue: Translations Not Loading

**Problem:** Status stuck in `'loading'`

**Solution:** Check network request and service keys

```typescript
const { status, error, missingKeys } = loadTranslations(translations)

console.log('Status:', status)
console.log('Error:', error)
console.log('Missing:', missingKeys)
```

---

### Issue: Offline Not Working

**Problem:** Component doesn't work without network

**Solution:** Add inline translations

```typescript
// ❌ Bad: Requires service
const translations = {
  label: 'ui.label'
}

// ✅ Good: Works offline
const translations = {
  label: {
    translations: {
      en: 'Label',
      el: 'Ετικέτα'
    }
  }
}
```

---

### Issue: Bundle Size Growth

**Problem:** Large bundle with translation files

**Solution:** Use service keys for dynamic content, inline for critical UI

```typescript
// ✅ Good: Service keys for dynamic content
const translations = {
  dynamicContent: 'content.dynamic', // From service

  // Inline for critical UI only
  errorMessage: {
    translations: { en: 'Error', el: 'Σφάλμα' }
  }
}
```

## 📚 Real-World Examples

### Navigation Component

```typescript
const translations = {
  home: {
    translations: {
      en: 'Home',
      el: 'Αρχική',
      ru: 'Главная'
    }
  },
  library: {
    translations: {
      en: 'Library',
      el: 'Βιβλιοθήκη',
      ru: 'Библиотека'
    }
  },
  builder: {
    translations: {
      en: 'Builder',
      el: 'Δημιουργός',
      ru: 'Конструктор'
    }
  }
} as const satisfies TranslationDictionary

export function Navigation() {
  const { t } = loadTranslations(translations)

  return (
    <nav>
      <Link to="/">{t(translations.home)}</Link>
      <Link to="/library">{t(translations.library)}</Link>
      <Link to="/builder">{t(translations.builder)}</Link>
    </nav>
  )
}
```

### Error Boundary

```typescript
const translations = {
  errorTitle: {
    translations: {
      en: 'Something went wrong',
      el: 'Κάτι πήγε στραβά',
      ru: 'Что-то пошло не так'
    },
    fallback: 'Error'
  },
  retryButton: {
    translations: {
      en: 'Try Again',
      el: 'Δοκιμάστε ξανά',
      ru: 'Попробуйте снова'
    },
    fallback: 'Retry'
  }
} as const satisfies TranslationDictionary

export function ErrorBoundary({ error }: { error: Error }) {
  const { t } = loadTranslations(translations)

  return (
    <div>
      <h1>{t(translations.errorTitle)}</h1>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>
        {t(translations.retryButton)}
      </button>
    </div>
  )
}
```

## 🔗 Related Documentation

### Technical References
- **[Data Models](../technical/data-models.md)** - TypeScript type definitions
- **[API Specification](../technical/api-specification.md)** - Translation API endpoints
- **[Component Architecture](../architecture/component-architecture.md)** - React integration patterns

### Development Guides
- **[Exercise Development](../guides/exercise-development.md)** - Adding translations to exercises
- **[Accessibility Guide](../guides/accessibility.md)** - Localized accessibility patterns
- **[Performance Guidelines](../architecture/performance.md)** - i18n performance optimization

## 💡 Best Practices

### 1. Co-locate Translations
Keep translation files next to components for better organization.

### 2. Use Type-Safe References
Always reference dictionary keys, never magic strings.

### 3. Provide Inline Translations for Critical UI
Error messages, loading states, and essential UI should work offline.

### 4. Use `satisfies` for Type Safety
Preserve literal types while ensuring type correctness.

### 5. Document Translation Structure
Add comments to explain translation organization and service keys.

### 6. Handle Loading States
Show appropriate UI during translation loading.

### 7. Monitor Missing Keys
Log missing keys in development for debugging.

### 8. Test with Inline Translations
Write tests that work without service mocking.

---

**Need help?** Check the [Implementation Guide](implementation.md) for detailed patterns or the [API Reference](api-reference.md) for complete API documentation.