export type RouterMode = 'browser' | 'hash' | 'memory'

export const AppMode = {
	development: 'development',
	production: 'production',
	test: 'test'
} as const

export type AppModeType = (typeof AppMode)[keyof typeof AppMode]

interface LearnGreekImportMetaEnv extends ImportMetaEnv {
	readonly VITE_ROUTER_MODE?: RouterMode
	readonly VITE_ENABLE_MSW?: string
	readonly VITE_ENABLE_QUERY_DEVTOOLS?: string
	readonly VITE_ENABLE_HTTP_FALLBACK?: string
}

const env = import.meta.env as LearnGreekImportMetaEnv

function normalizeRouterMode(value: string | undefined): RouterMode {
	if (value === 'hash' || value === 'browser' || value === 'memory') {
		return value
	}
	return 'hash'
}

function normalizeBoolean(
	value: string | undefined,
	defaultValue: boolean
): boolean {
	if (value !== undefined) {
		return value === 'true'
	}
	return defaultValue
}

function detectAutomationEnvironment(): boolean {
	if (typeof navigator === 'undefined') {
		return false
	}

	if (navigator.webdriver) {
		return true
	}

	const userAgent = navigator.userAgent ?? ''
	return userAgent.toLowerCase().includes('playwright')
}

const routerMode = normalizeRouterMode(env.VITE_ROUTER_MODE)
const enableMockServiceWorker = normalizeBoolean(env.VITE_ENABLE_MSW, false)
const enableQueryDevtools = normalizeBoolean(
	env.VITE_ENABLE_QUERY_DEVTOOLS,
	false
)
const enableHttpFallback = normalizeBoolean(env.VITE_ENABLE_HTTP_FALLBACK, true)
const isAutomationEnvironment = detectAutomationEnvironment()

export const environment = {
	mode: env.MODE as AppModeType,
	isAutomationEnvironment,
	baseUrl: env.BASE_URL || './',
	routerMode,
	enableMockServiceWorker,
	enableQueryDevtools,
	enableHttpFallback
} as const

export type Environment = typeof environment
