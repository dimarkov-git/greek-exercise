import {screen, within} from '@testing-library/react'
import {render} from '@tests/utils'
import {describe, expect, it} from 'vitest'
import {WordFormFeedback} from './WordFormFeedback'

const correctAnswers = ['είμαι', 'είσαι']

describe('WordFormFeedback', () => {
	it('renders nothing while waiting for input', () => {
		const {container} = render(
			<WordFormFeedback
				correctAnswers={correctAnswers}
				isCorrect={null}
				status='WAITING_INPUT'
				userAnswer=''
			/>
		)

		expect(container).toBeEmptyDOMElement()
	})

	it('shows celebratory feedback for correct answers', async () => {
		render(
			<WordFormFeedback
				correctAnswers={correctAnswers}
				isCorrect={true}
				status='CORRECT_ANSWER'
				userAnswer='είμαι'
			/>
		)

		expect(await screen.findByText(/correct!/i)).toBeInTheDocument()
		expect(screen.getByText(/είμαι is correct/i)).toBeInTheDocument()
	})

	it('lists expected answers when the response is wrong', async () => {
		render(
			<WordFormFeedback
				correctAnswers={correctAnswers}
				isCorrect={false}
				status='WRONG_ANSWER'
				userAnswer='είμε'
			/>
		)

		const feedbackCard = await screen.findByRole('status')

		expect(within(feedbackCard).getByText(/^incorrect$/i)).toBeInTheDocument()
		expect(screen.getByText(/your answer/i)).toBeInTheDocument()
		expect(screen.getByText('είμαι')).toBeInTheDocument()
		expect(screen.getByText('είσαι')).toBeInTheDocument()
		expect(
			screen.getByText(/enter one of the correct answers to continue/i)
		).toBeInTheDocument()
	})
})
