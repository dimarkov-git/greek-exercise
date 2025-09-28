import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import type {WordFormExerciseWithDefaults} from '@/domain/exercises/types'
import {
	DEFAULT_EXERCISE_SETTINGS,
	type ExerciseResult
} from '@/entities/exercise'
import {render, screen, waitFor} from '@/test-utils'
import {ExercisePage} from './ExercisePage'

// Mock dependencies
const mockNavigate = vi.fn()
const mockSetHeaderEnabled = vi.fn()
const mockT = vi.fn((key: string) => {
	const translations: Record<string, string> = {
		'exercise.unsupportedType': 'Unsupported Exercise Type',
		'exercise.notImplemented': 'Exercise type "{type}" is not implemented yet.',
		'exercise.backToLibrary': 'Back to Library'
	}
	return translations[key] || key
})

// Mock react-router
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router')
	return {
		...actual,
		useParams: vi.fn(),
		useNavigate: vi.fn()
	}
})

// Mock hooks
vi.mock('@/hooks/useExercises', () => ({
	useExercise: vi.fn()
}))

vi.mock('@/hooks/useLayout', () => ({
	useLayout: vi.fn()
}))

vi.mock('@/hooks/useTranslations', () => ({
	useTranslations: vi.fn()
}))

// Mock components
vi.mock('@/components/LoadingOrError', () => ({
	LoadingOrError: ({error}: {error?: Error}) => (
		<div data-testid='loading-or-error'>
			{error ? `Error: ${error.message}` : 'Loading...'}
		</div>
	)
}))

vi.mock('@/components/exercises/word-form/WordFormExercise', () => ({
	WordFormExercise: ({
		exercise,
		onComplete,
		onExit
	}: {
		exercise: WordFormExerciseWithDefaults
		onComplete: (result: Omit<ExerciseResult, 'completedAt'>) => void
		onExit: () => void
	}) => (
		<div data-testid='word-form-exercise'>
			<h1>{exercise.title}</h1>
			<button
				data-testid='complete-button'
				onClick={() =>
					onComplete({
						exerciseId: exercise.id,
						totalCases: 0,
						correctAnswers: 0,
						incorrectAnswers: 0
					})
				}
			>
				Complete
			</button>
			<button data-testid='exit-button' onClick={onExit}>
				Exit
			</button>
		</div>
	)
}))

// Import mocked modules to set up implementations
import {useNavigate, useParams} from 'react-router'
import {useExercise} from '@/hooks/useExercises'
import {useLayout} from '@/hooks/useLayout'
import {useTranslations} from '@/hooks/useTranslations'

// Test data
const mockWordFormExercise: WordFormExerciseWithDefaults = {
	enabled: true,
	id: 'exercise-1',
	type: 'word-form',
	language: 'el',
	title: 'Test Word Form Exercise',
	description: 'A test exercise',
	difficulty: 'a0',
	estimatedTimeMinutes: 10,
	blocks: [
		{
			id: 'block-1',
			name: 'Block 1',
			cases: [
				{
					id: 'case-1',
					prompt: 'Test prompt',
					correct: ['test answer']
				}
			]
		}
	],
	tags: ['test'],
	settings: DEFAULT_EXERCISE_SETTINGS
}

type UseExerciseReturn = ReturnType<typeof useExercise>

function mockUseExerciseResult(
	overrides: Record<string, unknown>
): UseExerciseReturn {
	return overrides as unknown as UseExerciseReturn
}

const mockUnsupportedExercise = {
	id: 'exercise-2',
	type: 'unsupported-type',
	title: 'Unsupported Exercise',
	description: 'This type is not supported'
} as unknown as WordFormExerciseWithDefaults

