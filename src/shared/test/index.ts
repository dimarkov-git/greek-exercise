/**
 * Shared testing utilities
 *
 * @module shared/test
 */

export * as msw from './msw'
export * as mswData from './msw/data'
export * from './render-utils'

// Note: MSW server setup is isolated in test-setup.ts
// Don't import server in browser code to avoid Vite "msw/node" errors
