# Phase 7: Multi-type exercise system architecture

**Status**: In Progress
**Started**: 2025-01-02
**Goal**: Reorganize application architecture to support multiple exercise types (flashcard, multiple-choice, word-form)

## Executive summary

This document outlines the complete reorganization of the exercise system to support multiple types of exercises through a flexible, extensible architecture using the Registry Pattern and Component Factory.

## Current architecture analysis

### Problems with current implementation

1. **Hard coupling to word-form type**
   - `ExercisePage.tsx` has hardcoded switch statement for exercise types
   - `LearnPage.tsx` explicitly checks for `exercise.type !== 'word-form'`
   - Library cards are identical for all types (no customization)

2. **No abstraction layer**
   - No common interface for different exercise types
   - Each new type requires manual changes in multiple files
   - Difficult to test in isolation

3. **Logic duplication**
   - Hint system, progress tracking, state machine are word-form specific
   - Will need to duplicate for each new type

4. **Complex integration**
   - Adding flashcard or multiple-choice requires changes in:
     - ExercisePage (render logic)
     - LearnPage (learn view)
     - ExerciseLibrary (cards)
     - API layer (hooks)

### What's already good

- ✅ FSD architecture with clear boundaries
- ✅ HintSystem is already universal (works with any hints)
- ✅ ExercisePage has type switch (lines 69-101) - just needs better implementation
- ✅ Exercise types already defined in `shared/model/types/exercises.ts`
- ✅ Strong TypeScript typing throughout

## New architecture design

### Core principles

1. **Open/Closed Principle**: Open for extension (new exercise types), closed for modification (pages/library)
2. **Dependency Inversion**: Pages depend on abstractions, not concrete implementations
3. **Single Responsibility**: Each exercise type is self-contained feature
4. **FSD Compliance**: Maintain Feature-Sliced Design architecture

### Architecture layers

```
┌─────────────────────────────────────────────────────────┐
│                      Pages Layer                         │
│  ExercisePage │ LearnPage │ ExerciseLibrary             │
│  (Use factory to get components - no type knowledge)    │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  Factory Layer (Entities)                │
│  ExerciseComponentFactory                                │
│  - getExerciseRenderer(type) → Component                │
│  - getExerciseLearnView(type) → Component               │
│  - getExerciseLibraryCard(type) → Component             │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Registry Layer (Entities)                   │
│  ExerciseTypeRegistry                                    │
│  - Map<ExerciseType, ExerciseComponents>                │
│  - register(type, components)                           │
│  - get(type) → components                               │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│           Feature Implementations (Features)             │
│  word-form-exercise │ flashcard-exercise │ ...          │
│  Each implements ExerciseRendererContract               │
└─────────────────────────────────────────────────────────┘
```

## Implementation plan

### Phase 1: Create abstractions (Foundation)

#### 1.1. Exercise renderer contract

**File**: `src/entities/exercise/model/exercise-renderer-contract.ts`

Define universal interfaces that all exercise types must implement:

```typescript
// Base state interface
export interface ExerciseState {
  status: ExerciseStatus
  progress: ExerciseProgress
  statistics: ExerciseStatistics
}

// Base progress interface
export interface ExerciseProgress {
  current: number
  total: number
  completed: number
  percentage: number
}

// Base statistics interface
export interface ExerciseStatistics {
  correct: number
  incorrect: number
  skipped: number
  hintsUsed: number
  timeSpentMs: number
}

// Universal renderer props
export interface ExerciseRendererProps<TExercise = unknown> {
  exercise: TExercise
  onComplete?: (result: ExerciseResult) => void
  onExit?: () => void
}

// Universal learn view props
export interface ExerciseLearnViewProps<TExercise = unknown> {
  exercise: TExercise
  viewMode: 'table' | 'json'
}

// Universal library card props (optional - uses default if not provided)
export interface ExerciseLibraryCardProps {
  exercise: ExerciseSummary
  t: TranslationFunction
}
```

#### 1.2. Exercise type registry

**File**: `src/entities/exercise/model/exercise-type-registry.ts`

Create registry to map exercise types to their components:

