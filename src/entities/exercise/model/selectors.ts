import type {ExercisesListDto} from '@/entities/exercise'
import {createExerciseLibraryViewModel} from './adapters'
import type {
	ExerciseFilterSelection,
	ExerciseLibraryViewModel,
	ExerciseSummary
} from './domain-types'
import type {ExerciseMetadata} from './types'

type Selector<TArgs extends readonly unknown[], TResult> = (
	...args: TArgs
) => TResult

function areArgumentsEqual(
	previous: readonly unknown[] | undefined,
	next: readonly unknown[]
): boolean {
	if (!previous || previous.length !== next.length) {
		return false
	}

	for (let index = 0; index < next.length; index++) {
		if (!Object.is(previous[index], next[index])) {
			return false
		}
	}

	return true
}

export function createMemoizedSelector<
	TArgs extends readonly unknown[],
	TResult
>(selector: Selector<TArgs, TResult>): Selector<TArgs, TResult> {
	let lastArgs: readonly unknown[] | undefined
	let lastResult: TResult | undefined

	return (...args) => {
		if (areArgumentsEqual(lastArgs, args)) {
			return lastResult as TResult
		}

		lastArgs = args
		lastResult = selector(...args)
		return lastResult
	}
}

export const selectExerciseLibraryViewModel = createMemoizedSelector(
	(metadata: ExercisesListDto): ExerciseLibraryViewModel =>
		createExerciseLibraryViewModel(metadata)
)

export const selectFilterOptions = createMemoizedSelector(
	(viewModel: ExerciseLibraryViewModel) => viewModel.filterOptions
)

export const selectFilteredExercises = createMemoizedSelector(
	(
		exercises: ExerciseSummary[],
		filters: ExerciseFilterSelection
	): ExerciseSummary[] => {
		if (
			filters.tags.length === 0 &&
			filters.difficulties.length === 0 &&
			filters.languages.length === 0
		) {
			return exercises
		}

		return exercises.filter(exercise => {
			const matchesTags =
				filters.tags.length === 0 ||
				filters.tags.every(tag => exercise.tags.includes(tag))

			if (!matchesTags) {
				return false
			}

			const matchesDifficulty =
				filters.difficulties.length === 0 ||
				filters.difficulties.includes(exercise.difficulty)

			if (!matchesDifficulty) {
				return false
			}

			const matchesLanguages =
				filters.languages.length === 0 ||
				filters.languages.every(language =>
					exercise.availableLanguages.includes(language)
				)

			return matchesLanguages
		})
	}
)

export const selectHasEnabledExercises = createMemoizedSelector(
	(viewModel: ExerciseLibraryViewModel) => viewModel.totals.enabled > 0
)

export const selectDifficultyOptions = createMemoizedSelector(
	(viewModel: ExerciseLibraryViewModel): ExerciseMetadata['difficulty'][] =>
		viewModel.filterOptions.difficulties
)

export const selectTagOptions = createMemoizedSelector(
	(viewModel: ExerciseLibraryViewModel): string[] =>
		viewModel.filterOptions.tags
)

export const selectLanguageOptions = createMemoizedSelector(
	(viewModel: ExerciseLibraryViewModel) => viewModel.filterOptions.languages
)
