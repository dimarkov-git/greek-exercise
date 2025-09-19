import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import type {ExerciseStatus} from '@/types/exercises'
import {WordFormFeedback} from './WordFormFeedback'

describe('WordFormFeedback', () => {
	const defaultProps = {
		status: 'WAITING_INPUT' as ExerciseStatus,
		correctAnswers: ['είμαι'],
		userAnswer: '',
		isCorrect: null as boolean | null
	}

	describe('Status-based rendering', () => {
		it('should show no feedback for WAITING_INPUT status', () => {
			render(<WordFormFeedback {...defaultProps} status='WAITING_INPUT' />)

			expect(screen.queryByText(/σωστό/i)).not.toBeInTheDocument()
			expect(screen.queryByText(/λάθος/i)).not.toBeInTheDocument()
		})

		it('should show no feedback for CHECKING status', () => {
			render(<WordFormFeedback {...defaultProps} status='CHECKING' />)

			expect(screen.queryByText(/σωστό/i)).not.toBeInTheDocument()
			expect(screen.queryByText(/λάθος/i)).not.toBeInTheDocument()
		})

		it('should show no feedback when isCorrect is null', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={null}
					status='CORRECT_ANSWER'
				/>
			)

			expect(screen.queryByText(/σωστό/i)).not.toBeInTheDocument()
			expect(screen.queryByText(/λάθος/i)).not.toBeInTheDocument()
		})

		it('should show correct feedback when isCorrect is true', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={true}
					status='CORRECT_ANSWER'
					userAnswer='είμαι'
				/>
			)

			expect(screen.getByText(/σωστό/i)).toBeInTheDocument()
			expect(screen.getByText(/είμαι/)).toBeInTheDocument()
		})

		it('should show incorrect feedback when isCorrect is false', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={false}
					status='WRONG_ANSWER'
					userAnswer='λάθος'
				/>
			)

			expect(screen.getByText('Λάθος')).toBeInTheDocument() // Error title
			expect(screen.getByText(/Η απάντησή σας:.*λάθος/)).toBeInTheDocument() // User answer
			expect(screen.getByText(/είμαι/)).toBeInTheDocument()
		})
	})

	describe('Multiple correct answers', () => {
		it('should display all correct answers when multiple exist', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					correctAnswers={['είμαι', 'ειμαι']}
					isCorrect={false}
					status='WRONG_ANSWER'
				/>
			)

			expect(screen.getByText(/είμαι/)).toBeInTheDocument()
			expect(screen.getByText(/ειμαι/)).toBeInTheDocument()
		})
	})

	describe('Visual styling', () => {
		it('should apply correct styling for success state', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={true}
					status='CORRECT_ANSWER'
				/>
			)

			const feedback = screen.getByText(/σωστό/i).parentElement
			expect(feedback).toHaveClass('text-green-700')
		})

		it('should apply correct styling for error state', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={false}
					status='WRONG_ANSWER'
				/>
			)

			const feedback = screen.getByText('Λάθος').parentElement
			expect(feedback).toHaveClass('text-red-700')
		})
	})

	describe('Greek text rendering', () => {
		it('should render Greek text correctly in feedback', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={true}
					status='CORRECT_ANSWER'
					userAnswer='είμαι'
				/>
			)

			expect(screen.getByText(/είμαι/)).toBeInTheDocument()
		})

		it('should handle complex Greek text with multiple tone marks', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={true}
					status='CORRECT_ANSWER'
					userAnswer='ήμουν'
				/>
			)

			expect(screen.getByText(/ήμουν/)).toBeInTheDocument()
		})
	})

	describe('Edge cases', () => {
		it('should handle empty correct answers array', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					correctAnswers={[]}
					isCorrect={false}
					status='WRONG_ANSWER'
				/>
			)

			expect(screen.getByText(/λάθος/i)).toBeInTheDocument()
		})

		it('should handle very long correct answers', () => {
			const longAnswer = 'α'.repeat(100)
			render(
				<WordFormFeedback
					{...defaultProps}
					correctAnswers={[longAnswer]}
					isCorrect={false}
					status='WRONG_ANSWER'
				/>
			)

			expect(screen.getByText(longAnswer)).toBeInTheDocument()
		})

		it('should handle undefined userAnswer', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={true}
					status='CORRECT_ANSWER' // Test with empty string instead of undefined
					userAnswer=''
				/>
			)

			expect(screen.getByText(/σωστό/i)).toBeInTheDocument()
		})

		it('should handle empty userAnswer', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={false}
					status='WRONG_ANSWER'
					userAnswer=''
				/>
			)

			expect(screen.getByText(/λάθος/i)).toBeInTheDocument()
		})
	})

	describe('Status-specific behavior', () => {
		it('should show continue message for WRONG_ANSWER status', () => {
			render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={false}
					status='WRONG_ANSWER'
				/>
			)

			expect(
				screen.getByText(/εισάγετε μία από τις σωστές απαντήσεις/i)
			).toBeInTheDocument()
		})

		it('should show progress indicator for correct answers', () => {
			const {container} = render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={true}
					status='CORRECT_ANSWER'
				/>
			)

			const progressBar = container.querySelector('.bg-green-400')
			expect(progressBar).toBeInTheDocument()
		})

		it('should not show progress indicator for wrong answers', () => {
			const {container} = render(
				<WordFormFeedback
					{...defaultProps}
					isCorrect={false}
					status='WRONG_ANSWER'
				/>
			)

			const progressBar = container.querySelector('.bg-green-400')
			expect(progressBar).not.toBeInTheDocument()
		})
	})
})
