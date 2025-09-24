/**
 * Centralized test selectors for stable element identification
 * Uses data-testid attributes instead of text-based selectors for language independence
 */

const HASH_PREFIX = '/#'

const normalizePath = (path: string) =>
	path.startsWith('/') ? path : `/${path}`

const withHashPath = (path: string) => {
	const normalized = normalizePath(path)
	return normalized === '/' ? `${HASH_PREFIX}/` : `${HASH_PREFIX}${normalized}`
}

const withHashRegex = (path: string) => new RegExp(withHashPath(path))

export const SELECTORS = {
	// Navigation and Layout
	navCardExercises: '[data-testid="nav-card-exercises"]',
	navCardBuilder: '[data-testid="nav-card-builder"]',
	exerciseBackButton: '[data-testid="exercise-back-button"]',
	mobileMenu: '[data-testid="mobile-menu"]',
	mobileMenuLanguageDropdown:
		'[data-testid="mobile-menu"] [data-testid="ui-language-dropdown"]',

	// Theme Controls
	themeToggle: '[data-testid="theme-toggle"]',
	mobileMenuThemeToggle:
		'[data-testid="mobile-menu"] [data-testid="theme-toggle"]',
	themeDataAttr: '[data-theme]',

	// Language Controls
	uiLanguageDropdown: '[data-testid="ui-language-dropdown"]',
	uiLanguageDropdownMenu: '[data-testid="ui-language-dropdown-menu"]',
	uiLanguageOption: (lang: string) =>
		`[data-testid="ui-language-option-${lang}"]`,
	uiLanguageDataAttr: '[data-current-language]',

	userLanguageSelector: '[data-testid="user-language-selector"]',
	userLanguageOption: (lang: string) =>
		`[data-testid="user-language-option-${lang}"]`,
	userLanguageDataAttr: '[data-current-user-language]',

	// Exercise Controls
	exerciseInput: '[data-testid="exercise-input"]',
	exerciseSubmitButton: '[data-testid="exercise-submit-button"]',
	startExerciseButton: '[data-testid="start-exercise-button"]',
	autoAdvanceToggle: '[data-testid="auto-advance-toggle"]',
	exerciseProgress: '[data-testid="exercise-progress"]',
	progressText: '[data-testid="progress-text"]',

	// Generic Selectors
	mainHeading: 'h1',
	htmlElement: 'html',
	textboxRole: 'role=textbox',
	buttonRole: 'role=button',
	linkRole: 'role=link'
} as const

/**
 * Attribute selectors for data-driven testing
 */
export const DATA_ATTRIBUTES = {
	theme: 'data-theme',
	uiLanguage: 'data-current-language',
	userLanguage: 'data-current-user-language',
	inputStatus: 'data-status',
	autoAdvanceEnabled: 'data-enabled',
	userLangSelected: 'data-selected',
	dropdownOpen: 'data-is-open',
	progressCurrent: 'data-progress-current',
	progressTotal: 'data-progress-total'
} as const

/**
 * CSS class selectors for state checking
 */
export const CSS_CLASSES = {
	greenBackground: '.bg-green-500',
	redText: '.text-red-600',
	hiddenMobile: '.md\\:hidden'
} as const

/**
 * Route patterns for URL validation
 */
export const ROUTES = {
	home: withHashPath('/'),
	exercises: withHashPath('/exercises'),
	exercisePath: (slug: string) => withHashPath(`/exercise/${slug}`),
	exerciseVerbsBe: withHashRegex('/exercise/verbs-be'),
	exerciseVerbsHave: withHashRegex('/exercise/verbs-have')
} as const
