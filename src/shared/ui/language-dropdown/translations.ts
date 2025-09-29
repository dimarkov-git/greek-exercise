import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

/**
 * Language dropdown translations
 *
 * Simple format: English fallbacks that work offline
 * Service will provide translations for other languages
 */
export const translations = {
	selectLanguage: 'Select Language',
	dropdownArrow: 'Dropdown arrow',
	selectedLanguage: 'Selected language'
} as const satisfies AutonomousTranslationDictionary

export type TranslationKey = keyof typeof translations
