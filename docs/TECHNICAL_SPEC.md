# Technical specification - Learn Greek

**Learn Greek** is an interactive single-page application (SPA) for learning Greek language with multilingual interface
support and customizable exercise system.

## 📋 Project overview

### Current status

**Version**: 0.1.0 (MVP)
**Stage**: Functional prototype with one exercise type
**Development**: Active

### Purpose

Create a modern, interactive language learning platform focused on Greek language practice with:

- Multiple exercise types for comprehensive learning
- JSON-based exercise configuration system
- Full internationalization support (Greek, Russian, English)
- Responsive design for desktop and mobile devices
- Offline-capable PWA functionality (planned)

### Target audience

- **Primary**: Greek language learners (beginner to advanced)
- **Secondary**: Language teachers creating custom exercises
- **Tertiary**: Developers extending the exercise system

## 🏗️ Architecture overview

### Technology stack

#### Frontend framework

- **React 19** - Latest stable version with concurrent features
- **TypeScript 5** - Strict typing for better developer experience
- **React Router 7** - Client-side routing with lazy loading

#### Build tools

- **Vite 7** - Fast build and hot module replacement
- **Biome** - Unified linting and formatting tool

#### Styling

- **Tailwind CSS v4** - Utility-first styles with CSS-in-JS support
- **Framer Motion 12** - Smooth animations and transitions

#### State management

- **TanStack Query 5** - Server state caching and synchronization
- **Zustand** - Client state management with persistence
- **React Context** - Language state management

#### Data validation

- **Valibot** - Lightweight data validation (Zod alternative)
- **React Hook Form** - Form handling with validation

#### Testing

- **Vitest** - Unit and integration testing (100% coverage required)
- **Testing Library** - React component testing
- **Playwright** - End-to-end testing
- **MSW** - API mocking for development and tests

#### Development tools

- **IndexedDB** (via Dexie.js) - Client-side data persistence
- **pnpm** - Package manager
- **GitHub Actions** - CI/CD pipeline (planned)

### System architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │    │   State Layer    │    │   Data Layer    │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ Pages           │    │ TanStack Query   │    │ MSW Handlers    │
│ Components      │◄──►│ Zustand Store    │◄──►│ JSON Files      │
│ Hooks           │    │ React Context    │    │ IndexedDB       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🎯 Functional requirements

### Core features

#### ✅ Implemented features

1. **Homepage with settings**
    - Theme switcher (light/dark mode)
    - UI language selector (Greek/Russian/English)
    - User language selector (for exercise hints)
    - Navigation to main sections

2. **Adaptive header navigation**
    - Desktop: full horizontal navigation
    - Mobile: burger menu with dropdown
    - Conditional display (hidden on exercise pages)
    - Compact settings controls

3. **Exercise library**
    - Browse available exercises with metadata
    - Filter by tags, difficulty level
    - Search functionality
    - Exercise statistics display

4. **Word-form exercises**
    - Text input with real-time validation
    - Multiple correct answers support
    - Greek text normalization and comparison
    - Visual feedback (green/red pulse effects)
    - Adaptive hint system (hover/tap for translations)
    - Progress tracking within exercises
    - Auto-advance settings (configurable)
    - Exercise completion statistics

5. **Internationalization system**
    - Three-language support (Greek, Russian, English)
    - API-driven translation loading
    - Fallback translation system
    - Real-time language switching
    - Dual language support (UI + user language)

6. **Data management**
    - JSON-based exercise configuration
    - MSW API mocking for development
    - TanStack Query caching (30-minute stale time)
    - Valibot schema validation
    - Settings persistence in localStorage

### 🔄 Planned features (Roadmap)

#### Phase 2 (Next)

1. **Additional word-form exercises**
    - Greek pronouns practice
    - Verb έχω (to have) conjugation
    - More irregular verbs

2. **Enhanced progress tracking**
    - Cross-session progress persistence
    - User statistics and analytics
    - Achievement system

