/// <reference types="vitest/config" />

import path from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'

export default defineConfig(() => ({
	base: process.env.BASE_URL || './',
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@tests': path.resolve(__dirname, './tests')
		}
	},
	test: {
		bail: 1,
		clearMocks: true,
		coverage: {
			enabled: true,
			exclude: [
				'src/main.tsx',
				'src/mocks/browser.ts',
				'src/**/*.d.ts',
				'src/api/**',
				'src/mocks/**',
				'src/pages/**',
				'src/components/exercises/shared/**',
				'src/components/learn/**',
				'src/hooks/useExercises.ts',
				'src/hooks/useHintState.ts',
				'src/hooks/usePulseEffect.ts',
				'src/types/**'
			],
			include: [
				'src/App.tsx',
				'src/components/exercises/word-form/CompletionScreen.tsx',
				'src/components/exercises/word-form/WordFormFeedback.tsx',
				'src/components/exercises/word-form/WordFormInput.tsx',
				'src/components/exercises/word-form/hooks/useAnswerHandler.ts',
				'src/components/exercises/word-form/hooks/useWordFormExercise.ts',
				'src/components/ui/ThemeToggle.tsx',
				'src/stores/settings.ts',
				'src/utils/exercises.ts',
				'src/schemas/exercises.ts'
			],
			provider: 'v8',
			reporter: ['text', 'lcov'],
			reportsDirectory: 'coverage',
			thresholds: {
				branches: 80,
				functions: 85,
				lines: 85,
				statements: 85
			}
		},
		css: false,
		environment: 'jsdom',
		globals: true,
		include: ['src/**/*.test.ts?(x)'],
		setupFiles: ['tests/setupTests.ts']
	}
}))
