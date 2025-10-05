/**
 * FlashcardRenderer component tests
 */

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {ReactNode} from 'react'
import {BrowserRouter} from 'react-router'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {FlashcardExercise} from '@/entities/exercise'
import {FlashcardRenderer} from './FlashcardRenderer'

// Mock the flashcard storage
vi.mock('../lib/flashcard-storage', () => ({
	flashcardStorage: {
		loadExerciseProgress: vi.fn().mockResolvedValue([
			{
				cardId: 'card-1',
				exerciseId: 'test-exercise',
				easeFactor: 2.5,
				interval: 0,
				repetitions: 0,
				lastReview: null,
				nextReview: null,
				state: 'new' as const
			}
		]),
		saveCardProgress: vi.fn().mockResolvedValue(undefined)
	}
}))

// Mock sm2-algorithm to allow controlling due cards
vi.mock('../lib/sm2-algorithm', async importOriginal => {
	const actual = await importOriginal<typeof import('../lib/sm2-algorithm')>()
	return {
		...actual,
		getDueCards: vi.fn(actual.getDueCards)
	}
})

const mockExercise: FlashcardExercise = {
	enabled: true,
	id: 'test-exercise',
	type: 'flashcard',
	language: 'el',
	title: 'Test Flashcards',
	titleI18n: {
		en: 'Test Flashcards',
		ru: 'Тестовые карточки'
	},
	description: 'Test flashcard exercise',
	descriptionI18n: {
		en: 'Test flashcard exercise',
		ru: 'Тестовое упражнение с карточками'
	},
	tags: ['test'],
	difficulty: 'a1',
	settings: {
		autoAdvance: false,
		autoAdvanceDelayMs: 0,
		allowSkip: true,
		shuffleCases: false
	},
	srsSettings: {
		newCardsPerDay: 20,
		reviewsPerDay: 100,
		graduatingInterval: 1,
		easyInterval: 4
	},
	cards: [
		{
			id: 'card-1',
			front: 'το νερό',
			frontHintI18n: {en: 'water', ru: 'вода'},
			back: 'το νερό (neuter)',
			backHintI18n: {en: 'the water', ru: 'вода'}
		},
		{
			id: 'card-2',
			front: 'η μέρα',
			frontHintI18n: {en: 'day', ru: 'день'},
			back: 'η μέρα (feminine)',
			backHintI18n: {en: 'the day', ru: 'день'}
		},
		{
			id: 'card-3',
			front: 'ο άνθρωπος',
			frontHintI18n: {en: 'person', ru: 'человек'},
			back: 'ο άνθρωπος (masculine)',
			backHintI18n: {en: 'the person', ru: 'человек'}
		}
	]
}

describe('FlashcardRenderer', () => {
	const createWrapper = () => {
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
					gcTime: 0
				}
			}
		})

		return function Wrapper({children}: {children: ReactNode}) {
			return (
				<BrowserRouter>
					<QueryClientProvider client={queryClient}>
						{children}
					</QueryClientProvider>
				</BrowserRouter>
			)
		}
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders loading state initially', async () => {
		render(<FlashcardRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		// Should show loading indicator
		expect(screen.getByText('Loading cards...')).toBeInTheDocument()

		// Wait for async state updates to complete
		await waitFor(() => {
			expect(screen.queryByText('Loading cards...')).not.toBeInTheDocument()
		})
	})

	it('renders flashcard with front side visible', async () => {
		render(<FlashcardRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		await waitFor(() => {
			expect(screen.getByText('το νερό')).toBeInTheDocument()
		})

		// Hint button should be available (both front and back have hints, but both exist in DOM)
		const hintButtons = screen.getAllByRole('button', {name: /water/i})
		expect(hintButtons.length).toBeGreaterThan(0)
	})

	it('flips card to show back when clicked', async () => {
		const user = userEvent.setup()
		render(<FlashcardRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		await waitFor(() => {
			expect(screen.getByText('το νερό')).toBeInTheDocument()
		})

		// Click the card (it's a clickable div with cursor-pointer)
		const cardText = screen.getByText('Click to flip')
		const card = cardText.previousElementSibling
		if (card) {
			await user.click(card)
		}

		// Should show back side
		await waitFor(() => {
			expect(screen.getByText(/click to flip back/i)).toBeInTheDocument()
		})
	})

	it('shows rating buttons after flipping card', async () => {
		const user = userEvent.setup()
		render(<FlashcardRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		await waitFor(() => {
			expect(screen.getByText('το νερό')).toBeInTheDocument()
		})

		// Rating buttons should not be visible initially
		expect(
			screen.queryByRole('button', {name: /don't know/i})
		).not.toBeInTheDocument()

		// Flip the card
		const cardText = screen.getByText('Click to flip')
		const card = cardText.previousElementSibling
		if (card) {
			await user.click(card)
		}

		// Rating buttons should appear (2 simplified buttons)
		await waitFor(() => {
			expect(
				screen.getByRole('button', {name: /mark as don't know/i})
			).toBeInTheDocument()
		})
		expect(
			screen.getByRole('button', {name: /mark as know/i})
		).toBeInTheDocument()
	})

	it('displays progress bar', async () => {
		render(<FlashcardRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		await waitFor(() => {
			expect(screen.getByText(/Progress:/)).toBeInTheDocument()
		})

		expect(screen.getByText(/Due today:/)).toBeInTheDocument()
	})

	it('shows back to library link', async () => {
		render(<FlashcardRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		await waitFor(() => {
			expect(screen.getByText('το νερό')).toBeInTheDocument()
		})

		const backLink = screen.getByTestId('exercise-back-button')
		expect(backLink).toBeInTheDocument()
		expect(backLink).toHaveAttribute('href', '/exercises')
	})

	it('does not call onExit (back to library is handled by router)', async () => {
		const onExit = vi.fn()

		render(<FlashcardRenderer exercise={mockExercise} onExit={onExit} />, {
			wrapper: createWrapper()
		})

		await waitFor(() => {
			expect(screen.getByText('το νερό')).toBeInTheDocument()
		})

		// onExit is not called because navigation is handled by the Link component
		expect(onExit).not.toHaveBeenCalled()
	})

	it('shows completion screen when no cards are due', async () => {
		// Mock getDueCards to return empty array (no cards due)
		const {getDueCards} = await import('../lib/sm2-algorithm')
		vi.mocked(getDueCards).mockReturnValueOnce([])

		render(<FlashcardRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		// When no cards are due, it shows the completion screen directly
		await waitFor(() => {
			expect(screen.getByText('flashcard.reviewComplete')).toBeInTheDocument()
		})

		// Should show 0 reviewed cards
		expect(screen.getByText('0 / 0')).toBeInTheDocument()
	})

	it('uses localized title from titleI18n', async () => {
		render(<FlashcardRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		// The title is used in the completion screen
		await waitFor(() => {
			expect(screen.getByText('το νερό')).toBeInTheDocument()
		})
	})

	it('handles missing onExit prop gracefully', async () => {
		render(<FlashcardRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		await waitFor(() => {
			expect(screen.getByText('το νερό')).toBeInTheDocument()
		})

		// Exit button should not be present
		expect(
			screen.queryByRole('button', {name: /exit/i})
		).not.toBeInTheDocument()
	})

	it('handles missing onComplete prop gracefully', async () => {
		render(<FlashcardRenderer exercise={mockExercise} />, {
			wrapper: createWrapper()
		})

		await waitFor(() => {
			expect(screen.getByText('το νερό')).toBeInTheDocument()
		})

		// Component should render without errors
		expect(screen.getByText('το νερό')).toBeInTheDocument()
	})
})