3. **Exercise improvements**
    - Audio pronunciation support
    - Image context for vocabulary
    - Customizable difficulty levels

#### Phase 3 (Medium term)

1. **New exercise types**
    - **Translation exercises**: Greek ↔ English/Russian
    - **Flashcards**: Vocabulary memorization
    - **Multiple choice tests**: Grammar and vocabulary

2. **Exercise builder**
    - Visual JSON editor for creating exercises
    - Import/export exercise packages
    - Exercise validation and preview

3. **Social features**
    - Exercise sharing via URL
    - Community exercise library
    - Progress comparison

#### Phase 4 (Long term)

1. **PWA features**
    - Service Worker for offline usage
    - Web App Manifest for installation
    - Background sync for progress

2. **Advanced features**
    - Spaced repetition algorithm
    - Adaptive difficulty adjustment
    - Voice recognition for pronunciation

3. **Platform expansion**
    - Multiple language support (beyond Greek)
    - Teacher dashboard
    - Learning path recommendations

## 📱 User experience design

### Interface languages

**UI Languages** (interface elements):

- Greek (primary)
- Russian
- English

**User Languages** (exercise hints and translations):

- Greek
- Russian
- English

### Responsive design

#### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

#### Navigation patterns

- **Desktop**: Horizontal header with full navigation
- **Mobile**: Collapsible burger menu
- **Exercise pages**: Minimal UI for focus

#### Typography

- **Font**: Inter (preloaded for performance)
- **Sizes**: Responsive scaling (sm/base/lg/xl)
- **Greek text**: Proper Unicode support with tone handling

### Accessibility

- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **High contrast** in dark mode
- **Focus management** for form interactions
- **Semantic HTML** structure

## 🗂️ Data architecture

### Exercise data structure

#### Word-form exercises

```typescript
interface WordFormExercise {
    // Metadata
    enabled: boolean
    id: string
    type: 'word-form'
    title: string
    titleI18n: Record<Language, string>
    description: string
    descriptionI18n: Record<Language, string>

    // Classification
    tags: string[]
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedTimeMinutes: number

    // Configuration
    settings: ExerciseSettings
    blocks: WordFormBlock[]
}

interface ExerciseSettings {
    autoAdvance: boolean
    autoAdvanceDelayMs: number
    allowSkip: boolean
    shuffleCases: boolean
}

interface WordFormBlock {
    id: string
    name: string                              // Greek name
    nameHintI18n: Record<Language, string>    // Translated hints
    cases: WordFormCase[]
}

interface WordFormCase {
    id: string
    prompt: string                            // Greek prompt
    promptHintI18n: Record<Language, string>  // Translated prompts
    correct: string[]                         // Acceptable answers
    hint?: string                             // Optional Greek hint
    hintI18n?: Record<Language, string>       // Optional translated hints
}
```

### API endpoints

#### MSW Mock API

```typescript
// Exercise endpoints
GET / api / exercises           // Exercise metadata list
GET / api / exercises /
:
id       // Specific exercise data

// Translation endpoints
GET / api / texts / common        // Translation keys
GET / api / translations /
:
lang  // Localized strings
```

#### Response formats

```typescript
// Exercise metadata
interface ExerciseMetadata {
    id: string
    title: string
    titleI18n: Record<Language, string>
    tags: string[]
    difficulty: string
    estimatedTimeMinutes: number
    totalBlocks: number
    totalCases: number
}

// Translation data
interface TranslationData {
    [key: string]: string
}
```

### File organization

```
src/mocks/data/
├── exercises/
│   ├── verbs-be.json         # Greek verb είμαι
│   ├── verbs-have.json       # Greek verb έχω (planned)
│   └── pronouns.json         # Greek pronouns (planned)
├── translations/
│   ├── en.json               # English translations
│   ├── ru.json               # Russian translations
│   └── el.json               # Greek translations
└── texts/
    └── common.json           # Translation keys
```

## 🎨 Component architecture

### Component hierarchy

