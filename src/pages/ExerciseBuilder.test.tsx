import type React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@/test-utils'
import {ExerciseBuilder} from './ExerciseBuilder'

// Mock dependencies
vi.mock('@/hooks/useTranslations', () => ({
	useTranslations: vi.fn(() => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				exerciseBuilder: 'Exercise Builder',
				exerciseBuilderDesc: 'Create custom Greek learning exercises',
				'ui.toolsEmoji': '🛠️',
				'ui.comingSoon': 'Coming Soon',
				comingSoonMessage: 'This feature is coming soon'
			}
			return translations[key] || key
		}
	}))
}))

vi.mock('@/components/Head', () => ({
	Head: ({title}: {title: string}) => (
		<div data-testid='head' data-title={title} />
	)
}))

type MockMotionDivProps = {
	children: React.ReactNode
	className?: string
} & Record<string, unknown>

vi.mock('framer-motion', () => ({
	motion: {
		div: ({children, className, ...props}: MockMotionDivProps) => (
			<div className={className} {...props}>
				{children}
			</div>
		)
	}
}))

describe('ExerciseBuilder', () => {
	it('renders the page title and description', () => {
		render(<ExerciseBuilder />)

		expect(
			screen.getByRole('heading', {name: 'Exercise Builder'})
		).toBeInTheDocument()
		expect(
			screen.getByText('Create custom Greek learning exercises')
		).toBeInTheDocument()
	})

	it('sets the correct page title', () => {
		render(<ExerciseBuilder />)

		const head = screen.getByTestId('head')
		expect(head).toHaveAttribute('data-title', 'Exercise Builder')
	})

	it('displays the tools emoji', () => {
		render(<ExerciseBuilder />)

		expect(screen.getByText('🛠️')).toBeInTheDocument()
	})

	it('shows coming soon message', () => {
		render(<ExerciseBuilder />)

		expect(screen.getByText('comingSoon')).toBeInTheDocument()
	})

	it('has a link back to home', () => {
		render(<ExerciseBuilder />)

		const homeLink = screen.getByRole('link')
		expect(homeLink).toBeInTheDocument()
		expect(homeLink).toHaveAttribute('href', '/')
		expect(homeLink).toHaveTextContent('ui.backToHome')
	})

	it('applies correct styling classes', () => {
		render(<ExerciseBuilder />)

		// Check main container has correct classes
		const mainContainer = screen.getByRole('heading').closest('div')
		expect(mainContainer).toHaveClass('text-center')
	})

	it('renders without errors', () => {
		expect(() => render(<ExerciseBuilder />)).not.toThrow()
	})
})
