import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {
	Container,
	Grid,
	HStack,
	PageContent,
	PageFooter,
	PageHeader,
	Section,
	Spacer,
	Spacing,
	Stack,
	VStack
} from './spacing'

describe('Spacing', () => {
	it('renders with default props', () => {
		render(<Spacing>Content</Spacing>)
		const element = screen.getByText('Content')

		expect(element).toBeInTheDocument()
		expect(element.tagName).toBe('DIV')
	})

	it('renders with custom element', () => {
		render(
			<Spacing as='section'>Section content</Spacing>
		)
		const element = screen.getByText('Section content')

		expect(element.tagName).toBe('SECTION')
	})

	it('applies padding classes', () => {
		render(<Spacing p={4}>Padded content</Spacing>)
		const element = screen.getByText('Padded content')

		expect(element).toHaveClass('p-[var(--space-4)]')
	})

	it('applies margin classes', () => {
		render(<Spacing m={6}>Margin content</Spacing>)
		const element = screen.getByText('Margin content')

		expect(element).toHaveClass('m-[var(--space-6)]')
	})

	it('applies gap classes', () => {
		render(<Spacing gap={3}>Gap content</Spacing>)
		const element = screen.getByText('Gap content')

		expect(element).toHaveClass('gap-[var(--space-3)]')
	})

	it('combines multiple spacing properties', () => {
		render(
			<Spacing p={4} m={2} gap={1}>
				Combined spacing
			</Spacing>
		)
		const element = screen.getByText('Combined spacing')

		expect(element).toHaveClass(
			'p-[var(--space-4)]',
			'm-[var(--space-2)]',
			'gap-[var(--space-1)]'
		)
	})
})

describe('Stack', () => {
	it('renders vertical stack by default', () => {
		render(
			<Stack>
				<div>Item 1</div>
				<div>Item 2</div>
			</Stack>
		)
		const stack = screen.getByText('Item 1').parentElement

		expect(stack).toHaveClass('flex', 'flex-col', 'gap-[var(--space-4)]')
	})

	it('renders horizontal stack', () => {
		render(
			<Stack direction='horizontal'>
				<div>Item 1</div>
				<div>Item 2</div>
			</Stack>
		)
		const stack = screen.getByText('Item 1').parentElement

		expect(stack).toHaveClass('flex', 'flex-row', 'gap-[var(--space-4)]')
	})

	it('applies custom spacing', () => {
		render(
			<Stack space={8}>
				<div>Item 1</div>
				<div>Item 2</div>
			</Stack>
		)
		const stack = screen.getByText('Item 1').parentElement

		expect(stack).toHaveClass('gap-[var(--space-8)]')
	})
})

describe('VStack', () => {
	it('renders as vertical stack', () => {
		render(
			<VStack>
				<div>Item 1</div>
				<div>Item 2</div>
			</VStack>
		)
		const stack = screen.getByText('Item 1').parentElement

		expect(stack).toHaveClass('flex', 'flex-col')
	})
})

describe('HStack', () => {
	it('renders as horizontal stack', () => {
		render(
			<HStack>
				<div>Item 1</div>
				<div>Item 2</div>
			</HStack>
		)
		const stack = screen.getByText('Item 1').parentElement

		expect(stack).toHaveClass('flex', 'flex-row')
	})
})

