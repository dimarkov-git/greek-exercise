import type {TranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	tableView: 'tableView',
	jsonView: 'jsonView'
} as const satisfies TranslationDictionary

export type TranslationKey = keyof typeof translations
