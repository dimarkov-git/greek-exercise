# Feature-Sliced Design migration plan

Подробный план миграции проекта **Learn Greek** на архитектуру Feature-Sliced Design (FSD).

## 1. Анализ текущего состояния

### Текущая архитектура

Проект уже частично следует принципам FSD с некоторыми отклонениями:

**Существующая структура:**

```
src/
├── app/                    # ✅ Уже соответствует FSD
├── pages/                  # ✅ Уже соответствует FSD
├── components/             # ❌ Нужно распределить по слоям
│   ├── exercises/
│   ├── layout/
│   └── ui/
├── hooks/                  # ❌ Нужно распределить по слоям
├── stores/                 # ❌ Нужно переместить в shared/model
├── api/                    # ❌ Нужно переместить в shared/api
├── contexts/               # ❌ Нужно распределить по слоям
├── i18n/                   # ❌ Нужно переместить в shared/i18n
├── types/                  # ❌ Нужно распределить по слоям
└── utils/                  # ❌ Нужно переместить в shared/lib
```

### 1.1 Типичные проблемы при текущей архитектуре

1. **Смешанные архитектурные парадигмы**
    - Текущий `src/` смешивает исторические папки (`components/`, `hooks/`, `stores/`) с развивающимися доменными
      слайсами, что замедляет навигацию и поощряет кросс-импорты
    - Компоненты в `components/` смешивают UI элементы разного уровня абстракции

2. **Неявные публичные контракты**
    - Многие модули импортируются напрямую через глубокие относительные пути (например,
      `../../components/ui/ThemeToggle`), что ломает потребителей при рефакторинге и усложняет бандлинг
    - Отсутствие четких Public API через barrel exports

3. **Утечка общего состояния**
    - Zustand stores и TanStack Query hooks находятся в папках верхнего уровня без четкого владельца, что увеличивает
      риск случайной связи между несвязанными страницами
    - Хуки в `hooks/` содержат логику разных доменов

4. **Разбросанность тестов**
    - Unit и integration тесты живут рядом с legacy директориями, поэтому миграция файлов часто оставляет осиротевшие
      пути тестов, которые не проходят Vitest glob patterns

5. **Непоследовательное именование**
    - Доменная логика разбросана между `domain/`, `utils/`, и `components/exercises/`, что усложняет определение границ
      слайсов для упражнений против generic UI

### 1.2 Риски при миграции для смягчения

1. **Поломанные графы импортов**
    - Введение алиасов и перемещение файлов может нарушить Vitest мocks, MSW handlers и lazy route imports, если barrel
      exports и codemods не запланированы
    - Необходимо тщательно планировать каждый шаг

2. **Регрессия покрытия тестов**
    - Реорганизация без обновления `pnpm test --run` focus lists или snapshot путей может снизить enforced 93% coverage
      threshold
    - Важно поддерживать работоспособность тестов на каждом шаге

3. **Bundle регрессии**
    - Перемещение shared утилит в новые barrels может непреднамеренно втянуть тяжелые модули в больше бандлов (например,
      TanStack Query devtools в production), если границы tree-shaking сжимаются
    - Необходимо контролировать размер бандла после каждого этапа

4. **Translation регрессии**
    - Извлечение фич должно сохранять i18n ключи colocated; иначе скрипты генерации переводов могут пропустить новые
      namespaces
    - Критически важно для многоязычного приложения

5. **Конфликты параллельной работы**
    - Крупномасштабные перемещения будут конфликтовать с Renovate или feature branches; планировать инкрементальные PR с
      четким ownership для избежания merge churn
    - Рекомендуется координация с другими разработчиками

## 2. Целевая структура проекта

### Слои FSD

```
src/
├── app/           # Инициализация приложения, провайдеры, роутинг
├── processes/     # Сложные бизнес-процессы (пока не используется)
├── pages/         # Страницы приложения
├── widgets/       # Составные блоки интерфейса
├── features/      # Функциональность с бизнес-логикой
├── entities/      # Бизнес-сущности
└── shared/        # Переиспользуемый код без бизнес-логики
```

### Пример дерева каталогов для маршрута упражнения

