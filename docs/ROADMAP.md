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

## Phase 6: Simplify architecture

### Goals

Optimize architecture for maintainability and extensibility.

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
