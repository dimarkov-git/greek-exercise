/// <reference types="vitest/config" />

import path from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import {visualizer} from 'rollup-plugin-visualizer'
import {defineConfig, type PluginOption} from 'vite'

export default defineConfig(() => {
	const analyzePlugins: PluginOption[] =
		process.env.ANALYZE === 'true'
			? [
					visualizer({
						filename: 'docs/reports/phase-2/assets/bundle-report.html',
						template: 'treemap',
						gzipSize: true,
						brotliSize: true
					}) as PluginOption,
					visualizer({
						filename: 'docs/reports/phase-2/assets/bundle-report.json',
						json: true
					}) as PluginOption
				]
			: []

	return {
		base: process.env.BASE_URL || './',
		plugins: [react(), tailwindcss(), ...analyzePlugins],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')
			}
		},
		test: {
			bail: 1,
			clearMocks: true,
			coverage: {
				enabled: true,
				exclude: ['src/main.tsx', 'src/mocks/browser.ts'],
				include: ['src/domain/**/*', 'src/mocks/utils/**/*'],
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
			setupFiles: 'src/test-setup.ts'
		}
	}
})
