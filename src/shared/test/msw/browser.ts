import type {RequestHandler} from 'msw'
import {setupWorker} from 'msw/browser'
import {translationHandlers} from './handlers'

/**
 * Create MSW browser worker with custom handlers
 *
 * @param additionalHandlers - Additional request handlers (e.g., exercise handlers)
 * @returns MSW worker instance
 *
 * @example
 * ```ts
 * import {testing} from '@/entities/exercise'
 * import {msw} from '@/shared/test'
 *
 * const worker = msw.createWorker(testing.exerciseHandlers)
 * await worker.start()
 * ```
 */
export function createWorker(additionalHandlers: RequestHandler[] = []) {
	return setupWorker(...translationHandlers, ...additionalHandlers)
}
