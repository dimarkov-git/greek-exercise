import {useEffect} from 'react'
import {useSettingsStore} from '@/stores/settings'

export function setDocumentTheme(theme: string) {
	if (typeof document === 'undefined') {
		return
	}

	document.documentElement.setAttribute('data-theme', theme)

	if (theme === 'dark') {
		document.documentElement.classList.add('dark')
	} else {
		document.documentElement.classList.remove('dark')
	}
}

export function setDocumentLanguage(language: string) {
	if (typeof document === 'undefined') {
		return
	}

	document.documentElement.lang = language
}

export function useSettingsSync() {
	const theme = useSettingsStore(state => state.theme)
	const uiLanguage = useSettingsStore(state => state.uiLanguage)

	useEffect(() => {
		setDocumentTheme(theme)
	}, [theme])

	useEffect(() => {
		setDocumentLanguage(uiLanguage)
	}, [uiLanguage])
}
