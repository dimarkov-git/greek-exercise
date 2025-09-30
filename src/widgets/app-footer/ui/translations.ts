import type {TranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	copyright: 'footer.copyright',
	github: 'footer.github',
	madeWith: {
		fallback: 'Από τον Ντένις με αγάπη'
	}
} as const satisfies TranslationDictionary

export type TranslationKey = keyof typeof translations
