import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	darkTheme: 'theme.darkTheme',
	lightTheme: 'theme.lightTheme',
	sunEmoji: '☀️',
	moonEmoji: '🌙'
} as const satisfies AutonomousTranslationDictionary

export type TranslationKey = keyof typeof translations
