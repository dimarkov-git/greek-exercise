import {act, renderHook} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {useLayout} from '@/shared/lib'
import {LayoutProvider} from '@/shared/lib/contexts/LayoutContext'

describe('useLayout', () => {
	it('throws when used outside of a LayoutProvider', () => {
		expect(() => renderHook(() => useLayout())).toThrow(
			'useLayout must be used within a LayoutProvider'
		)
	})

	it('exposes state and toggle helpers from LayoutProvider', () => {
		const {result} = renderHook(() => useLayout(), {
			wrapper: ({children}) => <LayoutProvider>{children}</LayoutProvider>
		})

		expect(result.current.headerEnabled).toBe(true)

		act(() => {
			result.current.setHeaderEnabled(false)
		})

		expect(result.current.headerEnabled).toBe(false)
	})
})
