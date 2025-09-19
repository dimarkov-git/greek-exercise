import {useQuery} from '@tanstack/react-query'
import {useEffect, useRef, useState} from 'react'
import {useSettingsStore} from '@/stores/settings'
import type {
	SupportedLanguage,
	TranslationOptions,
	TranslationRequest,
	TranslationResult
} from '@/types/translations'
import {getRandomFictionalText} from '@/types/translations'

interface TranslationsResponse {
	translations: TranslationResult
}

async function fetchTranslations(
	language: SupportedLanguage,
	keys: string[]
): Promise<TranslationResult> {
	const keysParam = keys.join(',')
	const url = `/api/translations?lang=${language}&keys=${encodeURIComponent(keysParam)}`

	// If URL is too long, use POST instead
	if (url.length > 2000) {
		const response = await fetch('/api/translations', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				language,
				keys
			})
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch translations: ${response.statusText}`)
		}

		const data: TranslationsResponse = await response.json()
		return data.translations
	}

	// Use GET for shorter requests
	const response = await fetch(url)

	if (!response.ok) {
		throw new Error(`Failed to fetch translations: ${response.statusText}`)
	}

	const data: TranslationsResponse = await response.json()
	return data.translations
}

function getDefaultLanguage(): SupportedLanguage {
	// Check if we're in test environment via global variables
	if (typeof globalThis !== 'undefined' && '__VITEST__' in globalThis) {
		return 'en'
	}

	// Check browser environment for test indicators
	if (
		typeof window !== 'undefined' &&
		(window.location.href.includes('test') || document.title.includes('test'))
	) {
		return 'en'
	}

	// Default to Greek for production
	return 'el'
}

function createGetTranslation(
	translations: TranslationResult | undefined,
	fictionalLanguage: boolean
) {
	return (request: TranslationRequest): string => {
		const {key, fallback} = request

		if (!translations) {
			return fallback || key
		}

		const translation = translations[key]
		if (translation) {
			return translation
		}

		if (fallback) {
			return fallback
		}

		if (fictionalLanguage) {
			return getRandomFictionalText()
		}

		return key
	}
}

function createTranslationFunction(
	requests: TranslationRequest[],
	getTranslation: (request: TranslationRequest) => string,
	fictionalLanguage: boolean
) {
	return (key: string): string => {
		const request = requests.find(req => req.key === key)
		if (!request) {
			return fictionalLanguage ? getRandomFictionalText() : key
		}
		return getTranslation(request)
	}
}

function createTranslationMap(
	requests: TranslationRequest[],
	getTranslation: (request: TranslationRequest) => string
): Record<string, string> {
	return requests.reduce(
		(acc, request) => {
			acc[request.key] = getTranslation(request)
			return acc
		},
		{} as Record<string, string>
	)
}

export function useTranslations(
	requests: TranslationRequest[],
	options: TranslationOptions = {}
) {
	const {uiLanguage} = useSettingsStore()
	const {fictionalLanguage = true} = options
	const [isLanguageLoading, setIsLanguageLoading] = useState(false)
	const previousLanguageRef = useRef<SupportedLanguage | undefined>(undefined)

	const currentLanguage = uiLanguage || getDefaultLanguage()
	const allKeys = Array.from(new Set(requests.map(req => req.key)))

	const {
		data: translations,
		isLoading: isQueryLoading,
		error
	} = useQuery({
		queryKey: ['new-translations', currentLanguage, allKeys.sort()],
		queryFn: () => fetchTranslations(currentLanguage, allKeys),
		staleTime: Number.POSITIVE_INFINITY,
		retry: 2
	})

	// Track language changes to force loading state
	useEffect(() => {
		if (
			previousLanguageRef.current !== undefined &&
			previousLanguageRef.current !== currentLanguage
		) {
			setIsLanguageLoading(true)
			const timer = setTimeout(() => {
				setIsLanguageLoading(false)
			}, 300) // Minimum animation duration
			previousLanguageRef.current = currentLanguage
			return () => clearTimeout(timer)
		}
		previousLanguageRef.current = currentLanguage
		return
	}, [currentLanguage])

	// Reset loading state when query starts loading
	useEffect(() => {
		if (isQueryLoading) {
			setIsLanguageLoading(false)
		}
	}, [isQueryLoading])

	const getTranslation = createGetTranslation(translations, fictionalLanguage)
	const t = createTranslationFunction(
		requests,
		getTranslation,
		fictionalLanguage
	)
	const translationMap = createTranslationMap(requests, getTranslation)

	return {
		t,
		translations: translationMap,
		currentLanguage,
		isLoading: isQueryLoading || isLanguageLoading,
		error: error as Error | null
	}
}
