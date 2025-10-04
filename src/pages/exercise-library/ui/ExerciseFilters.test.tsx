import {screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {Difficulty} from '@/entities/exercise'
import type {Language} from '@/shared/model'
import {render} from '@/shared/test'
import {exerciseLibraryTranslations} from '../lib/translations'
import {ExerciseFilters} from './ExerciseFilters'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
	motion: {
		div: 'div',
		button: 'button',
		svg: 'svg'
	},
	AnimatePresence: ({children}: {children: React.ReactNode}) => (
		<div>{children}</div>
	)
}))

// Mock translator function
const mockT = vi.fn((key: string) => {
	const translations: Record<string, string> = {
		filters: 'Filters',
		difficulty: 'Difficulty',
		language: 'Language',
		tags: 'Tags',
		all: 'All',
		'difficulty.a0': 'A0',
		'difficulty.a1': 'A1',
		'difficulty.a2': 'A2',
		'difficulty.b1': 'B1',
		'difficulty.b2': 'B2',
		'difficulty.c1': 'C1',
		'difficulty.c2': 'C2',
		'ui.expand': 'Expand',
		'ui.collapse': 'Collapse',
		'ui.hashSymbol': '#',
		'ui.colon': ':',
		'ui.plusSymbol': '+'
	}
	return translations[key] || key
})

const defaultProps = {
	difficultyOptions: ['a1', 'a2', 'b1'] as Difficulty[],
	languageOptions: ['en', 'el', 'ru'] as Language[],
	selectedDifficulties: [] as Difficulty[],
	setSelectedDifficulties: vi.fn(),
	selectedLanguages: [] as Language[],
	setSelectedLanguages: vi.fn(),
	selectedTags: [] as string[],
	setSelectedTags: vi.fn(),
	selectedTypes: [] as import('@/entities/exercise').ExerciseType[],
	setSelectedTypes: vi.fn(),
	tagOptions: ['grammar', 'verbs', 'nouns'],
	typeOptions: [
		'word-form',
		'flashcard',
		'multiple-choice'
	] as import('@/entities/exercise').ExerciseType[],
	t: mockT,
	translations: exerciseLibraryTranslations
}

