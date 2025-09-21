import {screen} from '@testing-library/react'
import {render} from '@tests/utils'
import {describe, expect, it, vi} from 'vitest'
import {CompletionScreen} from './CompletionScreen'

describe('CompletionScreen', () => {
	const baseProps = {
		correctCount: 8,
		incorrectCount: 2,
		totalCases: 10,
		timeSpentMs: 3200,
		exerciseTitle: 'Verb practice',
		onRestart: vi.fn(),
		onExit: vi.fn()
	}

	it('summarises the exercise outcome', async () => {
		render(<CompletionScreen {...baseProps} />)

		expect(
			await screen.findByRole('heading', {
				name: /congratulations! you completed the exercise/i
			})
		).toBeInTheDocument()
		expect(screen.getByText('8')).toBeInTheDocument()
		expect(screen.getByText('2')).toBeInTheDocument()
		expect(screen.getByText('80%')).toBeInTheDocument()
		expect(screen.getByText('3s')).toBeInTheDocument()
	})

	it('allows the learner to restart or exit', async () => {
		const props = {...baseProps, onRestart: vi.fn(), onExit: vi.fn()}
		const {user} = render(<CompletionScreen {...props} />)

		await user.click(await screen.findByRole('button', {name: /start again/i}))
		await user.click(screen.getByRole('button', {name: /return to library/i}))

		expect(props.onRestart).toHaveBeenCalledTimes(1)
		expect(props.onExit).toHaveBeenCalledTimes(1)
	})
})
