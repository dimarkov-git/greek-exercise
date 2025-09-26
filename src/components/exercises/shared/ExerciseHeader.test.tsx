import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {render} from '@/test-utils'
import {ExerciseHeader} from './ExerciseHeader'

vi.mock('@/hooks/useTranslations', () => ({
	useTranslations: () => ({
		t: (key: string) => key,
		status: 'complete' as const,
		missingKeys: [] as string[]
	})
}))

describe('ExerciseHeader', () => {
	it('renders title, block name and progress information', () => {
		render(
			<ExerciseHeader
				blockName='Ενεστώτας'
				progress={{current: 3, total: 5}}
				title='Είμαι'
			/>
		)

		expect(screen.getByText('Είμαι')).toBeInTheDocument()
		expect(screen.getByText('Ενεστώτας')).toBeInTheDocument()
		expect(screen.getByTestId('progress-text')).toHaveTextContent(
			'3 exercise.progressOf 5'
		)
		expect(screen.getByText('exercise.progress')).toBeInTheDocument()
	})

	it('invokes auto advance toggle when button is clicked', async () => {
		const onToggle = vi.fn()
		const user = userEvent.setup()

		render(
			<ExerciseHeader
				autoAdvanceEnabled={false}
				onToggleAutoAdvance={onToggle}
				progress={{current: 1, total: 2}}
				title='Μελέτη'
			/>
		)

		const toggle = screen.getByTestId('auto-advance-toggle')
		expect(toggle).toHaveAttribute('data-enabled', 'false')

		await user.click(toggle)

		expect(onToggle).toHaveBeenCalledTimes(1)
	})

	it('hides back button when showBackButton is false', () => {
		render(<ExerciseHeader showBackButton={false} title='Χωρίς επιστροφή' />)

		expect(screen.queryByTestId('exercise-back-button')).not.toBeInTheDocument()
	})
})
