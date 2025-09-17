import {createContext} from 'react'
import type {SupportedLanguage} from '@/api/texts'

export interface LanguageContextType {
	language: SupportedLanguage
	setLanguage: (lang: SupportedLanguage) => void
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
)