```typescript
export interface ExerciseTypeComponents {
  Renderer: ComponentType<ExerciseRendererProps>
  LearnView: ComponentType<ExerciseLearnViewProps>
  LibraryCard?: ComponentType<ExerciseLibraryCardProps> // Optional
}

class ExerciseTypeRegistry {
  private registry = new Map<ExerciseType, ExerciseTypeComponents>()

  register(type: ExerciseType, components: ExerciseTypeComponents): void
  get(type: ExerciseType): ExerciseTypeComponents | undefined
  has(type: ExerciseType): boolean
}

export const exerciseTypeRegistry = new ExerciseTypeRegistry()
```

#### 1.3. Component factory

**File**: `src/entities/exercise/lib/exercise-component-factory.ts`

Create factory functions to retrieve components:

```typescript
export function getExerciseRenderer(
  type: ExerciseType
): ComponentType<ExerciseRendererProps> | null {
  const components = exerciseTypeRegistry.get(type)
  return components?.Renderer ?? null
}

export function getExerciseLearnView(
  type: ExerciseType
): ComponentType<ExerciseLearnViewProps> | null {
  const components = exerciseTypeRegistry.get(type)
  return components?.LearnView ?? null
}

export function getExerciseLibraryCard(
  type: ExerciseType
): ComponentType<ExerciseLibraryCardProps> | null {
  const components = exerciseTypeRegistry.get(type)
  return components?.LibraryCard ?? null
}
```

### Phase 2: Reorganize word-form

#### 2.1. Move word-form to features/

**Current location**: `src/pages/exercise/ui/word-form-exercise/`
**New location**: `src/features/word-form-exercise/`

New structure:
```
src/features/word-form-exercise/
├── ui/
│   ├── WordFormRenderer.tsx (entry point for execution)
│   ├── WordFormLearnView.tsx (entry point for learning)
│   ├── components/
│   │   ├── ExerciseContent.tsx
│   │   ├── WordFormInput.tsx
│   │   ├── WordFormFeedback.tsx
│   │   ├── CompletionScreen.tsx
│   │   └── ExerciseRenderer.tsx
│   ├── exercise-header/
│   │   └── ExerciseHeader.tsx
│   └── hint-system/ (keep existing structure)
├── model/
│   ├── wordFormMachine.ts (state machine)
│   ├── useWordFormExercise.ts (main hook)
│   └── types.ts (word-form specific types)
├── lib/
│   └── word-form-utils.ts (Greek text processing, etc.)
├── word-form-adapter.ts (NEW - adapts to contract)
└── index.ts (barrel export)
```

#### 2.2. Create word-form adapter

**File**: `src/features/word-form-exercise/word-form-adapter.ts`

Adapt existing word-form to new contract:

```typescript
export function WordFormRenderer({
  exercise,
  onComplete,
  onExit
}: ExerciseRendererProps<WordFormExercise>) {
  // Existing WordFormExercise logic wrapped in contract
  return <WordFormExerciseWrapper exercise={exercise} ... />
}

export function WordFormLearnView({
  exercise,
  viewMode
}: ExerciseLearnViewProps<WordFormExercise>) {
  // Existing TableView/JsonView logic
  return viewMode === 'table'
    ? <TableView exercise={exercise} />
    : <JsonView exercise={exercise} />
}
```

#### 2.3. Register word-form in registry

**File**: `src/features/word-form-exercise/index.ts`

```typescript
import { exerciseTypeRegistry } from '@/entities/exercise'
import { WordFormRenderer, WordFormLearnView } from './word-form-adapter'

// Auto-register on import
exerciseTypeRegistry.register('word-form', {
  Renderer: WordFormRenderer,
  LearnView: WordFormLearnView
})

export { WordFormRenderer, WordFormLearnView }
```

### Phase 3: Refactor pages to use factory

#### 3.1. Update ExercisePage

**File**: `src/pages/exercise/ui/ExercisePage.tsx`

**Before**:
```typescript
switch (exercise.type) {
  case 'word-form':
    return <WordFormExercise ... />
  default:
    return <UnsupportedType />
}
```

