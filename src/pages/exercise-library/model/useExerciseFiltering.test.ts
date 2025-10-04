import {act, renderHook} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import type {
	Difficulty,
	ExerciseLibraryViewModel,
	ExerciseSummary
} from '@/entities/exercise'
import type {Language} from '@/shared/model'

// Mock the selectors module using vi.hoisted()
const selectorsModule = vi.hoisted(() => ({
	selectFilteredExercises: vi.fn(),
	selectTagOptions: vi.fn(),
	selectDifficultyOptions: vi.fn(),
	selectLanguageOptions: vi.fn()
}))

vi.mock('@/entities/exercise', () => ({
	...selectorsModule
}))

import {useExerciseFiltering} from './useExerciseFiltering'

// Test data factory functions
function createExerciseSummary(
	overrides: Partial<ExerciseSummary> = {}
): ExerciseSummary {
	return {
		id: 'test-exercise',
		type: 'word-form',
		language: 'el',
		title: 'Test Exercise',
		description: 'Test Description',
		tags: ['verbs'],
		difficulty: 'a1',
		totalBlocks: 2,
		totalCases: 8,
		enabled: true,
		availableLanguages: ['el', 'en'],
		...overrides
	}
}

function createViewModel(
	overrides: Partial<ExerciseLibraryViewModel> = {}
): ExerciseLibraryViewModel {
	return {
		exercises: [
			createExerciseSummary({id: 'exercise-1', tags: ['verbs', 'present']}),
			createExerciseSummary({
				id: 'exercise-2',
				tags: ['nouns'],
				difficulty: 'b1',
				availableLanguages: ['el', 'ru']
			})
		],
		filterOptions: {
			tags: ['verbs', 'present', 'nouns'],
			difficulties: ['a1', 'b1'],
			languages: ['el', 'en', 'ru'],
			types: ['word-form']
		},
		totals: {
			total: 2,
			enabled: 2
		},
		...overrides
	}
}

