import type {TranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	hintIcon: 'exercise.hintIcon'
} as const satisfies TranslationDictionary

export type TranslationKey = keyof typeof translations
