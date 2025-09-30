import '../global.css'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {configureHttpClient} from '@/shared/api'
import {detectAutomationEnvironment} from '@/shared/lib'
import {resolveFallbackResponse} from '@/shared/test'
import {App} from './App'
import {AppErrorBoundary} from './AppErrorBoundary'
import {AppRouter} from './AppRouter'
import {AppModeEnum, environment} from './config/environment'
import {AppProviders} from './providers/AppProviders'

// Configure httpClient with app-level dependencies
configureHttpClient({
	isDevelopment: environment.mode === AppModeEnum.development,
	enableHTTPFallback: environment.enableHTTPFallback,
	resolveFallback: resolveFallbackResponse
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

	// Import worker directly from msw/browser (not through shared/test to avoid Node.js test issues)
	const {worker} = await import('@/shared/test/msw/browser')

	const startPromise = worker.start({
		serviceWorker: {
			url: `${environment.baseURL}mockServiceWorker.js`
		},
		onUnhandledRequest:
			environment.mode === AppModeEnum.development ? 'warn' : 'bypass'
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
		if (environment.mode === AppModeEnum.development) {
			// biome-ignore lint/suspicious/noConsole: development diagnostics
			console.warn('Failed to start Mock Service Worker', error)
		}
	} finally {
		renderApplication()
	}
}

bootstrap().catch(error => {
	if (environment.mode === AppModeEnum.development) {
		// biome-ignore lint/suspicious/noConsole: development diagnostics
		console.error('Application bootstrap failed', error)
	}
})
