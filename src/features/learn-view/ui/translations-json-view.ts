import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	copyJson: 'copyJson',
	jsonCopied: 'jsonCopied',
	copyFailed: 'copyFailed',
	success: 'success',
	error: 'error',
	copy: 'copy'
} as const satisfies AutonomousTranslationDictionary

export type TranslationKey = keyof typeof translations