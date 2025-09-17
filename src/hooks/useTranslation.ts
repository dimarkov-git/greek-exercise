import {useQuery} from '@tanstack/react-query'
import {
	getCommonTexts,
	getTranslations,
	type SupportedLanguage
} from '@/api/texts'
import {useLanguage} from '@/hooks/useLanguage'

export function useTranslation() {
	const {language} = useLanguage()

	const {data: commonTexts} = useQuery({
		queryKey: ['texts', 'common'],
		queryFn: getCommonTexts,
		staleTime: 1000 * 60 * 30 // 30 minutes
	})

	const {data: translations} = useQuery({
		queryKey: ['translations', language],
		queryFn: () => getTranslations(language),
		staleTime: 1000 * 60 * 30 // 30 minutes
	})

	const t = (key: string): string => {
		if (!translations) {
			return key
		}
		return translations[key] ?? key
	}

	return {
		t,
		language,
		isLoading: !(commonTexts && translations),
		commonTexts,
		translations
	}
}

export function useLanguageSwitch() {
	const {language, setLanguage} = useLanguage()

	const switchLanguage = (newLanguage: SupportedLanguage) => {
		setLanguage(newLanguage)
	}

	return {
		currentLanguage: language,
		switchLanguage,
		availableLanguages: ['en', 'ru', 'el'] as const
	}
}