describe('Grid', () => {
	it('renders with default grid', () => {
		render(
			<Grid>
				<div>Item 1</div>
				<div>Item 2</div>
			</Grid>
		)
		const grid = screen.getByText('Item 1').parentElement

		expect(grid).toHaveClass('grid', 'grid-cols-1', 'gap-[var(--space-6)]')
	})

	it('renders with custom columns', () => {
		render(
			<Grid cols={3}>
				<div>Item 1</div>
				<div>Item 2</div>
			</Grid>
		)
		const grid = screen.getByText('Item 1').parentElement

		expect(grid).toHaveClass(
			'grid',
			'grid-cols-1',
			'md:grid-cols-2',
			'lg:grid-cols-3'
		)
	})

	it('renders with non-responsive grid', () => {
		render(
			<Grid cols={2} responsive={false}>
				<div>Item 1</div>
			</Grid>
		)
		const grid = screen.getByText('Item 1').parentElement

		expect(grid).toHaveClass('grid', 'grid-cols-2')
		expect(grid).not.toHaveClass('md:grid-cols-2')
	})

	it('applies custom spacing', () => {
		render(
			<Grid space={4}>
				<div>Item 1</div>
			</Grid>
		)
		const grid = screen.getByText('Item 1').parentElement

		expect(grid).toHaveClass('gap-[var(--space-4)]')
	})
})

describe('Container', () => {
	it('renders with default props', () => {
		render(<Container>Container content</Container>)
		const container = screen.getByText('Container content')

		expect(container).toHaveClass(
			'max-w-screen-xl',
			'mx-auto',
			'w-full',
			'p-[var(--space-4)]'
		)
	})

	it('renders with custom size', () => {
		render(<Container size='lg'>Large container</Container>)
		const container = screen.getByText('Large container')

		expect(container).toHaveClass('max-w-screen-lg')
	})

	it('renders without centering', () => {
		render(
			<Container center={false}>Uncentered container</Container>
		)
		const container = screen.getByText('Uncentered container')

		expect(container).not.toHaveClass('mx-auto')
	})

	it('applies custom padding', () => {
		render(<Container padding={8}>Padded container</Container>)
		const container = screen.getByText('Padded container')

		expect(container).toHaveClass('p-[var(--space-8)]')
	})
})

describe('Section', () => {
	it('renders with default padding', () => {
		render(<Section>Section content</Section>)
		const section = screen.getByText('Section content')

		expect(section).toHaveClass('py-[var(--space-16)]')
	})

	it('applies custom paddingY', () => {
		render(<Section paddingY={12}>Custom section</Section>)
		const section = screen.getByText('Custom section')

		expect(section).toHaveClass('py-[var(--space-12)]')
	})

	it('applies marginY when provided', () => {
		render(<Section marginY={8}>Margin section</Section>)
		const section = screen.getByText('Margin section')

		expect(section).toHaveClass('my-[var(--space-8)]')
	})
})

describe('Spacer', () => {
	it('renders vertical spacer by default', () => {
		const {container} = render(<Spacer />)
		const spacer = container.firstChild as HTMLElement

		expect(spacer.style.height).toBe('var(--space-4)')
	})

	it('renders horizontal spacer', () => {
		const {container} = render(<Spacer direction='horizontal' />)
		const spacer = container.firstChild as HTMLElement

		expect(spacer.style.width).toBe('var(--space-4)')
	})

	it('applies custom size', () => {
		const {container} = render(<Spacer size={8} />)
		const spacer = container.firstChild as HTMLElement

		expect(spacer.style.height).toBe('var(--space-8)')
	})
})

describe('Layout Components', () => {
	it('renders PageHeader with proper styling', () => {
		render(<PageHeader>Header content</PageHeader>)
		const header = screen.getByText('Header content')

		expect(header).toHaveClass(
			'py-[var(--space-8)]',
			'border-b',
			'border-[var(--color-border)]'
		)
	})

	it('renders PageContent with proper styling', () => {
		render(<PageContent>Main content</PageContent>)
		const content = screen.getByText('Main content')

		expect(content).toHaveClass(
			'flex-1',
			'max-w-screen-xl',
			'mx-auto',
			'w-full',
			'p-[var(--space-6)]'
		)
	})

	it('renders PageFooter with proper styling', () => {
		render(<PageFooter>Footer content</PageFooter>)
		const footer = screen.getByText('Footer content')

		expect(footer).toHaveClass(
			'py-[var(--space-6)]',
			'border-t',
			'border-[var(--color-border)]',
			'bg-[var(--color-surface)]'
		)
	})
})