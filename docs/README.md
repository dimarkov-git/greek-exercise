# Documentation

## 📚 Documentation Structure

### 🏗️ **Technical Documentation** [`technical/`](technical/)

Complete technical reference and API documentation:

- [**Technical Overview**](technical/overview.md) – Technology stack, architecture, and system design
- [**API Specification**](technical/api-specification.md) – Mock API endpoints and data flow patterns
- [**Data Models**](technical/data-models.md) – TypeScript interfaces and validation schemas

### 🏛️ **Architecture Guides** [`architecture/`](architecture/)

System architecture and design patterns:

- [**Project Structure**](architecture/project-structure.md) – File organization and module boundaries
- [**Component Architecture**](architecture/component-architecture.md) – React patterns and design principles
- [**Exercise System**](architecture/exercise-system.md) – Exercise engine architecture and extensibility
- [**Performance Guidelines**](architecture/performance.md) – Performance budgets and optimization strategies

### 🌐 **Internationalization** [`i18n/`](i18n/)

Type-safe multi-language support system:

- [**i18n Overview**](i18n/overview.md) – System architecture and supported languages
- [**Implementation Guide**](i18n/implementation.md) – Usage patterns and code examples
- [**API Reference**](i18n/api-reference.md) – Complete API documentation

### 📖 **Developer Guides** [`guides/`](guides/)

Step-by-step development instructions:

- [**Getting Started**](guides/getting-started.md) – Environment setup with Node 24.x and PNPM 10
- [**Development Standards**](guides/development-standards.md) – Quality standards and CI/CD requirements
- [**Tailwind CSS Guide**](guides/tailwind-css-guide.md) – Modern Tailwind v4 development patterns and UI/UX best
  practices
- [**Exercise Development**](guides/exercise-development.md) – Creating and configuring exercises
- [**Testing Guide**](guides/testing-guide.md) – Unit, integration, and E2E testing strategies
- [**Accessibility Guide**](guides/accessibility.md) – WCAG AA compliance patterns

### 📋 **Project Documentation**

Core project information and planning:

- [**User Guide**](guides/user-guide.md) – Comprehensive application functionality from a user perspective
- [**Development Roadmap**](ROADMAP.md) – Phases 6+ with performance and PWA focus
- [**Exercise JSON Format**](exercise-json-format.md) – Exercise data structure specification

## 🎯 Quick Navigation

| Need to...                   | Go to...                                                 |
|------------------------------|----------------------------------------------------------|
| **Start developing**         | [Getting Started Guide](guides/getting-started.md)       |
| **Follow quality standards** | [Development Standards](guides/development-standards.md) |
| **Style with Tailwind**      | [Tailwind CSS Guide](guides/tailwind-css-guide.md)       |
| **Understand the system**    | [Technical Overview](technical/overview.md)              |
| **Learn app functionality**  | [User Guide](guides/user-guide.md)                       |
| **Add translations**         | [i18n Implementation](i18n/implementation.md)            |
| **Create exercises**         | [Exercise Development](guides/exercise-development.md)   |
| **Write tests**              | [Testing Guide](guides/testing-guide.md)                 |
| **Optimize performance**     | [Performance Guidelines](architecture/performance.md)    |
| **Ensure accessibility**     | [Accessibility Guide](guides/accessibility.md)           |
| **Understand structure**     | [Project Structure](architecture/project-structure.md)   |
| **Plan future work**         | [Development Roadmap](ROADMAP.md)                        |


## 🔗 Cross-References

### Architecture Dependencies

- **Components** → [Component Architecture](architecture/component-architecture.md)
- **State Management** → [Technical Overview](technical/overview.md#state-management)
- **Data Flow** → [API Specification](technical/api-specification.md)
- **Performance** → [Performance Guidelines](architecture/performance.md)

### Development Workflows

- **Feature Development** → [Getting Started](guides/getting-started.md) + [Technical Overview](technical/overview.md)
- **Exercise Creation
  ** → [Exercise Development](guides/exercise-development.md) + [JSON Format](exercise-json-format.md)
- **Testing Strategy** → [Testing Guide](guides/testing-guide.md) + [User Guide](guides/user-guide.md)
- **Internationalization** → [i18n Overview](i18n/overview.md) → [Implementation](i18n/implementation.md)

## 📊 Key Metrics & Standards

### Code Quality

- **TypeScript**: Strict mode, no `any` types
- **Test Coverage**: 80% statements/lines/functions, 75% branches
- **Performance**: Bundle < 250KB main, < 150KB per route
- **Accessibility**: WCAG AA compliance

### Supported Technologies

- **Frontend**: React 19, TypeScript 5.9, Vite 7
- **State**: TanStack Query 5, Zustand
- **Testing**: Vitest, Playwright, MSW
- **Languages**: Greek (el), English (en), Russian (ru)

---

**For development guidelines and coding standards, see [CLAUDE.md](../CLAUDE.md)**
