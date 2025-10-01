/**
 * Mock Service Worker infrastructure
 *
 * Provides MSW setup utilities for browser and Node.js environments.
 * This is infrastructure code that can be used in development, testing,
 * and production (offline mode).
 *
 * @module shared/api/msw
 */

export type {RequestHandler} from 'msw'
export {createWorker} from './browser'

// Don't export server in browser builds to avoid msw/node dependency
// Server is imported directly in test-setup.ts
// export {createServer} from './server'