```
App (Root)
├── Header (Conditional)
│   ├── HeaderLogo
│   ├── HeaderNavigation
│   └── HeaderSettings
│       ├── CompactThemeToggle
│       └── LanguageDropdown
├── Routes
│   ├── HomePage
│   │   ├── UserLanguageSelector
│   │   └── MainNavigation
│   ├── ExerciseLibrary
│   ├── ExerciseBuilder (placeholder)
│   └── ExercisePage
│       └── WordFormExerciseWrapper
│           └── WordFormExercise
│               ├── ExerciseLayout
│               ├── ExerciseHeader
│               ├── WordFormInput
│               ├── WordFormFeedback
│               ├── HintSystem
│               ├── PulseEffect
│               └── CompletionScreen
└── Footer
```

### Component categories

#### Layout components

- Application structure and navigation
- Responsive design patterns
- Conditional rendering based on routes

#### UI components

- Reusable interface elements
- Consistent styling and behavior
- Accessibility features

#### Exercise components

- Shared exercise infrastructure
- Type-specific implementations
- State management and data flow

### Design patterns

- **Composition over inheritance**: Modular component structure
- **Custom hooks**: Logic extraction and reusability
- **State machines**: Predictable exercise state transitions
- **Error boundaries**: Graceful error handling
- **Memoization**: Performance optimization for expensive operations

## 🔄 State management

### Global state (Zustand)

```typescript
interface SettingsState {
    theme: 'light' | 'dark'
    uiLanguage: 'el' | 'ru' | 'en'
    userLanguage: 'el' | 'ru' | 'en'
    setTheme: (theme: Theme) => void
    setUiLanguage: (lang: Language) => void
    setUserLanguage: (lang: Language) => void
}
```

**Features**:

- Automatic localStorage persistence
- Type-safe actions
- Reactive updates across components

### Server state (TanStack Query)

**Queries**:

- `useExercises()` - Exercise metadata list
- `useExercise(id)` - Specific exercise data
- `useI18n()` - Translation data

**Caching strategy**:

- 30-minute stale time for exercises
- 30-minute stale time for translations
- Automatic background refetching
- Error retry with exponential backoff

### Local state patterns

- **useState**: Component-specific UI state
- **useReducer**: Complex state logic (exercise state machine)
- **Context**: Cross-component communication (language management)

## 🧪 Testing strategy

### Test coverage requirements

**Target**: 100% code coverage
**Current**: 100% (19/19 tests passing)

### Testing levels

#### Unit tests (Vitest + Testing Library)

```typescript
// Component testing
describe('WordFormExercise', () => {
    it('validates Greek text input correctly', () => {
        expect(normalizeGreekText('είμαι')).toBe('ειμαι')
    })
})

// Hook testing
describe('useExercise', () => {
    it('loads exercise data correctly', async () => {
        const {result} = renderHook(() => useExercise('verbs-be'))
        expect(result.current.data).toBeDefined()
    })
})
```

#### Integration tests

- Full component interaction flows
- API integration with MSW
- State management across components

#### End-to-end tests (Playwright)

```typescript
test('complete exercise flow', async ({page}) => {
    await page.goto('/exercise/verbs-be')
    await page.fill('[role="textbox"]', 'είμαι')
    await page.click('text=Check')
    await expect(page.locator('.pulse-success')).toBeVisible()
})
```

### Testing environments

- **Development**: MSW browser integration
- **Testing**: MSW Node.js server
- **E2E**: Real browser automation

## 🚀 Performance requirements

### Loading performance

- **First Contentful Paint**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **Bundle size**: < 500KB gzipped

### Runtime performance

- **Animations**: Consistent 60fps
- **Memory usage**: < 100MB for typical session
- **Greek text processing**: < 100ms for normalization

### Optimization strategies

#### Code splitting

```typescript
// Route-level splitting
const ExercisePage = lazy(() => import('./pages/ExercisePage'))

// Component-level splitting
const WordFormExercise = lazy(() =>
    import('./components/exercises/word-form/WordFormExercise')
)
```

