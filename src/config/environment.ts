export const RouterMode = {
	browser: 'browser',
	hash: 'hash',
	memory: 'memory'
} as const

export type RouterModeType = (typeof RouterMode)[keyof typeof RouterMode]

export const AppMode = {
	development: 'development',
	production: 'production',
	test: 'test'
} as const

export type AppModeType = (typeof AppMode)[keyof typeof AppMode]

interface LearnGreekImportMetaEnv extends ImportMetaEnv {
	readonly VITE_ROUTER_MODE?: RouterModeType
	readonly VITE_ENABLE_MSW?: string
	readonly VITE_ENABLE_QUERY_DEVTOOLS?: string
	readonly VITE_ENABLE_HTTP_FALLBACK?: string
}

const env = import.meta.env as LearnGreekImportMetaEnv

const routerMode = normalizeRouterMode(env.VITE_ROUTER_MODE)
const enableMockServiceWorker = normalizeBoolean(env.VITE_ENABLE_MSW, false)
const enableQueryDevtools = normalizeBoolean(
	env.VITE_ENABLE_QUERY_DEVTOOLS,
	false
)
const enableHttpFallback = normalizeBoolean(env.VITE_ENABLE_HTTP_FALLBACK, true)
const isAutomationEnvironment = detectAutomationEnvironment()

export interface Environment {
	readonly mode: AppModeType
	readonly isAutomationEnvironment: boolean
	readonly baseUrl: string
	readonly routerMode: RouterModeType
	readonly enableMockServiceWorker: boolean
	readonly enableQueryDevtools: boolean
	readonly enableHttpFallback: boolean
}

export const environment: Environment = {
	mode: env.MODE as AppModeType,
	isAutomationEnvironment,
	baseUrl: env.BASE_URL || './',
	routerMode,
	enableMockServiceWorker,
	enableQueryDevtools,
	enableHttpFallback
}

function normalizeRouterMode(value: string | undefined): RouterModeType {
	const validModes = Object.values(RouterMode)
	if (validModes.includes(value as RouterModeType)) {
		return value as RouterModeType
	}
	return RouterMode.hash
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
