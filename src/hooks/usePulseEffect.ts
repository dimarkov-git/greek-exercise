import {useState} from 'react'

/**
 * Hook for managing pulse animation state
 */
export function usePulseEffect() {
	const [pulseState, setPulseState] = useState<boolean | null>(null)

	const triggerPulse = (isCorrect: boolean) => {
		setPulseState(isCorrect)
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
