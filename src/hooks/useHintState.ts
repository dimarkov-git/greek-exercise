import {useState} from 'react'

/**
 * Hook for managing hint visibility state
 */
export function useHintState() {
	const [visibleHints, setVisibleHints] = useState<Set<string>>(new Set())

	const toggleHint = (hintId: string) => {
		setVisibleHints(prev => {
			const newSet = new Set(prev)
			if (newSet.has(hintId)) {
				newSet.delete(hintId)
			} else {
				newSet.add(hintId)
			}
			return newSet
		})
	}

	const showHint = (hintId: string) => {
		setVisibleHints(prev => new Set(prev).add(hintId))
	}

	const hideHint = (hintId: string) => {
		setVisibleHints(prev => {
			const newSet = new Set(prev)
			newSet.delete(hintId)
			return newSet
		})
	}

	const hideAllHints = () => {
		setVisibleHints(new Set())
	}

	const isHintVisible = (hintId: string) => visibleHints.has(hintId)

	return {
		toggleHint,
		showHint,
		hideHint,
		hideAllHints,
		isHintVisible
	}
}
