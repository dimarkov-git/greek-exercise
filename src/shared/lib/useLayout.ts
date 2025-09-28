import {useContext} from 'react'
import {LayoutContext} from '@/shared/lib/contexts/LayoutContextDefinition'

export function useLayout() {
	const context = useContext(LayoutContext)
	if (context === undefined) {
		throw new Error('useLayout must be used within a LayoutProvider')
	}
	return context
}
