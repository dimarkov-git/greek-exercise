import type {TranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	interfaceLanguage: 'interfaceLanguage'
} as const satisfies TranslationDictionary

export type TranslationKey = keyof typeof translations
