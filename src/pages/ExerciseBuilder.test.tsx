import userEvent from '@testing-library/user-event'
import type React from 'react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useCustomExercisesStore} from '@/entities/exercise'
import {act, render, screen, waitFor} from '@/shared/test'
import {ExerciseBuilder} from './ExerciseBuilder'

const translations: Record<string, string> = {
	exerciseBuilder: 'Exercise Builder',
	exerciseBuilderDesc: 'Create custom Greek learning exercises',
	'ui.toolsEmoji': '🛠️',
	'ui.backToHome': '← Back to Home',
	'builder.libraryInfo':
		'Saved exercises stay locally and appear in the library.',
	'builder.openLibrary': 'Open library',
	'builder.typeSectionTitle': 'Exercise setup',
	'builder.typeHelp': 'Choose the exercise type to load a template.',
	'builder.wordFormType': 'Word form exercise',
	'builder.jsonEditorHelp': 'Edit the JSON structure below.',
	'builder.jsonEditorTitle': 'Exercise JSON',
	'builder.formatJson': 'Format JSON',
	'builder.resetTemplate': 'Reset template',
	'builder.saveToLibrary': 'Save to library',
	'builder.saveSuccess': 'Exercise saved',
	'builder.saveError': 'Could not save exercise',
	'builder.validationTitle': 'Validation',
	'builder.validationError': 'Errors',
	'builder.validationSuccess': 'Valid',
	'builder.validationHint': 'Everything looks correct.',
	'builder.validationUnknown': 'Unknown validation error',
	'builder.validationEmpty': 'Provide exercise JSON to validate',
	'builder.parseError': 'Parse error: {message}',
	'builder.previewTitle': 'Table preview',
	'builder.previewUnavailable': 'Preview unavailable',
	'builder.previewUnavailableHint': 'Fix errors to see the preview.',
	'builder.savedExercisesTitle': 'My exercises',
	'builder.noSavedExercises': 'You have no saved exercises yet',
	'builder.loadButton': 'Load',
	'builder.deleteButton': 'Delete',
	'builder.lastUpdated': 'Updated {date}',
	'ui.hashSymbol': '#'
}

const translate = (key: string) => translations[key] ?? key

vi.mock('@/shared/lib/i18n', () => ({
	loadTranslations: vi.fn(() => ({
		t: translate,
		language: 'en',
		isLoading: false,
		error: null,
		missingKeys: [],
		status: 'complete'
	}))
}))

vi.mock('@/shared/ui/head', () => ({
	Head: ({title}: {title: string}) => (
		<div data-testid='head' data-title={title} />
	)
}))

vi.mock('@/features/learn-view', () => ({
	TableView: ({exercise}: {exercise: {title: string}}) => (
		<div data-testid='table-view'>Preview: {exercise.title}</div>
	)
}))

type MockMotionDivProps = {
	children: React.ReactNode
	className?: string
} & Record<string, unknown>

function mockMotionComponent(props: MockMotionDivProps) {
	const {children, className, ...rest} = props
	return (
		<div className={className} {...rest}>
			{children}
		</div>
	)
}

vi.mock('framer-motion', () => ({
	motion: new Proxy(
		{},
		{
			get: () => mockMotionComponent
		}
	)
}))

describe('ExerciseBuilder', () => {
	beforeEach(() => {
		localStorage.clear()
		act(() => {
			useCustomExercisesStore.setState({records: {}})
		})
	})

	it('renders hero content with title and description', () => {
		render(<ExerciseBuilder />)

		expect(
			screen.getByRole('heading', {name: 'Exercise Builder'})
		).toBeInTheDocument()
		expect(
			screen.getByText('Create custom Greek learning exercises')
		).toBeInTheDocument()
		expect(screen.getByText('🛠️')).toBeInTheDocument()
	})

	it('sets the correct document title', () => {
		render(<ExerciseBuilder />)

		expect(screen.getByTestId('head')).toHaveAttribute(
			'data-title',
			'Exercise Builder'
		)
	})

	it('shows the JSON editor prefilled with the template', () => {
		render(<ExerciseBuilder />)

		const editor = screen.getByLabelText('Exercise JSON') as HTMLTextAreaElement
		expect(editor.value).toContain('"id": "custom-verb-eimai"')
	})

	it('shows validation error when JSON is cleared', async () => {
		const user = userEvent.setup()
		render(<ExerciseBuilder />)

		const editor = screen.getByLabelText('Exercise JSON')
		await user.clear(editor)

		await waitFor(() => {
			expect(
				screen.getByText('Provide exercise JSON to validate')
			).toBeInTheDocument()
		})
	})

	it('saves exercise to custom store and displays success message', async () => {
		const user = userEvent.setup()
		render(<ExerciseBuilder />)

		const saveButton = screen.getByRole('button', {name: 'Save to library'})
		expect(saveButton).not.toBeDisabled()

		await user.click(saveButton)

		await waitFor(() => {
			expect(screen.getByText('Exercise saved')).toBeInTheDocument()
		})

		const state = useCustomExercisesStore.getState()
		expect(Object.keys(state.records)).toHaveLength(1)
	})

	it('lists saved exercises and allows loading them back into the editor', async () => {
		const user = userEvent.setup()
		render(<ExerciseBuilder />)

		await user.click(screen.getByRole('button', {name: 'Save to library'}))

		await waitFor(() => {
			expect(screen.getByText('My exercises')).toBeInTheDocument()
			expect(screen.getByText('Ρήμα είμαι — ενεστώτας')).toBeInTheDocument()
		})

		const loadButton = await screen.findByRole('button', {name: 'Load'})
		await user.click(loadButton)

		const editor = screen.getByLabelText('Exercise JSON') as HTMLTextAreaElement
		expect(editor.value).toContain('"custom-verb-eimai"')
	})

	it('deletes saved exercises', async () => {
		const user = userEvent.setup()
		render(<ExerciseBuilder />)

		await user.click(screen.getByRole('button', {name: 'Save to library'}))

		const deleteButton = await screen.findByRole('button', {name: 'Delete'})
		await user.click(deleteButton)

		await waitFor(() => {
			expect(
				screen.getByText('You have no saved exercises yet')
			).toBeInTheDocument()
		})
	})
})
