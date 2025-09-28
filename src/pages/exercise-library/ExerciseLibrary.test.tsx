import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import type {
	Difficulty,
	ExerciseLibraryViewModel,
	ExerciseSummary
} from '@/entities/exercise'
import {render, screen} from '@/shared/lib'
import type {Language} from '@/shared/model/settings'
import {ExerciseLibrary} from './ExerciseLibrary'

// Mock dependencies
const mockT = vi.fn((key: string) => {
	const translations: Record<string, string> = {
		exerciseLibrary: 'Exercise Library',
		exerciseLibraryDesc: 'Choose an exercise to practice',
		settings: 'Settings',
		filters: 'Filters',
		noExercisesFound: 'No exercises found',
		clearFilters: 'Clear filters'
	}
	return translations[key] || key
})

// Mock hooks
vi.mock('@/entities/exercise', () => ({
	useExercises: vi.fn()
}))

vi.mock('@/shared/lib/i18n', () => ({
	useTranslations: vi.fn()
}))

vi.mock('./hooks/useExerciseFiltering', () => ({
	useExerciseFiltering: vi.fn()
}))

// Mock components
vi.mock('@/shared/ui/head', () => ({
	Head: ({title}: {title: string}) => {
		// Simulate the real Head component behavior
		document.title = title
		return null
	}
}))

vi.mock('@/shared/ui/loading-or-error', () => ({
	LoadingOrError: ({error}: {error?: Error}) => (
		<div data-testid='loading-or-error'>
			{error ? `Error: ${error.message}` : 'Loading...'}
		</div>
	)
}))

vi.mock('./components/LibraryHeader', () => ({
	LibraryHeader: ({t}: {t: (key: string) => string}) => (
		<header data-testid='library-header'>
			<h1>{t('exerciseLibrary')}</h1>
			<p>{t('exerciseLibraryDesc')}</p>
		</header>
	)
}))

vi.mock('./components/UserSettings', () => ({
	UserSettings: ({t}: {t: (key: string) => string}) => (
		<div data-testid='user-settings'>
			<h2>{t('settings')}</h2>
		</div>
	)
}))

vi.mock('./components/ExerciseFilters', () => ({
	ExerciseFilters: ({
		t,
		selectedTags,
		selectedDifficulties,
		selectedLanguages,
		setSelectedTags,
		setSelectedDifficulties,
		setSelectedLanguages,
		tagOptions,
		difficultyOptions,
		languageOptions
	}: {
		t: (key: string) => string
		selectedTags: string[]
		selectedDifficulties: Difficulty[]
		selectedLanguages: Language[]
		setSelectedTags: (tags: string[]) => void
		setSelectedDifficulties: (difficulties: Difficulty[]) => void
		setSelectedLanguages: (languages: Language[]) => void
		tagOptions: string[]
		difficultyOptions: Difficulty[]
		languageOptions: Language[]
	}) => (
		<div data-testid='exercise-filters'>
			<h2>{t('filters')}</h2>
			<div data-testid='filter-options'>
				<div>Tags: {tagOptions.join(', ')}</div>
				<div>Difficulties: {difficultyOptions.join(', ')}</div>
				<div>Languages: {languageOptions.join(', ')}</div>
			</div>
			<div data-testid='selected-filters'>
				<div>Selected Tags: {selectedTags.join(', ')}</div>
				<div>Selected Difficulties: {selectedDifficulties.join(', ')}</div>
				<div>Selected Languages: {selectedLanguages.join(', ')}</div>
			</div>
			<button
				data-testid='set-tag-filter'
				onClick={() => setSelectedTags(['grammar'])}
			>
				Set Tag Filter
			</button>
			<button
				data-testid='set-difficulty-filter'
				onClick={() => setSelectedDifficulties(['a1'])}
			>
				Set Difficulty Filter
			</button>
			<button
				data-testid='set-language-filter'
				onClick={() => setSelectedLanguages(['en'])}
			>
				Set Language Filter
			</button>
		</div>
	)
}))

