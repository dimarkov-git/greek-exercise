# Technical Documentation

Complete technical reference for the Learn Greek application.

## 📚 Documentation Index

### Core Technical Information
- **[Technical Overview](overview.md)** - Project overview, technology stack, and system architecture

### Architecture Guides
- **[Project Structure](../architecture/project-structure.md)** - File organization and module boundaries
- **[Component Architecture](../architecture/component-architecture.md)** - React component patterns and design principles
- **[Performance Guidelines](../architecture/performance.md)** - Performance budgets and optimization strategies
- **[Exercise System](../architecture/exercise-system.md)** - Exercise engine architecture and extensibility

### Development Resources
- **[Getting Started](../guides/getting-started.md)** - Development environment setup
- **[Testing Guide](../guides/testing-guide.md)** - Unit, integration, and E2E testing strategies
- **[Exercise Development](../guides/exercise-development.md)** - Creating and configuring exercises
- **[Accessibility Guide](../guides/accessibility.md)** - WCAG compliance and accessibility patterns

## 🎯 Quick Reference

### Technology Stack
- **Frontend**: React 19, TypeScript 5.9, Vite 7
- **Styling**: Tailwind CSS v4, Framer Motion 12
- **State**: TanStack Query 5, Zustand, React Context
- **Testing**: Vitest, Playwright, MSW
- **Quality**: Biome, 80% coverage (75% branches)

### Key Metrics
- **Bundle Size**: < 250KB main bundle, < 150KB per route
- **Performance**: LCP < 2.5s, CLS < 0.1
- **Coverage**: 80% statements/lines/functions, 75% branches
- **Languages**: Greek (el), English (en), Russian (ru)

### Project Structure
```
src/
├── app/           # App shell and routing
├── pages/         # Page components
├── components/    # React components (UI, exercises, layout)
├── hooks/         # Custom React hooks
├── stores/        # Zustand state management
├── api/           # API utilities and HTTP client
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── i18n/          # Internationalization
├── mocks/         # MSW mock handlers
├── domain/        # Business logic and entities
└── contexts/      # React contexts
```

## 🔄 Common Tasks

### Development Workflow
```bash
pnpm dev          # Start development server
pnpm test         # Run tests in watch mode
pnpm lint         # Check code quality
pnpm validate     # Full validation (lint + test + e2e)
```

### Adding New Features
1. Check [Technical Overview](overview.md) for architecture patterns
2. Review [Component Architecture](../architecture/component-architecture.md) for React patterns
3. Follow [Testing Guide](../guides/testing-guide.md) for test requirements

### Performance Optimization
1. Check [Performance Guidelines](../architecture/performance.md) for budgets
2. Use bundle analyzer: `pnpm build:analyze`
3. Monitor Core Web Vitals in production
4. Review [optimization strategies](../architecture/performance.md)

## 📋 Documentation Standards

### Maintenance Requirements
- Update technical docs alongside code changes
- Verify code examples compile and execute correctly
- Cross-reference related documentation sections
- Include performance and bundle size implications

### Content Guidelines
- **English Only**: All technical documentation in English
- **Code Examples**: Fully functional, copy-pasteable examples
- **Type Safety**: Include TypeScript types in all examples
- **Cross-References**: Link to related documentation sections

## 🔗 External Resources

- **[React 19 Documentation](https://react.dev/)** - Latest React patterns and APIs
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Advanced TypeScript usage
- **[Vite Guide](https://vitejs.dev/guide/)** - Build tool configuration and optimization
- **[TanStack Query](https://tanstack.com/query/latest)** - Server state management patterns
