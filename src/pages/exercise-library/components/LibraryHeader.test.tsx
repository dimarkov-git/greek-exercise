import {screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {render} from '@/shared/lib'
import {exerciseLibraryTranslations} from '../translations'
import {LibraryHeader} from './LibraryHeader'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
	motion: {
		div: 'div'
	}
}))

// Mock translator function
const mockT = vi.fn((key: string) => {
	const translations: Record<string, string> = {
		exerciseLibrary: 'Exercise Library',
		exerciseLibraryDesc:
			'Practice Greek with interactive exercises tailored to your level'
	}
	return translations[key] || key
})

describe('LibraryHeader', () => {
	describe('Rendering', () => {
		it('renders the main heading', () => {
			render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const heading = screen.getByRole('heading', {level: 1})
			expect(heading).toBeInTheDocument()
			expect(heading).toHaveTextContent('Exercise Library')
		})

		it('renders the description text', () => {
			render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const description = screen.getByText(
				'Practice Greek with interactive exercises tailored to your level'
			)
			expect(description).toBeInTheDocument()
		})

		it('has proper semantic structure with h1 and p elements', () => {
			render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const heading = screen.getByRole('heading', {level: 1})
			const description = screen.getByText(
				'Practice Greek with interactive exercises tailored to your level'
			)

			expect(heading.tagName).toBe('H1')
			expect(description.tagName).toBe('P')
		})

		it('renders with correct container structure', () => {
			const {container} = render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const outerDiv = container.firstChild as HTMLElement
			expect(outerDiv).toHaveClass('mb-12', 'text-center')
		})
	})

	describe('Styling', () => {
		it('applies correct CSS classes to heading', () => {
			render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const heading = screen.getByRole('heading', {level: 1})
			expect(heading).toHaveClass(
				'mb-4',
				'font-bold',
				'text-4xl',
				'text-gray-900',
				'dark:text-white'
			)
		})

		it('applies correct CSS classes to description', () => {
			render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const description = screen.getByText(
				'Practice Greek with interactive exercises tailored to your level'
			)
			expect(description).toHaveClass(
				'text-gray-600',
				'text-xl',
				'dark:text-gray-400'
			)
		})

		it('centers content with text-center class', () => {
			const {container} = render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const outerDiv = container.firstChild as HTMLElement
			expect(outerDiv).toHaveClass('text-center')
		})

		it('applies proper spacing with margin bottom', () => {
			const {container} = render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const outerDiv = container.firstChild as HTMLElement
			expect(outerDiv).toHaveClass('mb-12')
		})
	})

	describe('Translation integration', () => {
		it('calls translation function with correct keys', () => {
			render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			expect(mockT).toHaveBeenCalledWith('exerciseLibrary')
			expect(mockT).toHaveBeenCalledWith('exerciseLibraryDesc')
		})

		it('displays translated text correctly', () => {
			render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			expect(screen.getByText('Exercise Library')).toBeInTheDocument()
			expect(
				screen.getByText(
					'Practice Greek with interactive exercises tailored to your level'
				)
			).toBeInTheDocument()
		})

		it('handles missing translations gracefully by showing translation keys', () => {
			const fallbackT = vi.fn((key: string) => key)
			render(
				<LibraryHeader
					t={fallbackT}
					translations={exerciseLibraryTranslations}
				/>
			)

			expect(screen.getByText('exerciseLibrary')).toBeInTheDocument()
			expect(screen.getByText('exerciseLibraryDesc')).toBeInTheDocument()
		})

		it('handles empty translation values', () => {
			const emptyT = vi.fn(() => '')
			render(
				<LibraryHeader t={emptyT} translations={exerciseLibraryTranslations} />
			)

			const heading = screen.getByRole('heading', {level: 1})
			const description = heading.nextElementSibling

			expect(heading).toHaveTextContent('')
			expect(description).toHaveTextContent('')
		})
	})

	describe('Accessibility', () => {
		it('has proper heading hierarchy with h1 element', () => {
			render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const heading = screen.getByRole('heading', {level: 1})
			expect(heading).toBeInTheDocument()
			expect(heading.tagName).toBe('H1')
		})

		it('provides meaningful content for screen readers', () => {
			render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const heading = screen.getByRole('heading', {
				name: 'Exercise Library'
			})
			expect(heading).toBeInTheDocument()
		})

		it('maintains content structure for assistive technologies', () => {
			render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const heading = screen.getByRole('heading', {level: 1})
			const description = screen.getByText(
				'Practice Greek with interactive exercises tailored to your level'
			)

			// Verify the description follows the heading in document order
			expect(heading.compareDocumentPosition(description)).toBe(
				Node.DOCUMENT_POSITION_FOLLOWING
			)
		})
	})

	describe('Component props', () => {
		it('accepts and uses translator function prop', () => {
			const customT = vi.fn((key: string) => {
				const customTranslations: Record<string, string> = {
					exerciseLibrary: 'Custom Library Title',
					exerciseLibraryDesc: 'Custom description text'
				}
				return customTranslations[key] || key
			})

			render(
				<LibraryHeader t={customT} translations={exerciseLibraryTranslations} />
			)

			expect(customT).toHaveBeenCalledWith('exerciseLibrary')
			expect(customT).toHaveBeenCalledWith('exerciseLibraryDesc')
			expect(screen.getByText('Custom Library Title')).toBeInTheDocument()
			expect(screen.getByText('Custom description text')).toBeInTheDocument()
		})

		it('works with translator that returns undefined', () => {
			const undefinedT = vi.fn(() => undefined as unknown as string)
			render(
				<LibraryHeader
					t={undefinedT}
					translations={exerciseLibraryTranslations}
				/>
			)

			expect(undefinedT).toHaveBeenCalledWith('exerciseLibrary')
			expect(undefinedT).toHaveBeenCalledWith('exerciseLibraryDesc')
		})
	})

	describe('Framer Motion integration', () => {
		it('renders motion.div correctly when mocked', () => {
			const {container} = render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			// With our mock, motion.div becomes a regular div
			const outerDiv = container.firstChild as HTMLElement
			expect(outerDiv.tagName).toBe('DIV')
		})

		it('maintains expected class structure with motion wrapper', () => {
			const {container} = render(
				<LibraryHeader t={mockT} translations={exerciseLibraryTranslations} />
			)

			const outerDiv = container.firstChild as HTMLElement
			expect(outerDiv).toHaveClass('mb-12', 'text-center')

			const heading = screen.getByRole('heading', {level: 1})
			const description = screen.getByText(
				'Practice Greek with interactive exercises tailored to your level'
			)

			expect(heading).toBeInTheDocument()
			expect(description).toBeInTheDocument()
		})
	})
})
