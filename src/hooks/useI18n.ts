import {useQuery} from '@tanstack/react-query'
import {getTranslations, type SupportedLanguage} from '@/api/texts'
import {useSettingsStore} from '@/stores/settings'

// Fallback translations for critical UI elements
const fallbackTranslations = {
	appTitle: 'Greek Learning App',
	appSubtitle: 'Interactive exercises for learning Greek language',
	settings: 'Settings',
	exerciseLibrary: 'Exercise Library',
	exerciseBuilder: 'Exercise Builder',
	exerciseLibraryDesc: 'Browse and execute available exercises',
	exerciseBuilderDesc: 'Create your own exercises'
}

export function useI18n() {
	const {uiLanguage} = useSettingsStore()

	const {data: translations, isLoading} = useQuery({
		queryKey: ['translations', uiLanguage],
		queryFn: () => getTranslations(uiLanguage as SupportedLanguage),
		staleTime: 1000 * 60 * 30, // 30 minutes
		retry: 3
	})

	const t = (key: string): string => {
		if (!translations) {
			return (
				fallbackTranslations[key as keyof typeof fallbackTranslations] || key
			)
		}
		return (
			translations[key] ??
			fallbackTranslations[key as keyof typeof fallbackTranslations] ??
			key
		)
	}

	return {
		t,
		currentLanguage: uiLanguage,
		isLoading
	}
}