vi.mock('./components/ExerciseGrid', () => ({
	ExerciseGrid: ({
		exercises,
		onClearFilters,
		t
	}: {
		exercises: ExerciseSummary[]
		onClearFilters: () => void
		t: (key: string) => string
	}) => (
		<div data-testid='exercise-grid'>
			{exercises.length === 0 ? (
				<div data-testid='no-exercises'>
					<p>{t('noExercisesFound')}</p>
					<button data-testid='clear-filters-button' onClick={onClearFilters}>
						{t('clearFilters')}
					</button>
				</div>
			) : (
				<div data-testid='exercise-list'>
					{exercises.map(exercise => (
						<div data-testid={`exercise-${exercise.id}`} key={exercise.id}>
							{exercise.title}
						</div>
					))}
				</div>
			)}
		</div>
	)
}))

// Import mocked modules to set up implementations
import {useExercises} from '@/entities/exercise'
import {useTranslations} from '@/shared/lib/i18n'
import {useExerciseFiltering} from './hooks/useExerciseFiltering'

// Test data
const mockExerciseSummary1: ExerciseSummary = {
	id: 'exercise-1',
	type: 'word-form',
	language: 'el',
	title: 'Basic Nouns',
	description: 'Learn basic Greek nouns',
	difficulty: 'a1',
	estimatedTimeMinutes: 15,
	enabled: true,
	tags: ['nouns', 'grammar'],
	totalBlocks: 2,
	totalCases: 10,
	availableLanguages: ['el']
}

const mockExerciseSummary2: ExerciseSummary = {
	id: 'exercise-2',
	type: 'word-form',
	language: 'el',
	title: 'Verb Conjugation',
	description: 'Practice verb conjugation',
	difficulty: 'a2',
	estimatedTimeMinutes: 20,
	enabled: true,
	tags: ['verbs', 'grammar'],
	totalBlocks: 3,
	totalCases: 15,
	availableLanguages: ['el']
}

const mockExerciseLibrary: ExerciseLibraryViewModel = {
	exercises: [mockExerciseSummary1, mockExerciseSummary2],
	filterOptions: {
		tags: ['nouns', 'verbs', 'grammar'],
		difficulties: ['a1', 'a2'],
		languages: ['el']
	},
	totals: {
		total: 2,
		enabled: 2
	}
}

type UseExercisesReturn = ReturnType<typeof useExercises>
type UseExerciseFilteringReturn = ReturnType<typeof useExerciseFiltering>

function mockUseExercisesResult(
	overrides: Partial<UseExercisesReturn>
): UseExercisesReturn {
	return {
		data: undefined,
		isLoading: false,
		error: null,
		...overrides
	} as UseExercisesReturn
}

function mockUseExerciseFilteringResult(
	overrides: Partial<UseExerciseFilteringReturn>
): UseExerciseFilteringReturn {
	return {
		filteredExercises: [],
		selectedTags: [],
		setSelectedTags: vi.fn(),
		selectedDifficulties: [],
		setSelectedDifficulties: vi.fn(),
		selectedLanguages: [],
		setSelectedLanguages: vi.fn(),
		tagOptions: [],
		difficultyOptions: [],
		languageOptions: [],
		clearFilters: vi.fn(),
		...overrides
	} as UseExerciseFilteringReturn
}

