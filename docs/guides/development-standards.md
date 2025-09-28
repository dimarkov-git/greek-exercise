# Development standards

This document outlines the quality standards and requirements for the Learn Greek project development process.

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

## Development workflow

All changes must follow the established development workflow as outlined in [CLAUDE.md](../../CLAUDE.md) and adhere to the Definition of Done (DoD) criteria.

## See also

- [Testing Guide](testing-guide.md) — Comprehensive testing strategies and patterns
- [Accessibility Guide](accessibility.md) — WCAG AA compliance requirements
- [Performance Architecture](../architecture/performance.md) — Performance budgets and optimization strategies
- [Getting Started](getting-started.md) — Development environment setup