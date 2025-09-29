import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	tableView: 'tableView',
	jsonView: 'jsonView'
} as const satisfies AutonomousTranslationDictionary

export type TranslationKey = keyof typeof translations