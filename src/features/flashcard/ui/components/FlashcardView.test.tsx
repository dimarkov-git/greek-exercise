/**
 * FlashcardView component tests
 */

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {ReactNode} from 'react'
import {describe, expect, it, vi} from 'vitest'
import type {FlashCard} from '@/entities/exercise'
import {FlashcardView} from './FlashcardView'

describe('FlashcardView', () => {
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
	const mockCard: FlashCard = {
		id: 'test-card',
		front: 'το νερό',
		backHintI18n: {en: 'water', ru: 'вода'}
	}

	it('renders front side by default', () => {
		render(
			<FlashcardView card={mockCard} isFlipped={false} onFlip={vi.fn()} />,
			{wrapper: createWrapper()}
		)

		expect(screen.getByText('το νερό')).toBeInTheDocument()
		expect(screen.getByText('Click to flip')).toBeInTheDocument()
	})

	it('renders back side when flipped', () => {
		render(
			<FlashcardView card={mockCard} isFlipped={true} onFlip={vi.fn()} />,
			{
				wrapper: createWrapper()
			}
		)

		expect(screen.getByText('water')).toBeInTheDocument()
		// Text changes based on onRate prop
		expect(screen.getByText(/click to flip back/i)).toBeInTheDocument()
	})

	it('calls onFlip when card is clicked', async () => {
		const user = userEvent.setup()
		const onFlip = vi.fn()

		render(
			<FlashcardView card={mockCard} isFlipped={false} onFlip={onFlip} />,
			{
				wrapper: createWrapper()
			}
		)

		const card = screen.getByText('το νερό').closest('div')
		if (card?.parentElement) {
			await user.click(card.parentElement)
		}

		expect(onFlip).toHaveBeenCalledOnce()
	})

	it('applies correct styling to front and back', () => {
		const Wrapper = createWrapper()
		const {rerender} = render(
			<FlashcardView card={mockCard} isFlipped={false} onFlip={vi.fn()} />,
			{wrapper: Wrapper}
		)

		// Check front styling classes
		const frontText = screen.getByText('το νερό')
		expect(frontText).toHaveClass('text-3xl')
		expect(frontText).toHaveClass('font-bold')

		// Flip the card
		rerender(
			<Wrapper>
				<FlashcardView card={mockCard} isFlipped={true} onFlip={vi.fn()} />
			</Wrapper>
		)

		// Check back styling classes
		const backText = screen.getByText('water')
		expect(backText).toHaveClass('text-2xl')
		expect(backText).toHaveClass('font-semibold')
	})
})
