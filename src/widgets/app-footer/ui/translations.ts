import type {TranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	copyright: 'footer.copyright',
	github: 'footer.github',
	madeWith: {
		key: 'footer.madeWith',
		translations: {
			el: 'Από τον Ντένις με αγάπη'
		},
		defaultLanguage: 'el',
		fallback: 'Made by Denis with love'
	}
} as const satisfies TranslationDictionary

export type TranslationKey = keyof typeof translations