describe('useExerciseFiltering', () => {
	beforeEach(() => {
		selectorsModule.selectFilteredExercises.mockReset()
		selectorsModule.selectTagOptions.mockReset()
		selectorsModule.selectDifficultyOptions.mockReset()
		selectorsModule.selectLanguageOptions.mockReset()
	})

	describe('initialization', () => {
		it('initializes with empty filter state', () => {
			const viewModel = createViewModel()
			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			expect(result.current.selectedTags).toEqual([])
			expect(result.current.selectedDifficulties).toEqual([])
			expect(result.current.selectedLanguages).toEqual([])
		})

		it('returns empty arrays when viewModel is undefined', () => {
			selectorsModule.selectFilteredExercises.mockReturnValue([])
			selectorsModule.selectTagOptions.mockReturnValue([])
			selectorsModule.selectDifficultyOptions.mockReturnValue([])
			selectorsModule.selectLanguageOptions.mockReturnValue([])

			const {result} = renderHook(() => useExerciseFiltering(undefined))

			expect(result.current.filteredExercises).toEqual([])
			expect(result.current.tagOptions).toEqual([])
			expect(result.current.difficultyOptions).toEqual([])
			expect(result.current.languageOptions).toEqual([])
		})
	})

	describe('filter state management', () => {
		it('updates selected tags', () => {
			const viewModel = createViewModel()
			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			act(() => {
				result.current.setSelectedTags(['verbs', 'present'])
			})

			expect(result.current.selectedTags).toEqual(['verbs', 'present'])
		})

		it('updates selected difficulties', () => {
			const viewModel = createViewModel()
			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			act(() => {
				result.current.setSelectedDifficulties(['a1', 'b1'])
			})

			expect(result.current.selectedDifficulties).toEqual(['a1', 'b1'])
		})

		it('updates selected languages', () => {
			const viewModel = createViewModel()
			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			act(() => {
				result.current.setSelectedLanguages(['el', 'en'])
			})

			expect(result.current.selectedLanguages).toEqual(['el', 'en'])
		})
	})

	describe('filtered exercises', () => {
		it('calls selectFilteredExercises with current filters', () => {
			const viewModel = createViewModel()
			const expectedExercises = [createExerciseSummary()]
			selectorsModule.selectFilteredExercises.mockReturnValue(expectedExercises)

			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			act(() => {
				result.current.setSelectedTags(['verbs'])
				result.current.setSelectedDifficulties(['a1'])
				result.current.setSelectedLanguages(['el'])
			})

			expect(selectorsModule.selectFilteredExercises).toHaveBeenLastCalledWith(
				viewModel.exercises,
				{
					tags: ['verbs'],
					difficulties: ['a1'],
					languages: ['el']
				}
			)
			expect(result.current.filteredExercises).toBe(expectedExercises)
		})

		it('returns empty array when viewModel is undefined', () => {
			const {result} = renderHook(() => useExerciseFiltering(undefined))

			expect(result.current.filteredExercises).toEqual([])
			expect(selectorsModule.selectFilteredExercises).not.toHaveBeenCalled()
		})

		it('recalculates when filters change', () => {
			const viewModel = createViewModel()
			const firstResult = [createExerciseSummary({id: 'first'})]
			const secondResult = [createExerciseSummary({id: 'second'})]

			selectorsModule.selectFilteredExercises
				.mockReturnValueOnce(firstResult)
				.mockReturnValueOnce(secondResult)

			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			expect(result.current.filteredExercises).toBe(firstResult)

			act(() => {
				result.current.setSelectedTags(['verbs'])
			})

			expect(result.current.filteredExercises).toBe(secondResult)
			expect(selectorsModule.selectFilteredExercises).toHaveBeenCalledTimes(2)
		})

		it('recalculates when viewModel changes', () => {
			const firstViewModel = createViewModel()
			const secondViewModel = createViewModel({
				exercises: [createExerciseSummary({id: 'different'})]
			})

			const firstResult = [createExerciseSummary({id: 'first'})]
			const secondResult = [createExerciseSummary({id: 'second'})]

			selectorsModule.selectFilteredExercises
				.mockReturnValueOnce(firstResult)
				.mockReturnValueOnce(secondResult)

			const {result, rerender} = renderHook(
				({viewModel}) => useExerciseFiltering(viewModel),
				{initialProps: {viewModel: firstViewModel}}
			)

			expect(result.current.filteredExercises).toBe(firstResult)

			rerender({viewModel: secondViewModel})

			expect(result.current.filteredExercises).toBe(secondResult)
			expect(selectorsModule.selectFilteredExercises).toHaveBeenCalledTimes(2)
		})
	})

	describe('filter options', () => {
		it('calls selectors and returns options from viewModel', () => {
			const viewModel = createViewModel()
			const expectedTags = ['verbs', 'nouns']
			const expectedDifficulties: Difficulty[] = ['a1', 'b1']
			const expectedLanguages: Language[] = ['el', 'en']

			selectorsModule.selectTagOptions.mockReturnValue(expectedTags)
			selectorsModule.selectDifficultyOptions.mockReturnValue(
				expectedDifficulties
			)
			selectorsModule.selectLanguageOptions.mockReturnValue(expectedLanguages)

			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			expect(selectorsModule.selectTagOptions).toHaveBeenCalledWith(viewModel)
			expect(selectorsModule.selectDifficultyOptions).toHaveBeenCalledWith(
				viewModel
			)
			expect(selectorsModule.selectLanguageOptions).toHaveBeenCalledWith(
				viewModel
			)

			expect(result.current.tagOptions).toBe(expectedTags)
			expect(result.current.difficultyOptions).toBe(expectedDifficulties)
			expect(result.current.languageOptions).toBe(expectedLanguages)
		})

		it('returns empty arrays when viewModel is undefined', () => {
			const {result} = renderHook(() => useExerciseFiltering(undefined))

			expect(result.current.tagOptions).toEqual([])
			expect(result.current.difficultyOptions).toEqual([])
			expect(result.current.languageOptions).toEqual([])

			expect(selectorsModule.selectTagOptions).not.toHaveBeenCalled()
			expect(selectorsModule.selectDifficultyOptions).not.toHaveBeenCalled()
			expect(selectorsModule.selectLanguageOptions).not.toHaveBeenCalled()
		})

		it('recalculates when viewModel changes', () => {
			const firstViewModel = createViewModel()
			const secondViewModel = createViewModel({
				filterOptions: {
					tags: ['different'],
					difficulties: ['c1'],
					languages: ['ru'],
					types: []
				}
			})

			const firstTags = ['first']
			const secondTags = ['second']

			selectorsModule.selectTagOptions
				.mockReturnValueOnce(firstTags)
				.mockReturnValueOnce(secondTags)
			selectorsModule.selectDifficultyOptions.mockReturnValue([
				'a1'
			] as Difficulty[])
			selectorsModule.selectLanguageOptions.mockReturnValue([
				'el'
			] as Language[])

			const {result, rerender} = renderHook(
				({viewModel}) => useExerciseFiltering(viewModel),
				{initialProps: {viewModel: firstViewModel}}
			)

			expect(result.current.tagOptions).toBe(firstTags)

			rerender({viewModel: secondViewModel})

			expect(result.current.tagOptions).toBe(secondTags)
		})
	})

	describe('clearFilters', () => {
		it('resets all filter selections to empty arrays', () => {
			const viewModel = createViewModel()
			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			// Set some filters first
			act(() => {
				result.current.setSelectedTags(['verbs'])
				result.current.setSelectedDifficulties(['a1'])
				result.current.setSelectedLanguages(['el'])
			})

			expect(result.current.selectedTags).toEqual(['verbs'])
			expect(result.current.selectedDifficulties).toEqual(['a1'])
			expect(result.current.selectedLanguages).toEqual(['el'])

			// Clear all filters
			act(() => {
				result.current.clearFilters()
			})

			expect(result.current.selectedTags).toEqual([])
			expect(result.current.selectedDifficulties).toEqual([])
			expect(result.current.selectedLanguages).toEqual([])
		})

		it('maintains stable function reference across renders', () => {
			const viewModel = createViewModel()
			const {result, rerender} = renderHook(() =>
				useExerciseFiltering(viewModel)
			)

			const firstClearFn = result.current.clearFilters

			rerender()

			const secondClearFn = result.current.clearFilters

			expect(firstClearFn).toBe(secondClearFn)
		})
	})

	describe('complex filter combinations', () => {
		it('handles multiple tag selections', () => {
			const viewModel = createViewModel()
			const expectedExercises = [createExerciseSummary()]
			selectorsModule.selectFilteredExercises.mockReturnValue(expectedExercises)

			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			act(() => {
				result.current.setSelectedTags(['verbs', 'present', 'nouns'])
			})

			expect(selectorsModule.selectFilteredExercises).toHaveBeenLastCalledWith(
				viewModel.exercises,
				{
					tags: ['verbs', 'present', 'nouns'],
					difficulties: [],
					languages: []
				}
			)
		})

		it('handles all filter types simultaneously', () => {
			const viewModel = createViewModel()
			const expectedExercises = [createExerciseSummary()]
			selectorsModule.selectFilteredExercises.mockReturnValue(expectedExercises)

			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			act(() => {
				result.current.setSelectedTags(['verbs'])
				result.current.setSelectedDifficulties(['a1', 'b1'])
				result.current.setSelectedLanguages(['el', 'en'])
			})

			expect(selectorsModule.selectFilteredExercises).toHaveBeenLastCalledWith(
				viewModel.exercises,
				{
					tags: ['verbs'],
					difficulties: ['a1', 'b1'],
					languages: ['el', 'en']
				}
			)
		})

		it('handles partial filter clearing by modifying individual filters', () => {
			const viewModel = createViewModel()
			selectorsModule.selectFilteredExercises.mockReturnValue([])

			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			// Set all filters
			act(() => {
				result.current.setSelectedTags(['verbs'])
				result.current.setSelectedDifficulties(['a1'])
				result.current.setSelectedLanguages(['el'])
			})

			// Clear only tags
			act(() => {
				result.current.setSelectedTags([])
			})

			expect(result.current.selectedTags).toEqual([])
			expect(result.current.selectedDifficulties).toEqual(['a1'])
			expect(result.current.selectedLanguages).toEqual(['el'])

			expect(selectorsModule.selectFilteredExercises).toHaveBeenLastCalledWith(
				viewModel.exercises,
				{
					tags: [],
					difficulties: ['a1'],
					languages: ['el']
				}
			)
		})
	})

	describe('edge cases', () => {
		it('handles empty exercise list', () => {
			const viewModel = createViewModel({exercises: []})
			selectorsModule.selectFilteredExercises.mockReturnValue([])

			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			expect(selectorsModule.selectFilteredExercises).toHaveBeenCalledWith([], {
				tags: [],
				difficulties: [],
				languages: []
			})
			expect(result.current.filteredExercises).toEqual([])
		})

		it('handles viewModel transitioning from undefined to defined', () => {
			const expectedExercises = [createExerciseSummary()]
			selectorsModule.selectFilteredExercises.mockReturnValue(expectedExercises)

			const {result, rerender} = renderHook(useExerciseFiltering, {
				initialProps: undefined
			})

			expect(result.current.filteredExercises).toEqual([])

			const viewModel = createViewModel()
			rerender(viewModel)

			expect(result.current.filteredExercises).toBe(expectedExercises)
		})

		it('handles viewModel transitioning from defined to undefined', () => {
			const viewModel = createViewModel()
			selectorsModule.selectFilteredExercises.mockReturnValue([
				createExerciseSummary()
			])

			const {result, rerender} = renderHook(useExerciseFiltering, {
				initialProps: viewModel
			})

			expect(result.current.filteredExercises).toHaveLength(1)

			rerender(undefined)

			expect(result.current.filteredExercises).toEqual([])
		})

		it('maintains filter state when viewModel becomes undefined', () => {
			const viewModel = createViewModel()
			const {result, rerender} = renderHook(useExerciseFiltering, {
				initialProps: viewModel
			})

			act(() => {
				result.current.setSelectedTags(['verbs'])
			})

			expect(result.current.selectedTags).toEqual(['verbs'])

			rerender(undefined)

			expect(result.current.selectedTags).toEqual(['verbs'])
		})

		it('handles duplicate values in filter arrays', () => {
			const viewModel = createViewModel()
			selectorsModule.selectFilteredExercises.mockReturnValue([])

			const {result} = renderHook(() => useExerciseFiltering(viewModel))

			act(() => {
				result.current.setSelectedTags(['verbs', 'verbs', 'present'])
				result.current.setSelectedDifficulties(['a1', 'a1'])
				result.current.setSelectedLanguages(['el', 'el', 'en'])
			})

			expect(selectorsModule.selectFilteredExercises).toHaveBeenLastCalledWith(
				viewModel.exercises,
				{
					tags: ['verbs', 'verbs', 'present'],
					difficulties: ['a1', 'a1'],
					languages: ['el', 'el', 'en']
				}
			)
		})
	})

	describe('memoization behavior', () => {
		it('does not recalculate filtered exercises when unrelated state changes', () => {
			const viewModel = createViewModel()
			selectorsModule.selectFilteredExercises.mockReturnValue([])

			const {rerender} = renderHook(() => useExerciseFiltering(viewModel))

			expect(selectorsModule.selectFilteredExercises).toHaveBeenCalledTimes(1)

			// Force a re-render without changing any dependencies
			rerender()

			// Should not call selector again due to memoization
			expect(selectorsModule.selectFilteredExercises).toHaveBeenCalledTimes(1)
		})

		it('does not recalculate filter options when unrelated state changes', () => {
			const viewModel = createViewModel()
			selectorsModule.selectTagOptions.mockReturnValue(['verbs'])
			selectorsModule.selectDifficultyOptions.mockReturnValue(['a1'])
			selectorsModule.selectLanguageOptions.mockReturnValue(['el'])

			const {rerender} = renderHook(() => useExerciseFiltering(viewModel))

			expect(selectorsModule.selectTagOptions).toHaveBeenCalledTimes(1)
			expect(selectorsModule.selectDifficultyOptions).toHaveBeenCalledTimes(1)
			expect(selectorsModule.selectLanguageOptions).toHaveBeenCalledTimes(1)

			// Force a re-render without changing viewModel
			rerender()

			// Should not call selectors again due to memoization
			expect(selectorsModule.selectTagOptions).toHaveBeenCalledTimes(1)
			expect(selectorsModule.selectDifficultyOptions).toHaveBeenCalledTimes(1)
			expect(selectorsModule.selectLanguageOptions).toHaveBeenCalledTimes(1)
		})
	})
})