**After**:
```typescript
const Renderer = getExerciseRenderer(exercise.type)

if (!Renderer) {
  return <UnsupportedType type={exercise.type} />
}

return <Renderer exercise={exercise} onComplete={...} onExit={...} />
```

#### 3.2. Update LearnPage

**File**: `src/pages/learn/ui/LearnPage.tsx`

**Before**:
```typescript
if (exercise.type !== 'word-form') {
  return <UnsupportedExerciseNotice />
}

return viewMode === 'table'
  ? <TableView exercise={exercise} />
  : <JsonView exercise={exercise} />
```

**After**:
```typescript
const LearnView = getExerciseLearnView(exercise.type)

if (!LearnView) {
  return <UnsupportedExerciseNotice type={exercise.type} />
}

return <LearnView exercise={exercise} viewMode={viewMode} />
```

#### 3.3. Update ExerciseLibrary

**File**: `src/pages/exercise-library/ui/ExerciseGrid.tsx`

**Before**:
```typescript
function ExerciseCard({ exercise, ... }) {
  // Same card for all types
  return <motion.div>...</motion.div>
}
```

**After**:
```typescript
function ExerciseCard({ exercise, ... }) {
  const CustomCard = getExerciseLibraryCard(exercise.type)

  if (CustomCard) {
    return <CustomCard exercise={exercise} t={t} />
  }

  // Default card for types without custom implementation
  return <DefaultExerciseCard exercise={exercise} t={t} />
}
```

### Phase 4: Hint system enhancements

#### 4.1. Add variant prop to HintSystem

**File**: `src/pages/exercise/ui/word-form-exercise/hint-system/components/HintSystem.tsx`

```typescript
interface HintSystemProps {
  primaryText: string
  hints: Partial<Record<Language, string>>
  className?: string
  icon?: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  variant?: 'tooltip' | 'card' | 'inline' // NEW
}
```

Variants:
- `tooltip` (default): Current hover/tap behavior for word-form
- `card`: Display hint on flashcard back (larger, centered)
- `inline`: Display hint next to question (multiple-choice)

#### 4.2. Create hint adapters

**File**: `src/features/hint-system/lib/hint-adapters.ts`

```typescript
export function adaptWordFormHints(
  block: WordFormBlock,
  case: WordFormCase
): HintSystemProps[]

export function adaptFlashcardHints(
  card: FlashCard
): HintSystemProps[]

export function adaptMultipleChoiceHints(
  question: MCQuestion
): HintSystemProps[]
```

### Phase 5: Create stubs for new exercise types

#### 5.1. Flashcard stub

**File**: `src/features/flashcard-exercise/ui/FlashcardRenderer.tsx`

```typescript
export function FlashcardRenderer({
  exercise,
  onComplete,
  onExit
}: ExerciseRendererProps<FlashcardExercise>) {
  return (
    <div className="p-8 text-center">
      <h2>Flashcard Exercise</h2>
      <p>Coming in Phase 7.2</p>
      <button onClick={onExit}>Back to Library</button>
    </div>
  )
}
```

**File**: `src/features/flashcard-exercise/index.ts`

```typescript
import { exerciseTypeRegistry } from '@/entities/exercise'
import { FlashcardRenderer } from './ui/FlashcardRenderer'

exerciseTypeRegistry.register('flashcard', {
  Renderer: FlashcardRenderer,
  LearnView: FlashcardRenderer // Temporary stub
})
```

#### 5.2. Multiple-choice stub

Similar structure to flashcard stub.

### Phase 6: Testing strategy

#### 6.1. Test registry

**File**: `src/entities/exercise/model/__tests__/exercise-type-registry.test.ts`

```typescript
describe('ExerciseTypeRegistry', () => {
  it('registers and retrieves exercise types', () => {
    const registry = new ExerciseTypeRegistry()
    const components = { Renderer: MockRenderer, LearnView: MockLearnView }

    registry.register('test-type', components)

    expect(registry.get('test-type')).toBe(components)
  })

  it('returns undefined for unregistered types', () => {
    const registry = new ExerciseTypeRegistry()
    expect(registry.get('unknown')).toBeUndefined()
  })
})
```

