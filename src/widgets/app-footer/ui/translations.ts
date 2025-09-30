import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	copyright: 'footer.copyright',
	github: 'footer.github',
	madeWith: {
		fallback: 'Από τον Ντένις με αγάπη'
	}
} as const satisfies AutonomousTranslationDictionary

export type TranslationKey = keyof typeof translations
