import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	ElevatedCard,
	ErrorCard,
	ExerciseCard,
	FloatingCard,
	GhostCard,
	InfoCard,
	InteractiveCard,
	OutlineCard,
	PrimaryCard,
	SettingsCard,
	SuccessCard,
	WarningCard
} from './card'

describe('Card', () => {
	it('renders with default variant and padding', () => {
		render(<Card>Card content</Card>)
		const card = screen.getByText('Card content')

		expect(card).toBeInTheDocument()
		expect(card).toHaveClass('p-6', 'rounded-xl')
	})

	it('renders with different variants', () => {
		render(
			<>
				<Card variant='default'>Default</Card>
				<Card variant='elevated'>Elevated</Card>
				<Card variant='floating'>Floating</Card>
				<Card variant='outline'>Outline</Card>
				<Card variant='ghost'>Ghost</Card>
				<Card variant='primary'>Primary</Card>
				<Card variant='success'>Success</Card>
				<Card variant='error'>Error</Card>
				<Card variant='warning'>Warning</Card>
				<Card variant='info'>Info</Card>
			</>
		)

		expect(screen.getByText('Default')).toBeInTheDocument()
		expect(screen.getByText('Elevated')).toBeInTheDocument()
		expect(screen.getByText('Floating')).toBeInTheDocument()
		expect(screen.getByText('Outline')).toBeInTheDocument()
		expect(screen.getByText('Ghost')).toBeInTheDocument()
		expect(screen.getByText('Primary')).toBeInTheDocument()
		expect(screen.getByText('Success')).toBeInTheDocument()
		expect(screen.getByText('Error')).toBeInTheDocument()
		expect(screen.getByText('Warning')).toBeInTheDocument()
		expect(screen.getByText('Info')).toBeInTheDocument()
	})

	it('renders with different padding sizes', () => {
		render(
			<>
				<Card padding='none'>No Padding</Card>
				<Card padding='sm'>Small Padding</Card>
				<Card padding='lg'>Large Padding</Card>
				<Card padding='xl'>Extra Large Padding</Card>
			</>
		)

		expect(screen.getByText('No Padding')).toHaveClass('p-0')
		expect(screen.getByText('Small Padding')).toHaveClass('p-4')
		expect(screen.getByText('Large Padding')).toHaveClass('p-8')
		expect(screen.getByText('Extra Large Padding')).toHaveClass('p-10')
	})

	it('renders as interactive card', async () => {
		const handleClick = vi.fn()
		const user = userEvent.setup()

		render(
			<Card interactive onClick={handleClick}>
				Interactive Card
			</Card>
		)
		const card = screen.getByText('Interactive Card')

		expect(card).toHaveClass('cursor-pointer')

		await user.click(card)
		expect(handleClick).toHaveBeenCalledOnce()
	})
})

describe('CardHeader', () => {
	it('renders with default padding', () => {
		render(<CardHeader>Header content</CardHeader>)
		const header = screen.getByText('Header content')

		expect(header).toBeInTheDocument()
		expect(header).toHaveClass('p-6', 'pb-6')
	})

	it('renders with different padding sizes', () => {
		render(
			<>
				<CardHeader padding='sm'>Small</CardHeader>
				<CardHeader padding='lg'>Large</CardHeader>
			</>
		)

		expect(screen.getByText('Small')).toHaveClass('p-4', 'pb-4')
		expect(screen.getByText('Large')).toHaveClass('p-8', 'pb-8')
	})
})

describe('CardTitle', () => {
	it('renders as h3 element', () => {
		render(<CardTitle>Card Title</CardTitle>)
		const title = screen.getByRole('heading', {level: 3})

		expect(title).toBeInTheDocument()
		expect(title).toHaveTextContent('Card Title')
		expect(title).toHaveClass('text-2xl', 'font-semibold')
	})
})

describe('CardDescription', () => {
	it('renders description text', () => {
		render(<CardDescription>This is a card description</CardDescription>)
		const description = screen.getByText('This is a card description')

		expect(description).toBeInTheDocument()
		expect(description).toHaveClass('text-sm')
	})
})

