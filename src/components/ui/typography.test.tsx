import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {
	Blockquote,
	Body,
	BodyLarge,
	BodySmall,
	Caption,
	Code,
	Display,
	DisplayLarge,
	Heading,
	Hero,
	HeroLarge,
	Link,
	List,
	ListItem,
	OrderedList,
	Pre,
	Subtitle,
	Title,
	Typography
} from './typography'

describe('Typography', () => {
	it('renders with default props', () => {
		render(<Typography>Default text</Typography>)
		const element = screen.getByText('Default text')

		expect(element).toBeInTheDocument()
		expect(element.tagName).toBe('P')
	})

	it('renders with custom element', () => {
		render(<Typography as='h1'>Heading text</Typography>)
		const element = screen.getByRole('heading', {level: 1})

		expect(element).toBeInTheDocument()
		expect(element).toHaveTextContent('Heading text')
	})

	it('renders with different sizes', () => {
		render(
			<>
				<Typography size='caption'>Caption</Typography>
				<Typography size='body-small'>Body Small</Typography>
				<Typography size='body'>Body</Typography>
				<Typography size='title'>Title</Typography>
				<Typography size='hero'>Hero</Typography>
			</>
		)

		expect(screen.getByText('Caption')).toBeInTheDocument()
		expect(screen.getByText('Body Small')).toBeInTheDocument()
		expect(screen.getByText('Body')).toBeInTheDocument()
		expect(screen.getByText('Title')).toBeInTheDocument()
		expect(screen.getByText('Hero')).toBeInTheDocument()
	})

	it('renders with different weights', () => {
		render(
			<>
				<Typography weight='light'>Light</Typography>
				<Typography weight='normal'>Normal</Typography>
				<Typography weight='medium'>Medium</Typography>
				<Typography weight='semibold'>Semibold</Typography>
				<Typography weight='bold'>Bold</Typography>
				<Typography weight='extrabold'>Extrabold</Typography>
			</>
		)

		expect(screen.getByText('Light')).toHaveClass('font-light')
		expect(screen.getByText('Normal')).toHaveClass('font-normal')
		expect(screen.getByText('Medium')).toHaveClass('font-medium')
		expect(screen.getByText('Semibold')).toHaveClass('font-semibold')
		expect(screen.getByText('Bold')).toHaveClass('font-bold')
		expect(screen.getByText('Extrabold')).toHaveClass('font-extrabold')
	})

	it('renders with different colors', () => {
		render(
			<>
				<Typography color='primary'>Primary</Typography>
				<Typography color='secondary'>Secondary</Typography>
				<Typography color='success'>Success</Typography>
				<Typography color='error'>Error</Typography>
				<Typography color='warning'>Warning</Typography>
			</>
		)

		expect(screen.getByText('Primary')).toBeInTheDocument()
		expect(screen.getByText('Secondary')).toBeInTheDocument()
		expect(screen.getByText('Success')).toBeInTheDocument()
		expect(screen.getByText('Error')).toBeInTheDocument()
		expect(screen.getByText('Warning')).toBeInTheDocument()
	})

	it('renders with different alignments', () => {
		render(
			<>
				<Typography align='left'>Left</Typography>
				<Typography align='center'>Center</Typography>
				<Typography align='right'>Right</Typography>
				<Typography align='justify'>Justify</Typography>
			</>
		)

		expect(screen.getByText('Left')).toHaveClass('text-left')
		expect(screen.getByText('Center')).toHaveClass('text-center')
		expect(screen.getByText('Right')).toHaveClass('text-right')
		expect(screen.getByText('Justify')).toHaveClass('text-justify')
	})

	it('renders with text transforms', () => {
		render(
			<>
				<Typography transform='uppercase'>Uppercase</Typography>
				<Typography transform='lowercase'>Lowercase</Typography>
				<Typography transform='capitalize'>Capitalize</Typography>
			</>
		)

		expect(screen.getByText('Uppercase')).toHaveClass('uppercase')
		expect(screen.getByText('Lowercase')).toHaveClass('lowercase')
		expect(screen.getByText('Capitalize')).toHaveClass('capitalize')
	})

	it('renders with decorations', () => {
		render(
			<>
				<Typography decoration='underline'>Underlined</Typography>
				<Typography decoration='line-through'>Strikethrough</Typography>
			</>
		)

		expect(screen.getByText('Underlined')).toHaveClass('underline')
		expect(screen.getByText('Strikethrough')).toHaveClass('line-through')
	})

	it('renders with truncation', () => {
		render(
			<Typography truncate={true}>
				Very long text that should be truncated
			</Typography>
		)
		const element = screen.getByText('Very long text that should be truncated')

		expect(element).toHaveClass('truncate')
	})

	it('applies custom className', () => {
		render(<Typography className='custom-class'>Custom styled text</Typography>)
		const element = screen.getByText('Custom styled text')

		expect(element).toHaveClass('custom-class')
	})

	it('uses semantic defaults based on element', () => {
		render(
			<>
				<Typography as='h1'>H1 Heading</Typography>
				<Typography as='h2'>H2 Heading</Typography>
				<Typography as='h3'>H3 Heading</Typography>
				<Typography as='small'>Small text</Typography>
			</>
		)

		// The elements should have appropriate semantic sizes based on their HTML element
		expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument()
		expect(screen.getByRole('heading', {level: 2})).toBeInTheDocument()
		expect(screen.getByRole('heading', {level: 3})).toBeInTheDocument()
		expect(screen.getByText('Small text')).toBeInTheDocument()
	})
})

