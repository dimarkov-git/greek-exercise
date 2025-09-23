import './global.css'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './App'
import {AppErrorBoundary} from './app/AppErrorBoundary'
import {AppProviders} from './app/AppProviders'
import {AppRouter} from './app/AppRouter'
import {environment} from './config/environment'

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

	const {worker} = await import('./mocks/browser')

	if (navigator?.serviceWorker?.controller) {
		return
	}

	await Promise.race([
		worker.start({
			serviceWorker: {
				url: `${environment.baseUrl}mockServiceWorker.js`
			},
			onUnhandledRequest: environment.isDevelopment ? 'warn' : 'bypass'
		}),
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
		if (environment.isDevelopment) {
			// biome-ignore lint/suspicious/noConsole: development diagnostics
			console.warn('Failed to start Mock Service Worker', error)
		}
	} finally {
		renderApplication()
	}
}

bootstrap().catch(error => {
	if (environment.isDevelopment) {
		// biome-ignore lint/suspicious/noConsole: development diagnostics
		console.error('Application bootstrap failed', error)
	}
})
