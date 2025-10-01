// Export MSW server and handlers for tests (but not browser worker to avoid Node.js issues)

// Export fallback resolver for test configuration
export {resolveFallbackResponse} from './fallbacks'
export {handlers} from './msw/handlers'
export {server} from './msw/server'
// Export test utilities
export * from './render-utils'
