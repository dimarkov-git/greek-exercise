import {describe, expect, it, vi} from 'vitest'
import type {WordFormExerciseWithDefaults} from '@/entities/exercise'
import {DEFAULT_EXERCISE_SETTINGS} from '@/entities/exercise'
import {render, screen, waitFor} from '@/shared/lib'
import {LearnPage} from './LearnPage'

// Mock all the dependencies
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router')
	return {
		...actual,
		useParams: vi.fn(),
		useNavigate: vi.fn()
	}
})

vi.mock('@/entities/exercise', () => ({
	useExercise: vi.fn(),
	DEFAULT_EXERCISE_SETTINGS: {
		autoAdvance: true,
		autoAdvanceDelayMs: 1500,
		allowSkip: false,
		shuffleCases: false
	}
}))

vi.mock('@/shared/lib', async () => {
	const actual = await vi.importActual('@/shared/lib')
	return {
		...actual,
		useLayout: vi.fn()
	}
})

vi.mock('@/shared/lib/i18n', async () => {
	const actual = await vi.importActual('@/shared/lib/i18n')
	return {
		...actual,
		loadTranslations: vi.fn()
	}
})

vi.mock('@/shared/ui/head', () => ({
	Head: vi.fn(({title}: {title: string}) => <title>{title}</title>)
}))

vi.mock('@/shared/ui/loading-or-error', () => ({
	LoadingOrError: vi.fn(({error}: {error?: Error}) =>
		error ? (
			<div data-testid='loading-error'>Error: {error.message}</div>
		) : (
			<div data-testid='loading-error'>Loading...</div>
		)
	)
}))

vi.mock('@/features/learn-view', () => ({
	JsonView: vi.fn(({exercise}: {exercise: WordFormExerciseWithDefaults}) => (
		<div data-testid='json-view'>JsonView: {exercise.title}</div>
	)),
	TableView: vi.fn(({exercise}: {exercise: WordFormExerciseWithDefaults}) => (
		<div data-testid='table-view'>TableView: {exercise.title}</div>
	)),
	ViewToggle: vi.fn(
		({
			viewMode,
			onViewModeChange
		}: {
			viewMode: string
			onViewModeChange: (mode: string) => void
		}) => (
			<div data-testid='view-toggle'>
				<button
					data-testid='table-mode-btn'
					onClick={() => onViewModeChange('table')}
				>
					Table ({viewMode})
				</button>
				<button
					data-testid='json-mode-btn'
					onClick={() => onViewModeChange('json')}
				>
					JSON ({viewMode})
				</button>
			</div>
		)
	)
}))

// Create mock implementations
const mockNavigate = vi.fn()
const mockSetHeaderEnabled = vi.fn()
const mockTranslator = vi.fn((key: unknown) => {
	if (typeof key === 'string') {
		const translations: Record<string, string> = {
			learnExercise: 'Learn Exercise',
			jsonView: 'JSON View',
			tableView: 'Table View',
			exerciseStructure: 'Exercise Structure',
			startExercise: 'Start Exercise',
			'exercise.backToLibrary': 'Back to Library',
			'exercise.unsupportedType': 'Unsupported Exercise Type',
			'exercise.notImplemented':
				'Exercise type "{type}" is not implemented yet.',
			'exercise.difficulty': 'Difficulty',
			'exercise.minutes': 'Minutes',
			'exercise.blocks': 'Blocks',
			'exercise.cases': 'Cases',
			'ui.leftArrow': '←',
			'ui.playIcon': '▶',
			'ui.hashSymbol': '#'
		}
		return translations[key] || key
	}
	return String(key)
})

// Import mocked modules to set up implementations
import {useNavigate, useParams} from 'react-router'
import {useExercise} from '@/entities/exercise'
import {useLayout} from '@/shared/lib'
import {loadTranslations} from '@/shared/lib/i18n'

// Test data
const mockWordFormExercise: WordFormExerciseWithDefaults = {
	id: 'test-exercise-1',
	enabled: true,
	type: 'word-form',
	language: 'el',
	title: 'Present Tense of εἰμί',
	description:
		'Learn the present tense forms of the verb "to be" in Ancient Greek',
	tags: ['verbs', 'present-tense', 'essential'],
	difficulty: 'a1',
	estimatedTimeMinutes: 15,
	blocks: [
		{
			id: 'block-1',
			name: 'εἰμί - Present Tense',
			cases: [
				{
					id: 'case-1',
					prompt: 'I am',
					correct: ['εἰμί']
				},
				{
					id: 'case-2',
					prompt: 'You are',
					correct: ['εἶ']
				}
			]
		},
		{
			id: 'block-2',
			name: 'εἰμί - Present Tense Plural',
			cases: [
				{
					id: 'case-3',
					prompt: 'We are',
					correct: ['ἐσμέν']
				}
			]
		}
	],
	settings: DEFAULT_EXERCISE_SETTINGS
}

