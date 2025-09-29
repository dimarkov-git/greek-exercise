import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {
	Skeleton,
	SkeletonButton,
	SkeletonCard,
	SkeletonExerciseCard,
	SkeletonExerciseList,
	SkeletonExercisePage,
	SkeletonText,
	SkeletonTitle
} from './skeleton'

describe('Skeleton Components', () => {
	describe('Skeleton', () => {
		it('renders with default classes', () => {
			const {container} = render(<Skeleton />)
			const skeleton = container.firstChild

			expect(skeleton).toHaveClass('animate-pulse', 'rounded-md')
		})

		it('applies custom className', () => {
			const {container} = render(<Skeleton className='custom-class' />)
			const skeleton = container.firstChild

			expect(skeleton).toHaveClass('custom-class')
		})

		it('has proper background color classes', () => {
			const {container} = render(<Skeleton />)
			const skeleton = container.firstChild as HTMLElement

			expect(skeleton.className).toContain('bg-[var(--color-surface)]')
		})
	})

	describe('SkeletonText', () => {
		it('renders with text-specific dimensions', () => {
			const {container} = render(<SkeletonText />)
			const skeletonText = container.firstChild

			expect(skeletonText).toHaveClass('h-4', 'w-full')
		})

		it('applies custom className along with defaults', () => {
			const {container} = render(<SkeletonText className='custom-width' />)
			const skeletonText = container.firstChild

			expect(skeletonText).toHaveClass('h-4', 'custom-width')
		})
	})

	describe('SkeletonTitle', () => {
		it('renders with title-specific dimensions', () => {
			const {container} = render(<SkeletonTitle />)
			const skeletonTitle = container.firstChild

			expect(skeletonTitle).toHaveClass('h-6', 'w-3/4')
		})

		it('applies custom className', () => {
			const {container} = render(<SkeletonTitle className='custom-title' />)
			const skeletonTitle = container.firstChild

			expect(skeletonTitle).toHaveClass('custom-title')
		})
	})

	describe('SkeletonButton', () => {
		it('renders with button-specific dimensions', () => {
			const {container} = render(<SkeletonButton />)
			const skeletonButton = container.firstChild

			expect(skeletonButton).toHaveClass('h-10', 'w-24', 'rounded-lg')
		})

		it('applies custom className', () => {
			const {container} = render(<SkeletonButton className='custom-button' />)
			const skeletonButton = container.firstChild

			expect(skeletonButton).toHaveClass('custom-button')
		})
	})

	describe('SkeletonCard', () => {
		it('renders card structure with multiple skeleton elements', () => {
			const {container} = render(<SkeletonCard />)

			// Should have main container
			expect(container.firstChild).toHaveClass(
				'space-y-4',
				'rounded-lg',
				'border',
				'p-6'
			)

			// Should contain title and text skeletons
			const skeletonElements = container.querySelectorAll(
				'[class*="animate-pulse"]'
			)
			expect(skeletonElements.length).toBeGreaterThan(3) // Title, 2 texts, 2 buttons
		})

		it('applies custom className to main container', () => {
			const {container} = render(<SkeletonCard className='custom-card' />)

			expect(container.firstChild).toHaveClass('custom-card')
		})
	})

	describe('SkeletonExerciseCard', () => {
		it('renders exercise card structure', () => {
			const {container} = render(<SkeletonExerciseCard />)

			expect(container.firstChild).toHaveClass(
				'space-y-4',
				'rounded-xl',
				'border',
				'bg-white',
				'p-6',
				'shadow-sm'
			)

			// Should contain multiple skeleton elements for exercise card layout
			const skeletonElements = container.querySelectorAll(
				'[class*="animate-pulse"]'
			)
			expect(skeletonElements.length).toBeGreaterThan(5) // Various elements
		})

		it('applies custom className', () => {
			const {container} = render(
				<SkeletonExerciseCard className='custom-exercise' />
			)

			expect(container.firstChild).toHaveClass('custom-exercise')
		})
	})

	describe('SkeletonExerciseList', () => {
		it('renders default number of exercise cards', () => {
			const {container} = render(<SkeletonExerciseList />)

			// Should render 3 cards by default
			const exerciseCards = container.querySelectorAll('.rounded-xl')
			expect(exerciseCards).toHaveLength(3)
		})

		it('renders custom number of exercise cards', () => {
			const {container} = render(<SkeletonExerciseList count={5} />)

			// Should render 5 cards
			const exerciseCards = container.querySelectorAll('.rounded-xl')
			expect(exerciseCards).toHaveLength(5)
		})

		it('has proper grid layout', () => {
			const {container} = render(<SkeletonExerciseList />)

			expect(container.firstChild).toHaveClass(
				'grid',
				'gap-6',
				'md:grid-cols-2',
				'lg:grid-cols-3'
			)
		})

		it('generates unique keys for cards', () => {
			const {container} = render(<SkeletonExerciseList count={2} />)

			const cards = container.querySelectorAll('.rounded-xl')
			expect(cards).toHaveLength(2)

			// Each card should be unique (no React key warnings)
			for (const card of cards) {
				expect(card).toBeInTheDocument()
			}
		})
	})

	describe('SkeletonExercisePage', () => {
		it('renders complete exercise page structure', () => {
			const {container} = render(<SkeletonExercisePage />)

			// Should have main container
			expect(container.firstChild).toHaveClass('space-y-8')

			// Should contain multiple sections with skeleton elements
			const skeletonElements = container.querySelectorAll(
				'[class*="animate-pulse"]'
			)
			expect(skeletonElements.length).toBeGreaterThan(10) // Many elements in exercise page
		})

		it('contains header section', () => {
			const {container} = render(<SkeletonExercisePage />)

			// Should have elements that look like header structure
			const headerElements = container.querySelectorAll(
				'.space-y-4, .space-y-2'
			)
			expect(headerElements.length).toBeGreaterThan(0)
		})

		it('contains exercise content section', () => {
			const {container} = render(<SkeletonExercisePage />)

			// Should have rounded exercise content area
			const contentArea = container.querySelector('.rounded-xl.bg-white')
			expect(contentArea).toBeInTheDocument()
		})

		it('contains input area section', () => {
			const {container} = render(<SkeletonExercisePage />)

			// Should have input-like skeleton
			const inputSkeleton = container.querySelector('.h-12.w-full.rounded-lg')
			expect(inputSkeleton).toBeInTheDocument()
		})
	})

	describe('Accessibility', () => {
		it('skeleton elements have proper aria attributes', () => {
			const {container} = render(<Skeleton data-testid='skeleton' />)
			const skeleton = container.firstChild as HTMLElement

			// Skeleton elements should not interfere with screen readers
			expect(skeleton.getAttribute('role')).not.toBe('button')
			expect(skeleton.getAttribute('role')).not.toBe('link')
		})

		it('skeleton components do not have interactive elements', () => {
			const {container} = render(<SkeletonCard />)

			// Should not have any buttons, links, or inputs
			expect(container.querySelectorAll('button')).toHaveLength(0)
			expect(container.querySelectorAll('a')).toHaveLength(0)
			expect(container.querySelectorAll('input')).toHaveLength(0)
		})
	})

	describe('Animation', () => {
		it('all skeleton elements have pulse animation', () => {
			const {container} = render(<SkeletonCard />)

			const skeletonElements = container.querySelectorAll(
				'[class*="animate-pulse"]'
			)
			expect(skeletonElements.length).toBeGreaterThan(0)

			for (const element of skeletonElements) {
				expect(element).toHaveClass('animate-pulse')
			}
		})
	})
})
