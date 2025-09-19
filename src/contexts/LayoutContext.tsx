import type {ReactNode} from 'react'
import {createContext, useContext, useState} from 'react'

interface LayoutContextType {
	headerEnabled: boolean
	setHeaderEnabled: (enabled: boolean) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

interface LayoutProviderProps {
	children: ReactNode
}

export function LayoutProvider({children}: LayoutProviderProps) {
	const [headerEnabled, setHeaderEnabled] = useState(true)

	return (
		<LayoutContext.Provider value={{headerEnabled, setHeaderEnabled}}>
			{children}
		</LayoutContext.Provider>
	)
}

export function useLayout() {
	const context = useContext(LayoutContext)
	if (context === undefined) {
		throw new Error('useLayout must be used within a LayoutProvider')
	}
	return context
}
