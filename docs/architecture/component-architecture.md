# Component architecture

This document describes the component system and design patterns used in the **Learn Greek** application.

## 🏗️ Component hierarchy

### Application-level components

```
App (Root)
├── Header (Conditional - hidden on exercise pages)
├── ErrorBoundary
├── Suspense
└── Routes
    ├── HomePage
    ├── ExerciseLibrary
    ├── ExerciseBuilder
    └── ExercisePage
        └── WordFormExerciseWrapper
```

### Component categories

#### 🎛️ Layout components

**Purpose**: Application structure and navigation

- **Header.tsx** - Main application header with adaptive design
  - **HeaderLogo.tsx** - Custom logo with Greek letters (ΕΛ)
  - **HeaderNavigation.tsx** - Responsive navigation menu
  - **HeaderSettings.tsx** - Compact settings controls
- **Footer.tsx** - Application footer with links and copyright
- **MainNavigation.tsx** - Homepage navigation cards

#### 🎨 UI components

**Purpose**: Reusable interface elements

- **NavigationCard.tsx** - Interactive cards for navigation
- **ThemeToggle.tsx** - Full theme switcher with text
- **CompactThemeToggle.tsx** - Icon-only theme switcher
- **LanguageSelector.tsx** - Button-based language selection
- **LanguageDropdown.tsx** - Dropdown language selection with flags
- **UserLanguageSelector.tsx** - User preference language selector

#### 📚 Exercise library slice (`pages/exercise-library/`)

**Purpose**: Structured browsing experience for the exercise catalogue

- **ExerciseLibrary.tsx** – page container that orchestrates data loading, translations, and feature slices
- **components/LibraryHeader.tsx** – animated hero header for the page
- **components/UserSettings.tsx** – collapsible settings summary with user language selector
- **components/ExerciseFilters.tsx** – collapsible filters with difficulty/tag chips and inline summary state
- **components/ExerciseGrid.tsx** – animated card grid with empty state and CTA buttons
- **hooks/useExerciseFiltering.ts** – memoised filtering logic with reset helper used by the page container

#### 🎯 Exercise components

**Purpose**: Exercise system implementation

##### Shared components (`components/exercises/shared/`)

- **ExerciseLayout.tsx** - Common layout wrapper
- **ExerciseHeader.tsx** - Header with progress and controls
- **HintSystem.tsx** - Adaptive hint display system
- **PulseEffect.tsx** - Animated feedback component

##### Word-form components (`components/exercises/word-form/`)

- **WordFormExercise.tsx** - Main exercise controller
- **WordFormExerciseWrapper.tsx** - Page integration wrapper
- **WordFormInput.tsx** - Text input with validation
- **WordFormFeedback.tsx** - Answer feedback display
- **CompletionScreen.tsx** - Exercise completion summary
- **ExerciseContent.tsx** - Content renderer
- **ExerciseRenderer.tsx** - State machine renderer

## 🎨 Design patterns

### Composition over inheritance

The application uses composition patterns throughout:

```tsx
// Layout composition
<ExerciseLayout>
  <ExerciseHeader>
    <PulseEffect variant="success" />
  </ExerciseHeader>
  <WordFormInput />
  <WordFormFeedback />
</ExerciseLayout>

// Header composition
<Header>
  <HeaderLogo />
  <HeaderNavigation />
  <HeaderSettings>
    <CompactThemeToggle />
    <LanguageDropdown />
  </HeaderSettings>
</Header>
```

### State management patterns

#### Local state (useState)

Used for component-specific UI state:

```tsx
// Example: Mobile menu toggle
const [isMenuOpen, setIsMenuOpen] = useState(false)

// Example: Form input state
const [userAnswer, setUserAnswer] = useState('')
```

#### Global state (Zustand)

Used for cross-component settings:

```tsx
// Settings store
const { theme, uiLanguage, userLanguage } = useSettingsStore()
```

#### Server state (TanStack Query)

Used for API data management:

```tsx
// Exercise data
const { data: exercise, isLoading } = useExercise(exerciseId)

// Translation data
const { t } = useI18n()
```

### Component communication patterns

#### Props drilling (limited scope)

```tsx
<WordFormExercise
  exercise={exercise}
  onComplete={handleComplete}
/>
```

#### Context for cross-cutting concerns

```tsx
// Language context
<LanguageProvider>
  <App />
</LanguageProvider>
```

#### Custom hooks for logic reuse

```tsx
// Exercise-specific hooks
const pulseState = usePulseEffect()
const hintState = useHintState()

// Data fetching hooks
const { data: exercises } = useExercises()
```

## 📱 Responsive design patterns

### Adaptive navigation

The header component demonstrates adaptive design:

