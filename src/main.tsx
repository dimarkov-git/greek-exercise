import './global.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import {App} from './App'

const queryClient = new QueryClient()

async function enableMocking() {
	// We always use MSW for now
	// if (import.meta.env.MODE === 'production') { return }

	try {
		const {worker} = await import('./mocks/browser')
		return worker.start({
			serviceWorker: {
				url: `${import.meta.env.BASE_URL}mockServiceWorker.js`
			},
			onUnhandledRequest: 'bypass'
		})
	} catch {
		// Don't throw error, just continue without mocking
		return
	}
}

function renderApp() {
	const container = document.querySelector('#root')
	if (container) {
		const root = createRoot(container)
		root.render(
			<StrictMode>
				<QueryClientProvider client={queryClient}>
					<ReactQueryDevtools initialIsOpen={false} />
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</QueryClientProvider>
			</StrictMode>
		)
	}
}

// Initialize MSW and render app
enableMocking()
	.then(() => {
		renderApp()
	})
	.catch(() => {
		renderApp()
	})
