import type {RequestHandler} from 'msw'
import {setupServer} from 'msw/node'
import {translationHandlers} from './handlers'

// Create server with translation handlers only
// Exercise handlers are added where needed to respect FSD boundaries
export function createServer(additionalHandlers: RequestHandler[] = []) {
	return setupServer(...translationHandlers, ...additionalHandlers)
}

// Export server with just translation handlers
export const server = createServer()
