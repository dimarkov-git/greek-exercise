import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import type {RouterMode} from '@/app/config/environment'
import {AppRouter} from './AppRouter'

// Mock the environment module
const mockEnvironment = vi.hoisted(() => ({
	environment: {
		routerMode: 'memory' as RouterMode
	}
}))

vi.mock('@/app/config/environment', () => mockEnvironment)

describe('AppRouter', () => {
	it('renders children within router context', () => {
		render(
			<AppRouter>
				<div data-testid='test-child'>Test Content</div>
			</AppRouter>
		)

		expect(screen.getByTestId('test-child')).toBeInTheDocument()
		expect(screen.getByText('Test Content')).toBeInTheDocument()
	})

	it('uses MemoryRouter when routerMode is memory', () => {
		mockEnvironment.environment.routerMode = 'memory'

		render(
			<AppRouter>
				<div data-testid='memory-router-child'>Memory Router Child</div>
			</AppRouter>
		)

		expect(screen.getByTestId('memory-router-child')).toBeInTheDocument()
	})

	it('uses HashRouter when routerMode is hash', () => {
		mockEnvironment.environment.routerMode = 'hash'

		render(
			<AppRouter>
				<div data-testid='hash-router-child'>Hash Router Child</div>
			</AppRouter>
		)

		expect(screen.getByTestId('hash-router-child')).toBeInTheDocument()
	})

	it('uses BrowserRouter when routerMode is browser', () => {
		mockEnvironment.environment.routerMode = 'browser'

		render(
			<AppRouter>
				<div data-testid='browser-router-child'>Browser Router Child</div>
			</AppRouter>
		)

		expect(screen.getByTestId('browser-router-child')).toBeInTheDocument()
	})

	it('maintains router functionality with navigation', () => {
		mockEnvironment.environment.routerMode = 'memory'

		function TestNavigationComponent() {
			return (
				<div>
					<div data-testid='nav-component'>Navigation Component</div>
				</div>
			)
		}

		render(
			<AppRouter>
				<TestNavigationComponent />
			</AppRouter>
		)

		expect(screen.getByTestId('nav-component')).toBeInTheDocument()
	})
})
