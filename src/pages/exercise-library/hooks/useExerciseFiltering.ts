import {useCallback, useMemo, useState} from 'react'
import {
	selectDifficultyOptions,
	selectFilteredExercises,
	selectLanguageOptions,
	selectTagOptions
} from '@/domain/exercises/selectors'
import type {ExerciseLibraryViewModel} from '@/domain/exercises/types'
import type {Difficulty} from '@/entities/exercise'
import type {Language} from '@/shared/model/settings'

export function useExerciseFiltering(
	viewModel: ExerciseLibraryViewModel | undefined
) {
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [selectedDifficulties, setSelectedDifficulties] = useState<
		Difficulty[]
	>([])
	const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([])

	const filteredExercises = useMemo(() => {
		if (!viewModel) {
			return []
		}

		return selectFilteredExercises(viewModel.exercises, {
			tags: selectedTags,
			difficulties: selectedDifficulties,
			languages: selectedLanguages
		})
	}, [selectedDifficulties, selectedLanguages, selectedTags, viewModel])

	const {tagOptions, difficultyOptions, languageOptions} = useMemo(() => {
		if (!viewModel) {
			return {
				tagOptions: [],
				difficultyOptions: [] as Difficulty[],
				languageOptions: [] as Language[]
			}
		}

		return {
			tagOptions: selectTagOptions(viewModel),
			difficultyOptions: selectDifficultyOptions(viewModel),
			languageOptions: selectLanguageOptions(viewModel)
		}
	}, [viewModel])

	const clearFilters = useCallback(() => {
		setSelectedTags([])
		setSelectedDifficulties([])
		setSelectedLanguages([])
	}, [])

	return {
		filteredExercises,
		selectedTags,
		setSelectedTags,
		selectedDifficulties,
		setSelectedDifficulties,
		selectedLanguages,
		setSelectedLanguages,
		tagOptions,
		difficultyOptions,
		languageOptions,
		clearFilters
	}
}
