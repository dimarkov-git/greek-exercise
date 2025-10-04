import {useCallback, useMemo, useState} from 'react'
import type {
	Difficulty,
	ExerciseLibraryViewModel,
	ExerciseType
} from '@/entities/exercise'
import {
	selectDifficultyOptions,
	selectFilteredExercises,
	selectLanguageOptions,
	selectTagOptions,
	selectTypeOptions
} from '@/entities/exercise'
import type {Language} from '@/shared/model'

export function useExerciseFiltering(
	viewModel: ExerciseLibraryViewModel | undefined
) {
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [selectedDifficulties, setSelectedDifficulties] = useState<
		Difficulty[]
	>([])
	const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([])
	const [selectedTypes, setSelectedTypes] = useState<ExerciseType[]>([])

	const filteredExercises = useMemo(() => {
		if (!viewModel) {
			return []
		}

		return selectFilteredExercises(viewModel.exercises, {
			tags: selectedTags,
			difficulties: selectedDifficulties,
			languages: selectedLanguages,
			types: selectedTypes
		})
	}, [
		selectedDifficulties,
		selectedLanguages,
		selectedTags,
		selectedTypes,
		viewModel
	])

	const {tagOptions, difficultyOptions, languageOptions, typeOptions} =
		useMemo(() => {
			if (!viewModel) {
				return {
					tagOptions: [],
					difficultyOptions: [] as Difficulty[],
					languageOptions: [] as Language[],
					typeOptions: [] as ExerciseType[]
				}
			}

			return {
				tagOptions: selectTagOptions(viewModel),
				difficultyOptions: selectDifficultyOptions(viewModel),
				languageOptions: selectLanguageOptions(viewModel),
				typeOptions: selectTypeOptions(viewModel)
			}
		}, [viewModel])

	const clearFilters = useCallback(() => {
		setSelectedTags([])
		setSelectedDifficulties([])
		setSelectedLanguages([])
		setSelectedTypes([])
	}, [])

	return {
		filteredExercises,
		selectedTags,
		setSelectedTags,
		selectedDifficulties,
		setSelectedDifficulties,
		selectedLanguages,
		setSelectedLanguages,
		selectedTypes,
		setSelectedTypes,
		tagOptions,
		difficultyOptions,
		languageOptions,
		typeOptions,
		clearFilters
	}
}
