# Learn Greek documentation

## Project status

**Current version:** MVP with comprehensive architecture and testing
**Completed phases:** 0-5 (foundation through coverage governance)
**Coverage:** 93%+ statements/lines/functions, 88%+ branches
**Next phase:** Performance optimization and PWA foundation

## Documentation structure

### `architecture/`

Technical architecture and system design:

- [**project-structure.md**](architecture/project-structure.md) – Complete project structure and file organization.
- [**component-architecture.md**](architecture/component-architecture.md) – Component system and design patterns.
- [**exercise-system.md**](architecture/exercise-system.md) – Exercise system architecture and data flow.
- [**performance.md**](architecture/performance.md) – Performance budgets, KPIs, and optimization guidelines.
- [**i18n-system.md**](architecture/i18n-system.md) – Type-safe internationalization with generated registry.

### `guides/`

Step-by-step guides for developers:

- [**getting-started.md**](guides/getting-started.md) – Complete setup guide with Node 24.x and PNPM 10.
- [**exercise-development.md**](guides/exercise-development.md) – Creating and configuring exercises.
- [**testing-guide.md**](guides/testing-guide.md) – Comprehensive testing with 93%+ coverage requirements.
- [**accessibility.md**](guides/accessibility.md) – WCAG AA compliance and @axe-core/playwright integration.

### `api/`

API documentation and data models:

- [**exercise-json-format.md**](exercise-json-format.md) – JSON structure specification for exercises.
- MSW mocking patterns documented in testing guides

## Core documentation

### Project specifications

- [**TECHNICAL_SPEC.md**](TECHNICAL_SPEC.md) – Complete technical specification and requirements.
- [**ROADMAP.md**](ROADMAP.md) – Development roadmap for Phases 6+ with performance and PWA focus.

### Key architectural decisions

These patterns emerged from the completed phases (0-5):

- **Component composition** - Page decomposition under 50-line function limits
- **Generated i18n registry** - Type-safe translations with deterministic fallbacks
- **HTTP fallback policies** - Configurable offline support via environment flags
- **Coverage governance** - 93%+ thresholds on critical runtime modules
- **SSR-safe state sync** - DOM mutations handled via useEffect hooks

### Development workflow

1. **Setup:** Node 24.x LTS + PNPM 10 with `corepack enable`
2. **Development:** `pnpm dev` for hot reload development server
3. **Testing:** Maintain 93%+ coverage with `pnpm test` and `pnpm test:e2e`
4. **Quality:** `pnpm validate` must pass (lint + test + e2e)
5. **Bundle analysis:** Use `pnpm build:analyze` for size monitoring

## Quick navigation

| Task                         | Documentation                                          |
|------------------------------|--------------------------------------------------------|
| **Getting started**          | [Setup guide](guides/getting-started.md)               |
| **Architecture overview**    | [Project structure](architecture/project-structure.md) |
| **Testing strategy**         | [Testing guide](guides/testing-guide.md)               |
| **Exercise development**     | [Exercise guide](guides/exercise-development.md)       |
| **Performance optimization** | [Performance guide](architecture/performance.md)       |
| **Accessibility**            | [A11y guide](guides/accessibility.md)                  |
| **i18n implementation**      | [i18n system](architecture/i18n-system.md)             |
| **Future roadmap**           | [Development roadmap](ROADMAP.md)                      |

---

**For development guidelines and coding standards, see [CLAUDE.md](../CLAUDE.md)**
