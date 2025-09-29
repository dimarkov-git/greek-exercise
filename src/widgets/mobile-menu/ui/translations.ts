import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

export const mobileMenuTranslations = {
	home: 'navigation.home',
	library: 'navigation.library',
	builder: 'navigation.builder',
	testSection: 'navigation.testSection',
	settings: 'settings'
} as const satisfies AutonomousTranslationDictionary

export const mobileMenuButtonTranslations = {
	menu: 'navigation.menu',
	close: 'navigation.close'
} as const satisfies AutonomousTranslationDictionary
