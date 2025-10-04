/**
 * CompletionScreen component tests
 */

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {ReactNode} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {CompletionScreen} from './CompletionScreen'

describe('CompletionScreen', () => {
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
	const defaultProps = {
		exerciseTitle: 'Test Flashcards',
		reviewedCards: 10,
		correctCards: 8,
		totalCards: 12,
		averageQuality: 3.5,
		onRestart: vi.fn(),
		onExit: vi.fn()
	}

	it('renders completion title and exercise title', () => {
		render(<CompletionScreen {...defaultProps} />, {wrapper: createWrapper()})

		expect(screen.getByText(/flashcard\.reviewComplete/i)).toBeInTheDocument()
		expect(screen.getByText('Test Flashcards')).toBeInTheDocument()
	})

	it('displays reviewed cards statistics', () => {
		render(<CompletionScreen {...defaultProps} />, {wrapper: createWrapper()})

		expect(screen.getByText(/flashcard\.reviewedCards/i)).toBeInTheDocument()
		expect(screen.getByText('10 / 12')).toBeInTheDocument()
	})

	it('calculates and displays accuracy correctly', () => {
		render(<CompletionScreen {...defaultProps} />, {wrapper: createWrapper()})

		expect(screen.getByText(/flashcard\.accuracy/i)).toBeInTheDocument()
		// 8/10 = 80%
		expect(screen.getByText('80%')).toBeInTheDocument()
	})

	it('displays average quality rating', () => {
		render(<CompletionScreen {...defaultProps} />, {wrapper: createWrapper()})

		expect(screen.getByText(/flashcard\.averageQuality/i)).toBeInTheDocument()
		expect(screen.getByText('3.5 / 5')).toBeInTheDocument()
	})

	it('handles zero reviewed cards without errors', () => {
		const props = {
			...defaultProps,
			reviewedCards: 0,
			correctCards: 0
		}

		render(<CompletionScreen {...props} />, {wrapper: createWrapper()})

		// Should show 0% accuracy
		expect(screen.getByText('0%')).toBeInTheDocument()
	})

	it('rounds average quality to one decimal place', () => {
		const props = {
			...defaultProps,
			averageQuality: 3.456_789
		}

		render(<CompletionScreen {...props} />, {wrapper: createWrapper()})

		expect(screen.getByText('3.5 / 5')).toBeInTheDocument()
	})

	it('calls onRestart when review again button is clicked', async () => {
		const user = userEvent.setup()
		const onRestart = vi.fn()

		render(<CompletionScreen {...defaultProps} onRestart={onRestart} />, {
			wrapper: createWrapper()
		})

		await user.click(
			screen.getByRole('button', {name: /flashcard\.reviewAgain/i})
		)

		expect(onRestart).toHaveBeenCalledOnce()
	})

	it('calls onExit when back to library button is clicked', async () => {
		const user = userEvent.setup()
		const onExit = vi.fn()

		render(<CompletionScreen {...defaultProps} onExit={onExit} />, {
			wrapper: createWrapper()
		})

		await user.click(
			screen.getByRole('button', {name: /common\.backToLibrary/i})
		)

		expect(onExit).toHaveBeenCalledOnce()
	})

	it('does not render exit button when onExit is undefined', () => {
		const {onExit: _onExit, ...propsWithoutExit} = defaultProps

		render(<CompletionScreen {...propsWithoutExit} onExit={undefined} />, {
			wrapper: createWrapper()
		})

		expect(
			screen.queryByRole('button', {name: /common\.backToLibrary/i})
		).not.toBeInTheDocument()
	})

	it('always renders restart button', () => {
		render(<CompletionScreen {...defaultProps} />, {wrapper: createWrapper()})

		expect(
			screen.getByRole('button', {name: /flashcard\.reviewAgain/i})
		).toBeInTheDocument()
	})

	it('displays success icon', () => {
		render(<CompletionScreen {...defaultProps} />, {wrapper: createWrapper()})

		expect(screen.getByText('✓')).toBeInTheDocument()
	})

	it('handles 100% accuracy correctly', () => {
		const props = {
			...defaultProps,
			reviewedCards: 10,
			correctCards: 10
		}

		render(<CompletionScreen {...props} />, {wrapper: createWrapper()})

		expect(screen.getByText('100%')).toBeInTheDocument()
	})

	it('handles 0% accuracy correctly', () => {
		const props = {
			...defaultProps,
			reviewedCards: 10,
			correctCards: 0
		}

		render(<CompletionScreen {...props} />, {wrapper: createWrapper()})

		expect(screen.getByText('0%')).toBeInTheDocument()
	})

	it('displays partial progress when not all cards reviewed', () => {
		const props = {
			...defaultProps,
			reviewedCards: 5,
			totalCards: 20
		}

		render(<CompletionScreen {...props} />, {wrapper: createWrapper()})

		expect(screen.getByText('5 / 20')).toBeInTheDocument()
	})
})