#### Caching

- TanStack Query for API responses
- Service Worker for static assets (planned)
- localStorage for user settings

#### Bundle optimization

- Tree shaking for unused code
- Image optimization with proper formats
- Font preloading for critical text

## 🔒 Security considerations

### Data validation

- **Input sanitization**: All user inputs validated
- **Schema validation**: Valibot schemas for all data
- **Type safety**: Full TypeScript coverage

### Client-side security

- **No sensitive data**: All data is public educational content
- **localStorage**: Only user preferences stored
- **XSS prevention**: React's built-in protection + CSP headers

### API security

- **MSW mocking**: Development-only mock API
- **Production API**: HTTPS enforcement (planned)
- **Rate limiting**: API throttling (planned)

## 📊 Analytics and monitoring

### Built-in analytics

**Exercise metrics**:

- Questions answered correctly/incorrectly
- Time spent per question/exercise
- Hints accessed per question
- Exercise completion rates
- User accuracy over time

**User behavior**:

- Language preference patterns
- Exercise type preferences
- Session duration and frequency
- Feature usage statistics

### Monitoring (Planned)

- **Error tracking**: Client-side error reporting
- **Performance monitoring**: Core Web Vitals tracking
- **User feedback**: In-app feedback system

## 🛠️ Development workflow

### Commands

```bash
# Development
pnpm dev          # Start dev server (http://localhost:5173)
pnpm build        # Production build
pnpm preview      # Preview production build

# Code quality
pnpm lint         # TypeScript + Biome linting
pnpm format       # Code formatting
pnpm validate     # Full validation (lint + test + e2e)

# Testing
pnpm test         # Unit tests (watch mode)
pnpm test:ci      # Unit tests (CI mode)
pnpm test:e2e     # E2E tests with UI
pnpm test:e2e:ci  # E2E tests headless
```

### Code quality standards

- **TypeScript strict mode**: Zero compilation errors
- **100% test coverage**: All code paths tested
- **Biome linting**: Zero linting violations
- **Consistent formatting**: Automated code formatting

### Git workflow

- **Main branch**: Production-ready code
- **Feature branches**: Individual features/fixes
- **Pull requests**: Code review required
- **Conventional commits**: Standardized commit messages

## 📦 Deployment

### Build process

```bash
# Production build
pnpm build

# Output: dist/ directory
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [images/fonts]
└── mockServiceWorker.js
```

### Hosting requirements

- **Static hosting**: Single-page application
- **HTTPS**: Required for PWA features
- **Gzip compression**: Recommended for performance
- **SPA routing**: Fallback to index.html for client-side routes

## 🔮 Future considerations

### Scalability

- **Multiple languages**: Architecture supports extension beyond Greek
- **Exercise types**: Modular system for new exercise formats
- **User growth**: Client-side architecture scales naturally

### Technical debt

- **Legacy components**: Some components marked as "legacy" for refactoring
- **Testing coverage**: E2E tests need expansion for new features
- **Performance**: Bundle size monitoring as features grow

### Integration opportunities

- **Language APIs**: Google Translate, DeepL integration
- **Speech APIs**: Web Speech API for pronunciation
- **Analytics platforms**: GA4, Mixpanel integration
- **Content management**: Headless CMS for exercise content

## 📋 Quality assurance

### Code review checklist

- [ ] TypeScript compilation passes
- [ ] All tests pass (unit + integration + e2e)
- [ ] Code coverage maintains 100%
- [ ] Biome linting passes
- [ ] Performance benchmarks maintained
- [ ] Accessibility standards met
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested

### Release criteria

- [ ] All functional requirements implemented
- [ ] No critical bugs or security issues
- [ ] Performance targets met
- [ ] Documentation updated
- [ ] User acceptance testing completed
- [ ] Deployment pipeline validated

---

**Document version**: 1.0
**Last updated**: 2024-09-19
**Next review**: 2024-10-19
