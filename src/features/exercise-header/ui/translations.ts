import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	backArrow: 'exercise.backArrow',
	backToLibrary: 'exercise.backToLibrary',
	autoAdvanceEnabled: 'exercise.autoAdvanceEnabled',
	autoAdvanceDisabled: 'exercise.autoAdvanceDisabled',
	autoAdvanceEnabledIcon: 'exercise.autoAdvanceEnabledIcon',
	autoAdvanceDisabledIcon: 'exercise.autoAdvanceDisabledIcon',
	autoAdvance: 'exercise.autoAdvance',
	progress: 'exercise.progress',
	progressOf: 'exercise.progressOf'
} as const satisfies AutonomousTranslationDictionary

export type TranslationKey = keyof typeof translations