describe('ExercisePage', () => {
	beforeEach(() => {
		// Clear all mocks first
		vi.clearAllMocks()

		// Reset mocks using direct imports
		vi.mocked(useNavigate).mockReturnValue(mockNavigate)
		vi.mocked(useLayout).mockReturnValue({
			headerEnabled: true,
			setHeaderEnabled: mockSetHeaderEnabled
		})
		vi.mocked(useTranslations).mockReturnValue({
			t: mockT,
			translations: {},
			currentLanguage: 'en',
			isLoading: false,
			error: null,
			missingKeys: [],
			status: 'complete'
		} as unknown as ReturnType<typeof useTranslations>)
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.clearAllMocks()
		vi.useRealTimers()
	})

	describe('Header management', () => {
		it('disables header on mount and enables on unmount', () => {
			vi.mocked(useParams).mockReturnValue({
				exerciseId: 'exercise-1'
			})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockWordFormExercise,
					isLoading: false,
					error: null
				})
			)

			const {unmount} = render(<ExercisePage />)

			expect(mockSetHeaderEnabled).toHaveBeenCalledWith(false)

			unmount()

			expect(mockSetHeaderEnabled).toHaveBeenCalledWith(true)
		})
	})

	describe('Loading state', () => {
		it('shows LoadingOrError component when loading', () => {
			vi.mocked(useParams).mockReturnValue({
				exerciseId: 'exercise-1'
			})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: undefined,
					isLoading: true,
					error: null
				})
			)

			render(<ExercisePage />)

			expect(screen.getByTestId('loading-or-error')).toBeInTheDocument()
			expect(screen.getByText('Loading...')).toBeInTheDocument()
		})
	})

	describe('Error states', () => {
		it('shows LoadingOrError with error when fetch fails', () => {
			const testError = new Error('Failed to fetch exercise')

			vi.mocked(useParams).mockReturnValue({
				exerciseId: 'exercise-1'
			})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: undefined,
					isLoading: false,
					error: testError
				})
			)

			render(<ExercisePage />)

			expect(screen.getByTestId('loading-or-error')).toBeInTheDocument()
			expect(
				screen.getByText('Error: Failed to fetch exercise')
			).toBeInTheDocument()
		})

		it('shows LoadingOrError when no exercise is found', () => {
			vi.mocked(useParams).mockReturnValue({
				exerciseId: 'non-existent'
			})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: undefined,
					isLoading: false,
					error: null
				})
			)

			render(<ExercisePage />)

			expect(screen.getByTestId('loading-or-error')).toBeInTheDocument()
		})
	})

	describe('Word-form exercise rendering', () => {
		it('renders WordFormExercise component for word-form type', () => {
			vi.mocked(useParams).mockReturnValue({
				exerciseId: 'exercise-1'
			})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockWordFormExercise,
					isLoading: false,
					error: null
				})
			)

			render(<ExercisePage />)

			expect(screen.getByTestId('word-form-exercise')).toBeInTheDocument()
			expect(screen.getByText('Test Word Form Exercise')).toBeInTheDocument()
		})

		it('passes correct props to WordFormExercise', () => {
			vi.mocked(useParams).mockReturnValue({
				exerciseId: 'exercise-1'
			})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockWordFormExercise,
					isLoading: false,
					error: null
				})
			)

			render(<ExercisePage />)

			expect(screen.getByTestId('complete-button')).toBeInTheDocument()
			expect(screen.getByTestId('exit-button')).toBeInTheDocument()
		})
	})

	describe('Unsupported exercise types', () => {
		it('shows unsupported type message for non-word-form exercises', () => {
			vi.mocked(useParams).mockReturnValue({
				exerciseId: 'exercise-2'
			})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockUnsupportedExercise,
					isLoading: false,
					error: null
				})
			)

			render(<ExercisePage />)

			expect(screen.getByText('Unsupported Exercise Type')).toBeInTheDocument()
			expect(
				screen.getByText(
					'Exercise type "unsupported-type" is not implemented yet.'
				)
			).toBeInTheDocument()
			expect(
				screen.getByRole('button', {name: 'Back to Library'})
			).toBeInTheDocument()
		})

		it('handles exit navigation for unsupported types', async () => {
			vi.useRealTimers()
			vi.mocked(useParams).mockReturnValue({
				exerciseId: 'exercise-2'
			})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockUnsupportedExercise,
					isLoading: false,
					error: null
				})
			)

			const {user} = render(<ExercisePage />)

			const backButton = screen.getByRole('button', {name: 'Back to Library'})
			await user.click(backButton)

			expect(mockNavigate).toHaveBeenCalledWith('/exercises', {replace: true})
			vi.useFakeTimers()
		})
	})

	describe('Exercise completion', () => {
		it('navigates to exercises after completion with delay', async () => {
			vi.useRealTimers()
			vi.mocked(useParams).mockReturnValue({
				exerciseId: 'exercise-1'
			})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockWordFormExercise,
					isLoading: false,
					error: null
				})
			)

			const {user} = render(<ExercisePage />)

			const completeButton = screen.getByTestId('complete-button')
			await user.click(completeButton)

			// Should not navigate immediately
			expect(mockNavigate).not.toHaveBeenCalled()

			// Wait for the actual timeout to complete
			await waitFor(
				() => {
					expect(mockNavigate).toHaveBeenCalledWith('/exercises', {
						replace: true
					})
				},
				{timeout: 4000}
			)
			vi.useFakeTimers()
		})

		it('handles immediate exit', async () => {
			vi.useRealTimers()
			vi.mocked(useParams).mockReturnValue({
				exerciseId: 'exercise-1'
			})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockWordFormExercise,
					isLoading: false,
					error: null
				})
			)

			const {user} = render(<ExercisePage />)

			const exitButton = screen.getByTestId('exit-button')
			await user.click(exitButton)

			expect(mockNavigate).toHaveBeenCalledWith('/exercises', {replace: true})
			vi.useFakeTimers()
		})
	})

	describe('Missing exerciseId', () => {
		it('handles undefined exerciseId gracefully', () => {
			vi.mocked(useParams).mockReturnValue({
				exerciseId: undefined
			})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: undefined,
					isLoading: false,
					error: null
				})
			)

			render(<ExercisePage />)

			expect(screen.getByTestId('loading-or-error')).toBeInTheDocument()
		})
	})
})
