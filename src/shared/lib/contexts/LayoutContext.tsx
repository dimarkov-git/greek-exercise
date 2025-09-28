import type {ReactNode} from 'react'
import {useState} from 'react'
import {LayoutContext} from './LayoutContextDefinition'

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
