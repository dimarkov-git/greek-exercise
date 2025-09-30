import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	userLanguageLabel: 'userLanguageLabel'
} as const satisfies AutonomousTranslationDictionary

export type TranslationKey = keyof typeof translations
