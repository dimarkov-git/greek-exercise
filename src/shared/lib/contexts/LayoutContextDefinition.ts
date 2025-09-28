import {createContext} from 'react'

interface LayoutContextType {
	headerEnabled: boolean
	setHeaderEnabled: (enabled: boolean) => void
}

export const LayoutContext = createContext<LayoutContextType | undefined>(
	undefined
)
