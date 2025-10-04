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
		frontHintI18n: {en: 'water', ru: 'вода'},
		back: 'το νερό (neuter)',
		backHintI18n: {en: 'the water', ru: 'вода'}
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

		expect(screen.getByText('το νερό (neuter)')).toBeInTheDocument()
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

	it('renders card without hints', () => {
		const cardWithoutHints: FlashCard = {
			id: 'test-card-2',
			front: 'η μέρα',
			back: 'η μέρα (feminine)'
		}

		render(
			<FlashcardView
				card={cardWithoutHints}
				isFlipped={false}
				onFlip={vi.fn()}
			/>,
			{wrapper: createWrapper()}
		)

		expect(screen.getByText('η μέρα')).toBeInTheDocument()
	})

	it('renders additional hint on back side', () => {
		const cardWithAdditionalHint: FlashCard = {
			id: 'test-card-3',
			front: 'ο φίλος',
			back: 'ο φίλος (masculine)',
			additionalHint: 'Masculine gender'
		}

		render(
			<FlashcardView
				card={cardWithAdditionalHint}
				isFlipped={true}
				onFlip={vi.fn()}
			/>,
			{wrapper: createWrapper()}
		)

		expect(screen.getByText('Masculine gender')).toBeInTheDocument()
	})

	it('renders additional hint with i18n', () => {
		const cardWithI18nHint: FlashCard = {
			id: 'test-card-4',
			front: 'ο φίλος',
			back: 'ο φίλος (masculine)',
			additionalHint: 'Masculine gender',
			additionalHintI18n: {
				en: 'Masculine gender',
				ru: 'Мужской род'
			}
		}

		render(
			<FlashcardView
				card={cardWithI18nHint}
				isFlipped={true}
				onFlip={vi.fn()}
			/>,
			{wrapper: createWrapper()}
		)

		expect(screen.getByText('Masculine gender')).toBeInTheDocument()
	})

	it('does not render additional hint on front side', () => {
		const cardWithAdditionalHint: FlashCard = {
			id: 'test-card-5',
			front: 'ο φίλος',
			back: 'ο φίλος (masculine)',
			additionalHint: 'Should not appear'
		}

		render(
			<FlashcardView
				card={cardWithAdditionalHint}
				isFlipped={false}
				onFlip={vi.fn()}
			/>,
			{wrapper: createWrapper()}
		)

		// Additional hint exists in DOM (back side) but should not be visible on front
		// It's in the flipped card which has rotateY(180deg)
		const hint = screen.getByText('Should not appear')
		expect(hint).toBeInTheDocument()
		// The hint's parent container should have the transform rotateY(180deg)
		expect(hint.parentElement?.parentElement?.parentElement).toHaveStyle({
			transform: 'rotateY(180deg)'
		})
	})

	it('applies correct styling to front and back', () => {
		const Wrapper = createWrapper()
		const {rerender} = render(
			<FlashcardView card={mockCard} isFlipped={false} onFlip={vi.fn()} />,
			{wrapper: Wrapper}
		)

		// Check front styling classes (classes are on HintSystem parent element)
		const frontText = screen.getByText('το νερό')
		// Navigate up to find the element with styling classes
		const frontContainer = frontText.closest('.font-bold')
		expect(frontContainer).toHaveClass('text-3xl')
		expect(frontContainer).toHaveClass('font-bold')

		// Flip the card
		rerender(
			<Wrapper>
				<FlashcardView card={mockCard} isFlipped={true} onFlip={vi.fn()} />
			</Wrapper>
		)

		// Check back styling classes (classes are on HintSystem parent element)
		const backText = screen.getByText('το νερό (neuter)')
		const backContainer = backText.closest('.font-semibold')
		expect(backContainer).toHaveClass('text-2xl')
		expect(backContainer).toHaveClass('font-semibold')
	})
})
