import {useState} from 'react'
import type {PulseState} from '@/components/exercises/shared/PulseEffect'

/**
 * Hook for managing pulse animation state
 */
export function usePulseEffect() {
	const [pulseState, setPulseState] = useState<PulseState>(null)

	const triggerPulse = (state: 'correct' | 'incorrect' | 'skip') => {
		setPulseState(state)
	}

	const clearPulse = () => {
		setPulseState(null)
	}

	return {
		pulseState,
		triggerPulse,
		clearPulse
	}
}
