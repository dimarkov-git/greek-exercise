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
	it('renders all four rating buttons', () => {
		render(<FlashcardRating onRate={vi.fn()} />, {wrapper: createWrapper()})

		expect(screen.getByRole('button', {name: /again/i})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: /hard/i})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: /good/i})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: /easy/i})).toBeInTheDocument()
	})

	it('displays quality rating prompt', () => {
		render(<FlashcardRating onRate={vi.fn()} />, {wrapper: createWrapper()})

		// Translation key will be displayed literally in tests
		expect(screen.getByText(/flashcard\.rateQuality/i)).toBeInTheDocument()
	})

	it('calls onRate with quality 1 when Again is clicked', async () => {
		const user = userEvent.setup()
		const onRate = vi.fn()

		render(<FlashcardRating onRate={onRate} />, {wrapper: createWrapper()})

		await user.click(screen.getByRole('button', {name: /again/i}))

		expect(onRate).toHaveBeenCalledWith(1 as QualityRating)
		expect(onRate).toHaveBeenCalledOnce()
	})

	it('calls onRate with quality 2 when Hard is clicked', async () => {
		const user = userEvent.setup()
		const onRate = vi.fn()

		render(<FlashcardRating onRate={onRate} />, {wrapper: createWrapper()})

		await user.click(screen.getByRole('button', {name: /hard/i}))

		expect(onRate).toHaveBeenCalledWith(2 as QualityRating)
	})

	it('calls onRate with quality 3 when Good is clicked', async () => {
		const user = userEvent.setup()
		const onRate = vi.fn()

		render(<FlashcardRating onRate={onRate} />, {wrapper: createWrapper()})

		await user.click(screen.getByRole('button', {name: /good/i}))

		expect(onRate).toHaveBeenCalledWith(3 as QualityRating)
	})

	it('calls onRate with quality 4 when Easy is clicked', async () => {
		const user = userEvent.setup()
		const onRate = vi.fn()

		render(<FlashcardRating onRate={onRate} />, {wrapper: createWrapper()})

		await user.click(screen.getByRole('button', {name: /easy/i}))

		expect(onRate).toHaveBeenCalledWith(4 as QualityRating)
	})

	it('disables all buttons when disabled prop is true', () => {
		render(<FlashcardRating disabled={true} onRate={vi.fn()} />, {
			wrapper: createWrapper()
		})

		const againButton = screen.getByRole('button', {name: /again/i})
		const hardButton = screen.getByRole('button', {name: /hard/i})
		const goodButton = screen.getByRole('button', {name: /good/i})
		const easyButton = screen.getByRole('button', {name: /easy/i})

		expect(againButton).toBeDisabled()
		expect(hardButton).toBeDisabled()
		expect(goodButton).toBeDisabled()
		expect(easyButton).toBeDisabled()
	})

	it('does not call onRate when disabled button is clicked', async () => {
		const user = userEvent.setup()
		const onRate = vi.fn()

		render(<FlashcardRating disabled={true} onRate={onRate} />, {
			wrapper: createWrapper()
		})

		await user.click(screen.getByRole('button', {name: /good/i}))

		expect(onRate).not.toHaveBeenCalled()
	})

	it('applies correct color classes to buttons', () => {
		render(<FlashcardRating onRate={vi.fn()} />, {wrapper: createWrapper()})

		const againButton = screen.getByRole('button', {name: /again/i})
		const hardButton = screen.getByRole('button', {name: /hard/i})
		const goodButton = screen.getByRole('button', {name: /good/i})
		const easyButton = screen.getByRole('button', {name: /easy/i})

		expect(againButton).toHaveClass('bg-red-600')
		expect(hardButton).toHaveClass('bg-orange-600')
		expect(goodButton).toHaveClass('bg-green-600')
		expect(easyButton).toHaveClass('bg-blue-600')
	})

	it('renders in grid layout', () => {
		const {container} = render(<FlashcardRating onRate={vi.fn()} />, {
			wrapper: createWrapper()
		})

		const grid = container.querySelector('.grid')
		expect(grid).toBeInTheDocument()
		expect(grid).toHaveClass('grid-cols-2')
		expect(grid).toHaveClass('sm:grid-cols-4')
	})
})