describe('CardContent', () => {
	it('renders with default padding', () => {
		render(<CardContent>Content here</CardContent>)
		const content = screen.getByText('Content here')

		expect(content).toBeInTheDocument()
		expect(content).toHaveClass('p-6', 'pt-0')
	})

	it('renders with different padding sizes', () => {
		render(
			<>
				<CardContent padding='sm'>Small</CardContent>
				<CardContent padding='lg'>Large</CardContent>
			</>
		)

		expect(screen.getByText('Small')).toHaveClass('p-4', 'pt-0')
		expect(screen.getByText('Large')).toHaveClass('p-8', 'pt-0')
	})
})

describe('CardFooter', () => {
	it('renders with default padding', () => {
		render(<CardFooter>Footer content</CardFooter>)
		const footer = screen.getByText('Footer content')

		expect(footer).toBeInTheDocument()
		expect(footer).toHaveClass('p-6', 'pt-0', 'flex', 'items-center')
	})
})

// Test specialized card variants
describe('Specialized Card variants', () => {
	it('renders ElevatedCard', () => {
		render(<ElevatedCard>Elevated</ElevatedCard>)
		expect(screen.getByText('Elevated')).toBeInTheDocument()
	})

	it('renders FloatingCard', () => {
		render(<FloatingCard>Floating</FloatingCard>)
		expect(screen.getByText('Floating')).toBeInTheDocument()
	})

	it('renders OutlineCard', () => {
		render(<OutlineCard>Outline</OutlineCard>)
		expect(screen.getByText('Outline')).toBeInTheDocument()
	})

	it('renders GhostCard', () => {
		render(<GhostCard>Ghost</GhostCard>)
		expect(screen.getByText('Ghost')).toBeInTheDocument()
	})

	it('renders PrimaryCard', () => {
		render(<PrimaryCard>Primary</PrimaryCard>)
		expect(screen.getByText('Primary')).toBeInTheDocument()
	})

	it('renders SuccessCard', () => {
		render(<SuccessCard>Success</SuccessCard>)
		expect(screen.getByText('Success')).toBeInTheDocument()
	})

	it('renders ErrorCard', () => {
		render(<ErrorCard>Error</ErrorCard>)
		expect(screen.getByText('Error')).toBeInTheDocument()
	})

	it('renders WarningCard', () => {
		render(<WarningCard>Warning</WarningCard>)
		expect(screen.getByText('Warning')).toBeInTheDocument()
	})

	it('renders InfoCard', () => {
		render(<InfoCard>Info</InfoCard>)
		expect(screen.getByText('Info')).toBeInTheDocument()
	})

	it('renders InteractiveCard with interactive behavior', () => {
		render(<InteractiveCard>Interactive</InteractiveCard>)
		const card = screen.getByText('Interactive')

		expect(card).toHaveClass('cursor-pointer')
	})

	it('renders ExerciseCard with title and description', () => {
		render(
			<ExerciseCard
				description='Exercise description'
				title='Exercise Title'
			>
				Exercise content
			</ExerciseCard>
		)

		expect(screen.getByRole('heading', {name: 'Exercise Title'})).toBeInTheDocument()
		expect(screen.getByText('Exercise description')).toBeInTheDocument()
		expect(screen.getByText('Exercise content')).toBeInTheDocument()
	})

	it('renders ExerciseCard without description', () => {
		render(<ExerciseCard title='Simple Exercise' />)

		expect(screen.getByRole('heading', {name: 'Simple Exercise'})).toBeInTheDocument()
		expect(screen.queryByText('Exercise description')).not.toBeInTheDocument()
	})

	it('renders SettingsCard with title and description', () => {
		render(
			<SettingsCard
				description='Settings description'
				title='Settings Title'
			>
				Settings content
			</SettingsCard>
		)

		expect(screen.getByRole('heading', {name: 'Settings Title'})).toBeInTheDocument()
		expect(screen.getByText('Settings description')).toBeInTheDocument()
		expect(screen.getByText('Settings content')).toBeInTheDocument()
	})

	it('renders SettingsCard without description', () => {
		render(<SettingsCard title='Simple Settings' />)

		expect(screen.getByRole('heading', {name: 'Simple Settings'})).toBeInTheDocument()
		expect(screen.queryByText('Settings description')).not.toBeInTheDocument()
	})
})