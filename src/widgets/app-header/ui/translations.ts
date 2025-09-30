import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

export const headerNavigationTranslations = {
	home: 'navigation.home',
	library: 'navigation.library',
	builder: 'navigation.builder'
} as const satisfies AutonomousTranslationDictionary

export const headerLogoTranslations = {
	logoInitials: {
		key: 'app.logoInitials',
		fallback: 'ΜΕ'
	},
	title: 'app.title'
} as const satisfies AutonomousTranslationDictionary
