export const RouterModeEnum = {
	browser: 'browser',
	hash: 'hash',
	memory: 'memory'
} as const

export type RouterMode = (typeof RouterModeEnum)[keyof typeof RouterModeEnum]

export const AppModeEnum = {
	development: 'development',
	production: 'production',
	test: 'test'
} as const

export type AppMode = (typeof AppModeEnum)[keyof typeof AppModeEnum]

interface AppImportMetaEnv extends ImportMetaEnv {
	readonly VITE_ROUTER_MODE?: RouterMode
	readonly VITE_ENABLE_MSW?: string
	readonly VITE_ENABLE_HTTP_FALLBACK?: string
	readonly VITE_ENABLE_QUERY_DEVTOOLS?: string
}

const env = import.meta.env as AppImportMetaEnv

export interface Environment {
	readonly mode: AppMode
	readonly baseURL: string
	readonly routerMode: RouterMode
	readonly enableMockServiceWorker: boolean
	readonly enableHTTPFallback: boolean
	readonly enableQueryDevtools: boolean
}

export const environment: Environment = {
	mode: env.MODE as AppMode,
	baseURL: env.BASE_URL || './',
	routerMode: normalizeRouterMode(env.VITE_ROUTER_MODE, RouterModeEnum.hash),
	enableMockServiceWorker: normalizeBoolean(env.VITE_ENABLE_MSW, false),
	enableHTTPFallback: normalizeBoolean(env.VITE_ENABLE_HTTP_FALLBACK, true),
	enableQueryDevtools: normalizeBoolean(env.VITE_ENABLE_QUERY_DEVTOOLS, false)
}

function normalizeRouterMode(
	value: string | undefined,
	defaultValue: RouterMode
): RouterMode {
	const validModes = Object.values(RouterModeEnum)
	if (validModes.includes(value as RouterMode)) {
		return value as RouterMode
	}
	return defaultValue
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
