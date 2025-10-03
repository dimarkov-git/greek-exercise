/**
 * FlashcardRating component tests
 */

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {ReactNode} from 'react'
import {describe, expect, it, vi} from 'vitest'
import type {QualityRating} from '@/entities/exercise'
import {FlashcardRating} from './FlashcardRating'

describe('FlashcardRating', () => {
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
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			)
		}
	}

	it('renders two rating buttons', () => {
		render(<FlashcardRating onRate={vi.fn()} />, {wrapper: createWrapper()})

		expect(
			screen.getByRole('button', {name: /mark as don't know/i})
		).toBeInTheDocument()
		expect(
			screen.getByRole('button', {name: /mark as know/i})
		).toBeInTheDocument()
	})

	it('displays quality rating prompt', () => {
		render(<FlashcardRating onRate={vi.fn()} />, {wrapper: createWrapper()})

		// Translation key will be displayed literally in tests
		expect(screen.getByText(/flashcard\.rateQuality/i)).toBeInTheDocument()
	})

	it("calls onRate with quality 2 when Don't Know is clicked", async () => {
		const user = userEvent.setup()
		const onRate = vi.fn()

		render(<FlashcardRating onRate={onRate} />, {wrapper: createWrapper()})

		await user.click(screen.getByRole('button', {name: /don't know/i}))

		expect(onRate).toHaveBeenCalledWith(2 as QualityRating)
		expect(onRate).toHaveBeenCalledOnce()
	})

	it('calls onRate with quality 4 when Know is clicked', async () => {
		const user = userEvent.setup()
		const onRate = vi.fn()

		render(<FlashcardRating onRate={onRate} />, {wrapper: createWrapper()})

		await user.click(screen.getByRole('button', {name: /mark as know/i}))

		expect(onRate).toHaveBeenCalledWith(4 as QualityRating)
		expect(onRate).toHaveBeenCalledOnce()
	})

	it('disables all buttons when disabled prop is true', () => {
		render(<FlashcardRating disabled={true} onRate={vi.fn()} />, {
			wrapper: createWrapper()
		})

		const dontKnowButton = screen.getByRole('button', {
			name: /mark as don't know/i
		})
		const knowButton = screen.getByRole('button', {name: /mark as know/i})

		expect(dontKnowButton).toBeDisabled()
		expect(knowButton).toBeDisabled()
	})

	it('does not call onRate when disabled button is clicked', async () => {
		const user = userEvent.setup()
		const onRate = vi.fn()

		render(<FlashcardRating disabled={true} onRate={onRate} />, {
			wrapper: createWrapper()
		})

		await user.click(screen.getByRole('button', {name: /mark as know/i}))

		expect(onRate).not.toHaveBeenCalled()
	})

	it('applies correct color classes to buttons', () => {
		render(<FlashcardRating onRate={vi.fn()} />, {wrapper: createWrapper()})

		const dontKnowButton = screen.getByRole('button', {
			name: /mark as don't know/i
		})
		const knowButton = screen.getByRole('button', {name: /mark as know/i})

		expect(dontKnowButton).toHaveClass('bg-orange-600')
		expect(knowButton).toHaveClass('bg-green-600')
	})

	it('renders in grid layout with 2 columns', () => {
		const {container} = render(<FlashcardRating onRate={vi.fn()} />, {
			wrapper: createWrapper()
		})

		const grid = container.querySelector('.grid')
		expect(grid).toBeInTheDocument()
		expect(grid).toHaveClass('grid-cols-2')
	})

	it('is hidden on mobile (has md:block class)', () => {
		const {container} = render(<FlashcardRating onRate={vi.fn()} />, {
			wrapper: createWrapper()
		})

		const ratingDiv = container.querySelector('.md\\:block')
		expect(ratingDiv).toBeInTheDocument()
		expect(ratingDiv).toHaveClass('hidden')
	})
})
