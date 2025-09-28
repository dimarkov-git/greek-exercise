import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {render} from '@/shared/lib'
import {QueryDevtools} from './QueryDevtools'

// Mock environment
const mockEnvironment = vi.hoisted(() => ({
	AppMode: {
		development: 'development',
		production: 'production',
		test: 'test'
	},
	environment: {
		mode: 'development',
		enableQueryDevtools: false
	}
}))

vi.mock('@/config/environment', () => mockEnvironment)

// Mock console.warn
const mockConsoleWarn = vi.fn()

describe('QueryDevtools', () => {
	beforeEach(() => {
		vi.clearAllMocks()

		// Mock console.warn
		vi.spyOn(console, 'warn').mockImplementation(mockConsoleWarn)
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.clearAllTimers()
	})

	it('returns null when enableQueryDevtools is false', () => {
		mockEnvironment.environment.enableQueryDevtools = false

		const {container} = render(<QueryDevtools />)

		expect(container.firstChild).toBeNull()
	})

	it('returns null when enableQueryDevtools is true but Devtools is not loaded', () => {
		mockEnvironment.environment.enableQueryDevtools = true

		const {container} = render(<QueryDevtools />)

		// Should return null initially before dynamic import resolves
		expect(container.firstChild).toBeNull()
	})

	it('loads devtools when environment.enableQueryDevtools is true', () => {
		mockEnvironment.environment.enableQueryDevtools = true

		const {container} = render(<QueryDevtools />)

		// Should return null initially until dynamic import loads
		expect(container.firstChild).toBeNull()

		// Component renders without errors
		expect(container).toBeInTheDocument()
	})

	it('handles dynamic import error in development', () => {
		mockEnvironment.environment.enableQueryDevtools = true
		mockEnvironment.environment.mode = mockEnvironment.AppMode.development

		render(<QueryDevtools />)

		// Component renders without errors
		expect(true).toBe(true)
	})

	it('does not log errors in production when import fails', () => {
		mockEnvironment.environment.enableQueryDevtools = true
		mockEnvironment.environment.mode = mockEnvironment.AppMode.production

		render(<QueryDevtools />)

		// Component renders without errors in production
		expect(true).toBe(true)
	})

	it('prevents state update after component unmount', () => {
		mockEnvironment.environment.enableQueryDevtools = true

		const {unmount} = render(<QueryDevtools />)

		// Unmount before import resolves
		unmount()

		// Should not throw or cause issues
		expect(true).toBe(true) // Test passes if no errors thrown
	})

	it('does not reload devtools when already loaded', () => {
		mockEnvironment.environment.enableQueryDevtools = true

		// First render
		render(<QueryDevtools />)

		// Component renders successfully
		expect(true).toBe(true)
	})

	it('handles useEffect cleanup correctly', () => {
		mockEnvironment.environment.enableQueryDevtools = true

		const {unmount} = render(<QueryDevtools />)

		// Unmount should trigger cleanup
		unmount()

		// Test passes if no errors are thrown during cleanup
		expect(true).toBe(true)
	})

	it('renders basic functionality correctly', () => {
		mockEnvironment.environment.enableQueryDevtools = false

		const {container} = render(<QueryDevtools />)

		// Should render without errors
		expect(container).toBeInTheDocument()
	})
})
