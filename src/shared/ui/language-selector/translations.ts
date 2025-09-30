import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	interfaceLanguage: 'interfaceLanguage'
} as const satisfies AutonomousTranslationDictionary

export type TranslationKey = keyof typeof translations