```
src/
├── app/
│   ├── providers/
│   │   ├── query.tsx
│   │   └── index.ts
│   ├── router/
│   │   ├── routes.tsx
│   │   └── index.ts
│   └── index.ts
├── pages/
│   └── exercise/
│       ├── ui/
│       │   └── exercise-page.tsx
│       ├── model/
│       │   └── use-exercise-state.ts
│       └── index.ts
├── widgets/
│   ├── exercise-header/
│   │   ├── ui/
│   │   │   └── exercise-header.tsx
│   │   └── index.ts
│   └── exercise-layout/
│       ├── ui/
│       │   └── exercise-layout.tsx
│       └── index.ts
├── features/
│   ├── word-form-exercise/
│   │   ├── ui/
│   │   │   ├── word-form-input.tsx
│   │   │   ├── word-form-feedback.tsx
│   │   │   └── completion-screen.tsx
│   │   ├── model/
│   │   │   └── exercise-store.ts
│   │   ├── api/
│   │   │   └── exercise-api.ts
│   │   └── index.ts
│   └── hint-system/
│       ├── ui/
│       │   └── hint-tooltip.tsx
│       ├── model/
│       │   └── use-hint-state.ts
│       └── index.ts
├── entities/
│   ├── exercise/
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   └── validation.ts
│   │   ├── api/
│   │   │   └── exercise-api.ts
│   │   └── index.ts
│   └── user/
│       ├── model/
│       │   └── types.ts
│       └── index.ts
└── shared/
    ├── ui/
    │   ├── button/
    │   │   ├── button.tsx
    │   │   └── index.ts
    │   ├── input/
    │   │   ├── input.tsx
    │   │   └── index.ts
    │   └── index.ts
    ├── api/
    │   ├── http-client.ts
    │   └── index.ts
    ├── lib/
    │   ├── react-query.ts
    │   ├── validation.ts
    │   └── index.ts
    ├── config/
    │   ├── constants.ts
    │   └── index.ts
    └── model/
        ├── store.ts
        └── index.ts
```

### Пример Public API через index.ts

**entities/exercise/index.ts**

```typescript
export {type Exercise, type ExerciseState} from './model/types'
export {exerciseSchema} from './model/validation'
export {useExercise, useExercises} from './api/exercise-api'
```

**features/word-form-exercise/index.ts**

```typescript
export {WordFormInput} from './ui/word-form-input'
export {WordFormFeedback} from './ui/word-form-feedback'
export {CompletionScreen} from './ui/completion-screen'
export {useExerciseStore} from './model/exercise-store'
```

**shared/ui/index.ts**

```typescript
export {Button} from './button'
export {Input} from './input'
export {ThemeToggle} from './theme-toggle'
export {LanguageSelector} from './language-selector'
```

## 3. Правила импортов и линтинга

