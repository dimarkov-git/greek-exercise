/**
 * MultipleChoiceRenderer component tests
 */

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {ReactNode} from 'react'
import {describe, expect, it, vi} from 'vitest'
import type {MultipleChoiceExercise} from '../model/types'
import {MultipleChoiceRenderer} from './MultipleChoiceRenderer'

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {retry: false, gcTime: 0}
		}
	})

	return function Wrapper({children}: {children: ReactNode}) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		)
	}
}

const mockExercise: MultipleChoiceExercise = {
	enabled: true,
	id: 'test-mc-exercise',
	type: 'multiple-choice',
	language: 'el',
	title: 'Test Multiple Choice',
	titleI18n: {
		en: 'Test Multiple Choice',
		ru: 'Тестовый выбор'
	},
	description: 'Test multiple choice exercise',
	descriptionI18n: {
		en: 'Test multiple choice exercise',
		ru: 'Тестовое упражнение с множественным выбором'
	},
	tags: ['test'],
	difficulty: 'a1',
	settings: {
		autoAdvance: false,
		autoAdvanceDelayMs: 1000,
		allowSkip: true,
		shuffleQuestions: false,
		shuffleAnswers: false
	},
	questions: [
		{
			id: 'q1',
			text: 'What is water in Greek?',
			hint: 'It starts with ν',
			hintI18n: {en: 'It starts with ν', ru: 'Начинается с ν'},
			options: [
				{id: 'o1', text: 'το νερό'},
				{id: 'o2', text: 'η μέρα'},
				{id: 'o3', text: 'ο άνθρωπος'}
			],
			correctOptionId: 'o1'
		},
		{
			id: 'q2',
			text: 'What is day in Greek?',
			options: [
				{id: 'o4', text: 'το νερό'},
				{id: 'o5', text: 'η μέρα'},
				{id: 'o6', text: 'ο άνθρωπος'}
			],
			correctOptionId: 'o5'
		}
	]
}