#### 6.2. Test factory

**File**: `src/entities/exercise/lib/__tests__/exercise-component-factory.test.ts`

```typescript
describe('getExerciseRenderer', () => {
  it('returns renderer for registered type', () => {
    exerciseTypeRegistry.register('word-form', {
      Renderer: WordFormRenderer,
      LearnView: WordFormLearnView
    })

    const Renderer = getExerciseRenderer('word-form')
    expect(Renderer).toBe(WordFormRenderer)
  })

  it('returns null for unregistered type', () => {
    const Renderer = getExerciseRenderer('unknown')
    expect(Renderer).toBeNull()
  })
})
```

#### 6.3. Update existing tests

- Update word-form tests to use new paths
- Ensure ExercisePage tests work with factory
- Ensure LearnPage tests work with factory

### Phase 7: Documentation

#### 7.1. Architecture documentation

**File**: `docs/architecture/multi-type-exercise-system.md`

Content:
- Registry Pattern explanation
- Component Factory usage
- How to add new exercise type (step-by-step)
- Interface contracts
- Examples

#### 7.2. Developer guide

**File**: `docs/guides/adding-exercise-type.md`

Content:
- Prerequisites
- Step-by-step guide with code examples
- Testing checklist
- Common pitfalls

## File structure after reorganization

```
src/
├── entities/exercise/
│   ├── model/
│   │   ├── types.ts (existing)
│   │   ├── exercise-renderer-contract.ts (NEW)
│   │   ├── exercise-type-registry.ts (NEW)
│   │   └── __tests__/
│   │       └── exercise-type-registry.test.ts (NEW)
│   ├── lib/
│   │   ├── exercise-component-factory.ts (NEW)
│   │   └── __tests__/
│   │       └── exercise-component-factory.test.ts (NEW)
│   └── api/ (no changes)
│
├── features/
│   ├── word-form-exercise/ (MOVED from pages/exercise/ui/word-form-exercise)
│   │   ├── ui/
│   │   │   ├── WordFormRenderer.tsx (entry point)
│   │   │   ├── WordFormLearnView.tsx (entry point)
│   │   │   ├── components/ (existing components)
│   │   │   ├── exercise-header/ (existing)
│   │   │   └── hint-system/ (existing)
│   │   ├── model/
│   │   │   ├── wordFormMachine.ts (existing)
│   │   │   └── useWordFormExercise.ts (existing)
│   │   ├── lib/
│   │   │   └── word-form-utils.ts
│   │   ├── word-form-adapter.ts (NEW)
│   │   └── index.ts (barrel + registration)
│   │
│   ├── flashcard-exercise/ (NEW)
│   │   ├── ui/
│   │   │   └── FlashcardRenderer.tsx (stub)
│   │   └── index.ts
│   │
│   ├── multiple-choice-exercise/ (NEW)
│   │   ├── ui/
│   │   │   └── MultipleChoiceRenderer.tsx (stub)
│   │   └── index.ts
│   │
│   └── hint-system/ (existing, UPDATED)
│       ├── ui/
│       │   └── HintSystem.tsx (add variant prop)
│       └── lib/
│           └── hint-adapters.ts (NEW)
│
├── pages/
│   ├── exercise/
│   │   └── ui/
│   │       ├── ExercisePage.tsx (REFACTORED - uses factory)
│   │       └── translations.ts
│   │
│   ├── learn/
│   │   └── ui/
│   │       ├── LearnPage.tsx (REFACTORED - uses factory)
│   │       └── translations.ts
│   │
│   └── exercise-library/
│       └── ui/
│           ├── ExerciseLibrary.tsx (no changes)
│           └── ExerciseGrid.tsx (UPDATED - custom cards support)
│
└── docs/
    ├── Phase 7.md (THIS FILE)
    ├── architecture/
    │   └── multi-type-exercise-system.md (NEW)
    └── guides/
        └── adding-exercise-type.md (NEW)
```

## Benefits of new architecture

### 1. Extensibility
- **Before**: Add new type = modify 4+ files (ExercisePage, LearnPage, ExerciseLibrary, API)
- **After**: Add new type = create feature + register in one file

