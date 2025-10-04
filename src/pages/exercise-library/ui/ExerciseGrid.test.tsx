import {act, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {Difficulty, ExerciseSummary} from '@/entities/exercise'
import {DEFAULT_SETTINGS, useSettingsStore} from '@/shared/model'
import {render} from '@/shared/test'
import {exerciseLibraryTranslations} from '../lib/translations'
import {ExerciseGrid} from './ExerciseGrid'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
	motion: {
		div: 'div'
	},
	AnimatePresence: ({children}: {children: React.ReactNode}) => (
		<div>{children}</div>
	)
}))

// Mock translator function
const mockT = vi.fn((key: string) => {
	const translations: Record<string, string> = {
		exerciseCount: 'Showing {filteredCount} exercises',
		noExercisesFound: 'No exercises found',
		noExercisesFoundDesc: 'Try adjusting your filters to see more exercises.',
		clearFilters: 'Clear filters',
		startExercise: 'Start Exercise',
		learn: 'Learn',
		'builder.customBadge': 'Custom',
		'ui.searchEmoji': '🔍',
		'ui.documentEmoji': '📄',
		'ui.booksEmoji': '📚',
		'ui.timerEmoji': '⏱️',
		'ui.questionEmoji': '❓',
		'ui.cardEmoji': '🃏',
		'ui.hashSymbol': '#',
		'ui.plusSymbol': '+',
		'ui.colon': ':',
		'exercise.cases': 'cases',
		'exercise.blocks': 'blocks',
		'exercise.questions': 'questions',
		'exercise.cards': 'cards'
	}
	return translations[key] || key
})

// Mock exercise data
const createMockExercise = (
	overrides: Partial<ExerciseSummary> = {}
): ExerciseSummary => ({
	id: 'exercise-1',
	type: 'word-form',
	language: 'el',
	title: 'Basic Greek Verbs',
	titleI18n: {
		en: 'Basic Greek Verbs',
		el: 'Βασικά Ελληνικά Ρήματα',
		ru: 'Основные греческие глаголы'
	},
	description: 'Learn basic Greek verb conjugations',
	descriptionI18n: {
		en: 'Learn basic Greek verb conjugations',
		el: 'Μάθετε βασικές κλίσεις ελληνικών ρημάτων',
		ru: 'Изучите основные спряжения греческих глаголов'
	},
	tags: ['verbs', 'beginner', 'grammar'],
	difficulty: 'a1',
	totalBlocks: 3,
	totalCases: 12,
	enabled: true,
	availableLanguages: ['en', 'el', 'ru'],
	source: 'builtin',
	...overrides
})

const defaultProps = {
	exercises: [createMockExercise()],
	onClearFilters: vi.fn(),
	t: mockT,
	translations: exerciseLibraryTranslations
}

