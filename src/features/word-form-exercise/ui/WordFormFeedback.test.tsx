import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import type {ExerciseStatus} from '@/entities/exercise'
import {WordFormFeedback} from '@/features/word-form-exercise'

vi.mock('@/shared/lib/i18n', () => ({
	useTranslations: () => ({
		t: (key: string) => key,
		status: 'complete' as const,
		missingKeys: [] as string[]
	}),
	exerciseUiTranslations: {
		keys: [
			'exercise.accuracy',
			'exercise.autoAdvance',
			'exercise.autoAdvanceDisabled',
			'exercise.autoAdvanceDisabledIcon',
			'exercise.autoAdvanceEnabled',
			'exercise.autoAdvanceEnabledIcon',
			'exercise.backArrow',
			'exercise.backToLibrary',
			'exercise.blocks',
			'exercise.cases',
			'exercise.celebrationEmoji',
			'exercise.checking',
			'exercise.congratulations',
			'exercise.continue',
			'exercise.correct',
			'exercise.correctAnswerIs',
			'exercise.correctAnswers',
			'exercise.correctIcon',
			'exercise.difficulty',
			'exercise.enterCorrectAnswer',
			'exercise.enterCorrectAnswerToContinue',
			'exercise.enterCorrectToContinue',
			'exercise.enterKey',
			'exercise.enterKeyName',
			'exercise.exclamationMark',
			'exercise.hintIcon',
			'exercise.incorrect',
			'exercise.incorrectAnswers',
			'exercise.incorrectIcon',
			'exercise.minutes',
			'exercise.notImplemented',
			'exercise.percentSymbol',
			'exercise.pressEnterToContinue',
			'exercise.progress',
			'exercise.progressOf',
			'exercise.restartExercise',
			'exercise.returnToLibrary',
			'exercise.secondsSymbol',
			'exercise.skip',
			'exercise.submit',
			'exercise.time',
			'exercise.unsupportedType',
			'exercise.yourAnswerIs',
			'error.couldNotLoadExercise',
			'error.title'
		],
		lookupKeys: [],
		requests: [],
		cacheKey: 'mock-cache-key',
		fixedLanguageKeys: {},
		getRequest: vi.fn(),
		getFixedLanguage: vi.fn()
	}
}))

const baseProps = {
	correctAnswers: ['είμαι'],
	userAnswer: 'είμαι'
}

describe('WordFormFeedback', () => {
	it('does not render when feedback is not required', () => {
		const {container} = render(
			<WordFormFeedback
				{...baseProps}
				isCorrect={null}
				status='WAITING_INPUT'
			/>
		)

		expect(container.firstChild).toBeNull()
	})

	describe('success feedback', () => {
		it('renders success feedback with progress indicator', () => {
			render(
				<WordFormFeedback
					{...baseProps}
					isCorrect={true}
					status='CORRECT_ANSWER'
				/>
			)

			const heading = screen.getByText('exercise.correct', {
				exact: false,
				selector: 'span'
			})
			expect(heading).toHaveTextContent('exercise.correct')
			expect(heading).toHaveTextContent('exercise.exclamationMark')
			expect(screen.getByTitle('exercise.correctIcon')).toBeInTheDocument()
			expect(
				screen.getByText('exercise.correctAnswerIs', {
					exact: false,
					selector: 'p'
				})
			).toHaveTextContent('είμαι')
			const indicator = document.querySelector('.bg-green-400')
			expect(indicator).toBeTruthy()
		})
	})

	describe('error feedback', () => {
		it('renders error feedback with correct answers list and instructions', () => {
			render(
				<WordFormFeedback
					correctAnswers={['είμαι', 'είμαστε']}
					isCorrect={false}
					status='WRONG_ANSWER'
					userAnswer='λάθος'
				/>
			)

			expect(screen.getByText('exercise.incorrect')).toBeInTheDocument()
			expect(screen.getByTitle('exercise.incorrectIcon')).toBeInTheDocument()
			expect(
				screen.getByText('exercise.yourAnswerIs λάθος')
			).toBeInTheDocument()
			expect(screen.getByText('Σωστές απαντήσεις:')).toBeInTheDocument()
			expect(screen.getByText('είμαι')).toBeInTheDocument()
			expect(screen.getByText('είμαστε')).toBeInTheDocument()
			expect(
				screen.getByText('exercise.enterCorrectToContinue')
			).toBeInTheDocument()
		})

		it('omits user answer text when value is empty', () => {
			render(
				<WordFormFeedback
					correctAnswers={['είμαι']}
					isCorrect={false}
					status={'REQUIRE_CORRECTION' satisfies ExerciseStatus}
					userAnswer=''
				/>
			)

			expect(
				screen.queryByText('exercise.yourAnswerIs')
			).not.toBeInTheDocument()
		})
	})
})
