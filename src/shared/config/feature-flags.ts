/**
 * Feature flags and environment helpers for use across all layers
 * This provides a layer-appropriate way to access environment settings
 * without importing from the app layer
 */

const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD
const isTest = import.meta.env.MODE === 'test'

export const featureFlags = {
	showTestSection: isDevelopment,
	enableDevTools: isDevelopment,
	enableMSW: !isProduction
} as const

export function shouldShowTestSection(): boolean {
	return featureFlags.showTestSection
}

export function isDevMode(): boolean {
	return isDevelopment
}

export function isProdMode(): boolean {
	return isProduction
}

export function isTestMode(): boolean {
	return isTest
}
