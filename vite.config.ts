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
		filename: 'docs/reports/phase-2/assets/bundle-report.html',
		template: 'treemap',
		gzipSize: true,
		brotliSize: true
	}) as PluginOption

	const jsonReport = visualizer({
		filename: 'docs/reports/phase-2/assets/bundle-report.json',
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
			include: [
				'src/api/httpClient.ts',
				'src/app/shell/**/*',
				'src/contexts/LayoutContext*.ts',
				'src/domain/exercises/**/*',
				'src/hooks/useLayout.ts',
				'src/hooks/useTranslations.ts',
				'src/i18n/**/*',
				'src/stores/settings.ts',
				'src/utils/exercises.ts'
			],
			exclude: [
				'src/**/*.test.ts',
				'src/**/*.test.tsx',
				'src/**/*.stories.tsx'
			],
			reporter: ['text', 'lcov'],
			reportsDirectory: 'coverage',
			thresholds: {
				branches: 88,
				functions: 90,
				lines: 90,
				statements: 90
			}
		},
		css: false,
		environment: 'happy-dom',
		globals: true,
		include: ['src/**/*.test.ts?(x)'],
		setupFiles: 'src/test-setup.ts'
	}
}

export default defineConfig(() => ({
	base: process.env.BASE_URL || './',
	plugins: [react(), tailwindcss(), ...resolveAnalyzerPlugins()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	test: createTestConfiguration()
}))
