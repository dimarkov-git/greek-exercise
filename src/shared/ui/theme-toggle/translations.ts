import type {TranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	darkTheme: 'theme.darkTheme',
	lightTheme: 'theme.lightTheme',
	sunEmoji: '☀️',
	moonEmoji: '🌙'
} as const satisfies TranslationDictionary

export type TranslationKey = keyof typeof translations