describe('ExerciseLibrary', () => {
	beforeEach(() => {
		vi.clearAllMocks()

		// Default mock implementations
		vi.mocked(useTranslations).mockReturnValue({
			t: mockT,
			translations: {},
			currentLanguage: 'en',
			isLoading: false,
			error: null,
			missingKeys: [],
			status: 'complete'
		} as unknown as ReturnType<typeof useTranslations>)

		vi.mocked(useExerciseFiltering).mockReturnValue(
			mockUseExerciseFilteringResult({
				filteredExercises: mockExerciseLibrary.exercises,
				tagOptions: mockExerciseLibrary.filterOptions.tags,
				difficultyOptions: mockExerciseLibrary.filterOptions.difficulties,
				languageOptions: mockExerciseLibrary.filterOptions.languages
			})
		)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('Head component', () => {
		it('sets the page title correctly', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: mockExerciseLibrary,
					isLoading: false,
					error: null
				})
			)

			render(<ExerciseLibrary />)

			expect(document.title).toBe('Exercise Library')
		})
	})

	describe('Loading state', () => {
		it('shows LoadingOrError component when loading', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: undefined,
					isLoading: true,
					error: null
				})
			)

			render(<ExerciseLibrary />)

			expect(screen.getByTestId('loading-or-error')).toBeInTheDocument()
			expect(screen.getByText('Loading...')).toBeInTheDocument()
			expect(screen.queryByTestId('user-settings')).not.toBeInTheDocument()
			expect(screen.queryByTestId('exercise-filters')).not.toBeInTheDocument()
			expect(screen.queryByTestId('exercise-grid')).not.toBeInTheDocument()
		})

		it('shows LibraryHeader even when loading', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: undefined,
					isLoading: true,
					error: null
				})
			)

			render(<ExerciseLibrary />)

			expect(screen.getByTestId('library-header')).toBeInTheDocument()
			expect(screen.getByText('Exercise Library')).toBeInTheDocument()
		})
	})

	describe('Error state', () => {
		it('shows LoadingOrError with error when fetch fails', () => {
			const testError = new Error('Failed to fetch exercises')

			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: undefined,
					isLoading: false,
					error: testError
				})
			)

			render(<ExerciseLibrary />)

			expect(screen.getByTestId('loading-or-error')).toBeInTheDocument()
			expect(
				screen.getByText('Error: Failed to fetch exercises')
			).toBeInTheDocument()
			expect(screen.queryByTestId('user-settings')).not.toBeInTheDocument()
			expect(screen.queryByTestId('exercise-filters')).not.toBeInTheDocument()
			expect(screen.queryByTestId('exercise-grid')).not.toBeInTheDocument()
		})

		it('shows LibraryHeader even when error occurs', () => {
			const testError = new Error('Network error')

			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: undefined,
					isLoading: false,
					error: testError
				})
			)

			render(<ExerciseLibrary />)

			expect(screen.getByTestId('library-header')).toBeInTheDocument()
			expect(screen.getByText('Exercise Library')).toBeInTheDocument()
		})

		it('handles non-Error error objects gracefully', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: undefined,
					isLoading: false,
					error: 'string error' as unknown as Error
				})
			)

			render(<ExerciseLibrary />)

			expect(screen.getByTestId('loading-or-error')).toBeInTheDocument()
			expect(screen.getByText('Loading...')).toBeInTheDocument()
		})
	})

	describe('Successful data loading', () => {
		it('renders all main components when data is loaded', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: mockExerciseLibrary,
					isLoading: false,
					error: null
				})
			)

			render(<ExerciseLibrary />)

			expect(screen.getByTestId('library-header')).toBeInTheDocument()
			expect(screen.getByTestId('user-settings')).toBeInTheDocument()
			expect(screen.getByTestId('exercise-filters')).toBeInTheDocument()
			expect(screen.getByTestId('exercise-grid')).toBeInTheDocument()
			expect(screen.queryByTestId('loading-or-error')).not.toBeInTheDocument()
		})

		it('renders exercises in the grid', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: mockExerciseLibrary,
					isLoading: false,
					error: null
				})
			)

			render(<ExerciseLibrary />)

			expect(screen.getByTestId('exercise-list')).toBeInTheDocument()
			expect(screen.getByTestId('exercise-exercise-1')).toBeInTheDocument()
			expect(screen.getByTestId('exercise-exercise-2')).toBeInTheDocument()
			expect(screen.getByText('Basic Nouns')).toBeInTheDocument()
			expect(screen.getByText('Verb Conjugation')).toBeInTheDocument()
		})
	})

	describe('Exercise filtering integration', () => {
		it('passes correct props to ExerciseFilters component', () => {
			const mockSetSelectedTags = vi.fn()
			const mockSetSelectedDifficulties = vi.fn()
			const mockSetSelectedLanguages = vi.fn()

			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: mockExerciseLibrary,
					isLoading: false,
					error: null
				})
			)

			vi.mocked(useExerciseFiltering).mockReturnValue(
				mockUseExerciseFilteringResult({
					selectedTags: ['grammar'],
					selectedDifficulties: ['a1'],
					selectedLanguages: ['en'],
					setSelectedTags: mockSetSelectedTags,
					setSelectedDifficulties: mockSetSelectedDifficulties,
					setSelectedLanguages: mockSetSelectedLanguages,
					tagOptions: mockExerciseLibrary.filterOptions.tags,
					difficultyOptions: mockExerciseLibrary.filterOptions.difficulties,
					languageOptions: mockExerciseLibrary.filterOptions.languages
				})
			)

			render(<ExerciseLibrary />)

			// Check that filter options are displayed
			expect(
				screen.getByText('Tags: nouns, verbs, grammar')
			).toBeInTheDocument()
			expect(screen.getByText('Difficulties: a1, a2')).toBeInTheDocument()
			expect(screen.getByText('Languages: el')).toBeInTheDocument()

			// Check that selected filters are displayed
			expect(screen.getByText('Selected Tags: grammar')).toBeInTheDocument()
			expect(screen.getByText('Selected Difficulties: a1')).toBeInTheDocument()
			expect(screen.getByText('Selected Languages: en')).toBeInTheDocument()
		})

		it('handles filter interactions correctly', async () => {
			const mockSetSelectedTags = vi.fn()
			const mockSetSelectedDifficulties = vi.fn()
			const mockSetSelectedLanguages = vi.fn()

			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: mockExerciseLibrary,
					isLoading: false,
					error: null
				})
			)

			vi.mocked(useExerciseFiltering).mockReturnValue(
				mockUseExerciseFilteringResult({
					setSelectedTags: mockSetSelectedTags,
					setSelectedDifficulties: mockSetSelectedDifficulties,
					setSelectedLanguages: mockSetSelectedLanguages,
					tagOptions: mockExerciseLibrary.filterOptions.tags,
					difficultyOptions: mockExerciseLibrary.filterOptions.difficulties,
					languageOptions: mockExerciseLibrary.filterOptions.languages
				})
			)

			const {user} = render(<ExerciseLibrary />)

			// Test tag filter interaction
			await user.click(screen.getByTestId('set-tag-filter'))
			expect(mockSetSelectedTags).toHaveBeenCalledWith(['grammar'])

			// Test difficulty filter interaction
			await user.click(screen.getByTestId('set-difficulty-filter'))
			expect(mockSetSelectedDifficulties).toHaveBeenCalledWith(['a1'])

			// Test language filter interaction
			await user.click(screen.getByTestId('set-language-filter'))
			expect(mockSetSelectedLanguages).toHaveBeenCalledWith(['en'])
		})

		it('displays filtered exercises correctly', () => {
			const filteredExercises = [mockExerciseSummary1] // Only first exercise

			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: mockExerciseLibrary,
					isLoading: false,
					error: null
				})
			)

			vi.mocked(useExerciseFiltering).mockReturnValue(
				mockUseExerciseFilteringResult({
					filteredExercises,
					tagOptions: mockExerciseLibrary.filterOptions.tags,
					difficultyOptions: mockExerciseLibrary.filterOptions.difficulties,
					languageOptions: mockExerciseLibrary.filterOptions.languages
				})
			)

			render(<ExerciseLibrary />)

			expect(screen.getByTestId('exercise-exercise-1')).toBeInTheDocument()
			expect(screen.getByText('Basic Nouns')).toBeInTheDocument()
			expect(
				screen.queryByTestId('exercise-exercise-2')
			).not.toBeInTheDocument()
			expect(screen.queryByText('Verb Conjugation')).not.toBeInTheDocument()
		})

		it('shows no exercises message and clear filters button when no exercises match', async () => {
			const mockClearFilters = vi.fn()

			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: mockExerciseLibrary,
					isLoading: false,
					error: null
				})
			)

			vi.mocked(useExerciseFiltering).mockReturnValue(
				mockUseExerciseFilteringResult({
					filteredExercises: [], // No exercises match filters
					clearFilters: mockClearFilters,
					tagOptions: mockExerciseLibrary.filterOptions.tags,
					difficultyOptions: mockExerciseLibrary.filterOptions.difficulties,
					languageOptions: mockExerciseLibrary.filterOptions.languages
				})
			)

			const {user} = render(<ExerciseLibrary />)

			expect(screen.getByTestId('no-exercises')).toBeInTheDocument()
			expect(screen.getByText('No exercises found')).toBeInTheDocument()

			const clearFiltersButton = screen.getByTestId('clear-filters-button')
			expect(clearFiltersButton).toBeInTheDocument()

			await user.click(clearFiltersButton)
			expect(mockClearFilters).toHaveBeenCalled()
		})
	})

	describe('Hook integration', () => {
		it('calls useExerciseFiltering with correct exercise library data', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: mockExerciseLibrary,
					isLoading: false,
					error: null
				})
			)

			render(<ExerciseLibrary />)

			expect(useExerciseFiltering).toHaveBeenCalledWith(mockExerciseLibrary)
		})

		it('calls useExerciseFiltering with undefined when no data', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: undefined,
					isLoading: true,
					error: null
				})
			)

			render(<ExerciseLibrary />)

			expect(useExerciseFiltering).toHaveBeenCalledWith(undefined)
		})
	})

	describe('Component layout', () => {
		it('applies correct CSS classes to main container', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: mockExerciseLibrary,
					isLoading: false,
					error: null
				})
			)

			render(<ExerciseLibrary />)

			const mainContainer = screen.getByTestId('library-header').parentElement
			expect(mainContainer).toHaveClass('mx-auto', 'max-w-6xl', 'px-4', 'py-8')

			const outerContainer = mainContainer?.parentElement
			expect(outerContainer).toHaveClass(
				'min-h-screen',
				'bg-gray-50',
				'dark:bg-gray-900'
			)
		})
	})

	describe('Error prop handling', () => {
		it('passes error prop correctly when error is Error instance', () => {
			const testError = new Error('Test error')

			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: undefined,
					isLoading: false,
					error: testError
				})
			)

			render(<ExerciseLibrary />)

			expect(screen.getByText('Error: Test error')).toBeInTheDocument()
		})

		it('does not pass error prop when error is not Error instance', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: undefined,
					isLoading: false,
					error: 'string error' as unknown as Error
				})
			)

			render(<ExerciseLibrary />)

			expect(screen.getByText('Loading...')).toBeInTheDocument()
			expect(screen.queryByText('Error:')).not.toBeInTheDocument()
		})
	})

	describe('Translations integration', () => {
		it('passes translation function to all child components', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: mockExerciseLibrary,
					isLoading: false,
					error: null
				})
			)

			render(<ExerciseLibrary />)

			// Verify that translations are working in child components
			expect(screen.getByText('Exercise Library')).toBeInTheDocument() // LibraryHeader
			expect(screen.getByText('Settings')).toBeInTheDocument() // UserSettings
			expect(screen.getByText('Filters')).toBeInTheDocument() // ExerciseFilters
		})

		it('uses exerciseLibraryTranslations dictionary', () => {
			vi.mocked(useExercises).mockReturnValue(
				mockUseExercisesResult({
					data: mockExerciseLibrary,
					isLoading: false,
					error: null
				})
			)

			render(<ExerciseLibrary />)

			expect(useTranslations).toHaveBeenCalledWith(
				expect.objectContaining({
					keys: expect.arrayContaining([
						'exerciseLibrary',
						'exerciseLibraryDesc',
						'settings',
						'filters',
						'noExercisesFound',
						'clearFilters'
					])
				})
			)
		})
	})
})
