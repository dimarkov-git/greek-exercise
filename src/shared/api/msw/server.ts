/**
 * MSW server setup for Node.js test environment
 *
 * Creates and configures Mock Service Worker for Node.js/Vitest.
 * Used in unit and integration tests.
 *
 * @module shared/api/msw
 */

import type {RequestHandler} from 'msw'
import {setupServer} from 'msw/node'

/**
 * Create MSW server with provided handlers
 *
 * @param handlers - Request handlers to register with the server
 * @returns MSW server instance
 *
 * @example
 * ```ts
 * import {exerciseMswHandlers} from '@/entities/exercise'
 * import {translationMswHandlers} from '@/shared/lib/i18n'
 * import {createServer} from '@/shared/api/msw'
 *
 * const server = createServer([
 *   ...translationMswHandlers,
 *   ...exerciseMswHandlers
 * ])
 * server.listen()
 * ```
 */
export function createServer(handlers: RequestHandler[]) {
	return setupServer(...handlers)
}
