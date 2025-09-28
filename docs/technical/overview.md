# Technical Overview - Learn Greek

**Learn Greek** is an interactive single-page application (SPA) for learning Greek language with multilingual interface
support and customizable exercise system.

## 📋 Project Overview

### Current Status

- **Version**: 0.1.0 (MVP)
- **Stage**: Functional prototype with one exercise type
- **Development**: Active

### Purpose

Create a modern, interactive language learning platform focused on Greek language practice with:

- Multiple exercise types for comprehensive learning
- JSON-based exercise configuration system
- Full internationalization support (Greek, Russian, English)
- Responsive design for desktop and mobile devices
- Offline-capable PWA functionality (planned)

### Target Audience

- **Primary**: Greek language learners (beginner to advanced)
- **Secondary**: Language teachers creating custom exercises
- **Tertiary**: Developers extending the exercise system

## 🏗️ Technology Stack

### Frontend Framework
- **React 19** - Latest stable version with concurrent features
- **TypeScript 5.9** - Strict typing for better developer experience
- **React Router 7** - Client-side routing with lazy loading

### Build Tools
- **Vite 7** - Fast build and hot module replacement
- **Biome** - Unified linting and formatting tool

### Styling
- **Tailwind CSS v4** - Utility-first styles with CSS-in-JS support
- **Framer Motion 12** - Smooth animations and transitions

### State Management
- **TanStack Query 5** - Server state caching and synchronization
- **Zustand** - Client state management with persistence
- **React Context** - Language state management

### Data Validation
- **Valibot** - Lightweight data validation (with Zod support)
- **React Hook Form** - Form handling with validation

### Testing
- **Vitest** - Unit and integration testing (80% statements/lines/functions, 75% branches coverage)
- **Testing Library** - React component testing
- **Playwright** - End-to-end testing
- **MSW** - API mocking for development and tests

### Development Tools
- **IndexedDB** (via Dexie.js) - Client-side data persistence
- **pnpm** - Package manager
- **GitHub Actions** - CI/CD pipeline (planned)

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │    │   State Layer    │    │   Data Layer    │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ Pages           │    │ TanStack Query   │    │ MSW Handlers    │
│ Components      │◄──►│ Zustand Store    │◄──►│ JSON Files      │
│ Hooks           │    │ React Context    │    │ IndexedDB       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
src/
├── app/                 # App shell and routing
├── pages/              # Page components
├── components/         # React components (UI, exercises, layout)
├── hooks/              # Custom React hooks
├── stores/             # Zustand state management
├── api/                # API utilities and HTTP client
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── i18n/               # Internationalization
├── mocks/              # MSW mock handlers
├── domain/             # Business logic and entities
└── contexts/           # React contexts
```

## 🔗 Related Documentation

- **[API Reference](api-specification.md)** - Detailed API endpoints and data structures
- **[Data Models](data-models.md)** - Exercise and application data models
- **[Architecture Patterns](../architecture/)** - Detailed architecture documentation
- **[Development Guide](../guides/getting-started.md)** - Getting started with development

## 📊 Quality Metrics

- **Test Coverage**: 80% statements/lines/functions, 75% branches (enforced via Vitest)
- **Bundle Size**: Target < 250KB main bundle, < 150KB per route chunk
- **Performance**: Core Web Vitals targets (LCP < 2.5s, CLS < 0.1)