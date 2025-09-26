import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@/test-utils'
import type {WordFormExercise as WordFormExerciseType} from '@/types/exercises'
import {WordFormExercise} from './WordFormExercise'

// Mock the WordFormExerciseWrapper
vi.mock('./WordFormExerciseWrapper', () => ({
	WordFormExerciseWrapper: (props: any) => (
		<div data-testid="word-form-exercise-wrapper">
			<div data-testid="exercise-title">{props.exercise.title}</div>
			<div data-testid="exercise-id">{props.exercise.id}</div>
			{props.onComplete && (
				<button
					data-testid="complete-button"
					onClick={() =>
						props.onComplete({
							exerciseId: props.exercise.id,
							totalCases: 5,
							correctAnswers: 4,
							incorrectAnswers: 1,
							timeSpentMs: 60000,
							accuracy: 80
						})
					}
				>
					Complete
				</button>
			)}
			{props.onExit && (
				<button data-testid="exit-button" onClick={props.onExit}>
					Exit
				</button>
			)}
		</div>
	)
}))

// Test data
const mockExercise: WordFormExerciseType = {
	id: 'test-exercise-1',
	type: 'word-form',
	title: 'Test Exercise',
	description: 'A test word form exercise',
	difficulty: 'beginner',
	estimatedTimeMinutes: 10,
	blocks: [
		{
			id: 'block-1',
			title: 'Block 1',
			cases: [
				{
					id: 'case-1',
					prompt: 'Test prompt',
					expectedAnswer: 'test answer',
					hints: []
				}
			]
		}
	],
	tags: ['test']
}

describe('WordFormExercise', () => {
	it('renders WordFormExerciseWrapper with exercise prop', () => {
		render(<WordFormExercise exercise={mockExercise} />)

		expect(screen.getByTestId('word-form-exercise-wrapper')).toBeInTheDocument()
		expect(screen.getByTestId('exercise-title')).toHaveTextContent('Test Exercise')
		expect(screen.getByTestId('exercise-id')).toHaveTextContent('test-exercise-1')
	})

	it('passes onComplete callback to wrapper', async () => {
		const mockOnComplete = vi.fn()

		const {user} = render(
			<WordFormExercise exercise={mockExercise} onComplete={mockOnComplete} />
		)

		expect(screen.getByTestId('complete-button')).toBeInTheDocument()

		await user.click(screen.getByTestId('complete-button'))

		expect(mockOnComplete).toHaveBeenCalledWith({
			exerciseId: 'test-exercise-1',
			totalCases: 5,
			correctAnswers: 4,
			incorrectAnswers: 1,
			timeSpentMs: 60000,
			accuracy: 80
		})
	})

	it('passes onExit callback to wrapper', async () => {
		const mockOnExit = vi.fn()

		const {user} = render(
			<WordFormExercise exercise={mockExercise} onExit={mockOnExit} />
		)

		expect(screen.getByTestId('exit-button')).toBeInTheDocument()

		await user.click(screen.getByTestId('exit-button'))

		expect(mockOnExit).toHaveBeenCalled()
	})

	it('works without optional callbacks', () => {
		render(<WordFormExercise exercise={mockExercise} />)

		expect(screen.getByTestId('word-form-exercise-wrapper')).toBeInTheDocument()
		expect(screen.queryByTestId('complete-button')).not.toBeInTheDocument()
		expect(screen.queryByTestId('exit-button')).not.toBeInTheDocument()
	})

	it('passes all props to WordFormExerciseWrapper', () => {
		const mockOnComplete = vi.fn()
		const mockOnExit = vi.fn()

		render(
			<WordFormExercise
				exercise={mockExercise}
				onComplete={mockOnComplete}
				onExit={mockOnExit}
			/>
		)

		expect(screen.getByTestId('word-form-exercise-wrapper')).toBeInTheDocument()
		expect(screen.getByTestId('complete-button')).toBeInTheDocument()
		expect(screen.getByTestId('exit-button')).toBeInTheDocument()
	})

	it('handles different exercise data correctly', () => {
		const differentExercise: WordFormExerciseType = {
			id: 'different-exercise',
			type: 'word-form',
			title: 'Different Exercise',
			description: 'Another test exercise',
			difficulty: 'intermediate',
			estimatedTimeMinutes: 15,
			blocks: [
				{
					id: 'block-2',
					title: 'Block 2',
					cases: [
						{
							id: 'case-2',
							prompt: 'Different prompt',
							expectedAnswer: 'different answer',
							hints: []
						}
					]
				}
			],
			tags: ['different']
		}

		render(<WordFormExercise exercise={differentExercise} />)

		expect(screen.getByTestId('exercise-title')).toHaveTextContent('Different Exercise')
		expect(screen.getByTestId('exercise-id')).toHaveTextContent('different-exercise')
	})
})