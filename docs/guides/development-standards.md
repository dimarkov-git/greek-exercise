# Development standards

Quality standards for the Learn Greek project.

## Quality requirements

- **Test coverage**: 80% statements/lines/functions, 75% branches (enforced via Vitest)
- **Performance**: No bundle size regressions (use `pnpm build:analyze`)
- **Accessibility**: WCAG AA compliance (automated via @axe-core/playwright)
- **i18n**: All UI text via translation system
- **TypeScript**: Strict mode, no `any` types

## Validation

All changes must pass `pnpm validate` (lint + test + e2e).
