import '../global.css'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createExerciseFallbackResolver} from '@/entities/exercise'
import {configureHttpClient, createFallbackRegistry} from '@/shared/api'
import {
	createTranslationsFallbackResolver,
	detectAutomationEnvironment,
	logger
} from '@/shared/lib'
import {App} from './App'
import {AppErrorBoundary} from './AppErrorBoundary'
import {AppRouter} from './AppRouter'
import {environment} from './config/environment'
import {AppProviders} from './providers/AppProviders'

// Compose HTTP client fallback resolvers for offline-first strategy
const resolveFallback = createFallbackRegistry([
	createTranslationsFallbackResolver(),
	createExerciseFallbackResolver()
])

// Configure the HTTP client with app-level dependencies
configureHttpClient({
	enableHTTPFallback: environment.enableHTTPFallback,
	resolveFallback
})

async function startMockServiceWorker() {
	if (!environment.enableMockServiceWorker) {
		if (navigator?.serviceWorker) {
			const registrations = await navigator.serviceWorker.getRegistrations()
			await Promise.all(
				registrations.map(registration => registration.unregister())
			)
		}
		return
	}

	// Import MSW handlers from their domains
	const [{msw}, {exerciseMswHandlers}, {translationMswHandlers}] =
		await Promise.all([
			import('@/shared/api'),
			import('@/entities/exercise'),
			import('@/shared/lib/i18n')
		])

	const worker = msw.createWorker([
		...translationMswHandlers,
		...exerciseMswHandlers
	])

	const startPromise = worker.start({
		serviceWorker: {
			url: `${environment.baseURL}mockServiceWorker.js`
		},
		onUnhandledRequest: environment.isDevelopment ? 'warn' : 'bypass'
	})

	if (detectAutomationEnvironment()) {
		await startPromise
		return
	}

	await Promise.race([
		startPromise,
		new Promise(resolve => {
			setTimeout(resolve, 1500)
		})
	])
}

function renderApplication() {
	const container = document.querySelector('#root')

	if (!container) {
		throw new Error('Application root element "#root" not found')
	}

	const root = createRoot(container)

	root.render(
		<StrictMode>
			<AppErrorBoundary>
				<AppProviders>
					<AppRouter>
						<App />
					</AppRouter>
				</AppProviders>
			</AppErrorBoundary>
		</StrictMode>
	)
}

async function bootstrap() {
	try {
		await startMockServiceWorker()
	} catch (error) {
		logger.warn('Failed to start Mock Service Worker', error)
	} finally {
		renderApplication()
	}
}

bootstrap().catch(error => {
	logger.error('Application bootstrap failed', error)
})
