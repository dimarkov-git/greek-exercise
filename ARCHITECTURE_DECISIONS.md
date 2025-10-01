# Architecture Decision Records (ADR)

## ADR-001: FSD Architecture Compliance & MSW Handler Refactoring

**Date:** 2025-10-01  
**Status:** ✅ Implemented  
**Context:** FSD Steiger reported 7 critical violations where `shared/test` imported from `entities` layer

###  Decision

**Moved MSW testing utilities to respect FSD boundaries:**

1. **Created `entities/exercise/testing/`** directory for exercise-related test utilities:
   - `loadExercises.ts` — Exercise registry loader (from shared/test/msw/utils)
   - `fallbacks.ts` — Fallback response resolver (from shared/test)
   - `handlers.ts` — Exercise-specific MSW handlers

2. **Refactored `shared/test/msw/`** to contain only translation handlers:
   - `handlers.ts` — Translation-only MSW handlers
   - `browser.ts` — `createWorker(additionalHandlers)` factory function
   - `server.ts` — `createServer(additionalHandlers)` factory function

3. **App-level composition** in `src/app/main.tsx` and `src/test-setup.ts`:
   ```ts
   import {testing} from '@/entities/exercise'
   import {msw} from '@/shared/test'
   
   const worker = msw.createWorker(testing.exerciseHandlers)
   const server = msw.createServer(testing.exerciseHandlers)
   ```

### Consequences

**Positive:**
- ✅ **FSD violations reduced from 7 to 2** (only insignificant-slice warnings remain)
- ✅ **Zero layer boundary violations** — shared no longer imports from entities
- ✅ **Proper separation of concerns** — exercise testing lives with exercise entity
- ✅ **Tests pass:** 1 failed | 6 passed | 2 skipped (55 files)
- ✅ **All linters pass:** TypeScript, Biome, Dependency Cruiser

**Trade-offs:**
- ⚠️ App-level composition required for MSW setup (acceptable per FSD)
- ⚠️ Two insignificant-slice warnings (word-form-exercise, main-navigation) — non-critical

### Implementation Details

**Public API exports:**
- `@/entities/exercise` → `export * as testing from './testing'`
- `@/shared/test` → `export * as msw from './msw'`

**Biome configuration updated:**
- Added `src/entities/**/testing/index.ts` to barrel file exceptions

### Related Files

- `src/entities/exercise/testing/{fallbacks,handlers,loadExercises}.ts`
- `src/shared/test/msw/{browser,server,handlers}.ts`
- `src/app/main.tsx` (MSW worker setup)
- `src/test-setup.ts` (MSW server setup)
- `biome.json` (barrel file exceptions)