### Aliases в tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@/app/*": [
        "./src/app/*"
      ],
      "@/processes/*": [
        "./src/processes/*"
      ],
      "@/pages/*": [
        "./src/pages/*"
      ],
      "@/widgets/*": [
        "./src/widgets/*"
      ],
      "@/features/*": [
        "./src/features/*"
      ],
      "@/entities/*": [
        "./src/entities/*"
      ],
      "@/shared/*": [
        "./src/shared/*"
      ]
    }
  }
}
```

### ESLint правила для FSD

Установка `@feature-sliced/eslint-config`:

```bash
pnpm add -D @feature-sliced/eslint-config
```

**biome.json** (замена ESLint конфигурации):

```json
{
  "linter": {
    "rules": {
      "style": {
        "useImportType": "error"
      },
      "correctness": {
        "noUnusedImports": "error"
      }
    }
  },
  "organizeImports": {
    "enabled": true
  }
}
```

### Использование `@feature-sliced/steiger`

Установка и настройка Steiger для проверки архитектуры:

```bash
pnpm add -D @feature-sliced/steiger
```

**.steiger.config.js**

```javascript
module.exports = {
    rules: {
        'fsd/layers-slices': 'error',
        'fsd/no-cross-import': 'error',
        'fsd/public-api': 'error',
        'fsd/no-reserved-folder-names': 'error'
    }
}
```

**package.json scripts**

```json
{
  "scripts": {
    "lint:fsd": "steiger src",
    "lint:boundaries": "depcruise --config dependency-cruiser.config.cjs src",
    "lint": "pnpm lint:tsc && pnpm lint:biome && pnpm lint:fsd && pnpm lint:boundaries"
  }
}
```

### Dependency Cruiser для граничного контроля

Добавить `dependency-cruiser` конфигурацию (`dependency-cruiser.config.cjs`):

```bash
pnpm add -D dependency-cruiser
```

**dependency-cruiser.config.cjs**

```javascript
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    forbidden: [
        {
            name: "pages-layer-boundary",
            severity: "error",
            comment: "Pages may touch widgets, features, entities, shared only",
            from: {path: "^src/pages"},
            to: {pathNot: "^src/(pages|widgets|features|entities|shared)"}
        },
        {
            name: "widgets-layer-boundary",
            severity: "error",
            comment: "Widgets may touch features, entities, shared only",
            from: {path: "^src/widgets"},
            to: {pathNot: "^src/(widgets|features|entities|shared)"}
        },
        {
            name: "features-layer-boundary",
            severity: "error",
            comment: "Features may touch entities, shared only",
            from: {path: "^src/features"},
            to: {pathNot: "^src/(features|entities|shared)"}
        },
        {
            name: "entities-layer-boundary",
            severity: "error",
            comment: "Entities may touch shared only",
            from: {path: "^src/entities"},
            to: {pathNot: "^src/(entities|shared)"}
        },
        {
            name: "no-deep-public-imports",
            severity: "error",
            comment: "Always import through slice index files",
            from: {path: "^src/(app|processes|pages|widgets|features|entities)"},
            to: {
                path: "^src/(pages|widgets|features|entities)/.+/(ui|model|api|lib)/",
                pathNot: "index\\.(ts|tsx)$"
            }
        }
    ],
    options: {
        tsPreCompilationDeps: true,
        enhancedResolveOptions: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            modules: ["src", "node_modules"]
        }
    }
};
```

## 4. Пошаговый план миграции

### Фаза 0: Подготовка фундамента (1-2 дня)

1. **Ввести алиасы**
   ```bash
   # Создать резервную копию
   cp tsconfig.app.json tsconfig.app.json.backup
   ```
    - Обновить `tsconfig.json`, Vite, Vitest, и Playwright configs с layer aliases
    - Запустить `pnpm lint` для подтверждения, что Biome подхватил новые пути

2. **Добавить linting guards**
   ```bash
   pnpm add -D @feature-sliced/steiger dependency-cruiser
   ```
    - Настроить Biome/ESLint и dependency-cruiser
    - Добавить CI скрипты (`"lint:boundaries": "depcruiser --config dependency-cruiser.config.cjs src"`)

3. **Обновить документацию**
    - Опубликовать этот план и поделиться конвенциями миграции в `docs/architecture`

4. **Создать базовую структуру папок**
   ```bash
   mkdir -p src/{widgets,features,entities}
   mkdir -p src/shared/{ui,api,lib,config,model,test}
   ```

### Фаза 1: Golden path слайсы (2-3 дня)

1. **Выбрать pilot фичи**
    - Выбрать два репрезентативных потока: например, выполнение упражнений и выбор языка

2. **Создать FSD skeleton**
    - Создать каркас `features/exercise/run`, `entities/exercise`, `shared/ui/button`, и т.д.
    - Переместить минимальный код для валидации импортов

3. **Опубликовать public APIs**
    - Убедиться, что каждый слайс экспортирует `index.ts` barrels со стабильными экспортами
    - Обновить потребителей для использования алиасов

4. **Обновить тесты**
    - Переместить связанные unit/integration тесты рядом с их слайсами (`ui/__tests__` или `model/__tests__`)
    - Подстроить Vitest `testMatch` если требуется

### Фаза 2: Миграция shared слоя (2-3 дня)

1. **Перенести API модуль**
   ```bash
   git mv src/api/* src/shared/api/
   ```

2. **Перенести утилиты**
   ```bash
   git mv src/utils/* src/shared/lib/
   ```

3. **Перенести глобальные типы**
   ```bash
   git mv src/types/settings.ts src/shared/model/
   ```

4. **Перенести i18n систему**
   ```bash
   git mv src/i18n/* src/shared/lib/i18n/
   ```

5. **Перенести stores в shared/model**
   ```bash
   git mv src/stores/settings.ts src/shared/model/
   ```

6. **Создать public API для shared модулей**
    - `src/shared/api/index.ts`
    - `src/shared/lib/index.ts`
    - `src/shared/model/index.ts`

### Шаг 3: Выделение entities (2-3 дня)

1. **Создать entity "exercise"**
   ```bash
   mkdir -p src/entities/exercise/{model,api}
   ```

2. **Перенести типы упражнений**
   ```bash
   git mv src/types/exercises.ts src/entities/exercise/model/
   ```

3. **Создать API для упражнений**
    - Вынести из `src/hooks/useExercises.ts` в `src/entities/exercise/api/`

4. **Создать entity "user"**
   ```bash
   mkdir -p src/entities/user/model
   ```

5. **Создать public API для entities**

### Шаг 4: Выделение UI компонентов в shared/ui (2-3 дня)

1. **Перенести базовые UI компоненты**
   ```bash
   git mv src/components/ui/ThemeToggle.tsx src/shared/ui/theme-toggle/
   git mv src/components/ui/LanguageSelector.tsx src/shared/ui/language-selector/
   git mv src/components/ui/NavigationCard.tsx src/shared/ui/navigation-card/
   ```

2. **Создать index.ts для каждого компонента**

3. **Обновить импорты в существующих файлах**

### Шаг 5: Создание features (3-4 дня)

1. **Создать feature "word-form-exercise"**
   ```bash
   mkdir -p src/features/word-form-exercise/{ui,model,api}
   ```

2. **Перенести компоненты упражнения**
   ```bash
   git mv src/components/exercises/word-form/* src/features/word-form-exercise/ui/
   ```

3. **Создать feature "hint-system"**
   ```bash
   mkdir -p src/features/hint-system/{ui,model}
   git mv src/components/exercises/shared/HintSystem.tsx src/features/hint-system/ui/
   git mv src/hooks/useHintState.ts src/features/hint-system/model/
   ```

4. **Создать feature "settings-panel"**
   ```bash
   mkdir -p src/features/settings-panel/ui
   git mv src/components/layout/SettingsPanel.tsx src/features/settings-panel/ui/
   ```

### Шаг 6: Создание widgets (2-3 дня)

1. **Создать widget "app-header"**
   ```bash
   mkdir -p src/widgets/app-header/ui
   git mv src/components/layout/Header.tsx src/widgets/app-header/ui/
   git mv src/components/layout/Header*.tsx src/widgets/app-header/ui/
   ```

2. **Создать widget "exercise-layout"**
   ```bash
   mkdir -p src/widgets/exercise-layout/ui
   git mv src/components/exercises/shared/ExerciseLayout.tsx src/widgets/exercise-layout/ui/
   ```

3. **Создать widget "mobile-menu"**
   ```bash
   mkdir -p src/widgets/mobile-menu/ui
   git mv src/components/layout/MobileMenu*.tsx src/widgets/mobile-menu/ui/
   ```

### Шаг 7: Обновление pages (2-3 дня)

1. **Реорганизовать существующие страницы**
    - Добавить `ui/` и `model/` сегменты где необходимо
    - Обновить импорты на новые алиасы

2. **Создать public API для страниц**

### Фаза 5: Финальная чистка и упрочнение (2-3 дня)

1. **Принуждение границ**
   ```bash
   pnpm lint:boundaries
   ```
    - Запустить dependency-cruiser для обеспечения отсутствия запрещенных импортов
    - Фейлить CI при нарушениях

2. **Обновить coverage maps**
    - Убедиться, что Vitest coverage thresholds все еще указывают на новые локации
    - Подстроить `collectCoverageFrom` globs

3. **Почистить устаревшие пути**
    - Удалить устаревшие алиасы, обновить `tsconfig.app.json` ссылки
    - Удалить избыточные re-export stubs

4. **Документация и обмен знаниями**
    - Обновить `docs/architecture/project-structure.md`
    - Провести walkthrough сессию

5. **Regression sweep**
    - Выполнить `pnpm validate` и целевое ручное QA тестирование
    - Только после этого мерджить финальный migration PR

1. **Запустить линтинг FSD**
   ```bash
   pnpm lint:fsd
   ```

2. **Исправить нарушения архитектуры**

3. **Обновить все импорты**
    - Использовать новые алиасы
    - Импортировать только через public API

4. **Запустить тесты**
   ```bash
   pnpm test:ci
   pnpm test:e2e:ci
   ```

5. **Проверить bundle size**
   ```bash
   pnpm build:analyze
   ```

6. **Обновить документацию**
    - Обновить `docs/architecture/project-structure.md`
    - Добавить примеры использования новых модулей

### Шаг 9: Проверка качества

1. **Запуск всех проверок**
   ```bash
   pnpm validate
   ```

2. **Проверка coverage**
    - Убедиться, что coverage остался 93%+

3. **Performance тесты**
    - Проверить, что bundle size не увеличился
    - Убедиться в отсутствии регрессии производительности

## 5. Дополнительные практики

### 5.1 Интеграция слоя данных (TanStack Query)

1. **Entities владеют data hooks**
    - Обернуть TanStack Query hooks внутри `entities/<name>/model` (например, `useExerciseQuery`)
    - Экспортировать типизированные селекторы и prefetch утилиты через public API сущности

2. **Feature mutations**
    - Фичи композируют entity hooks с UI действиями
    - Держать mutation side effects (toast, navigation) внутри фич, чтобы избежать утечки в entities

3. **Тестирование**
    - Предоставить MSW handlers внутри `shared/test/msw` и делить типизированные factories для детерминистических
      fixtures

**entities/exercise/api/exercise-queries.ts**

```typescript
import {queryOptions} from '@tanstack/react-query'
import {httpClient} from '@/shared/api'

export const exerciseQueries = {
    all: () => ['exercises'] as const,
    lists: () => [...exerciseQueries.all(), 'list'] as const,
    detail: (id: string) => [...exerciseQueries.all(), 'detail', id] as const,
}

export const exerciseListOptions = queryOptions({
    queryKey: exerciseQueries.lists(),
    queryFn: () => httpClient.get('/api/exercises')
})

export const exerciseDetailOptions = (id: string) => queryOptions({
    queryKey: exerciseQueries.detail(id),
    queryFn: () => httpClient.get(`/api/exercises/${id}`)
})
```

### 5.2 Workflow feature flags

1. **Flag registry**
    - Поддерживать `shared/config/feature-flags.ts` экспортирующий `isEnabled("flag-name")` с environment-driven
      источниками

2. **Slice integration**
    - Pages и widgets читают флаги и ветвятся к опциональным фичам через lazy-loading альтернативных widgets (
      `import("@features/experimental")`)

3. **Runtime safety**
    - Обернуть экспериментальные code paths с `Suspense`/`ErrorBoundary` чтобы избежать поломки существующих потоков

4. **Observability**
    - Логировать flag evaluations через shared analytics adapter (держать в `shared/lib/analytics`)

**shared/config/feature-flags.ts**

```typescript
export const FEATURE_FLAGS = {
    NEW_EXERCISE_BUILDER: import.meta.env.VITE_FEATURE_NEW_BUILDER === 'true',
    ADVANCED_HINTS: import.meta.env.VITE_FEATURE_ADVANCED_HINTS === 'true',
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS

export const isEnabled = (flag: FeatureFlag): boolean => FEATURE_FLAGS[flag]
```

**features/exercise-builder/index.ts**

```typescript
import {isEnabled} from '@/shared/config'

export const ExerciseBuilder = isEnabled('NEW_EXERCISE_BUILDER')
    ? lazy(() => import('./ui/new-exercise-builder'))
    : lazy(() => import('./ui/legacy-exercise-builder'))
```

### 5.3 Выравнивание стратегии тестирования

1. **Unit тесты**
    - Хранить рядом с реализацией (`model/__tests__`, `ui/__tests__`)
    - Использовать `@shared/test/render` утилиты для поддержания консистентного setup

2. **Integration тесты**
    - Размещать в page или widget слайсах для захвата составного поведения
    - Убедиться, что coverage budgets продолжают работать через `pnpm test`

3. **E2E тесты**
    - Организовать Playwright specs по route под `tests/e2e/pages/<route>.spec.ts`, маппинг к `pages/` слайсам
    - Запускать `pnpm test:e2e:ci` в pipelines

4. **Contract тесты**
    - Для API взаимодействий, colocate MSW handlers с entities и экспортировать их в тесты через `shared/test/msw`
      barrels

Тесты следуют структуре FSD:

```
src/
├── entities/
│   └── exercise/
│       ├── model/
│       │   ├── __tests__/
│       │   │   ├── types.test.ts
│       │   │   └── validation.test.ts
│       └── api/
│           └── __tests__/
│               └── exercise-api.test.ts
├── features/
│   └── word-form-exercise/
│       ├── ui/
│       │   └── __tests__/
│       │       ├── word-form-input.test.tsx
│       │       └── completion-screen.test.tsx
│       └── model/
│           └── __tests__/
│               └── exercise-store.test.ts
└── shared/
    ├── api/
    │   └── __tests__/
    │       └── http-client.test.ts
    ├── lib/
    │   └── __tests__/
    │       └── validation.test.ts
    └── test/
        ├── msw/
        │   └── handlers.ts
        └── render.tsx
```

### 5.4 Route-based code splitting

1. **Lazy pages**
    - Держать route-level lazy imports внутри `app/router/config.ts`, используя динамический `import("@pages/exercise")`
      для разделения бандлов

2. **Widget-level chunks**
    - Для тяжелых widgets (exercise builder), обернуть с `lazy()` и `Suspense` внутри страницы для defer опциональной
      функциональности

3. **Preloading hooks**
    - Использовать TanStack Query prefetching в `app/router` loaders для прайминга entity caches при навигации между
      роутами

4. **Bundle analysis**
    - После каждой фазы миграции, запускать `pnpm build:analyze` для обеспечения того, что новые slice boundaries
      уменьшают bundle coupling, а не увеличивают его

**app/router/routes.tsx**

```typescript
import {lazy} from 'react'
import {createBrowserRouter} from 'react-router-dom'

const HomePage = lazy(() => import('@/pages/home'))
const ExercisePage = lazy(() => import('@/pages/exercise'))
const ExerciseLibraryPage = lazy(() => import('@/pages/exercise-library'))

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage / >,
        loader: async () => {
            // Prefetch critical data for homepage
            return null;
        }
    },
    {
        path: '/exercises',
        element: <ExerciseLibraryPage / >,
    },
    {
        path: '/exercises/:id',
        element: <ExercisePage / >,
        loader: async ({params}) => {
            // Prefetch exercise data
            const {queryClient} = await import('@/app/providers/query-client');
            const {exerciseDetailOptions} = await import('@/entities/exercise/api');
            return queryClient.ensureQueryData(exerciseDetailOptions(params.id!));
        }
    },
])
```

**Настройка Vite для code splitting:**

```typescript
// vite.config.ts
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['react', 'react-dom'],
                    'query': ['@tanstack/react-query'],
                    'router': ['react-router-dom'],
                    'forms': ['react-hook-form', '@hookform/resolvers'],
                    'validation': ['valibot', 'zod']
                }
            }
        }
    }
})
```

## Заключение

Миграция на FSD займет примерно **15-20 рабочих дней** и пройдет в 5 фаз. Ключевые преимущества после миграции:

1. **Четкое разделение ответственности** между слоями
2. **Упрощенная навигация** по коду через стандартизированные границы слайсов
3. **Контролируемые зависимости** между модулями через enforced import rules
4. **Лучшая масштабируемость** при росте проекта и добавлении новых фич
5. **Унифицированные подходы** к организации новых фич через established patterns
6. **Improved bundle efficiency** через лучшие boundaries для tree-shaking
7. **Enhanced developer experience** через predictable project structure

**Совет по внедрению:** Выполняйте миграцию как последовательность инкрементальных PR (≤500 LOC каждый) для поддержания
быстрого `pnpm validate`, обеспечения reviewability, и избежания дестабилизации production deployments.

Важно поддерживать работоспособность тестов на каждом шаге и использовать инструменты автоматической проверки
архитектуры для предотвращения регрессии. После завершения миграции проект будет готов к дальнейшему масштабированию с
четкой архитектурной основой.
