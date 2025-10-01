/**
 * Mock Service Worker setup and utilities
 *
 * @module shared/test/msw
 */

// Server exports are only for Node.js test environment
// Don't import in browser code to avoid Vite errors
export type {RequestHandler} from 'msw'
export {createWorker} from './browser'
export {translationHandlers} from './handlers'
