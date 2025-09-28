# API Specification

## 📡 Mock API Endpoints

The application uses MSW (Mock Service Worker) to simulate API calls for development and testing.

### Exercise API

#### `GET /exercises`

Returns list of available exercises with metadata.

**Response**:
```typescript
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

type ExercisesResponse = ExerciseMetadata[]
```

**Example**:
```json
[
  {
    "id": "verbs-be",
    "title": "Greek verb 'to be' (είμαι)",
    "titleI18n": {
      "el": "Το ρήμα 'είμαι'",
      "en": "Greek verb 'to be' (είμαι)",
      "ru": "Греческий глагол 'быть' (είμαι)"
    },
    "tags": ["verbs", "beginner", "grammar"],
    "difficulty": "beginner",
    "estimatedTimeMinutes": 15,
    "totalBlocks": 6,
    "totalCases": 18
  }
]
```

#### `GET /exercises/:id`

Returns detailed exercise data for a specific exercise.

**Response**:
See [data-models.md](data-models.md) for detailed exercise structure.

### Translation API

#### `GET /translations/:language`

Returns translation data for specified language.

**Parameters**:
- `language`: 'el' | 'en' | 'ru'

**Response**:
```typescript
interface TranslationData {
  [key: string]: string
}
```

**Example**:
```json
{
  "app.title": "Learn Greek",
  "navigation.home": "Home",
  "navigation.exercises": "Exercises",
  "navigation.builder": "Builder"
}
```

## 🔄 State Management Integration

### TanStack Query Configuration

```typescript
// Query keys
export const queryKeys = {
  exercises: ['exercises'] as const,
  exercise: (id: string) => ['exercise', id] as const,
  translations: (lang: string) => ['translations', lang] as const,
}

// Query functions
export const exerciseQueries = {
  all: () => ({
    queryKey: queryKeys.exercises,
    queryFn: fetchExercises,
    staleTime: 30 * 60 * 1000, // 30 minutes
  }),

  byId: (id: string) => ({
    queryKey: queryKeys.exercise(id),
    queryFn: () => fetchExercise(id),
    staleTime: 30 * 60 * 1000,
  }),
}
```

### Caching Strategy

- **Exercises**: 30-minute stale time, cached indefinitely
- **Translations**: 30-minute stale time, cached indefinitely
- **Error Handling**: Automatic retry with exponential backoff
- **Background Refetch**: Enabled for fresh data when window regains focus

## 🗂️ File Organization

```
src/mocks/data/
├── exercises/
│   ├── verbs-be.json
│   ├── verbs-have.json
│   ├── verbs-present-tense.json
│   ├── verbs-past-tense.json
│   ├── verbs-future-tense.json
│   └── countries-nationalities.json
├── translations/
│   ├── en.json
│   ├── ru.json
│   └── el.json
└── handlers.ts              # MSW request handlers
```

### MSW Handlers

```typescript
// Example handler structure
export const exerciseHandlers = [
  http.get('/exercises', () => {
    return HttpResponse.json(exerciseMetadata)
  }),

  http.get('/exercises/:id', ({ params }) => {
    const exercise = getExerciseById(params.id as string)
    return exercise
      ? HttpResponse.json(exercise)
      : HttpResponse.json({ error: 'Not found' }, { status: 404 })
  }),
]
```

## 🔗 Related Documentation

- **[Data Models](data-models.md)** - Detailed data structures
- **[Technical Overview](overview.md)** - System architecture
- **[Exercise Development Guide](../guides/exercise-development.md)** - Creating exercises

## 📊 Performance Considerations

- **Bundle Impact**: MSW handlers add ~50KB to development bundle
- **Response Time**: Simulated 100-300ms delay for realistic testing
- **Memory Usage**: Exercise data cached in memory, ~2MB typical usage