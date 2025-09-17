# Greek exercise

A language learning single-page application focused on Greek language exercises and practice.

## Features

- Interactive language learning exercises
- Modern React-based user interface with responsive design
- Built with [Vite 6](https://vitejs.dev), [React 19](https://reactjs.org), and [TypeScript 5](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com) for styling
- [Biome V2](https://next.biomejs.dev) for linting, formatting and automatic import sorting
- Comprehensive testing with [Vitest 3](https://vitest.dev/) and [Testing Library 16](https://testing-library.com/)
- End-to-end testing with [Playwright 1.52](https://playwright.dev)

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
