# Learn Greek documentation

## Documentation structure

### `architecture/`

Technical architecture and system design:

- [**project-structure.md**](architecture/project-structure.md) – Complete project structure and file organization.
- [**component-architecture.md**](architecture/component-architecture.md) – Component system and design patterns.
- [**exercise-system.md**](architecture/exercise-system.md) – Exercise system architecture and data flow.
- [**performance.md**](architecture/performance.md) – Performance budgets, KPIs, and optimization guidelines.
- _Planned_: i18n-system.md, data-flow.md.

### `guides/`

Step-by-step guides for developers:

- [**getting-started.md**](guides/getting-started.md) – Complete setup guide for macOS users.
- [**exercise-development.md**](guides/exercise-development.md) – Creating and configuring exercises.
- [**testing-guide.md**](guides/testing-guide.md) – Comprehensive testing guidelines with Vitest and Playwright.
- [**accessibility.md**](guides/accessibility.md) – Accessibility standards and implementation patterns.
- _Planned_: development-workflow.md, translation-management.md, deployment.md.

### `api/`

API documentation and data models:

- [**exercise-json-format.md**](exercise-json-format.md) – JSON structure specification for exercises.
- _Planned_: translation-endpoints.md, exercise-endpoints.md, data-models.md, msw-mocking.md.

## Project documentation

### Core specifications

- [**TECHNICAL_SPEC.md**](TECHNICAL_SPEC.md) – Technical specification and project requirements.
- [**ROADMAP.md**](ROADMAP.md) – Refactor roadmap and future technical priorities.

### Phase 2 artefacts

- [Overview](reports/phase-2/overview.md) – Architecture snapshot, goals, scope, dependencies, and risks.
- [Execution report](reports/phase-2/execution-report.md) – Command outcomes, coverage, bundle metrics, and audit logs.
- [ADRs](reports/phase-2/adrs) – Accepted decisions for the Learn page refactor and related tooling.

### Phase 3 artefacts

- [Overview](reports/phase-3/overview.md) – Translation registry architecture, scope, dependencies, and risk log.
- [Execution report](reports/phase-3/execution-report.md) – Lint/test/e2e outcomes, coverage, and change summary.
- [ADRs](reports/phase-3/adrs) – Decisions covering generated dictionaries and settings synchronisation.

### Phase 4 artefacts

- [Overview](reports/phase-4/overview.md) – Testing/QA expansion scope, goals, dependencies, and risk mitigation.
- [ADRs](reports/phase-4/adrs) – Decisions for HTTP fallback governance and MSW decoupling.

### Phase 5 artefacts

- [Overview](reports/phase-5/overview.md) – Coverage governance snapshot, goals, scope, dependencies, and risk register.
- [ADRs](reports/phase-5/adrs) – Decisions documenting the new Vitest coverage thresholds and module scope.