describe('ExerciseGrid', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		localStorage.clear()
		act(() => {
			useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
		})
	})

	describe('Exercise count display', () => {
		it('displays the correct exercise count', () => {
			const exercises = [
				createMockExercise({id: 'ex-1'}),
				createMockExercise({id: 'ex-2'}),
				createMockExercise({id: 'ex-3'})
			]

			render(<ExerciseGrid {...defaultProps} exercises={exercises} />)

			expect(screen.getByText('Showing 3 exercises')).toBeInTheDocument()
			expect(mockT).toHaveBeenCalledWith('exerciseCount')
		})

		it('displays count for single exercise', () => {
			render(<ExerciseGrid {...defaultProps} />)

			expect(screen.getByText('Showing 1 exercises')).toBeInTheDocument()
		})

		it('displays zero count when no exercises', () => {
			render(<ExerciseGrid {...defaultProps} exercises={[]} />)

			expect(screen.getByText('Showing 0 exercises')).toBeInTheDocument()
		})
	})

	describe('Exercise grid layout', () => {
		it('renders exercises in a grid layout', () => {
			const exercises = [
				createMockExercise({id: 'ex-1', title: 'Exercise 1'}),
				createMockExercise({id: 'ex-2', title: 'Exercise 2'})
			]

			render(<ExerciseGrid {...defaultProps} exercises={exercises} />)

			// Find the grid by looking for the container with grid classes
			const gridContainer = document.querySelector(
				'.grid.gap-6.md\\:grid-cols-2.lg\\:grid-cols-3'
			)
			expect(gridContainer).toHaveClass(
				'grid',
				'gap-6',
				'md:grid-cols-2',
				'lg:grid-cols-3'
			)
		})

		it('renders all provided exercises', () => {
			const exercises = [
				createMockExercise({id: 'ex-1', title: 'Exercise 1'}),
				createMockExercise({id: 'ex-2', title: 'Exercise 2'}),
				createMockExercise({id: 'ex-3', title: 'Exercise 3'})
			]

			render(<ExerciseGrid {...defaultProps} exercises={exercises} />)

			// Check that we have the correct number of exercise cards
			expect(screen.getAllByTestId('start-exercise-button')).toHaveLength(3)
			expect(screen.getAllByTestId('learn-exercise-button')).toHaveLength(3)

			// Check the links are correct for each exercise
			const startButtons = screen.getAllByTestId('start-exercise-button')
			const learnButtons = screen.getAllByTestId('learn-exercise-button')

			expect(startButtons[0]).toHaveAttribute('href', '/exercise/ex-1')
			expect(startButtons[1]).toHaveAttribute('href', '/exercise/ex-2')
			expect(startButtons[2]).toHaveAttribute('href', '/exercise/ex-3')

			expect(learnButtons[0]).toHaveAttribute('href', '/learn/ex-1')
			expect(learnButtons[1]).toHaveAttribute('href', '/learn/ex-2')
			expect(learnButtons[2]).toHaveAttribute('href', '/learn/ex-3')
		})

		it('renders custom badge for user-created exercises', () => {
			const customExercise = createMockExercise({
				id: 'custom-1',
				title: 'Custom Exercise',
				source: 'custom'
			})

			render(<ExerciseGrid {...defaultProps} exercises={[customExercise]} />)

			expect(screen.getByText('Custom')).toBeInTheDocument()
		})
	})

	describe('Exercise cards', () => {
		describe('Title and description', () => {
			it('displays exercise title in UI language when available', () => {
				act(() => {
					useSettingsStore.setState({uiLanguage: 'en'})
				})

				render(<ExerciseGrid {...defaultProps} />)

				expect(screen.getByText('Basic Greek Verbs')).toBeInTheDocument()
			})

			it('falls back to default title when UI language translation not available', () => {
				const exerciseWithoutEnglish = createMockExercise({
					titleI18n: {el: 'Ελληνικά Ρήματα', ru: 'Русские глаголы'}
				})

				act(() => {
					useSettingsStore.setState({uiLanguage: 'en'})
				})

				render(
					<ExerciseGrid
						{...defaultProps}
						exercises={[exerciseWithoutEnglish]}
					/>
				)

				expect(screen.getByText('Basic Greek Verbs')).toBeInTheDocument()
			})

			it('displays exercise description in UI language when available', () => {
				act(() => {
					useSettingsStore.setState({uiLanguage: 'ru'})
				})

				render(<ExerciseGrid {...defaultProps} />)

				expect(
					screen.getByText('Изучите основные спряжения греческих глаголов')
				).toBeInTheDocument()
			})

			it('falls back to default description when UI language translation not available', () => {
				const exerciseWithoutRussian = createMockExercise({
					descriptionI18n: {en: 'English description', el: 'Greek description'}
				})

				act(() => {
					useSettingsStore.setState({uiLanguage: 'ru'})
				})

				render(
					<ExerciseGrid
						{...defaultProps}
						exercises={[exerciseWithoutRussian]}
					/>
				)

				expect(
					screen.getByText('Learn basic Greek verb conjugations')
				).toBeInTheDocument()
			})
		})

		describe('Difficulty display', () => {
			it('displays difficulty badge with correct color for A0/A1', () => {
				const easyExercise = createMockExercise({difficulty: 'a1'})
				render(<ExerciseGrid {...defaultProps} exercises={[easyExercise]} />)

				const difficultyBadge = screen.getByText('A1')
				expect(difficultyBadge).toHaveClass('bg-green-100', 'text-green-800')
			})

			it('displays difficulty badge with correct color for A2/B1', () => {
				const mediumExercise = createMockExercise({difficulty: 'a2'})
				render(<ExerciseGrid {...defaultProps} exercises={[mediumExercise]} />)

				const difficultyBadge = screen.getByText('A2')
				expect(difficultyBadge).toHaveClass('bg-yellow-100', 'text-yellow-800')
			})

			it('displays difficulty badge with correct color for B2/C1/C2', () => {
				const hardExercise = createMockExercise({difficulty: 'c1'})
				render(<ExerciseGrid {...defaultProps} exercises={[hardExercise]} />)

				const difficultyBadge = screen.getByText('C1')
				expect(difficultyBadge).toHaveClass('bg-red-100', 'text-red-800')
			})

			it('displays difficulty badge with gray color for unknown difficulty', () => {
				const unknownExercise = createMockExercise({
					difficulty: 'unknown' as Difficulty
				})
				render(<ExerciseGrid {...defaultProps} exercises={[unknownExercise]} />)

				const difficultyBadge = screen.getByText('unknown')
				expect(difficultyBadge).toHaveClass('bg-gray-100', 'text-gray-800')
			})

			it('displays localized difficulty labels', () => {
				act(() => {
					useSettingsStore.setState({uiLanguage: 'ru'})
				})

				const exercise = createMockExercise({difficulty: 'a1'})
				render(<ExerciseGrid {...defaultProps} exercises={[exercise]} />)

				expect(screen.getByText('А1')).toBeInTheDocument()
			})
		})

		describe('Tags display', () => {
			it('displays up to 3 tags', () => {
				render(<ExerciseGrid {...defaultProps} />)

				expect(screen.getByText('#verbs')).toBeInTheDocument()
				expect(screen.getByText('#beginner')).toBeInTheDocument()
				expect(screen.getByText('#grammar')).toBeInTheDocument()
			})

			it('shows overflow count when more than 3 tags', () => {
				const exerciseWithManyTags = createMockExercise({
					tags: [
						'verbs',
						'beginner',
						'grammar',
						'present',
						'tense',
						'conjugation'
					]
				})

				render(
					<ExerciseGrid {...defaultProps} exercises={[exerciseWithManyTags]} />
				)

				expect(screen.getByText('#verbs')).toBeInTheDocument()
				expect(screen.getByText('#beginner')).toBeInTheDocument()
				expect(screen.getByText('#grammar')).toBeInTheDocument()
				expect(screen.getByText('+3')).toBeInTheDocument()
				expect(screen.queryByText('#present')).not.toBeInTheDocument()
			})

			it('does not display tag section when no tags', () => {
				const exerciseWithoutTags = createMockExercise({tags: []})
				render(
					<ExerciseGrid {...defaultProps} exercises={[exerciseWithoutTags]} />
				)

				expect(screen.queryByText('#verbs')).not.toBeInTheDocument()
			})
		})

		describe('Exercise statistics', () => {
			it('displays exercise statistics correctly', () => {
				render(<ExerciseGrid {...defaultProps} />)

				const container = screen.getByTestId('exercise-card')
				expect(container.textContent).toContain('📄')
				expect(container.textContent).toContain('cases')
				expect(container.textContent).toContain('12')
				expect(container.textContent).toContain('📚')
				expect(container.textContent).toContain('blocks')
				expect(container.textContent).toContain('3')
			})

			it('calls translation functions for statistics', () => {
				render(<ExerciseGrid {...defaultProps} />)

				expect(mockT).toHaveBeenCalledWith('ui.documentEmoji')
				expect(mockT).toHaveBeenCalledWith('ui.booksEmoji')
				expect(mockT).toHaveBeenCalledWith('exercise.cases')
				expect(mockT).toHaveBeenCalledWith('exercise.blocks')
			})
		})

		describe('Action buttons', () => {
			it('renders Start Exercise button with correct link', () => {
				render(<ExerciseGrid {...defaultProps} />)

				const startButton = screen.getByTestId('start-exercise-button')
				expect(startButton).toHaveAttribute('href', '/exercise/exercise-1')
				expect(startButton).toHaveTextContent('Start Exercise')
			})

			it('renders Learn button with correct link and accessibility', () => {
				render(<ExerciseGrid {...defaultProps} />)

				const learnButton = screen.getByTestId('learn-exercise-button')
				expect(learnButton).toHaveAttribute('href', '/learn/exercise-1')
				expect(learnButton).toHaveAttribute('title', 'Learn')

				// Check for info icon (SVG)
				const svg = learnButton.querySelector('svg')
				expect(svg).toBeInTheDocument()
				expect(svg).toHaveAttribute('aria-hidden', 'true')
			})
		})
	})

	describe('Empty state', () => {
		const emptyProps = {
			...defaultProps,
			exercises: []
		}

		it('displays empty state when no exercises', () => {
			render(<ExerciseGrid {...emptyProps} />)

			expect(screen.getByText('🔍')).toBeInTheDocument()
			expect(screen.getByText('No exercises found')).toBeInTheDocument()
			expect(
				screen.getByText('Try adjusting your filters to see more exercises.')
			).toBeInTheDocument()
		})

		it('displays clear filters button in empty state', () => {
			render(<ExerciseGrid {...emptyProps} />)

			const clearButton = screen.getByRole('button', {name: 'Clear filters'})
			expect(clearButton).toBeInTheDocument()
			expect(clearButton).toHaveAttribute('type', 'button')
		})

		it('calls onClearFilters when clear filters button is clicked', async () => {
			const user = userEvent.setup()
			render(<ExerciseGrid {...emptyProps} />)

			const clearButton = screen.getByRole('button', {name: 'Clear filters'})
			await user.click(clearButton)

			expect(defaultProps.onClearFilters).toHaveBeenCalledTimes(1)
		})

		it('does not show empty state when exercises are present', () => {
			render(<ExerciseGrid {...defaultProps} />)

			expect(screen.queryByText('No exercises found')).not.toBeInTheDocument()
			expect(
				screen.queryByRole('button', {name: 'Clear filters'})
			).not.toBeInTheDocument()
		})

		it('calls translation functions for empty state', () => {
			render(<ExerciseGrid {...emptyProps} />)

			expect(mockT).toHaveBeenCalledWith('ui.searchEmoji')
			expect(mockT).toHaveBeenCalledWith('noExercisesFound')
			expect(mockT).toHaveBeenCalledWith('noExercisesFoundDesc')
			expect(mockT).toHaveBeenCalledWith('clearFilters')
		})
	})

	describe('Responsive behavior', () => {
		it('applies responsive grid classes', () => {
			render(<ExerciseGrid {...defaultProps} />)

			const gridContainer = document.querySelector(
				'.grid.gap-6.md\\:grid-cols-2.lg\\:grid-cols-3'
			)
			expect(gridContainer).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3')
		})

		it('applies responsive design classes to cards', () => {
			render(<ExerciseGrid {...defaultProps} />)

			// Find card by its unique classes
			const card = document.querySelector(
				'.rounded-lg.border.border-gray-200.bg-white.shadow-sm'
			)
			expect(card).toHaveClass(
				'rounded-lg',
				'border',
				'shadow-sm',
				'hover:shadow-md'
			)
		})
	})

	describe('Dark mode support', () => {
		it('applies dark mode classes to exercise count', () => {
			render(<ExerciseGrid {...defaultProps} />)

			const countElement = screen.getByText('Showing 1 exercises')
			expect(countElement).toHaveClass('text-gray-500', 'dark:text-gray-400')
		})

		it('applies dark mode classes to cards', () => {
			render(<ExerciseGrid {...defaultProps} />)

			const card = document.querySelector(
				'.rounded-lg.border.border-gray-200.bg-white.shadow-sm'
			)
			expect(card).toHaveClass(
				'border-gray-200',
				'bg-white',
				'dark:border-gray-700',
				'dark:bg-gray-800'
			)
		})

		it('applies dark mode classes to difficulty badges', () => {
			render(<ExerciseGrid {...defaultProps} />)

			const badge = screen.getByText('A1')
			expect(badge).toHaveClass('dark:bg-green-800', 'dark:text-green-100')
		})
	})

	describe('Accessibility', () => {
		it('has proper button types for clear filters', () => {
			render(<ExerciseGrid {...defaultProps} exercises={[]} />)

			const clearButton = screen.getByRole('button', {name: 'Clear filters'})
			expect(clearButton).toHaveAttribute('type', 'button')
		})

		it('has proper link accessibility for action buttons', () => {
			render(<ExerciseGrid {...defaultProps} />)

			const startButton = screen.getByTestId('start-exercise-button')
			const learnButton = screen.getByTestId('learn-exercise-button')

			expect(startButton).toHaveAttribute('href')
			expect(learnButton).toHaveAttribute('href')
			expect(learnButton).toHaveAttribute('title')
		})

		it('has proper SVG accessibility attributes', () => {
			render(<ExerciseGrid {...defaultProps} />)

			const learnButton = screen.getByTestId('learn-exercise-button')
			const svg = learnButton.querySelector('svg')

			expect(svg).toHaveAttribute('aria-hidden', 'true')
		})

		it('uses semantic HTML structure', () => {
			render(<ExerciseGrid {...defaultProps} />)

			// Check for proper heading structure
			expect(screen.getByRole('heading', {level: 3})).toBeInTheDocument()
		})
	})

	describe('Translation integration', () => {
		it('calls translation function with correct keys', () => {
			render(<ExerciseGrid {...defaultProps} />)

			expect(mockT).toHaveBeenCalledWith('exerciseCount')
			expect(mockT).toHaveBeenCalledWith('startExercise')
			expect(mockT).toHaveBeenCalledWith('learn')
			expect(mockT).toHaveBeenCalledWith('ui.hashSymbol')
			expect(mockT).toHaveBeenCalledWith('ui.documentEmoji')
			expect(mockT).toHaveBeenCalledWith('ui.booksEmoji')
		})

		it('handles translation function returning keys when translation missing', () => {
			const fallbackT = vi.fn((key: string) => key)
			const propsWithFallbackT = {...defaultProps, t: fallbackT}

			render(<ExerciseGrid {...propsWithFallbackT} />)

			expect(screen.getByText('startExercise')).toBeInTheDocument()
			// The learn button has no text content, only a title attribute
			const learnButton = screen.getByTestId('learn-exercise-button')
			expect(learnButton).toHaveAttribute('title', 'learn')
		})
	})

	describe('Edge cases', () => {
		it('handles exercises without i18n data gracefully', () => {
			const exerciseWithoutI18n = createMockExercise({})

			render(
				<ExerciseGrid {...defaultProps} exercises={[exerciseWithoutI18n]} />
			)

			expect(screen.getByText('Basic Greek Verbs')).toBeInTheDocument()
			expect(
				screen.getByText('Learn basic Greek verb conjugations')
			).toBeInTheDocument()
		})

		it('handles empty i18n objects gracefully', () => {
			const exerciseWithEmptyI18n = createMockExercise({
				titleI18n: {},
				descriptionI18n: {}
			})

			act(() => {
				useSettingsStore.setState({uiLanguage: 'en'})
			})

			render(
				<ExerciseGrid {...defaultProps} exercises={[exerciseWithEmptyI18n]} />
			)

			expect(screen.getByText('Basic Greek Verbs')).toBeInTheDocument()
			expect(
				screen.getByText('Learn basic Greek verb conjugations')
			).toBeInTheDocument()
		})

		it('handles exercises with zero statistics', () => {
			const exerciseWithZeroStats = createMockExercise({
				totalBlocks: 0,
				totalCases: 0
			})

			render(
				<ExerciseGrid {...defaultProps} exercises={[exerciseWithZeroStats]} />
			)

			const container = screen.getByTestId('exercise-card')
			expect(container.textContent).toContain('📄')
			expect(container.textContent).toContain('cases')
			expect(container.textContent).toContain('0')
			expect(container.textContent).toContain('📚')
			expect(container.textContent).toContain('blocks')
		})

		it('handles very large numbers in statistics', () => {
			const exerciseWithLargeStats = createMockExercise({
				totalBlocks: 999,
				totalCases: 9999
			})

			render(
				<ExerciseGrid {...defaultProps} exercises={[exerciseWithLargeStats]} />
			)

			const container = screen.getByTestId('exercise-card')
			expect(container.textContent).toContain('📄')
			expect(container.textContent).toContain('cases')
			expect(container.textContent).toContain('9999')
			expect(container.textContent).toContain('📚')
			expect(container.textContent).toContain('blocks')
			expect(container.textContent).toContain('999')
		})
	})
})
