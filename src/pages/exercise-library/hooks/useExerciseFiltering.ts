import {useCallback, useMemo, useState} from 'react'
import type {ExerciseMetadata} from '@/types/exercises'

export function useExerciseFiltering(
	exercises: ExerciseMetadata[] | undefined
) {
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])

	const filteredExercises = useMemo(() => {
		if (!exercises) return []

		return exercises.filter(exercise => {
			if (selectedTags.length > 0) {
				const hasSelectedTag = selectedTags.some(tag =>
					exercise.tags.includes(tag)
				)
				if (!hasSelectedTag) return false
			}

			if (
				selectedDifficulties.length > 0 &&
				!selectedDifficulties.includes(exercise.difficulty)
			) {
				return false
			}

			return true
		})
	}, [exercises, selectedDifficulties, selectedTags])

	const allTags = useMemo(() => {
		if (!exercises) return []

		return [...new Set(exercises.flatMap(exercise => exercise.tags))].sort()
	}, [exercises])

	const clearFilters = useCallback(() => {
		setSelectedTags([])
		setSelectedDifficulties([])
	}, [])

	return {
		selectedTags,
		setSelectedTags,
		selectedDifficulties,
		setSelectedDifficulties,
		filteredExercises,
		allTags,
		clearFilters
	}
}
