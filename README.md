# Learn Greek

**Learn Greek** is an interactive language learning application focused on Greek language exercises and practice.

## Features

- **📚 Exercise library** - Interactive language learning exercises
- **🌍 Multilingual interface** - Greek, Russian, and English UI support
- **🌓 Theme support** - Light and dark mode switching
- **💾 Persistent settings** - User preferences saved locally
- **🔄 Real-time language switching** - Instant interface language changes
- **📱 Responsive design** - Modern React-based user interface
- **🚀 Modern tech stack** - Built with [Vite 7](https://vitejs.dev), [React 19](https://reactjs.org), [TypeScript 5](https://www.typescriptlang.org)
- **🎨 Tailwind CSS v4** - Modern styling framework
- **📊 TanStack query** - Efficient data fetching and caching
- **🛠️ Development tools** - [Biome V2](https://next.biomejs.dev) for linting and formatting
- **🧪 Comprehensive testing** - [Vitest 3](https://vitest.dev/) + [Testing Library 16](https://testing-library.com/) + [Playwright](https://playwright.dev)

## Getting started

Clone the repository and install dependencies:

```
git clone <repository-url>
cd greek-exercise
pnpm install
```

Start the development server:

```
pnpm dev
```

## Scripts

- `pnpm dev` - start a development server with hot reload.
- `pnpm build` - build for production. The generated files will be on the `dist` folder.
- `pnpm preview` - locally preview the production build.
- `pnpm test` - run unit and integration tests related to changed files based on git.
- `pnpm test:ci` - run all unit and integration tests in CI mode.
- `pnpm test:e2e` - run all e2e tests with Playwright.
- `pnpm test:e2e:ci` - run all e2e tests headlessly.
- `pnpm format` - format all files with Biome Formatter.
- `pnpm lint` - runs TypeScript and Biome.
- `pnpm validate` - runs `lint`, `test:ci` and `test:e2e:ci`.

## Documentation

For detailed documentation, see [docs/README.md](docs/README.md).
