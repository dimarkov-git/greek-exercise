import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	hintIcon: 'exercise.hintIcon'
} as const satisfies AutonomousTranslationDictionary

export type TranslationKey = keyof typeof translations
