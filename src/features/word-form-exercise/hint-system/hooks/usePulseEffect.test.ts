import {act, renderHook} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {usePulseEffect} from '../index'

describe('usePulseEffect', () => {
	it('provides null as the initial pulse state', () => {
		const {result} = renderHook(() => usePulseEffect())

		expect(result.current.pulseState).toBeNull()
	})

	it('updates and clears the pulse state when triggered', () => {
		const {result} = renderHook(() => usePulseEffect())

		act(() => {
			result.current.triggerPulse('correct')
		})

		expect(result.current.pulseState).toBe('correct')

		act(() => {
			result.current.triggerPulse('incorrect')
		})

		expect(result.current.pulseState).toBe('incorrect')

		act(() => {
			result.current.clearPulse()
		})

		expect(result.current.pulseState).toBeNull()
	})
})
