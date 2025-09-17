import {type ReactNode, useState} from 'react'
import type {SupportedLanguage} from '@/api/texts'
import {LanguageContext} from './languageTypes'

interface LanguageProviderProps {
	children: ReactNode
	defaultLanguage?: SupportedLanguage
}

export function LanguageProvider({
	children,
	defaultLanguage = 'el'
}: LanguageProviderProps) {
	const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage)

	return (
		<LanguageContext.Provider value={{language, setLanguage}}>
			{children}
		</LanguageContext.Provider>
	)
}
