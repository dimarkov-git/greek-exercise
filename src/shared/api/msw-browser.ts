/**
 * MSW browser worker setup
 *
 * Creates and configures Mock Service Worker for browser environment.
 * Used in development and production offline mode.
 *
 * @module shared/api/msw
 */

import type {RequestHandler} from 'msw'
import {setupWorker} from 'msw/browser'

export type {RequestHandler} from 'msw'

/**
 * Create MSW browser worker with provided handlers
 *
 * @param handlers - Request handlers to register with the worker
 * @returns MSW worker instance
 *
 * @example
 * ```ts
 * import {exerciseMswHandlers} from '@/entities/exercise'
 * import {translationMswHandlers} from '@/shared/lib/i18n'
 * import {createWorker} from '@/shared/api/msw'
 *
 * const worker = createWorker([
 *   ...translationMswHandlers,
 *   ...exerciseMswHandlers
 * ])
 * await worker.start()
 * ```
 */
export function createWorker(handlers: RequestHandler[]) {
	return setupWorker(...handlers)
}