describe('ExerciseFilters', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Rendering', () => {
		it('renders the main filter container', () => {
			render(<ExerciseFilters {...defaultProps} />)

			expect(screen.getByText('Filters')).toBeInTheDocument()
		})

		it('renders collapse/expand button with correct initial state', () => {
			render(<ExerciseFilters {...defaultProps} />)

			const toggleButton = screen.getByRole('button', {name: /filters/i})
			expect(toggleButton).toHaveAttribute('type', 'button')
		})

		it('shows filter content by default (expanded state)', () => {
			render(<ExerciseFilters {...defaultProps} />)

			expect(screen.getByText('Difficulty')).toBeInTheDocument()
			expect(screen.getByText('Language')).toBeInTheDocument()
			expect(screen.getByText('Tags')).toBeInTheDocument()
		})

		it('displays correct SVG title for expanded state', () => {
			render(<ExerciseFilters {...defaultProps} />)

			const svg = screen.getByTitle('Collapse')
			expect(svg).toBeInTheDocument()
		})
	})

	describe('Collapse/Expand functionality', () => {
		it('toggles collapsed state when button is clicked', async () => {
			const user = userEvent.setup()
			render(<ExerciseFilters {...defaultProps} />)

			const toggleButton = screen.getByRole('button', {name: /filters/i})

			// Initially expanded - should show filter content
			expect(screen.getByText('Difficulty')).toBeInTheDocument()

			// Click to collapse
			await user.click(toggleButton)

			// Should show inline summary instead
			await waitFor(() => {
				expect(screen.getByTitle('Expand')).toBeInTheDocument()
			})
		})

		it('shows FilterSummaryInline when collapsed with selections', async () => {
			const user = userEvent.setup()
			const props = {
				...defaultProps,
				selectedDifficulties: ['a1'] as Difficulty[],
				selectedLanguages: ['en'] as Language[],
				selectedTags: ['grammar']
			}

			render(<ExerciseFilters {...props} />)

			const toggleButton = screen.getByRole('button', {name: /filters/i})
			await user.click(toggleButton)

			await waitFor(() => {
				expect(screen.getByText('A1')).toBeInTheDocument()
				expect(screen.getByText('🇺🇸 English')).toBeInTheDocument()
				expect(screen.getByText('grammar')).toBeInTheDocument()
			})
		})
	})

	describe('DifficultyFilter', () => {
		it('renders all difficulty options', () => {
			render(<ExerciseFilters {...defaultProps} />)

			expect(screen.getByText('A1')).toBeInTheDocument()
			expect(screen.getByText('A2')).toBeInTheDocument()
			expect(screen.getByText('B1')).toBeInTheDocument()
		})

		it('renders "All" button for difficulties', () => {
			render(<ExerciseFilters {...defaultProps} />)

			const allButtons = screen.getAllByRole('button', {name: 'All'})
			expect(allButtons).toHaveLength(2) // One for difficulty, one for language
		})

		it('highlights "All" button when no difficulties are selected', () => {
			render(<ExerciseFilters {...defaultProps} />)

			const allButtons = screen.getAllByRole('button', {name: 'All'})
			expect(allButtons).toHaveLength(2) // One for difficulty, one for language
			expect(allButtons.at(0)).toHaveClass('bg-blue-600', 'text-white')
		})

		it('highlights selected difficulty buttons', () => {
			const props = {
				...defaultProps,
				selectedDifficulties: ['a1'] as Difficulty[]
			}
			render(<ExerciseFilters {...props} />)

			const a1Button = screen.getByRole('button', {name: 'A1'})
			expect(a1Button).toHaveClass('bg-blue-600', 'text-white')
		})

		it('calls setSelectedDifficulties with empty array when "All" is clicked', async () => {
			const user = userEvent.setup()
			const props = {
				...defaultProps,
				selectedDifficulties: ['a1'] as Difficulty[]
			}
			render(<ExerciseFilters {...props} />)

			const allButtons = screen.getAllByRole('button', {name: 'All'})
			expect(allButtons).toHaveLength(2)
			const difficultyAllButton = allButtons.at(0)
			expect(difficultyAllButton).toBeDefined()
			await user.click(difficultyAllButton as HTMLElement)

			expect(props.setSelectedDifficulties).toHaveBeenCalledWith([])
		})

		it('adds difficulty to selection when clicked', async () => {
			const user = userEvent.setup()
			render(<ExerciseFilters {...defaultProps} />)

			const a1Button = screen.getByRole('button', {name: 'A1'})
			await user.click(a1Button)

			expect(defaultProps.setSelectedDifficulties).toHaveBeenCalledWith(['a1'])
		})

		it('removes difficulty from selection when already selected', async () => {
			const user = userEvent.setup()
			const props = {
				...defaultProps,
				selectedDifficulties: ['a1', 'a2'] as Difficulty[]
			}
			render(<ExerciseFilters {...props} />)

			const a1Button = screen.getByRole('button', {name: 'A1'})
			await user.click(a1Button)

			expect(props.setSelectedDifficulties).toHaveBeenCalledWith(['a2'])
		})
	})

	describe('LanguageFilter', () => {
		it('renders all language options with flags and names', () => {
			render(<ExerciseFilters {...defaultProps} />)

			expect(screen.getByText('🇺🇸 English')).toBeInTheDocument()
			expect(screen.getByText('🇬🇷 Ελληνικά')).toBeInTheDocument()
			expect(screen.getByText('🇷🇺 Русский')).toBeInTheDocument()
		})

		it('does not render when languageOptions is empty', () => {
			const props = {
				...defaultProps,
				languageOptions: [] as Language[]
			}
			render(<ExerciseFilters {...props} />)

			expect(screen.queryByText('Language')).not.toBeInTheDocument()
		})

		it('renders "All" button for languages', () => {
			render(<ExerciseFilters {...defaultProps} />)

			// Get all "All" buttons and find the one in the language section
			const allButtons = screen.getAllByRole('button', {name: 'All'})
			expect(allButtons).toHaveLength(2) // One for difficulty, one for language
		})

		it('highlights "All" button when no languages are selected', () => {
			render(<ExerciseFilters {...defaultProps} />)

			const allButtons = screen.getAllByRole('button', {name: 'All'})
			expect(allButtons).toHaveLength(2)
			expect(allButtons.at(1)).toHaveClass('bg-blue-600', 'text-white')
		})

		it('highlights selected language buttons', () => {
			const props = {
				...defaultProps,
				selectedLanguages: ['en'] as Language[]
			}
			render(<ExerciseFilters {...props} />)

			const enButton = screen.getByRole('button', {name: '🇺🇸 English'})
			expect(enButton).toHaveClass('bg-blue-600', 'text-white')
		})

		it('calls setSelectedLanguages with empty array when "All" is clicked', async () => {
			const user = userEvent.setup()
			const props = {
				...defaultProps,
				selectedLanguages: ['en'] as Language[]
			}
			render(<ExerciseFilters {...props} />)

			const allButtons = screen.getAllByRole('button', {name: 'All'})
			expect(allButtons).toHaveLength(2)
			const languageAllButton = allButtons.at(1)
			expect(languageAllButton).toBeDefined()
			await user.click(languageAllButton as HTMLElement)

			expect(props.setSelectedLanguages).toHaveBeenCalledWith([])
		})

		it('adds language to selection when clicked', async () => {
			const user = userEvent.setup()
			render(<ExerciseFilters {...defaultProps} />)

			const enButton = screen.getByRole('button', {name: '🇺🇸 English'})
			await user.click(enButton)

			expect(defaultProps.setSelectedLanguages).toHaveBeenCalledWith(['en'])
		})

		it('removes language from selection when already selected', async () => {
			const user = userEvent.setup()
			const props = {
				...defaultProps,
				selectedLanguages: ['en', 'el'] as Language[]
			}
			render(<ExerciseFilters {...props} />)

			const enButton = screen.getByRole('button', {name: '🇺🇸 English'})
			await user.click(enButton)

			expect(props.setSelectedLanguages).toHaveBeenCalledWith(['el'])
		})

		it('handles unknown languages gracefully', () => {
			const props = {
				...defaultProps,
				languageOptions: ['unknown' as Language]
			}
			render(<ExerciseFilters {...props} />)

			expect(screen.getByText('UNKNOWN')).toBeInTheDocument()
		})
	})

	describe('TagsFilter', () => {
		it('renders all tag options with hash symbols', () => {
			render(<ExerciseFilters {...defaultProps} />)

			expect(screen.getByRole('button', {name: '#grammar'})).toBeInTheDocument()
			expect(screen.getByRole('button', {name: '#verbs'})).toBeInTheDocument()
			expect(screen.getByRole('button', {name: '#nouns'})).toBeInTheDocument()
		})

		it('does not render when allTags is empty', () => {
			const props = {
				...defaultProps,
				tagOptions: []
			}
			render(<ExerciseFilters {...props} />)

			expect(screen.queryByText('Tags')).not.toBeInTheDocument()
		})

		it('highlights selected tag buttons', () => {
			const props = {
				...defaultProps,
				selectedTags: ['grammar']
			}
			render(<ExerciseFilters {...props} />)

			const grammarButton = screen.getByRole('button', {name: '#grammar'})
			expect(grammarButton).toHaveClass('bg-blue-600', 'text-white')
		})

		it('adds tag to selection when clicked', async () => {
			const user = userEvent.setup()
			render(<ExerciseFilters {...defaultProps} />)

			const grammarButton = screen.getByRole('button', {name: '#grammar'})
			await user.click(grammarButton)

			expect(defaultProps.setSelectedTags).toHaveBeenCalledWith(['grammar'])
		})

		it('removes tag from selection when already selected', async () => {
			const user = userEvent.setup()
			const props = {
				...defaultProps,
				selectedTags: ['grammar', 'verbs']
			}
			render(<ExerciseFilters {...props} />)

			const grammarButton = screen.getByRole('button', {name: '#grammar'})
			await user.click(grammarButton)

			expect(props.setSelectedTags).toHaveBeenCalledWith(['verbs'])
		})
	})

	describe('FilterSummaryInline', () => {
		it('shows "All" for empty difficulty selection', async () => {
			const user = userEvent.setup()
			render(<ExerciseFilters {...defaultProps} />)

			const toggleButton = screen.getByRole('button', {name: /filters/i})
			await user.click(toggleButton)

			await waitFor(() => {
				const difficultySection = screen.getByText('Difficulty:').parentElement
				expect(difficultySection).toHaveTextContent('All')
			})
		})

		it('shows "All" for empty language selection', async () => {
			const user = userEvent.setup()
			render(<ExerciseFilters {...defaultProps} />)

			const toggleButton = screen.getByRole('button', {name: /filters/i})
			await user.click(toggleButton)

			await waitFor(() => {
				const languageSection = screen.getByText('Language:').parentElement
				expect(languageSection).toHaveTextContent('All')
			})
		})

		it('shows selected difficulties', async () => {
			const user = userEvent.setup()
			const props = {
				...defaultProps,
				selectedDifficulties: ['a1', 'b1'] as Difficulty[]
			}
			render(<ExerciseFilters {...props} />)

			const toggleButton = screen.getByRole('button', {name: /filters/i})
			await user.click(toggleButton)

			await waitFor(() => {
				expect(screen.getByText('A1')).toBeInTheDocument()
				expect(screen.getByText('B1')).toBeInTheDocument()
			})
		})

		it('shows selected languages with flags', async () => {
			const user = userEvent.setup()
			const props = {
				...defaultProps,
				selectedLanguages: ['en', 'ru'] as Language[]
			}
			render(<ExerciseFilters {...props} />)

			const toggleButton = screen.getByRole('button', {name: /filters/i})
			await user.click(toggleButton)

			await waitFor(() => {
				expect(screen.getByText('🇺🇸 English')).toBeInTheDocument()
				expect(screen.getByText('🇷🇺 Русский')).toBeInTheDocument()
			})
		})

		it('shows first 3 tags and overflow count', async () => {
			const user = userEvent.setup()
			const props = {
				...defaultProps,
				selectedTags: ['grammar', 'verbs', 'nouns', 'adjectives', 'pronouns']
			}
			render(<ExerciseFilters {...props} />)

			const toggleButton = screen.getByRole('button', {name: /filters/i})
			await user.click(toggleButton)

			await waitFor(() => {
				expect(screen.getByText('grammar')).toBeInTheDocument()
				expect(screen.getByText('verbs')).toBeInTheDocument()
				expect(screen.getByText('nouns')).toBeInTheDocument()
				expect(screen.getByText('+2')).toBeInTheDocument()
				expect(screen.queryByText('adjectives')).not.toBeInTheDocument()
			})
		})

		it('does not show tags section when no tags are selected', async () => {
			const user = userEvent.setup()
			render(<ExerciseFilters {...defaultProps} />)

			const toggleButton = screen.getByRole('button', {name: /filters/i})
			await user.click(toggleButton)

			await waitFor(() => {
				const tagsLabel = screen.queryByText('Tags:')
				expect(tagsLabel).not.toBeInTheDocument()
			})
		})
	})

	describe('Accessibility', () => {
		it('has proper button types for all interactive elements', () => {
			render(<ExerciseFilters {...defaultProps} />)

			const buttons = screen.getAllByRole('button')
			for (const button of buttons) {
				expect(button).toHaveAttribute('type', 'button')
			}
		})

		it('has proper SVG title for screen readers', () => {
			render(<ExerciseFilters {...defaultProps} />)

			const svg = screen.getByTitle('Collapse')
			expect(svg).toBeInTheDocument()
		})

		it('maintains focus order when toggling filters', async () => {
			const user = userEvent.setup()
			render(<ExerciseFilters {...defaultProps} />)

			const toggleButton = screen.getByRole('button', {name: /filters/i})

			await user.click(toggleButton)

			// Toggle button should still be focusable
			expect(toggleButton).toBeInTheDocument()
		})
	})

	describe('Prop validation', () => {
		it('handles empty arrays for all options', () => {
			const props = {
				...defaultProps,
				difficultyOptions: [] as Difficulty[],
				languageOptions: [] as Language[],
				tagOptions: []
			}
			render(<ExerciseFilters {...props} />)

			expect(screen.getByText('Filters')).toBeInTheDocument()
			expect(screen.getByText('Difficulty')).toBeInTheDocument()
			expect(screen.queryByText('Language')).not.toBeInTheDocument()
			expect(screen.queryByText('Tags')).not.toBeInTheDocument()
		})

		it('handles multiple selections correctly', () => {
			const props = {
				...defaultProps,
				selectedDifficulties: ['a1', 'a2'] as Difficulty[],
				selectedLanguages: ['en', 'el'] as Language[],
				selectedTags: ['grammar', 'verbs']
			}
			render(<ExerciseFilters {...props} />)

			// Difficulty buttons
			const a1Button = screen.getByRole('button', {name: 'A1'})
			const a2Button = screen.getByRole('button', {name: 'A2'})
			expect(a1Button).toHaveClass('bg-blue-600', 'text-white')
			expect(a2Button).toHaveClass('bg-blue-600', 'text-white')

			// Language buttons
			const enButton = screen.getByRole('button', {name: '🇺🇸 English'})
			const elButton = screen.getByRole('button', {name: '🇬🇷 Ελληνικά'})
			expect(enButton).toHaveClass('bg-blue-600', 'text-white')
			expect(elButton).toHaveClass('bg-blue-600', 'text-white')

			// Tag buttons
			const grammarButton = screen.getByRole('button', {name: '#grammar'})
			const verbsButton = screen.getByRole('button', {name: '#verbs'})
			expect(grammarButton).toHaveClass('bg-blue-600', 'text-white')
			expect(verbsButton).toHaveClass('bg-blue-600', 'text-white')
		})
	})

	describe('Translation integration', () => {
		it('calls translation function with correct keys', () => {
			render(<ExerciseFilters {...defaultProps} />)

			expect(mockT).toHaveBeenCalledWith('filters')
			expect(mockT).toHaveBeenCalledWith('difficulty')
			expect(mockT).toHaveBeenCalledWith('language')
			expect(mockT).toHaveBeenCalledWith('tags')
			expect(mockT).toHaveBeenCalledWith('all')
			expect(mockT).toHaveBeenCalledWith('difficulty.a1')
			expect(mockT).toHaveBeenCalledWith('difficulty.a2')
			expect(mockT).toHaveBeenCalledWith('difficulty.b1')
			expect(mockT).toHaveBeenCalledWith('ui.hashSymbol')
		})

		it('handles translation function returning keys when translation missing', () => {
			const fallbackT = vi.fn((key: string) => key)
			const props = {
				...defaultProps,
				t: fallbackT
			}
			render(<ExerciseFilters {...props} />)

			expect(screen.getByText('filters')).toBeInTheDocument()
			expect(screen.getByText('difficulty')).toBeInTheDocument()
		})
	})
})