```tsx
// Desktop layout
<div className="hidden md:flex items-center space-x-4">
  <HeaderNavigation />
  <HeaderSettings />
</div>

// Mobile layout
<div className="md:hidden">
  <button onClick={toggleMenu}>
    {/* Burger menu */}
  </button>
  {isMenuOpen && <MobileMenu />}
</div>
```

### Responsive utilities

Common responsive patterns used throughout:

- **Breakpoints**: `sm:` (640px+), `md:` (768px+), `lg:` (1024px+)
- **Typography**: `text-sm md:text-base lg:text-lg`
- **Spacing**: `p-4 md:p-6 lg:p-8`
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## 🎭 Animation patterns

### Framer Motion integration

Consistent animation patterns across components:

#### Page transitions

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

#### Hover effects

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

#### Pulse feedback

```tsx
<motion.div
  animate={pulseState.isActive ? {
    boxShadow: [`0 0 0 0 ${color}40`, `0 0 0 20px ${color}00`]
  } : {}}
  transition={{ duration: 0.6 }}
>
  {children}
</motion.div>
```

### Animation timing

Consistent timing values:

- **Quick feedback**: 0.1-0.2s
- **Standard transitions**: 0.3s
- **Complex animations**: 0.6s
- **Page loads**: 0.3-0.5s

## 🌍 Internationalization patterns

### Multi-level translation system

The app supports dual language systems:

#### UI Language (interface)

```tsx
const { t } = useI18n() // Uses uiLanguage from settings
return <button>{t('exercise.start')}</button>
```

#### User Language (exercise hints)

```tsx
const { userLanguage } = useSettingsStore()
const hint = block.nameHintI18n[userLanguage]
```

### Hint system patterns

Adaptive hint display based on device capabilities:

```tsx
// Desktop: hover to show
<div onMouseEnter={showHint} onMouseLeave={hideHint}>
  {content}
  {showHint && <Tooltip>{hint}</Tooltip>}
</div>

// Mobile: tap to toggle
<div onClick={toggleHint}>
  {content}
  {showHint && <HintBubble>{hint}</HintBubble>}
</div>
```

## 🔧 Development patterns

### TypeScript patterns

#### Strict typing for component props

```tsx
interface ExerciseHeaderProps {
  title: string
  progress: {
    current: number
    total: number
  }
  onSkip?: () => void
  onRestart: () => void
}
```

#### Generic components

```tsx
interface NavigationCardProps<T = string> {
  title: string
  description: string
  href: T
  icon: ReactNode
}
```

### Error handling patterns

#### Component-level error boundaries

```tsx
<ErrorBoundary fallback={<ExerciseErrorFallback />}>
  <WordFormExercise exercise={exercise} />
</ErrorBoundary>
```

#### Graceful degradation

```tsx
// Fallback for missing translations
const displayText = translations[key] ?? fallbackTexts[key] ?? key
```

### Testing patterns

#### Component testing structure

```tsx
describe('WordFormExercise', () => {
  const mockExercise = createMockExercise()

  it('renders exercise content', () => {
    render(<WordFormExercise exercise={mockExercise} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('handles answer submission', async () => {
    // Test user interactions
  })
})
```

## 🚀 Performance patterns

### Code splitting

```tsx
// Lazy loading for exercise pages
const ExercisePage = lazy(() => import('../pages/ExercisePage'))

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ExercisePage />
</Suspense>
```

### Memoization patterns

```tsx
// Expensive calculations
const normalizedAnswers = useMemo(() =>
  answers.map(normalizeGreekText),
  [answers]
)

// Stable callbacks
const handleSubmit = useCallback((answer: string) => {
  validateAnswer(answer)
}, [validateAnswer])
```

### Render optimization

```tsx
// Prevent unnecessary re-renders
const MemoizedExerciseCard = memo(ExerciseCard, (prev, next) =>
  prev.exercise.id === next.exercise.id
)
```

## 📋 Component guidelines

### Naming conventions

- **PascalCase** for component files: `WordFormExercise.tsx`
- **camelCase** for props and functions: `onComplete`, `isLoading`
- **SCREAMING_SNAKE_CASE** for constants: `DEFAULT_TIMEOUT`

### File organization

```
components/
├── ui/               # Reusable UI elements
├── layout/           # App structure components
├── exercises/
│   ├── shared/       # Common exercise components
│   └── word-form/    # Specific exercise type
└── common/           # Utility components
```

### Component size guidelines

- **Small**: < 100 lines (UI components)
- **Medium**: 100-300 lines (feature components)
- **Large**: 300+ lines (page components, complex controllers)

### Reusability principles

1. **Single responsibility**: Each component has one clear purpose
2. **Composition friendly**: Components work well together
3. **Configurable**: Props allow customization without modification
4. **Accessible**: ARIA labels and keyboard navigation
5. **Testable**: Easy to test in isolation