import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@/test-utils'
import {PulseEffect, type PulseState, QuickPulse} from './PulseEffect'

// Mock framer-motion
type MockMotionDivProps = {
	children: React.ReactNode
	onAnimationComplete?: () => void
	animate?: unknown
	exit?: unknown
	initial?: unknown
} & Record<string, unknown>

vi.mock('framer-motion', () => ({
	AnimatePresence: ({children}: {children: React.ReactNode}) => (
		<div data-testid='animate-presence'>{children}</div>
	),
	motion: {
		div: ({children, onAnimationComplete, ...props}: MockMotionDivProps) => (
			<div
				data-animate={JSON.stringify(props.animate)}
				data-exit={JSON.stringify(props.exit)}
				data-initial={JSON.stringify(props.initial)}
				data-testid='motion-div'
				onClick={() => onAnimationComplete?.()}
				{...props}
			>
				{children}
			</div>
		)
	}
}))

describe('PulseEffect', () => {
	describe('Basic rendering', () => {
		it('renders children when pulseState is null', () => {
			render(
				<PulseEffect pulseState={null}>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			expect(screen.getByTestId('child-content')).toBeInTheDocument()
			expect(screen.getByText('Test Content')).toBeInTheDocument()
		})

		it('applies custom className to container', () => {
			render(
				<PulseEffect className='custom-class' pulseState={null}>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			// Get the outermost container (not the child wrapper with z-10)
			const outerContainer =
				screen.getByTestId('child-content').parentElement?.parentElement
			expect(outerContainer).toHaveClass('relative', 'custom-class')
		})

		it('applies default empty className when not provided', () => {
			render(
				<PulseEffect pulseState={null}>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			// Get the outermost container (not the child wrapper with z-10)
			const outerContainer =
				screen.getByTestId('child-content').parentElement?.parentElement
			expect(outerContainer).toHaveClass('relative')
		})
	})

	describe('Animation states', () => {
		it('renders motion div when pulseState is correct', () => {
			render(
				<PulseEffect pulseState='correct'>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			expect(screen.getByTestId('motion-div')).toBeInTheDocument()
			expect(screen.getByTestId('animate-presence')).toBeInTheDocument()
		})

		it('renders motion div when pulseState is incorrect', () => {
			render(
				<PulseEffect pulseState='incorrect'>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			expect(screen.getByTestId('motion-div')).toBeInTheDocument()
		})

		it('renders motion div when pulseState is skip', () => {
			render(
				<PulseEffect pulseState='skip'>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			expect(screen.getByTestId('motion-div')).toBeInTheDocument()
		})

		it('does not render motion div when pulseState is null', () => {
			render(
				<PulseEffect pulseState={null}>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument()
		})
	})

	describe('Animation properties', () => {
		it('applies correct animation properties for correct state', () => {
			render(
				<PulseEffect pulseState='correct'>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			const motionDiv = screen.getByTestId('motion-div')
			const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

			expect(animate.scale).toEqual([1, 1.02, 1])
			expect(animate.borderWidth).toEqual(['0px', '2px', '0px'])
			expect(animate.borderColor).toEqual([
				'transparent',
				'#22c55e', // green for correct
				'transparent'
			])
		})

		it('applies correct animation properties for incorrect state', () => {
			render(
				<PulseEffect pulseState='incorrect'>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			const motionDiv = screen.getByTestId('motion-div')
			const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

			expect(animate.borderColor).toEqual([
				'transparent',
				'#ef4444', // red for incorrect
				'transparent'
			])
		})

		it('applies correct animation properties for skip state', () => {
			render(
				<PulseEffect pulseState='skip'>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			const motionDiv = screen.getByTestId('motion-div')
			const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

			expect(animate.borderColor).toEqual([
				'transparent',
				'#eab308', // yellow for skip
				'transparent'
			])
		})
	})

	describe('Animation callback', () => {
		it('calls onAnimationComplete when provided', async () => {
			const mockCallback = vi.fn()

			const {user} = render(
				<PulseEffect onAnimationComplete={mockCallback} pulseState='correct'>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			// Simulate animation complete by clicking the motion div
			await user.click(screen.getByTestId('motion-div'))

			expect(mockCallback).toHaveBeenCalled()
		})

		it('does not error when onAnimationComplete is not provided', async () => {
			const {user} = render(
				<PulseEffect pulseState='correct'>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			// Should not throw when clicking without callback
			await user.click(screen.getByTestId('motion-div'))

			expect(screen.getByTestId('child-content')).toBeInTheDocument()
		})
	})

	describe('Motion div properties', () => {
		it('applies correct CSS classes to motion div', () => {
			render(
				<PulseEffect pulseState='correct'>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			const motionDiv = screen.getByTestId('motion-div')
			expect(motionDiv).toHaveClass(
				'pointer-events-none',
				'absolute',
				'inset-0',
				'rounded-lg'
			)
		})

		it('applies correct border style', () => {
			render(
				<PulseEffect pulseState='correct'>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			const motionDiv = screen.getByTestId('motion-div')
			expect(motionDiv).toHaveStyle({borderStyle: 'solid'})
		})
	})

	describe('Content layering', () => {
		it('renders content in correct z-index layer', () => {
			render(
				<PulseEffect pulseState='correct'>
					<div data-testid='child-content'>Test Content</div>
				</PulseEffect>
			)

			const contentWrapper = screen.getByTestId('child-content').parentElement
			expect(contentWrapper).toHaveClass('relative', 'z-10')
		})
	})
})

describe('QuickPulse', () => {
	it('renders PulseEffect with correct props', () => {
		render(
			<QuickPulse trigger='correct'>
				<div data-testid='quick-pulse-child'>Quick Pulse Content</div>
			</QuickPulse>
		)

		expect(screen.getByTestId('quick-pulse-child')).toBeInTheDocument()
		expect(screen.getByTestId('motion-div')).toBeInTheDocument()
	})

	it('passes onComplete callback to PulseEffect', async () => {
		const mockOnComplete = vi.fn()

		const {user} = render(
			<QuickPulse onComplete={mockOnComplete} trigger='correct'>
				<div data-testid='quick-pulse-child'>Quick Pulse Content</div>
			</QuickPulse>
		)

		await user.click(screen.getByTestId('motion-div'))

		expect(mockOnComplete).toHaveBeenCalled()
	})

	it('applies custom className', () => {
		render(
			<QuickPulse className='quick-pulse-class' trigger='correct'>
				<div data-testid='quick-pulse-child'>Quick Pulse Content</div>
			</QuickPulse>
		)

		// Get the outermost container (not the child wrapper with z-10)
		const outerContainer =
			screen.getByTestId('quick-pulse-child').parentElement?.parentElement
		expect(outerContainer).toHaveClass('relative', 'quick-pulse-class')
	})

	it('handles null trigger state', () => {
		render(
			<QuickPulse trigger={null}>
				<div data-testid='quick-pulse-child'>Quick Pulse Content</div>
			</QuickPulse>
		)

		expect(screen.getByTestId('quick-pulse-child')).toBeInTheDocument()
		expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument()
	})

	describe('All trigger states', () => {
		const states: PulseState[] = ['correct', 'incorrect', 'skip', null]

		it.each(states)('handles %s trigger state', state => {
			render(
				<QuickPulse trigger={state}>
					<div data-testid='quick-pulse-child'>Content</div>
				</QuickPulse>
			)

			expect(screen.getByTestId('quick-pulse-child')).toBeInTheDocument()

			if (state === null) {
				expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument()
			} else {
				expect(screen.getByTestId('motion-div')).toBeInTheDocument()
			}
		})
	})
})
