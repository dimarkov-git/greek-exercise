# Learn Greek development roadmap

This roadmap outlines the development priorities for the project.

## Quality standards

### Non-negotiable requirements

- **Test coverage:** Maintain 90%+ coverage on all features
- **Performance budgets:** No bundle size regressions
- **Accessibility:** WCAG AA compliance for all features
- **Documentation:** Update guides alongside feature development
- **i18n compliance:** All UI text through translation system
- **Testing complexity**: Maintain deterministic test patterns
- **Browser compatibility**: Target modern browsers, graceful degradation

### CI/CD requirements

- All phases must pass `pnpm validate`
- Bundle analysis integration
- Accessibility testing automation
- Cross-browser compatibility verification
- Security audit compliance

## Current status

### Completed phases

- ✅ **Phase 0**: Environment-aware bootstrap with MSW/DevTools configuration
- ✅ **Phase 1**: Architecture decomposition and component boundaries
- ✅ **Phase 2**: Domain layer and exercise system architecture
- ✅ **Phase 3**: Type-safe i18n with generated translation registry
- ✅ **Phase 4**: Testing expansion and HTTP fallback policies
- ✅ **Phase 5**: Coverage governance (93%+ statements/lines/functions)

## Phase 6: Feature-Sliced Design Migration & Developer Experience

### Goals

Migrate to Feature-Sliced Design (FSD) architecture for improved maintainability, scalability, and developer experience
while adding modern development tooling.

### Deliverables

- **FSD Architecture Migration** — Complete migration to Feature-Sliced Design with clear layer boundaries
- **Architecture Linting** — Automated boundary enforcement with Steiger and dependency-cruiser
- **Public API System** — Barrel exports for all slices with controlled module access
- **Import Aliases** — TypeScript path mapping for clean imports (`@/features/*`, `@/shared/*`)
- **Development Tooling** — Enhanced DX with architecture validation and migration utilities

### Technical tasks

#### FSD Migration (15-20 days)

- **Phase 0:** Foundation setup with aliases and linting guards (1-2 days)
- **Phase 1:** Golden path slices with pilot features (2-3 days)
- **Phase 2:** Migrate shared layer (API, utils, i18n, stores) (2-3 days)
- **Phase 3:** Extract entities (exercise, user) (2-3 days)
- **Phase 4:** Extract UI components to shared/ui (2-3 days)
- **Phase 5:** Create features (word-form-exercise, hint-system) (3-4 days)
- **Phase 6:** Create widgets (app-header, exercise-layout) (2-3 days)
- **Phase 7:** Update pages with FSD structure (2-3 days)
- **Phase 8:** Final cleanup and boundary enforcement (2-3 days)

#### Architecture Tooling

- Install and configure `@feature-sliced/steiger` for FSD rule enforcement
- Set up `dependency-cruiser` for import boundary validation
- Add TypeScript path aliases for all FSD layers
- Create barrel exports (`index.ts`) for all slices
- Integrate architecture checks into CI pipeline

#### Developer Experience Improvements

- **Codemod scripts** for safe refactoring during migration
- **Architecture documentation** with contribution guidelines
- **Module boundaries visualization** through dependency graphs
- **Feature flag system** for experimental functionality
- **Enhanced testing patterns** aligned with FSD structure

### Success metrics

- All imports follow FSD layer rules (enforced by linters)
- 100% barrel export coverage for public APIs
- Zero import boundary violations in CI
- Maintained test coverage (80%+ statements/lines/functions)
- No bundle size regressions during migration
- Improved code navigation and developer onboarding time

### Reference documentation

**Detailed migration guide:** [FSD Migration Plan](architecture/fsd-migration-plan.md)

#### Additional Development Experience Enhancements

##### Code Generation & Scaffolding

- **Slice generator CLI** — Interactive tool for creating new FSD slices with proper structure
- **Component templates** — Pre-configured templates for common patterns (features, entities, widgets)
- **Test scaffolding** — Auto-generate test files when creating new slices
- **i18n key extraction** — Automated detection and extraction of translation keys

##### Development Workflow Improvements

- **Pre-commit hooks** — Architecture validation, import sorting, and format checking
- **Bundle analysis dashboard** — Visual representation of module dependencies and sizes
- **Performance budgets** — Automated alerts for bundle size and performance regressions
- **Documentation generation** — Auto-generated API docs from TypeScript interfaces

##### Code Quality & Monitoring

- **Architecture decision records (ADRs)** — Documentation template for architectural decisions
- **Dependency health monitoring** — Automated alerts for outdated or vulnerable packages
- **Code complexity metrics** — Cyclomatic complexity and maintainability index tracking
- **Import graph visualization** — Interactive dependency graph for understanding module relationships

##### Developer Onboarding

- **Interactive development guide** — Step-by-step tutorial for new contributors
- **Architecture playground** — Example implementations of common patterns
- **Code review checklist** — Automated checklist for FSD compliance in PRs
- **VS Code workspace configuration** — Pre-configured settings, extensions, and snippets

##### Debugging & Diagnostics

- **Module boundary checker** — Real-time validation of import rules during development
- **Slice dependency analyzer** — Tool to identify circular dependencies and violations
- **Performance profiler integration** — React DevTools and bundle analysis integration
- **Error boundary improvements** — Enhanced error reporting with slice context information

## Phase 7: Performance & PWA foundation

### Goals

Optimize performance and lay groundwork for Progressive Web App features.

### Deliverables

- **Route-based code splitting** — Split exercise pages and reduce main bundle
- **Asset optimization** — Image optimization, font preloading, critical CSS
- **Service Worker implementation** — Basic caching strategy for static assets
- **Bundle monitoring** — CI integration with size regression alerts
- **Web App Manifest** — PWA installability with proper icons and metadata

### Technical tasks

- Implement `React.lazy()` for exercise components
- Add `rollup-plugin-visualizer` to CI pipeline
- Configure Workbox for service worker generation
- Optimize Tailwind CSS purging and critical path CSS
- Add bundle size budgets to CI validation

## Phase 8: Enhanced exercise system with Flashcards

### Goals

Expand beyond word-form exercises with new interactive exercise types.

### Deliverables

- **Flashcard system**: Spaced repetition for vocabulary memorization
- **Multiple choice tests**: Grammar and vocabulary with randomized options

## Phase 9: Mobile optimization & PWA completion

### Goals

Complete PWA implementation with full offline support and mobile optimization.

### Deliverables

- **Full offline support**: Complete app functionality without network
- **Background sync**: Progress synchronization when connection resumes
- **Mobile-first UX**: Touch interactions and responsive design refinements

### Technical implementation

- Advanced service worker strategies
- Background sync with retry policies
- Web Push API integration
- Touch gesture handling improvements
- App store optimization and metadata

## Long-term vision

### Platform expansion

- **Multi-language support**: Extend beyond Greek to other languages
- **Additional exercises**: More exercise types and content
