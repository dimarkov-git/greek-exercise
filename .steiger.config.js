export default {
	root: './src',
	plugins: ['@steiger/plugin-fsd'],
	rules: {
		// FSD rules configuration
		'fsd/forbidden-imports': 'error',
		'fsd/insignificant-slice': 'warn',
		'fsd/public-api': 'error',
		'fsd/file-structure': 'warn'
	},
	// Allow some cross-imports between specific features as they are business requirements
	ignorePatterns: [
		// Allow hint-system and word-form-exercise cross-imports as they are tightly coupled
		'**/features/word-form-exercise/**/*.ts',
		'**/features/word-form-exercise/**/*.tsx',
		'**/features/hint-system/**/*.ts',
		'**/features/hint-system/**/*.tsx',
		// Allow test files to have more flexible imports
		'**/*.test.ts',
		'**/*.test.tsx',
		'**/*.spec.ts',
		'**/*.spec.tsx',
		// Allow shared layer test utilities to import from higher layers for testing purposes
		'**/shared/test/**/*.ts',
		'**/shared/test/**/*.tsx',
		'**/shared/lib/test-utils.tsx',
		// Allow shared API layer to import app config (common pattern)
		'**/shared/api/**/*.ts'
	]
}
