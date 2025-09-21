import {screen} from '@testing-library/react'
import {render} from '@tests/utils'
import {useState} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {WordFormInput} from './WordFormInput'

// biome-ignore lint/style/useComponentExportOnlyModules: helper for test harness
function ControlledInput({
	status = 'WAITING_INPUT',
	disabled = false,
	initialValue = '',
	onSubmit = vi.fn()
}: {
	status?: Parameters<typeof WordFormInput>[0]['status']
	disabled?: boolean
	initialValue?: string
	onSubmit?: (value: string) => void
}) {
	const [value, setValue] = useState(initialValue)

	return (
		<WordFormInput
			autoFocus={true}
			disabled={disabled}
			onChange={setValue}
			onSubmit={submittedValue => {
				onSubmit(submittedValue)
				setValue('')
			}}
			placeholder='Type your answer'
			status={status}
			value={value}
		/>
	)
}

describe('WordFormInput', () => {
	it('allows the learner to type and submit an answer', async () => {
		const handleSubmit = vi.fn()
		const {user} = render(
			<ControlledInput onSubmit={handleSubmit} status='WAITING_INPUT' />
		)

		const input = await screen.findByRole('textbox')
		expect(input).toHaveFocus()

		await user.type(input, 'είμαι')
		await user.keyboard('{Enter}')

		expect(handleSubmit).toHaveBeenCalledWith('είμαι')
	})

	it('disables submission when no answer is provided', async () => {
		const {user} = render(<ControlledInput status='WAITING_INPUT' />)

		const submitButton = await screen.findByRole('button', {name: /submit/i})
		expect(submitButton).toBeDisabled()

		const input = screen.getByRole('textbox')
		await user.type(input, 'λέω')

		expect(submitButton).toBeEnabled()
	})

	it('shows checking state while validating answers', async () => {
		render(<ControlledInput initialValue='είμαι' status='CHECKING' />)

		const button = await screen.findByRole('button', {name: /checking/i})
		expect(button).toHaveAttribute('data-status', 'CHECKING')
		expect(button).not.toBeDisabled()
	})

	it('keeps the input enabled when a correction is required', async () => {
		render(
			<ControlledInput
				disabled={true}
				initialValue='είμαι'
				status='REQUIRE_CORRECTION'
			/>
		)

		const input = await screen.findByRole('textbox')
		expect(input).toBeEnabled()
		expect(
			screen.getByText(/please enter the correct answer to continue/i)
		).toBeInTheDocument()
	})
})
