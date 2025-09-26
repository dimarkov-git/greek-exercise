import {act, renderHook} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {useHintState} from '@/hooks/useHintState'

describe('useHintState', () => {
	it('toggles hint visibility state', () => {
		const {result} = renderHook(() => useHintState())

		expect(result.current.isHintVisible('hint-1')).toBe(false)

		act(() => {
			result.current.toggleHint('hint-1')
		})

		expect(result.current.isHintVisible('hint-1')).toBe(true)

		act(() => {
			result.current.toggleHint('hint-1')
		})

		expect(result.current.isHintVisible('hint-1')).toBe(false)
	})

	it('shows, hides and clears individual hints without affecting others', () => {
		const {result} = renderHook(() => useHintState())

		act(() => {
			result.current.showHint('alpha')
			result.current.showHint('beta')
		})

		expect(result.current.isHintVisible('alpha')).toBe(true)
		expect(result.current.isHintVisible('beta')).toBe(true)

		act(() => {
			result.current.hideHint('alpha')
		})

		expect(result.current.isHintVisible('alpha')).toBe(false)
		expect(result.current.isHintVisible('beta')).toBe(true)

		act(() => {
			result.current.hideAllHints()
		})

		expect(result.current.isHintVisible('alpha')).toBe(false)
		expect(result.current.isHintVisible('beta')).toBe(false)
	})
})