### 2. Maintainability
- **Before**: Exercise logic scattered across pages/
- **After**: Each type is self-contained in features/

### 3. Testability
- **Before**: Hard to test page logic without specific exercise types
- **After**: Pages test with mock components, features test in isolation

### 4. Type safety
- **Before**: Generic `exercise: any` in many places
- **After**: Generic props `<TExercise>` with proper typing

### 5. Code reuse
- **Before**: Duplicate hint system, progress bar, etc. for each type
- **After**: Shared components in shared/ and entities/

## Migration checklist

- [ ] Create exercise-renderer-contract.ts with interfaces
- [ ] Create exercise-type-registry.ts with Registry class
- [ ] Create exercise-component-factory.ts with factory functions
- [ ] Move word-form-exercise from pages/ to features/
- [ ] Create word-form-adapter.ts
- [ ] Register word-form in registry
- [ ] Refactor ExercisePage to use factory
- [ ] Refactor LearnPage to use factory
- [ ] Update ExerciseLibrary for custom cards
- [ ] Create flashcard-exercise stub
- [ ] Create multiple-choice-exercise stub
- [ ] Add variant prop to HintSystem
- [ ] Update all tests
- [ ] Create architecture documentation
- [ ] Create developer guide
- [ ] Run `pnpm validate` - all checks pass
- [ ] Update ROADMAP.md - Phase 7.1 complete

## Next steps (Phase 7.2)

After architecture reorganization is complete:

1. **Implement Flashcard System**
   - Full FlashcardRenderer with flip animation
   - SM-2 spaced repetition algorithm
   - IndexedDB persistence
   - FlashcardLearnView
   - Sample flashcard exercises

2. **Implement Multiple-Choice System**
   - MultipleChoiceRenderer with randomized options
   - Progress tracking
   - Explanation display
   - MultipleChoiceLearnView
   - Sample multiple-choice exercises

3. **Exercise Builder Enhancement**
   - Support creating flashcard exercises
   - Support creating multiple-choice exercises
   - Visual editor (not just JSON)

## Risks and mitigation

### Risk 1: Large refactoring of word-form
**Impact**: High
**Probability**: Medium
**Mitigation**:
- Move files gradually
- Keep old structure until new one is fully working
- Test after each step

### Risk 2: Breaking existing tests
**Impact**: High
**Probability**: High
**Mitigation**:
- Update tests in parallel with refactoring
- Run tests after each change
- Use git branches for safety

### Risk 3: Import path changes
**Impact**: Medium
**Probability**: High
**Mitigation**:
- Use TypeScript to catch broken imports
- Update all imports in single commit
- Use find-and-replace for bulk updates

### Risk 4: Registry not initialized
**Impact**: High
**Probability**: Low
**Mitigation**:
- Auto-register on feature import
- Add runtime checks in factory
- Log warnings for unregistered types

## Success criteria

1. ✅ All existing word-form functionality works unchanged
2. ✅ ExercisePage works with factory pattern
3. ✅ LearnPage works with factory pattern
4. ✅ Flashcard and multiple-choice stubs render correctly
5. ✅ All tests pass (`pnpm test:ci`)
6. ✅ E2E tests pass (`pnpm test:e2e:ci`)
7. ✅ Coverage remains >80% statements/lines/functions
8. ✅ `pnpm validate` passes all checks
9. ✅ No FSD boundary violations (`pnpm lint:boundaries`)
10. ✅ Documentation is complete and accurate

## Timeline estimate

- **Phase 1** (Abstractions): 2-3 hours
- **Phase 2** (Move word-form): 3-4 hours
- **Phase 3** (Refactor pages): 2-3 hours
- **Phase 4** (Hint system): 1-2 hours
- **Phase 5** (Stubs): 1 hour
- **Phase 6** (Testing): 2-3 hours
- **Phase 7** (Documentation): 1-2 hours

**Total**: 12-18 hours (3-4 work sessions)

---

**Document version**: 1.0
**Last updated**: 2025-01-02
**Status**: Ready for implementation