const mockUnsupportedExercise = {
	id: 'unsupported-exercise',
	enabled: true,
	type: 'flashcard',
	title: 'Flashcard Exercise',
	description: 'A flashcard exercise',
	tags: [],
	difficulty: 'a1' as const,
	estimatedTimeMinutes: 10,
	blocks: []
} as unknown as WordFormExerciseWithDefaults

type UseExerciseReturn = ReturnType<typeof useExercise>

function mockUseExerciseResult(
	overrides: Record<string, unknown>
): UseExerciseReturn {
	return overrides as unknown as UseExerciseReturn
}

describe('LearnPage', () => {
	beforeEach(() => {
		// Reset all mocks
		vi.clearAllMocks()

		// Set up default mock implementations
		vi.mocked(useParams).mockReturnValue({exerciseId: 'test-exercise-1'})
		vi.mocked(useNavigate).mockReturnValue(mockNavigate)
		vi.mocked(useLayout).mockReturnValue({
			headerEnabled: true,
			setHeaderEnabled: mockSetHeaderEnabled
		})
		vi.mocked(loadTranslations).mockReturnValue({
			t: mockTranslator,
			language: 'en' as const,
			isLoading: false,
			error: null,
			missingKeys: [],
			status: 'complete' as const
		})
	})

	describe('loading state', () => {
		it('shows LoadingOrError component when exercise is loading', () => {
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: undefined,
					isLoading: true,
					error: null
				})
			)

			render(<LearnPage />)

			expect(screen.getByTestId('loading-error')).toBeInTheDocument()
			expect(screen.getByText('Loading...')).toBeInTheDocument()
		})

		it('sets header to disabled when component mounts and re-enables on unmount', async () => {
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: undefined,
					isLoading: true,
					error: null
				})
			)

			const {unmount} = render(<LearnPage />)

			expect(mockSetHeaderEnabled).toHaveBeenCalledWith(false)

			unmount()

			await waitFor(() => {
				expect(mockSetHeaderEnabled).toHaveBeenCalledWith(true)
			})
		})
	})

	describe('error state', () => {
		it('shows LoadingOrError with error when exercise fetch fails', () => {
			const testError = new Error('Failed to load exercise')
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: undefined,
					isLoading: false,
					error: testError
				})
			)

			render(<LearnPage />)

			expect(screen.getByTestId('loading-error')).toBeInTheDocument()
			expect(
				screen.getByText('Error: Failed to load exercise')
			).toBeInTheDocument()
		})

		it('shows LoadingOrError when no exercise is found', () => {
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: undefined,
					isLoading: false,
					error: null
				})
			)

			render(<LearnPage />)

			expect(screen.getByTestId('loading-error')).toBeInTheDocument()
			expect(screen.getByText('Loading...')).toBeInTheDocument()
		})
	})

	describe('unsupported exercise type', () => {
		it('shows UnsupportedExerciseNotice for non-word-form exercise', () => {
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockUnsupportedExercise,
					isLoading: false,
					error: null
				})
			)

			render(<LearnPage />)

			expect(screen.getByText('Unsupported Exercise Type')).toBeInTheDocument()
			expect(
				screen.getByText('Exercise type "flashcard" is not implemented yet.')
			).toBeInTheDocument()
			expect(
				screen.getByRole('button', {name: 'Back to Library'})
			).toBeInTheDocument()
		})

		it('calls onBack when back button is clicked in UnsupportedExerciseNotice', async () => {
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockUnsupportedExercise,
					isLoading: false,
					error: null
				})
			)

			const {user} = render(<LearnPage />)
			const backButton = screen.getByRole('button', {name: 'Back to Library'})

			await user.click(backButton)

			expect(mockNavigate).toHaveBeenCalledWith('/exercises', {replace: true})
		})

		it('sets correct page title for unsupported exercise', () => {
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockUnsupportedExercise,
					isLoading: false,
					error: null
				})
			)

			render(<LearnPage />)

			// The Head component is mocked to render a title element
			expect(document.querySelector('title')).toHaveTextContent(
				'Learn Exercise'
			)
		})
	})

	describe('successful word-form exercise rendering', () => {
		beforeEach(() => {
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockWordFormExercise,
					isLoading: false,
					error: null
				})
			)
		})

		it('renders LearnPageContent with correct props', () => {
			render(<LearnPage />)

			// Check that the main content is rendered
			expect(screen.getByText('Present Tense of εἰμί')).toBeInTheDocument()
			expect(
				screen.getByText(
					'Learn the present tense forms of the verb "to be" in Ancient Greek'
				)
			).toBeInTheDocument()
		})

		it('sets correct page title', () => {
			render(<LearnPage />)

			// The Head component is mocked to render a title element
			expect(document.querySelector('title')).toHaveTextContent(
				'Present Tense of εἰμί | Learn Exercise'
			)
		})

		it('displays exercise stats correctly', () => {
			render(<LearnPage />)

			expect(screen.getByText('A1')).toBeInTheDocument() // difficulty uppercase
			expect(screen.getByText('15')).toBeInTheDocument() // minutes
			expect(screen.getByText('2')).toBeInTheDocument() // blocks count
			expect(screen.getByText('3')).toBeInTheDocument() // total cases count
		})

		it('displays exercise tags when present', () => {
			render(<LearnPage />)

			expect(screen.getByText('#verbs')).toBeInTheDocument()
			expect(screen.getByText('#present-tense')).toBeInTheDocument()
			expect(screen.getByText('#essential')).toBeInTheDocument()
		})

		it('does not display tags section when tags are empty', () => {
			const exerciseWithoutTags = {...mockWordFormExercise, tags: []}
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: exerciseWithoutTags,
					isLoading: false,
					error: null
				})
			)

			render(<LearnPage />)

			expect(screen.queryByText('#verbs')).not.toBeInTheDocument()
		})

		it('shows table view by default', () => {
			render(<LearnPage />)

			expect(screen.getByTestId('table-view')).toBeInTheDocument()
			expect(
				screen.getByText('TableView: Present Tense of εἰμί')
			).toBeInTheDocument()
			expect(screen.queryByTestId('json-view')).not.toBeInTheDocument()
		})

		it('handles view mode toggle correctly', async () => {
			const {user} = render(<LearnPage />)

			expect(screen.getByTestId('table-view')).toBeInTheDocument()

			const jsonButton = screen.getByTestId('json-mode-btn')
			await user.click(jsonButton)

			expect(screen.getByTestId('json-view')).toBeInTheDocument()
			expect(
				screen.getByText('JsonView: Present Tense of εἰμί')
			).toBeInTheDocument()
			expect(screen.queryByTestId('table-view')).not.toBeInTheDocument()
		})
	})

	describe('navigation functionality', () => {
		beforeEach(() => {
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockWordFormExercise,
					isLoading: false,
					error: null
				})
			)
		})

		it('calls navigate with correct path when back button is clicked', async () => {
			const {user} = render(<LearnPage />)

			const backButton = screen.getByRole('button', {name: 'Back to Library'})
			await user.click(backButton)

			expect(mockNavigate).toHaveBeenCalledWith('/exercises', {replace: true})
		})

		it('calls navigate with correct path when start exercise button is clicked', async () => {
			const {user} = render(<LearnPage />)

			const startButton = screen.getByRole('button', {name: 'Start Exercise'})
			await user.click(startButton)

			expect(mockNavigate).toHaveBeenCalledWith('/exercise/test-exercise-1')
		})

		it('does not navigate when start exercise is clicked without exerciseId', async () => {
			vi.mocked(useParams).mockReturnValue({exerciseId: undefined})

			const {user} = render(<LearnPage />)

			const startButton = screen.getByRole('button', {name: 'Start Exercise'})
			await user.click(startButton)

			expect(mockNavigate).not.toHaveBeenCalled()
		})
	})

	describe('sub-components', () => {
		beforeEach(() => {
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockWordFormExercise,
					isLoading: false,
					error: null
				})
			)
		})

		describe('LearnPageHero', () => {
			it('displays exercise title and description correctly', () => {
				render(<LearnPage />)

				expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument()
				expect(screen.getByText('Present Tense of εἰμί')).toBeInTheDocument()
				expect(
					screen.getByText(
						'Learn the present tense forms of the verb "to be" in Ancient Greek'
					)
				).toBeInTheDocument()
			})

			it('displays learn exercise label', () => {
				render(<LearnPage />)

				expect(screen.getByText('Learn Exercise')).toBeInTheDocument()
			})
		})

		describe('ExerciseStats', () => {
			it('calculates and displays total cases correctly', () => {
				render(<LearnPage />)

				// 2 cases in block-1 + 1 case in block-2 = 3 total cases
				expect(screen.getByText('3')).toBeInTheDocument()
			})

			it('displays difficulty in uppercase', () => {
				render(<LearnPage />)

				expect(screen.getByText('A1')).toBeInTheDocument()
			})

			it('displays all stat labels correctly', () => {
				render(<LearnPage />)

				expect(screen.getByText('Difficulty')).toBeInTheDocument()
				expect(screen.getByText('Minutes')).toBeInTheDocument()
				expect(screen.getByText('Blocks')).toBeInTheDocument()
				expect(screen.getByText('Cases')).toBeInTheDocument()
			})
		})

		describe('StatCard', () => {
			it('renders stat cards with correct structure', () => {
				render(<LearnPage />)

				// Check that all stat values are present
				const statCards = screen.getAllByText(/^(A1|15|2|3)$/)
				expect(statCards).toHaveLength(4)
			})
		})

		describe('LearnPageActions', () => {
			it('renders ViewToggle with correct props', () => {
				render(<LearnPage />)

				expect(screen.getByTestId('view-toggle')).toBeInTheDocument()
				expect(screen.getByText('Table (table)')).toBeInTheDocument()
			})

			it('renders start exercise button with correct styling and content', () => {
				render(<LearnPage />)

				const startButton = screen.getByRole('button', {name: 'Start Exercise'})
				expect(startButton).toBeInTheDocument()
				expect(startButton).toHaveClass(
					'inline-flex',
					'items-center',
					'gap-2',
					'rounded-xl',
					'bg-blue-600',
					'px-6',
					'py-3',
					'font-semibold',
					'text-white'
				)
			})
		})

		describe('ExerciseTags', () => {
			it('renders all tags correctly', () => {
				render(<LearnPage />)

				expect(screen.getByText('#verbs')).toBeInTheDocument()
				expect(screen.getByText('#present-tense')).toBeInTheDocument()
				expect(screen.getByText('#essential')).toBeInTheDocument()
			})

			it('applies correct styling to tags', () => {
				render(<LearnPage />)

				const verbsTag = screen.getByText('#verbs')
				expect(verbsTag).toHaveClass(
					'inline-flex',
					'items-center',
					'rounded-full',
					'bg-blue-100/80',
					'px-3',
					'py-1',
					'font-medium',
					'text-blue-700',
					'text-xs',
					'uppercase',
					'tracking-wide'
				)
			})

			it('renders null when no tags are provided', () => {
				const exerciseWithoutTags = {...mockWordFormExercise, tags: []}
				vi.mocked(useExercise).mockReturnValue(
					mockUseExerciseResult({
						data: exerciseWithoutTags,
						isLoading: false,
						error: null
					})
				)

				render(<LearnPage />)

				expect(screen.queryByText('#verbs')).not.toBeInTheDocument()
			})
		})
	})

	describe('edge cases', () => {
		it('handles missing exerciseId in params', () => {
			vi.mocked(useParams).mockReturnValue({})
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: undefined,
					isLoading: true,
					error: null
				})
			)

			render(<LearnPage />)

			expect(screen.getByTestId('loading-error')).toBeInTheDocument()
		})

		it('handles exercise with empty tags correctly', () => {
			const exerciseWithNoTags = {
				...mockWordFormExercise,
				tags: []
			}
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: exerciseWithNoTags,
					isLoading: false,
					error: null
				})
			)

			render(<LearnPage />)

			expect(screen.queryByText('#verbs')).not.toBeInTheDocument()
		})

		it('handles exercise with empty blocks array', () => {
			const exerciseWithNoBlocks = {...mockWordFormExercise, blocks: []}
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: exerciseWithNoBlocks,
					isLoading: false,
					error: null
				})
			)

			render(<LearnPage />)

			const zeroValues = screen.getAllByText('0')
			expect(zeroValues).toHaveLength(2) // blocks count and cases count should both be 0
		})

		it('handles exercise blocks with no cases', () => {
			const exerciseWithEmptyBlocks = {
				...mockWordFormExercise,
				blocks: [{id: 'empty-block', name: 'Empty Block', cases: []}]
			}
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: exerciseWithEmptyBlocks,
					isLoading: false,
					error: null
				})
			)

			render(<LearnPage />)

			expect(screen.getByText('1')).toBeInTheDocument() // blocks count
			expect(screen.getByText('0')).toBeInTheDocument() // cases count
		})
	})

	describe('hook dependencies', () => {
		it('calls useExercise with exerciseId from params', () => {
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockWordFormExercise,
					isLoading: false,
					error: null
				})
			)

			render(<LearnPage />)

			expect(useExercise).toHaveBeenCalledWith('test-exercise-1')
		})

		it('calls loadTranslations with correct dictionary', () => {
			vi.mocked(useExercise).mockReturnValue(
				mockUseExerciseResult({
					data: mockWordFormExercise,
					isLoading: false,
					error: null
				})
			)

			render(<LearnPage />)

			expect(loadTranslations).toHaveBeenCalled()
		})
	})
})
