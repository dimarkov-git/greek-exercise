import {useSettingsStore} from '@/stores/settings'
import type {Language} from '@/types/settings'

export interface I18nStrings {
	[key: string]: Record<Language, string>
}

const translations: I18nStrings = {
	// Home page
	appTitle: {
		el: 'Εκμάθηση Ελληνικών',
		ru: 'Изучение греческого языка',
		en: 'Greek Learning'
	},
	appSubtitle: {
		el: 'Διαδραστικές ασκήσεις για την εκμάθηση της ελληνικής γλώσσας',
		ru: 'Интерактивные упражнения для изучения греческого языка',
		en: 'Interactive exercises for learning Greek language'
	},

	// Settings
	settings: {
		el: 'Ρυθμίσεις',
		ru: 'Настройки',
		en: 'Settings'
	},
	interfaceLanguage: {
		el: 'Γλώσσα διεπαφής',
		ru: 'Язык интерфейса',
		en: 'Interface language'
	},
	userLanguage: {
		el: 'Η γλώσσα σας',
		ru: 'Ваш язык',
		en: 'Your language'
	},
	theme: {
		el: 'Θέμα',
		ru: 'Тема',
		en: 'Theme'
	},
	lightTheme: {
		el: 'Ανοιχτό',
		ru: 'Светлая',
		en: 'Light'
	},
	darkTheme: {
		el: 'Σκοτεινό',
		ru: 'Темная',
		en: 'Dark'
	},

	// Navigation
	exerciseLibrary: {
		el: 'Βιβλιοθήκη Ασκήσεων',
		ru: 'Библиотека упражнений',
		en: 'Exercise Library'
	},
	exerciseBuilder: {
		el: 'Κατασκευαστής Ασκήσεων',
		ru: 'Конструктор упражнений',
		en: 'Exercise Builder'
	},
	exerciseLibraryDesc: {
		el: 'Περιηγηθείτε και εκτελέστε διαθέσιμες ασκήσεις',
		ru: 'Просматривайте и выполняйте доступные упражнения',
		en: 'Browse and execute available exercises'
	},
	exerciseBuilderDesc: {
		el: 'Δημιουργήστε τις δικές σας ασκήσεις',
		ru: 'Создавайте собственные упражнения',
		en: 'Create your own exercises'
	}
}

export function useI18n() {
	const {uiLanguage} = useSettingsStore()

	const t = (key: keyof typeof translations): string => {
		const translation = translations[key]
		return translation?.[uiLanguage] || String(key)
	}

	return {t, currentLanguage: uiLanguage}
}
