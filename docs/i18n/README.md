# Internationalization Documentation

Complete guide to the type-safe i18n system in Learn Greek application.

## 📚 Documentation Index

### Core Documentation
- **[Overview](overview.md)** - System architecture, supported languages, and key features
- **[Implementation Guide](implementation.md)** - Detailed patterns and code examples
- **[API Reference](api-reference.md)** - Complete API documentation and type definitions

### Integration Guides
- **[Technical Architecture](../architecture/i18n-system.md)** - Deep technical implementation details
- **[Development Setup](../guides/getting-started.md)** - Environment configuration
- **[Testing Strategies](../guides/testing-guide.md)** - Testing i18n functionality

## 🚀 Quick Start

### 1. Basic Translation Usage

```typescript
import { useDictionary } from '@/i18n/dictionary'

function Component() {
  const t = useDictionary()
  return <h1>{t('app.title')}</h1>  // Type-safe translation
}
```

### 2. Feature-Scoped Translations

```typescript
import { navigationDictionary } from '@/i18n/dictionaries/navigation'

function Navigation() {
  const t = navigationDictionary.useTranslator()
  return <nav>{t('navigation.home')}</nav>  // Scoped & typed
}
```

### 3. Language Switching

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

## 🏗️ System Architecture

```
Translation Registry (Generated)
         │
         ▼
Feature Dictionaries (Scoped)
         │
         ▼
TanStack Query (Caching)
         │
         ▼
MSW Handlers (Development)
```

## ✨ Key Features

### 🔒 **Type Safety**
- **Compile-time validation** of translation keys
- **Auto-generated TypeScript types** from source strings
- **IDE autocomplete support** with IntelliSense

### 🎯 **Feature Scoping**
- **Dictionary per feature** (navigation, exercises, forms)
- **Tree-shakeable imports** for optimal bundle size
- **Focused translation loading** per component

### ⚡ **Performance**
- **30-minute caching** via TanStack Query
- **Background updates** for fresh translations
- **Lazy loading** of translation dictionaries

### 🧪 **Developer Experience**
- **MSW integration** for offline development
- **Deterministic fallbacks** replace random text
- **SSR-safe** implementation with DOM sync

## 📋 Supported Languages

| Code | Language | Status | Usage |
|------|----------|--------|--------|
| `el` | Ελληνικά (Greek) | ✅ Active | Primary learning content |
| `en` | English | ✅ Active | Default interface language |
| `ru` | Русский (Russian) | ✅ Active | Alternative interface |

## 🔧 Configuration

### Environment Setup
```bash
# Generate translation registry after adding keys
pnpm generate:i18n

# Development with mock translations
pnpm dev

# Production build with optimized translations
pnpm build
```

### File Structure
```
src/i18n/
├── generated/
│   └── translation-registry.ts      # Auto-generated types
├── dictionaries/
│   ├── navigation.ts               # Navigation translations
│   ├── exercise.ts                 # Exercise translations
│   └── home.ts                     # Home page translations
├── dictionary.ts                   # Core dictionary implementation
└── manual-fallbacks.json           # Manual fallback definitions
```

## 📊 Performance Metrics

### Bundle Impact
- **Registry Types**: ~15KB (generated TypeScript definitions)
- **Runtime Code**: ~8KB (hooks and utilities)
- **Per Dictionary**: ~2KB (feature-scoped translations)
- **Total Dev Impact**: ~28KB (including MSW handlers)

### Runtime Performance
- **Cache Duration**: 30 minutes per language
- **Memory Usage**: ~2KB per cached language
- **Load Time**: <100ms for translation switching

## 🧪 Testing Support

### Component Testing
```typescript
import { TestWrapper } from '@/test-utils'

test('displays translated content', () => {
  render(
    <TestWrapper language="en">
      <Component />
    </TestWrapper>
  )
})
```

### MSW Integration
```typescript
import { translationHandlers } from '@/mocks/handlers'

// Automatic mock translations for testing
const server = setupServer(...translationHandlers)
```

## 📈 Usage Statistics

### Translation Keys
- **Total Keys**: ~200 registered translation keys
- **Coverage**: 100% type-safe key definitions
- **Categories**: Navigation (15%), UI Actions (25%), Messages (20%), Forms (15%), Exercise (25%)

### Feature Dictionaries
- **Navigation**: `navigation.ts` - 8 keys
- **Exercise**: `exercise.ts` - 35 keys
- **Home**: `home.ts` - 12 keys
- **Forms**: `language.ts` - 15 keys
- **Layout**: `layout.ts` - 20 keys

## 🔗 Related Documentation

### Technical References
- **[Data Models](../technical/data-models.md)** - TypeScript type definitions
- **[API Specification](../technical/api-specification.md)** - Translation API endpoints
- **[Component Architecture](../architecture/component-architecture.md)** - React integration patterns

### Development Guides
- **[Exercise Development](../guides/exercise-development.md)** - Adding translations to exercises
- **[Accessibility Guide](../guides/accessibility.md)** - Localized accessibility patterns
- **[Performance Guidelines](../architecture/performance.md)** - i18n performance optimization

## 🆘 Common Issues & Solutions

### Missing Translation Keys
```typescript
// Problem: Key not found error
const t = useDictionary()
t('nonexistent.key')  // TypeScript error + runtime fallback

// Solution: Add key to registry and regenerate
pnpm generate:i18n
```

### Bundle Size Growth
```typescript
// Problem: Large bundle with all dictionaries
import * from '@/i18n/dictionaries'  // ❌ Imports everything

// Solution: Import only needed dictionaries
import { navigationDictionary } from '@/i18n/dictionaries/navigation'  // ✅
```

### SSR Hydration Issues
```typescript
// Problem: Language mismatch between server and client
// Solution: Use useSettingsSync() in app root
function App() {
  useSettingsSync()  // Ensures DOM sync after hydration
  return <Router />
}
```