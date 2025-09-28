# Data Models

## 📋 Core Data Structures

### Exercise Metadata

Interface for exercise list display and filtering.

```typescript
interface ExerciseMetadata {
  id: string                                    // Unique identifier
  title: string                                 // Default title
  titleI18n: Record<Language, string>           // Localized titles
  tags: string[]                                // Categorization tags
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTimeMinutes: number                  // Estimated completion time
  totalBlocks: number                           // Number of question blocks
  totalCases: number                            // Total questions
}
```

### Exercise Data Structure

Complete exercise definition with questions and metadata.

```typescript
interface Exercise {
  id: string
  title: string
  titleI18n: Record<Language, string>
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTimeMinutes: number
  description?: string
  descriptionI18n?: Record<Language, string>
  blocks: ExerciseBlock[]
}

interface ExerciseBlock {
  id: string
  title?: string
  titleI18n?: Record<Language, string>
  description?: string
  descriptionI18n?: Record<Language, string>
  cases: ExerciseCase[]
}

interface ExerciseCase {
  id: string
  question: string
  questionI18n?: Record<Language, string>
  correctAnswer: string
  hints?: HintData[]
  alternatives?: string[]                       // Alternative correct answers
  explanation?: string
  explanationI18n?: Record<Language, string>
}
```

### Language and Localization

```typescript
type Language = 'el' | 'en' | 'ru'

interface TranslationData {
  [key: string]: string
}

interface LocalizedString {
  el?: string     // Greek
  en?: string     // English
  ru?: string     // Russian
}
```

### State Management Models

#### Settings State (Zustand)

```typescript
interface SettingsState {
  theme: 'light' | 'dark'
  uiLanguage: Language
  userLanguage: Language
  setTheme: (theme: 'light' | 'dark') => void
  setUiLanguage: (lang: Language) => void
  setUserLanguage: (lang: Language) => void
}
```

#### Exercise State Machine

```typescript
type ExerciseState =
  | 'loading'
  | 'ready'
  | 'answering'
  | 'feedback'
  | 'completed'
  | 'error'

interface ExerciseProgress {
  currentBlockIndex: number
  currentCaseIndex: number
  answers: ExerciseAnswer[]
  startTime: number
  hintsUsed: number
  score: {
    correct: number
    incorrect: number
    total: number
  }
}

interface ExerciseAnswer {
  caseId: string
  userAnswer: string
  isCorrect: boolean
  timeSpent: number
  hintsUsed: number
}
```

### Component Props Types

#### Exercise Component Props

```typescript
interface WordFormExerciseProps {
  exercise: Exercise
  onComplete: (progress: ExerciseProgress) => void
  onExit: () => void
}

interface ExerciseLayoutProps {
  title: string
  progress: {
    current: number
    total: number
  }
  onBack: () => void
  children: React.ReactNode
}
```

### API Response Types

#### Exercise API Responses

```typescript
// GET /exercises
type ExercisesResponse = ExerciseMetadata[]

// GET /exercises/:id
type ExerciseResponse = Exercise

// Error response
interface ApiError {
  error: string
  message?: string
  statusCode: number
}
```

### Validation Schemas

#### Valibot Schemas

```typescript
import { object, string, array, number, optional } from 'valibot'

export const ExerciseMetadataSchema = object({
  id: string(),
  title: string(),
  titleI18n: object({
    el: optional(string()),
    en: optional(string()),
    ru: optional(string()),
  }),
  tags: array(string()),
  difficulty: picklist(['beginner', 'intermediate', 'advanced']),
  estimatedTimeMinutes: number(),
  totalBlocks: number(),
  totalCases: number(),
})

export const ExerciseCaseSchema = object({
  id: string(),
  question: string(),
  correctAnswer: string(),
  hints: optional(array(string())),
  alternatives: optional(array(string())),
})
```

### Performance and Optimization

#### Bundle Size Impact

```typescript
// Type definitions: ~5KB gzipped
// Validation schemas: ~15KB gzipped (Valibot + Zod)
// Mock data: ~50KB gzipped (all exercises)
```

#### Memory Usage Patterns

```typescript
// Typical session memory usage
interface MemoryProfile {
  exerciseData: '~2MB'           // All loaded exercises
  translations: '~500KB'        // UI translations
  componentState: '~50KB'       // React component state
  queryCache: '~1MB'            // TanStack Query cache
}
```

## 🔄 Data Flow Patterns

### Exercise Loading Flow

```
1. Component mounts → useExercise(id) query
2. TanStack Query checks cache
3. If not cached → MSW handler fetches JSON
4. Data validated with Valibot schema
5. Component receives typed data
6. Exercise state machine initializes
```

### State Synchronization

```
UI Component ↔ Local State (useState/useReducer)
     ↕
Global State (Zustand) ↔ localStorage persistence
     ↕
Server State (TanStack Query) ↔ MSW mock API
```

## 🔗 Related Documentation

- **[API Specification](api-specification.md)** - API endpoints and responses
- **[Technical Overview](overview.md)** - System architecture
- **[Exercise JSON Format](../exercise-json-format.md)** - JSON file structure
- **[Development Guide](../guides/exercise-development.md)** - Creating exercises

## 📊 Type Coverage Metrics

- **TypeScript Coverage**: 100% (no `any` types)
- **Runtime Validation**: Valibot schemas for all external data
- **Component Props**: Fully typed React component interfaces
- **API Responses**: Type-safe API client with proper error handling