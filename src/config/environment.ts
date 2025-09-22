export type RouterMode = 'browser' | 'hash' | 'memory'

interface LearnGreekImportMetaEnv extends ImportMetaEnv {
	readonly VITE_ROUTER_MODE?: RouterMode
	readonly VITE_ENABLE_MSW?: string
	readonly VITE_ENABLE_QUERY_DEVTOOLS?: string
}

const env = import.meta.env as LearnGreekImportMetaEnv
const mode = env.MODE

const globalObject = globalThis as {readonly __VITEST__?: unknown}

const isTest = mode === 'test' || typeof globalObject.__VITEST__ !== 'undefined'

const routerModeEnv = env.VITE_ROUTER_MODE as string | undefined

const isAutomationEnvironment = (() => {
	if (typeof navigator === 'undefined') {
		return false
	}

	if (navigator.webdriver) {
		return true
	}

	const userAgent = navigator.userAgent ?? ''

	return userAgent.toLowerCase().includes('playwright')
})()

let derivedRouterMode: RouterMode

if (isTest) {
	derivedRouterMode = 'memory'
} else if (isAutomationEnvironment) {
	derivedRouterMode = 'hash'
} else {
	derivedRouterMode = 'browser'
}

function normalizeRouterMode(
	value: string | undefined,
	fallback: RouterMode
): RouterMode {
	if (value === 'hash' || value === 'browser' || value === 'memory') {
		return value
	}
	return fallback
}

const routerMode = normalizeRouterMode(routerModeEnv, derivedRouterMode)

const enableMockServiceWorker =
	env.VITE_ENABLE_MSW !== 'false' && !env.PROD && !isTest

const enableQueryDevtools =
	env.VITE_ENABLE_QUERY_DEVTOOLS !== 'false' && env.DEV && !isTest

export const environment = {
	mode,
	isDevelopment: env.DEV,
	isProduction: env.PROD,
	isTest,
	routerMode,
	enableMockServiceWorker,
	enableQueryDevtools
} as const

export type Environment = typeof environment