// Test specialized typography components
describe('Specialized Typography components', () => {
	it('renders Heading with proper defaults', () => {
		render(<Heading>Main Heading</Heading>)
		const element = screen.getByRole('heading', {level: 2})

		expect(element).toBeInTheDocument()
		expect(element).toHaveClass('font-semibold')
	})

	it('renders Title with proper defaults', () => {
		render(<Title>Section Title</Title>)
		const element = screen.getByRole('heading', {level: 3})

		expect(element).toBeInTheDocument()
		expect(element).toHaveClass('font-semibold')
	})

	it('renders Subtitle with proper defaults', () => {
		render(<Subtitle>Subtitle text</Subtitle>)
		const element = screen.getByRole('heading', {level: 4})

		expect(element).toBeInTheDocument()
		expect(element).toHaveClass('font-medium')
	})

	it('renders Body text', () => {
		render(<Body>Body paragraph</Body>)
		expect(screen.getByText('Body paragraph')).toBeInTheDocument()
	})

	it('renders BodySmall text', () => {
		render(<BodySmall>Small body text</BodySmall>)
		expect(screen.getByText('Small body text')).toBeInTheDocument()
	})

	it('renders BodyLarge text', () => {
		render(<BodyLarge>Large body text</BodyLarge>)
		expect(screen.getByText('Large body text')).toBeInTheDocument()
	})

	it('renders Caption with secondary color', () => {
		render(<Caption>Caption text</Caption>)
		const element = screen.getByText('Caption text')

		expect(element.tagName).toBe('SMALL')
		expect(element).toBeInTheDocument()
	})

	it('renders Display heading', () => {
		render(<Display>Display heading</Display>)
		const element = screen.getByRole('heading', {level: 1})

		expect(element).toBeInTheDocument()
		expect(element).toHaveClass('font-bold')
	})

	it('renders DisplayLarge heading', () => {
		render(<DisplayLarge>Large display</DisplayLarge>)
		const element = screen.getByRole('heading', {level: 1})

		expect(element).toBeInTheDocument()
		expect(element).toHaveClass('font-bold')
	})

	it('renders Hero heading', () => {
		render(<Hero>Hero text</Hero>)
		const element = screen.getByRole('heading', {level: 1})

		expect(element).toBeInTheDocument()
		expect(element).toHaveClass('font-extrabold')
	})

	it('renders HeroLarge heading', () => {
		render(<HeroLarge>Large hero</HeroLarge>)
		const element = screen.getByRole('heading', {level: 1})

		expect(element).toBeInTheDocument()
		expect(element).toHaveClass('font-extrabold')
	})

	it('renders Blockquote with proper styling', () => {
		render(<Blockquote>Quote text</Blockquote>)
		const element = screen.getByText('Quote text')

		expect(element.tagName).toBe('BLOCKQUOTE')
		expect(element).toHaveClass('border-l-4', 'pl-4', 'italic')
	})

	it('renders Code with monospace styling', () => {
		render(<Code>const code = true</Code>)
		const element = screen.getByText('const code = true')

		expect(element.tagName).toBe('CODE')
		expect(element).toHaveClass('font-mono', 'rounded', 'px-2', 'py-1')
	})

	it('renders Pre with monospace styling', () => {
		render(<Pre>function example()</Pre>)
		const element = screen.getByText('function example()')

		expect(element.tagName).toBe('PRE')
		expect(element).toHaveClass('font-mono', 'rounded-lg', 'p-4')
	})

	it('renders Link with underline', () => {
		render(<Link href='#'>Link text</Link>)
		const element = screen.getByRole('link')

		expect(element).toBeInTheDocument()
		expect(element).toHaveClass('underline')
	})

	it('renders List with proper styling', () => {
		render(
			<List>
				<ListItem>Item 1</ListItem>
				<ListItem>Item 2</ListItem>
			</List>
		)

		const list = screen.getByRole('list')
		expect(list.tagName).toBe('UL')
		expect(list).toHaveClass('list-inside', 'space-y-1')
	})

	it('renders OrderedList with proper styling', () => {
		render(
			<OrderedList>
				<ListItem>First item</ListItem>
				<ListItem>Second item</ListItem>
			</OrderedList>
		)

		const list = screen.getByRole('list')
		expect(list.tagName).toBe('OL')
		expect(list).toHaveClass('list-inside', 'list-decimal', 'space-y-1')
	})

	it('renders ListItem', () => {
		render(<ListItem>List item text</ListItem>)
		const element = screen.getByText('List item text')

		expect(element.tagName).toBe('LI')
		expect(element).toBeInTheDocument()
	})
})
