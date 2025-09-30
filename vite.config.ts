/// <reference types="vitest/config" />

import path from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import {visualizer} from 'rollup-plugin-visualizer'
import {defineConfig, type PluginOption, type UserConfig} from 'vite'

function resolveAnalyzerPlugins(): PluginOption[] {
	if (process.env.ANALYZE !== 'true') {
		return []
	}

	const treemapReport = visualizer({
		filename: 'docs/reports/assets/bundle-report.html',
		template: 'treemap',
		gzipSize: true,
		brotliSize: true
	}) as PluginOption

	const jsonReport = visualizer({
		filename: 'docs/reports/assets/bundle-report.json',
		json: true
	}) as PluginOption

	return [treemapReport, jsonReport]
}

function createTestConfiguration(): NonNullable<UserConfig['test']> {
	return {
		bail: 1,
		clearMocks: true,
		coverage: {
			enabled: true,
			exclude: ['src/app/main.tsx', 'src/mocks/browser.ts'],
			include: ['src/**/*'],
			reporter: ['text', 'lcov'],
			reportsDirectory: 'coverage',
			thresholds: {
				branches: 75,
				functions: 80,
				lines: 80,
				statements: 80
			}
		},
		css: false,
		environment: 'happy-dom',
		globals: true,
		include: ['src/**/*.test.ts?(x)'],
		setupFiles: 'src/test-setup.ts',
		env: {
			// biome-ignore lint/style/useNamingConvention: environment variable naming follows Vite requirements.
			VITE_ROUTER_MODE: 'memory',
			// biome-ignore lint/style/useNamingConvention: environment variable naming follows Vite requirements.
			VITE_ENABLE_MSW: 'true'
		}
	}
}

export default defineConfig(() => ({
	base: process.env.BASE_URL || './',
	plugins: [react(), tailwindcss(), ...resolveAnalyzerPlugins()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@/app': path.resolve(__dirname, './src/app'),
			'@/processes': path.resolve(__dirname, './src/processes'),
			'@/pages': path.resolve(__dirname, './src/pages'),
			'@/widgets': path.resolve(__dirname, './src/widgets'),
			'@/features': path.resolve(__dirname, './src/features'),
			'@/entities': path.resolve(__dirname, './src/entities'),
			'@/shared': path.resolve(__dirname, './src/shared')
		}
	},
	test: createTestConfiguration()
}))
