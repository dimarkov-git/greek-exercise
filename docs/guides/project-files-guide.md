# Project files guide

Complete documentation files in the project.

## Configuration Files

### `knip.ts`

**Path:** `/knip.ts`

**Purpose:** Dependency and export checker configuration file for `knip` tool

**Description:**
Configuration for the `knip` tool that identifies unused dependencies, exports, types, and files in
JavaScript/TypeScript projects. This JSON file specifies which dependencies should be ignored during analysis.

**Features:**

- Detects unused dependencies, devDependencies, and exports

**Documentation:** [Knip.dev](https://knip.dev)

---

### `.editorconfig`

**Path:** `/.editorconfig`

**Purpose:** Cross-editor code style configuration

**Description:**
EditorConfig helps maintain consistent coding styles across different editors and IDEs. This configuration enforces
UTF-8 encoding, LF line endings, and tab indentation for TypeScript/JSON files.

**Key Settings:**

- `root = true`: Stop searching for configs in parent directories
- `charset = utf-8`: Use UTF-8 encoding
- `end_of_line = lf`: Use LF line endings (Unix-style)
- `trim_trailing_whitespace = true`: Remove trailing spaces
- `insert_final_newline = true`: Add final newline
- `indent_style = tab`: Use tabs for TypeScript, TSX, and JSON files

**Documentation:** [EditorConfig.org](https://editorconfig.org/)

---

### `.env.local`

**Path:** `/.env.local`

**Purpose:** Local environment variables (gitignored)

**Description:**
Contains environment variables for local development that override default settings. This file is ignored by Git to
prevent sharing local configuration.

**Contents:**

- `VITE_ENABLE_MSW=true`: Enables Mock Service Worker for API mocking during development

**Documentation:** [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

### `.gitignore`

**Path:** `/.gitignore`

**Purpose:** Git ignore patterns for excluding files from version control

**Description:**
Specifies which files and directories Git should ignore. Organized by categories with clear comments.

**Key Sections:**

- OS-specific files (`.DS_Store`, `.AppleDouble`)
- Environment files (`.env`)
- IDE files (`.idea/`, `.vscode/`)
- AI/LLM tooling (`.claude`, `CLAUDE.md`, `.playwright-mcp`)
- Development artifacts (`node_modules`, `dist`, `coverage`)
- Test results and reports (`/test-results/`, `/playwright-report/`)

**Documentation:** [Git Documentation - gitignore](https://git-scm.com/docs/gitignore)

---

### `.steiger.config.js`

**Path:** `/.steiger.config.js`

**Purpose:** FSD (Feature-Sliced Design) architecture linter configuration

**Description:**
Configuration for Steiger, the official FSD linter that enforces architectural boundaries in Feature-Sliced Design
projects. Ensures proper layer separation and import restrictions.

**Key Settings:**

- `root: './src'`: Source directory to analyze
- `plugins: ['@steiger/plugin-fsd']`: FSD-specific rules
- **Rules:**
    - `fsd/forbidden-imports: 'error'`: Prevents cross-layer imports
    - `fsd/insignificant-slice: 'warn'`: Warns about unused slices
    - `fsd/public-api: 'error'`: Enforces public API usage
    - `fsd/file-structure: 'warn'`: Validates file organization

**Ignore Patterns:**

- Cross-imports allowed between `word-form-exercise` and `hint-system` features (business requirement)
- Test files have flexible import rules
- Shared test utilities can import from higher layers
- Shared API layer can import app config

**Documentation:** [Steiger FSD Linter](https://github.com/feature-sliced/steiger)

---

### `biome.json`

**Path:** `/biome.json`

**Purpose:** Biome code formatter and linter configuration

**Description:**
Comprehensive configuration for Biome, a fast toolchain for JavaScript/TypeScript that handles formatting, linting, and
code analysis. Replaces ESLint and Prettier with better performance.

**Key Features:**

- **Git Integration:** `vcs.enabled: true` with ignore file support
- **Auto-assists:** Import organization, sorted attributes/properties
- **Formatting:** Tab indentation, minimal semicolons, single quotes
- **Linting:** All rule groups enabled as errors (a11y, complexity, performance, security)

**Rule Overrides:**

- **Global:** Disabled import extensions, explicit types, JSX literals
- **Config files:** Allow Node.js modules and default exports
- **Test files:** Relaxed rules for testing patterns
- **Barrel files:** Allow re-exports for index.ts files
- **Public assets:** No formatting or linting

**Documentation:** [Biome Configuration](https://biomejs.dev/reference/configuration/)

---

### `dependency-cruiser.config.cjs`

**Path:** `/dependency-cruiser.config.cjs`

**Purpose:** Architecture dependency validation for FSD layers

**Description:**
Configuration for dependency-cruiser that enforces FSD architectural boundaries by preventing imports between
inappropriate layers.

**Layer Restrictions:**

- **Pages:** Can only import from widgets, features, entities, shared, app
- **Widgets:** Can only import from features, entities, shared, app
- **Features:** Can only import from entities, shared, app
- **Entities:** Can only import from shared, app
- **Shared:** Can only import from app (most restrictive)

**Settings:**

- `forbidden`: Array of boundary violation rules
- `severity: 'error'`: Treat violations as errors
- `tsPreCompilationDeps: true`: Analyze TypeScript before compilation

**Documentation:** [Dependency Cruiser](https://github.com/sverweij/dependency-cruiser)

---

### `index.html`

**Path:** `/index.html`

**Purpose:** Main HTML entry point for the application

**Description:**
The root HTML file that serves as the entry point for the React application. Configured for modern web standards with
PWA support.

**Key Features:**

- **HTML5 doctype** with semantic structure
- **PWA Support:** Manifest, icons, and theme color
- **SEO/Meta:** Description, viewport, favicon
- **Accessibility:** No-JavaScript fallback message
- **Dark Mode Ready:** CSS classes for theming
- **Vite Integration:** Module script loading

**Critical Elements:**

- `<div id="root">`: React mount point
- `<script type="module" src="/src/main.tsx">`: Entry script
- `antialiased` class for better font rendering

**Documentation:** [Vite Guide](https://vitejs.dev/guide/)

---

### `package.json`

**Path:** `/package.json`

**Purpose:** Project metadata, dependencies, and scripts

**Description:**
NPM package configuration defining the project structure, dependencies, and available commands. Uses PNPM as package
manager with strict version enforcement.

**Project Info:**

- **Name:** `learn-greek`
- **Type:** `module` (ESM)
- **License:** MIT
- **Package Manager:** PNPM 10.17.0

**Key Scripts:**

- `dev`: Development server with auto-open
- `build`: Production build
- `test`: Vitest in watch mode
- `test:ci`: Single test run for CI
- `lint`: Full linting (TypeScript + Biome + boundaries)
- `validate`: Complete validation pipeline

**Dependencies:**

- **React 19:** Latest React with concurrent features
- **TypeScript 5.9:** Strict typing
- **TanStack Query 5.90:** Server state management
- **Zustand 5.0:** Client state management
- **React Router 7.9:** Navigation
- **Valibot 1.1:** Schema validation

**Dev Dependencies:**

- **Vite 7.1:** Build tool
- **Vitest 3.2:** Testing framework
- **Playwright 1.55:** E2E testing
- **Biome 2.2:** Code quality
- **Tailwind CSS 4.1:** Styling

**Documentation:** [NPM package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

---

### `playwright.config.ts`

**Path:** `/playwright.config.ts`

**Purpose:** End-to-end testing configuration

**Description:**
Playwright configuration for E2E tests across multiple browsers and devices. Optimized for both local development and CI
environments.

**Browser Coverage:**

- **Desktop:** Chrome, Safari
- **Mobile:** Pixel 5 simulation

**Key Settings:**

- `forbidOnly: Boolean(process.env.CI)`: Prevent `.only` in CI
- `fullyParallel: true`: Parallel test execution
- `retries: process.env.CI ? 2 : 0`: Retry flaky tests in CI
- `workers: process.env.CI ? 1 : undefined`: Single worker in CI

**Development Server:**

- **URL:** `http://localhost:5173`
- **Command:** `pnpm dev`
- **Environment Variables:**
    - `VITE_ROUTER_MODE: 'hash'`: Hash routing for E2E
    - `VITE_ENABLE_MSW: 'true'`: Mock API responses

**Documentation:** [Playwright Configuration](https://playwright.dev/docs/test-configuration)

---

### `pnpm-lock.yaml`

**Path:** `/pnpm-lock.yaml`

**Purpose:** Dependency lock file for reproducible installs

**Description:**
Auto-generated lock file that pins exact versions of all dependencies and their sub-dependencies. Ensures identical
dependency trees across environments.

**Key Features:**

- **Version 9.0:** Latest lock file format
- **Reproducible builds:** Identical installs across machines
- **Security:** Integrity hashes for all packages
- **Performance:** Faster installs with cached resolution

**Management:**

- Auto-updated by PNPM during install/update
- Should be committed to version control
- Updated via Renovate bot (weekly for non-security)

**Documentation:** [PNPM Lockfile](https://pnpm.io/pnpm-lock.yaml)

---

### `README.md`

**Path:** `/README.md`

**Purpose:** Primary project documentation

**Description:**
Comprehensive project overview covering architecture, features, and development workflows. Serves as the main entry
point for contributors and users.

**Key Sections:**

- **Features:** Exercise system, i18n, state management
- **Architecture:** Tech stack and patterns
- **Getting Started:** Setup instructions
- **Commands:** Development workflows
- **Documentation:** Links to detailed guides

**Highlights:**

- React 19 + TypeScript 5 + Vite 7
- 93%+ test coverage with Vitest/Playwright
- Feature-Sliced Design architecture
- WCAG AA accessibility compliance

**Documentation:** Links to `docs/` directory for detailed guides

---

### `rollup-plugin-visualizer.d.ts`

**Path:** `/rollup-plugin-visualizer.d.ts`

**Purpose:** TypeScript type definitions for bundle analyzer

**Description:**
Custom TypeScript declarations for the `rollup-plugin-visualizer` package used in bundle analysis. Provides type safety
for build-time bundle visualization.

**Interface Definition:**

- `VisualizerOptions`: Configuration interface
- **Template types:** 'treemap' | 'sunburst' | 'network'
- **Size analysis:** gzipSize, brotliSize options
- **Output formats:** HTML and JSON export

**Usage:**

- Imported in `vite.config.ts` for bundle analysis
- Activated via `ANALYZE=true` environment variable
- Generates reports in `docs/reports/assets/`

**Documentation:** [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)

---

### `tsconfig.app.json`

**Path:** `/tsconfig.app.json`

**Purpose:** TypeScript configuration for application code

**Description:**
TypeScript project configuration for the main application source code with strict type checking and modern ES features.

**Key Settings:**

- **Strict Mode:** All strict options enabled
- **Modern Target:** ESNext with bundler resolution
- **React JSX:** `react-jsx` transform
- **Path Aliases:** FSD layer mapping (`@/app/*`, `@/features/*`, etc.)
- **Libraries:** ESNext, DOM, DOM.Iterable

**Type Safety Features:**

- `noUncheckedIndexedAccess`: Array/object access safety
- `exactOptionalPropertyTypes`: Strict optional property handling
- `noPropertyAccessFromIndexSignature`: Consistent property access
- `verbatimModuleSyntax`: Explicit import/export syntax

**Documentation:** [TypeScript tsconfig](https://www.typescriptlang.org/tsconfig)

---

### `tsconfig.json`

**Path:** `/tsconfig.json`

**Purpose:** Root TypeScript configuration with project references

**Description:**
Root TypeScript configuration using project references for better build performance and logical separation of concerns.

**Structure:**

- **No files:** Empty files array (delegates to references)
- **References:**
    - `./tsconfig.app.json`: Application code
    - `./tsconfig.node.json`: Node.js tooling

**Benefits:**

- **Incremental builds:** Only rebuild changed projects
- **Better IDE performance:** Faster type checking
- **Clear separation:** App vs tooling configurations

**Documentation:** [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

---

### `tsconfig.node.json`

**Path:** `/tsconfig.node.json`

**Purpose:** TypeScript configuration for Node.js tooling

**Description:**
Separate TypeScript configuration for build tools, config files, and Node.js-specific code with relaxed browser
requirements.

**Key Differences from App Config:**

- **No DOM libraries:** Node.js only environment
- **Includes:** Vite config, TypeScript definitions
- **Base URL:** `src` for relative imports
- **Target:** Node.js-compatible features only

**Included Files:**

- `vite.config.ts`: Build configuration
- `src/**/*.d.ts`: Type definitions
- `rollup-plugin-visualizer.d.ts`: Bundle analyzer types

**Documentation:** [TypeScript Node Configuration](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

---

### `vite.config.ts`

**Path:** `/vite.config.ts`

**Purpose:** Vite build tool configuration

**Description:**
Comprehensive Vite configuration supporting development, testing, and production builds with bundle analysis and path
aliases.

**Plugins:**

- `@vitejs/plugin-react`: React support with Fast Refresh
- `@tailwindcss/vite`: Tailwind CSS v4 integration
- `rollup-plugin-visualizer`: Bundle analysis (conditional)

**Path Aliases:**

- Full FSD layer mapping for clean imports
- Matches TypeScript path configuration
- Enables `@/features/*` style imports

**Test Configuration:**

- **Environment:** happy-dom (faster than jsdom)
- **Coverage:** 80% statements/lines/functions, 75% branches
- **Setup:** Global test utilities and MSW
- **Globals:** Vitest globals for describe/it/expect

**Bundle Analysis:**

- **Conditional:** Only when `ANALYZE=true`
- **Formats:** HTML treemap and JSON data
- **Output:** `docs/reports/assets/`
- **Features:** Gzip and Brotli size analysis

**Documentation:** [Vite Configuration](https://vitejs.dev/config/)

---
