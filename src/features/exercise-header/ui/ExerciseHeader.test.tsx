import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {render} from '@/shared/lib'
import {ExerciseHeader} from './ExerciseHeader'

vi.mock('@/shared/lib/i18n', () => ({
	loadTranslations: () => ({
		t: (key: string) => key,
		language: 'en',
		isLoading: false,
		error: null,
		missingKeys: [],
		status: 'complete' as const
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

	it('renders title without block name when not provided', () => {
		render(
			<ExerciseHeader progress={{current: 1, total: 3}} title='Solo Title' />
		)

		expect(screen.getByText('Solo Title')).toBeInTheDocument()
		expect(screen.queryByText('Ενεστώτας')).not.toBeInTheDocument()
	})

	it('renders without progress bar when progress not provided', () => {
		render(<ExerciseHeader title='No Progress' />)

		expect(screen.getByText('No Progress')).toBeInTheDocument()
		expect(screen.queryByTestId('exercise-progress')).not.toBeInTheDocument()
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

	it('shows auto advance toggle as enabled when autoAdvanceEnabled is true', () => {
		const onToggle = vi.fn()

		render(
			<ExerciseHeader
				autoAdvanceEnabled={true}
				onToggleAutoAdvance={onToggle}
				title='Enabled Auto Advance'
			/>
		)

		const toggle = screen.getByTestId('auto-advance-toggle')
		expect(toggle).toHaveAttribute('data-enabled', 'true')
		expect(toggle).toHaveAttribute('title', 'exercise.autoAdvanceEnabled')
	})

	it('shows auto advance toggle as disabled when autoAdvanceEnabled is false', () => {
		const onToggle = vi.fn()

		render(
			<ExerciseHeader
				autoAdvanceEnabled={false}
				onToggleAutoAdvance={onToggle}
				title='Disabled Auto Advance'
			/>
		)

		const toggle = screen.getByTestId('auto-advance-toggle')
		expect(toggle).toHaveAttribute('data-enabled', 'false')
		expect(toggle).toHaveAttribute('title', 'exercise.autoAdvanceDisabled')
	})

	it('does not render auto advance toggle when onToggleAutoAdvance is not provided', () => {
		render(
			<ExerciseHeader autoAdvanceEnabled={true} title='No Toggle Handler' />
		)

		expect(screen.queryByTestId('auto-advance-toggle')).not.toBeInTheDocument()
	})

	it('hides back button when showBackButton is false', () => {
		render(<ExerciseHeader showBackButton={false} title='Χωρίς επιστροφή' />)

		expect(screen.queryByTestId('exercise-back-button')).not.toBeInTheDocument()
	})

	it('shows back button by default', () => {
		render(<ExerciseHeader title='Default Back Button' />)

		expect(screen.getByTestId('exercise-back-button')).toBeInTheDocument()
	})

	it('renders back button with correct link and text', () => {
		render(<ExerciseHeader title='Back Button Test' />)

		const backButton = screen.getByTestId('exercise-back-button')
		expect(backButton).toHaveAttribute('href', '/exercises')
		expect(backButton).toHaveTextContent('exercise.backToLibrary')
	})

	it('renders progress with correct data attributes', () => {
		render(
			<ExerciseHeader
				progress={{current: 7, total: 10}}
				title='Progress Attributes'
			/>
		)

		const progressText = screen.getByTestId('progress-text')
		expect(progressText).toHaveAttribute('data-progress-current', '7')
		expect(progressText).toHaveAttribute('data-progress-total', '10')
	})

	it('renders progress bar with correct percentage calculation', () => {
		render(
			<ExerciseHeader
				progress={{current: 2, total: 8}}
				title='Progress Percentage'
			/>
		)

		const progressBar = screen.getByTestId('exercise-progress')
		expect(progressBar).toBeInTheDocument()

		// Check that progress text shows correct values
		const progressText = screen.getByTestId('progress-text')
		expect(progressText).toHaveTextContent('2 exercise.progressOf 8')
	})

	it('handles edge case of zero current progress', () => {
		render(
			<ExerciseHeader progress={{current: 0, total: 5}} title='Zero Progress' />
		)

		const progressText = screen.getByTestId('progress-text')
		expect(progressText).toHaveTextContent('0 exercise.progressOf 5')
		expect(progressText).toHaveAttribute('data-progress-current', '0')
	})

	it('handles edge case of completed progress', () => {
		render(
			<ExerciseHeader
				progress={{current: 5, total: 5}}
				title='Complete Progress'
			/>
		)

		const progressText = screen.getByTestId('progress-text')
		expect(progressText).toHaveTextContent('5 exercise.progressOf 5')
		expect(progressText).toHaveAttribute('data-progress-current', '5')
		expect(progressText).toHaveAttribute('data-progress-total', '5')
	})

	it('renders auto advance toggle with correct SVG icons', () => {
		const onToggle = vi.fn()

		const {rerender} = render(
			<ExerciseHeader
				autoAdvanceEnabled={true}
				onToggleAutoAdvance={onToggle}
				title='SVG Icons Test'
			/>
		)

		// Check enabled icon
		let toggle = screen.getByTestId('auto-advance-toggle')
		expect(toggle.querySelector('svg title')).toHaveTextContent(
			'exercise.autoAdvanceEnabledIcon'
		)

		// Re-render with disabled state
		rerender(
			<ExerciseHeader
				autoAdvanceEnabled={false}
				onToggleAutoAdvance={onToggle}
				title='SVG Icons Test'
			/>
		)

		// Check disabled icon
		toggle = screen.getByTestId('auto-advance-toggle')
		expect(toggle.querySelector('svg title')).toHaveTextContent(
			'exercise.autoAdvanceDisabledIcon'
		)
	})

	it('renders back button with correct SVG icon', () => {
		render(<ExerciseHeader title='Back SVG Test' />)

		const backButton = screen.getByTestId('exercise-back-button')
		const svgTitle = backButton.querySelector('svg title')
		expect(svgTitle).toHaveTextContent('exercise.backArrow')
	})

	it('applies correct CSS classes for styling', () => {
		const onToggle = vi.fn()

		render(
			<ExerciseHeader
				autoAdvanceEnabled={true}
				onToggleAutoAdvance={onToggle}
				progress={{current: 1, total: 3}}
				title='CSS Classes Test'
			/>
		)

		// Check that title is rendered
		expect(screen.getByText('CSS Classes Test')).toBeInTheDocument()

		// Check auto advance toggle has correct styling classes
		const toggle = screen.getByTestId('auto-advance-toggle')
		expect(toggle).toHaveClass(
			'flex',
			'items-center',
			'gap-2',
			'rounded-lg',
			'px-3',
			'py-2',
			'text-sm',
			'transition-colors'
		)
	})

	it('renders all components together correctly', () => {
		const onToggle = vi.fn()

		render(
			<ExerciseHeader
				autoAdvanceEnabled={false}
				blockName='Test Block'
				onToggleAutoAdvance={onToggle}
				progress={{current: 3, total: 7}}
				showBackButton={true}
				title='Complete Test'
			/>
		)

		// All elements should be present
		expect(screen.getByText('Complete Test')).toBeInTheDocument()
		expect(screen.getByText('Test Block')).toBeInTheDocument()
		expect(screen.getByTestId('exercise-back-button')).toBeInTheDocument()
		expect(screen.getByTestId('auto-advance-toggle')).toBeInTheDocument()
		expect(screen.getByTestId('exercise-progress')).toBeInTheDocument()
		expect(screen.getByTestId('progress-text')).toHaveTextContent(
			'3 exercise.progressOf 7'
		)
	})
})
