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

export interface Environment {
	readonly mode: AppMode
	readonly isDevelopment: boolean
	readonly baseURL: string
	readonly routerMode: RouterMode
	readonly enableMockServiceWorker: boolean
	readonly enableHTTPFallback: boolean
	readonly enableQueryDevtools: boolean
}

export function normalizeRouterMode(
	value: string | undefined,
	defaultValue: RouterMode
): RouterMode {
	const validModes = Object.values(RouterModeEnum)
	if (validModes.includes(value as RouterMode)) {
		return value as RouterMode
	}
	return defaultValue
}

export function normalizeBoolean(
	value: string | undefined,
	defaultValue: boolean
): boolean {
	if (value !== undefined) {
		return value === 'true'
	}
	return defaultValue
}

export function createEnvironment(env: ImportMetaEnv): Environment {
	const appEnv = env as AppImportMetaEnv
	return {
		mode: appEnv.MODE as AppMode,
		isDevelopment: appEnv.MODE === AppModeEnum.development,
		baseURL: appEnv.BASE_URL || './',
		routerMode: normalizeRouterMode(
			appEnv.VITE_ROUTER_MODE,
			RouterModeEnum.hash
		),
		enableMockServiceWorker: normalizeBoolean(appEnv.VITE_ENABLE_MSW, false),
		enableHTTPFallback: normalizeBoolean(
			appEnv.VITE_ENABLE_HTTP_FALLBACK,
			true
		),
		enableQueryDevtools: normalizeBoolean(
			appEnv.VITE_ENABLE_QUERY_DEVTOOLS,
			false
		)
	}
}

export const environment: Environment = createEnvironment(import.meta.env)