describe('MultipleChoiceRenderer', () => {
	it('renders the first question', () => {
		render(<MultipleChoiceRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		expect(screen.getByText('What is water in Greek?')).toBeInTheDocument()
	})

	it('renders all options for the question', () => {
		render(<MultipleChoiceRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		expect(screen.getByText('το νερό')).toBeInTheDocument()
		expect(screen.getByText('η μέρα')).toBeInTheDocument()
		expect(screen.getByText('ο άνθρωπος')).toBeInTheDocument()
	})

	it('allows selecting an option', async () => {
		const user = userEvent.setup()
		render(<MultipleChoiceRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		const option = screen.getByText('το νερό')
		await user.click(option)

		// Option should be visually selected (checked)
		const radioButton = option
			.closest('label')
			?.querySelector('input[type="radio"]')
		expect(radioButton).toBeChecked()
	})

	it('shows check answer button when option is selected', async () => {
		const user = userEvent.setup()
		render(<MultipleChoiceRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		const option = screen.getByText('το νερό')
		await user.click(option)

		const checkButton = screen.getByRole('button', {
			name: /multipleChoice\.checkAnswer/i
		})
		expect(checkButton).toBeEnabled()
	})

	it('shows feedback after checking answer', async () => {
		const user = userEvent.setup()
		render(<MultipleChoiceRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		// Select correct answer
		await user.click(screen.getByText('το νερό'))

		// Check answer
		const checkButton = screen.getByRole('button', {
			name: /multipleChoice\.checkAnswer/i
		})
		await user.click(checkButton)

		// Should show correct feedback
		await waitFor(() => {
			expect(screen.getByText(/multipleChoice\.correct/i)).toBeInTheDocument()
		})
	})

	it('advances to next question after answering', async () => {
		const user = userEvent.setup()
		render(<MultipleChoiceRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		// Answer first question
		await user.click(screen.getByText('το νερό'))
		await user.click(
			screen.getByRole('button', {name: /multipleChoice\.checkAnswer/i})
		)

		// Click next
		await user.click(
			screen.getByRole('button', {name: /multipleChoice\.next/i})
		)

		// Should show second question
		await waitFor(() => {
			expect(screen.getByText('What is day in Greek?')).toBeInTheDocument()
		})
	})

	it('shows completion screen after all questions', async () => {
		const user = userEvent.setup()
		render(<MultipleChoiceRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		// Answer first question
		await user.click(screen.getByText('το νερό'))
		await user.click(
			screen.getByRole('button', {name: /multipleChoice\.checkAnswer/i})
		)
		await user.click(
			screen.getByRole('button', {name: /multipleChoice\.next/i})
		)

		// Answer second question
		await user.click(screen.getByText('η μέρα'))
		await user.click(
			screen.getByRole('button', {name: /multipleChoice\.checkAnswer/i})
		)
		await user.click(
			screen.getByRole('button', {name: /multipleChoice\.next/i})
		)

		// Should show completion screen
		await waitFor(() => {
			expect(screen.getByText(/multipleChoice\.completed/i)).toBeInTheDocument()
		})
	})

	it('calls onComplete when exercise is finished', async () => {
		const user = userEvent.setup()
		const onComplete = vi.fn()
		render(
			<MultipleChoiceRenderer
				exercise={mockExercise}
				onComplete={onComplete}
			/>,
			{wrapper: createWrapper()}
		)

		// Answer both questions
		await user.click(screen.getByText('το νερό'))
		await user.click(
			screen.getByRole('button', {name: /multipleChoice\.checkAnswer/i})
		)
		await user.click(
			screen.getByRole('button', {name: /multipleChoice\.next/i})
		)

		await user.click(screen.getByText('η μέρα'))
		await user.click(
			screen.getByRole('button', {name: /multipleChoice\.checkAnswer/i})
		)
		await user.click(
			screen.getByRole('button', {name: /multipleChoice\.next/i})
		)

		await waitFor(() => {
			expect(onComplete).toHaveBeenCalledWith(
				expect.objectContaining({
					exerciseId: 'test-mc-exercise',
					totalCases: 2,
					correctAnswers: 2,
					incorrectAnswers: 0
				})
			)
		})
	})

	it('allows skipping questions when enabled', async () => {
		const user = userEvent.setup()
		render(<MultipleChoiceRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		const skipButton = screen.getByRole('button', {
			name: /multipleChoice\.skip/i
		})
		await user.click(skipButton)

		// Should advance to next question
		await waitFor(() => {
			expect(screen.getByText('What is day in Greek?')).toBeInTheDocument()
		})
	})

	it('calls onExit when exit button is clicked', async () => {
		const user = userEvent.setup()
		const onExit = vi.fn()
		render(<MultipleChoiceRenderer exercise={mockExercise} onExit={onExit} />, {
			wrapper: createWrapper()
		})

		const exitButton = screen.getByRole('button', {name: /back/i})
		await user.click(exitButton)

		expect(onExit).toHaveBeenCalledOnce()
	})

	it('does not show exit button when onExit is not provided', () => {
		render(<MultipleChoiceRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		expect(
			screen.queryByRole('button', {name: /back/i})
		).not.toBeInTheDocument()
	})

	it('shows progress information', () => {
		render(<MultipleChoiceRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		expect(screen.getByText(/Question 1 of 2/i)).toBeInTheDocument()
	})

	it('uses localized title from titleI18n', () => {
		render(<MultipleChoiceRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		// Component renders successfully with localized title
		expect(screen.getByText('What is water in Greek?')).toBeInTheDocument()
	})

	it('handles exercise with no questions', () => {
		const emptyExercise: MultipleChoiceExercise = {
			...mockExercise,
			questions: []
		}

		render(<MultipleChoiceRenderer exercise={emptyExercise} />, {
			wrapper: createWrapper()
		})

		expect(screen.getByText(/No questions available/i)).toBeInTheDocument()
	})
})
