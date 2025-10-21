import {cva, type VariantProps} from 'class-variance-authority'
import React, {createElement, type HTMLAttributes} from 'react'
import {cn} from '@/shared/lib'

// Spacing variants using our 8px grid system
const spacingVariants = cva('', {
	variants: {
		// Padding variants using CSS custom properties
		p: {
			0: 'p-[var(--space-0)]',
			px: 'p-[var(--space-px)]',
			'0.5': 'p-[var(--space-0_5)]',
			1: 'p-[var(--space-1)]',
			'1.5': 'p-[var(--space-1_5)]',
			2: 'p-[var(--space-2)]',
			'2.5': 'p-[var(--space-2_5)]',
			3: 'p-[var(--space-3)]',
			'3.5': 'p-[var(--space-3_5)]',
			4: 'p-[var(--space-4)]',
			5: 'p-[var(--space-5)]',
			6: 'p-[var(--space-6)]',
			7: 'p-[var(--space-7)]',
			8: 'p-[var(--space-8)]',
			9: 'p-[var(--space-9)]',
			10: 'p-[var(--space-10)]',
			11: 'p-[var(--space-11)]',
			12: 'p-[var(--space-12)]',
			14: 'p-[var(--space-14)]',
			16: 'p-[var(--space-16)]',
			20: 'p-[var(--space-20)]',
			24: 'p-[var(--space-24)]',
			28: 'p-[var(--space-28)]',
			32: 'p-[var(--space-32)]'
		},
		// Margin variants using CSS custom properties
		m: {
			0: 'm-[var(--space-0)]',
			px: 'm-[var(--space-px)]',
			'0.5': 'm-[var(--space-0_5)]',
			1: 'm-[var(--space-1)]',
			'1.5': 'm-[var(--space-1_5)]',
			2: 'm-[var(--space-2)]',
			'2.5': 'm-[var(--space-2_5)]',
			3: 'm-[var(--space-3)]',
			'3.5': 'm-[var(--space-3_5)]',
			4: 'm-[var(--space-4)]',
			5: 'm-[var(--space-5)]',
			6: 'm-[var(--space-6)]',
			7: 'm-[var(--space-7)]',
			8: 'm-[var(--space-8)]',
			9: 'm-[var(--space-9)]',
			10: 'm-[var(--space-10)]',
			11: 'm-[var(--space-11)]',
			12: 'm-[var(--space-12)]',
			14: 'm-[var(--space-14)]',
			16: 'm-[var(--space-16)]',
			20: 'm-[var(--space-20)]',
			24: 'm-[var(--space-24)]',
			28: 'm-[var(--space-28)]',
			32: 'm-[var(--space-32)]'
		},
		// Gap variants using CSS custom properties
		gap: {
			0: 'gap-[var(--space-0)]',
			px: 'gap-[var(--space-px)]',
			'0.5': 'gap-[var(--space-0_5)]',
			1: 'gap-[var(--space-1)]',
			'1.5': 'gap-[var(--space-1_5)]',
			2: 'gap-[var(--space-2)]',
			'2.5': 'gap-[var(--space-2_5)]',
			3: 'gap-[var(--space-3)]',
			'3.5': 'gap-[var(--space-3_5)]',
			4: 'gap-[var(--space-4)]',
			5: 'gap-[var(--space-5)]',
			6: 'gap-[var(--space-6)]',
			7: 'gap-[var(--space-7)]',
			8: 'gap-[var(--space-8)]',
			9: 'gap-[var(--space-9)]',
			10: 'gap-[var(--space-10)]',
			11: 'gap-[var(--space-11)]',
			12: 'gap-[var(--space-12)]',
			14: 'gap-[var(--space-14)]',
			16: 'gap-[var(--space-16)]',
			20: 'gap-[var(--space-20)]',
			24: 'gap-[var(--space-24)]',
			28: 'gap-[var(--space-28)]',
			32: 'gap-[var(--space-32)]'
		}
	}
})

export interface SpacingProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof spacingVariants> {
	as?: keyof React.JSX.IntrinsicElements
}

// Generic spacing component
export const Spacing = ({
	className,
	p,
	m,
	gap,
	as = 'div',
	children,
	ref,
	...props
}: SpacingProps & {ref?: React.RefObject<HTMLElement | null>}) =>
	createElement(
		as as string,
		{
			className: cn(spacingVariants({p, m, gap}), className),
			ref,
			...props
		},
		children
	)

Spacing.displayName = 'Spacing'

// Specialized spacing components
export interface StackProps extends Omit<SpacingProps, 'gap'> {
	space?: SpacingProps['gap']
	direction?: 'vertical' | 'horizontal'
}

// Stack component for consistent spacing between children
export const Stack = ({
	direction = 'vertical',
	space = 4,
	className,
	children,
	ref,
	...props
}: StackProps & {ref?: React.RefObject<HTMLElement | null>}) => {
	const flexDirection = direction === 'vertical' ? 'flex-col' : 'flex-row'

	return (
		<Spacing
			className={cn('flex', flexDirection, className)}
			gap={space}
			{...(ref && {ref})}
			{...props}
		>
			{children}
		</Spacing>
	)
}

Stack.displayName = 'Stack'

// Vertical stack (VStack)
export const VStack = ({
	ref,
	...props
}: Omit<StackProps, 'direction'> & {
	ref?: React.RefObject<HTMLElement | null>
}) => <Stack direction='vertical' {...(ref && {ref})} {...props} />

VStack.displayName = 'VStack'

// Horizontal stack (HStack)
export const HStack = ({
	ref,
	...props
}: Omit<StackProps, 'direction'> & {
	ref?: React.RefObject<HTMLElement | null>
}) => <Stack direction='horizontal' {...(ref && {ref})} {...props} />

HStack.displayName = 'HStack'

// Grid component with consistent spacing
export interface GridProps extends Omit<SpacingProps, 'gap'> {
	cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
	space?: SpacingProps['gap']
	responsive?: boolean
}

export const Grid = ({
	cols = 1,
	space = 6,
	responsive = true,
	className,
	children,
	ref,
	...props
}: GridProps & {ref?: React.RefObject<HTMLElement | null>}) => {
	// Generate responsive grid classes
	const gridColsClass = responsive
		? cn({
				'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': cols === 3,
				'grid-cols-1 md:grid-cols-2': cols === 2,
				'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': cols === 4,
				'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5': cols === 5,
				'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6': cols === 6,
				'grid-cols-1 md:grid-cols-6 lg:grid-cols-12': cols === 12,
				'grid-cols-1': cols === 1
			})
		: `grid-cols-${cols}`

	return (
		<Spacing
			className={cn('grid', gridColsClass, className)}
			gap={space}
			{...(ref && {ref})}
			{...props}
		>
			{children}
		</Spacing>
	)
}

Grid.displayName = 'Grid'

// Container component with consistent padding and max-width
export interface ContainerProps extends Omit<SpacingProps, 'p'> {
	size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
	padding?: SpacingProps['p']
	center?: boolean
}

export const Container = ({
	size = 'xl',
	padding = 4,
	center = true,
	className,
	children,
	ref,
	...props
}: ContainerProps & {ref?: React.RefObject<HTMLElement | null>}) => {
	const maxWidthClass = {
		sm: 'max-w-screen-sm',
		md: 'max-w-screen-md',
		lg: 'max-w-screen-lg',
		xl: 'max-w-screen-xl',
		'2xl': 'max-w-screen-2xl',
		full: 'max-w-full'
	}[size]

	return (
		<Spacing
			className={cn(maxWidthClass, center && 'mx-auto', 'w-full', className)}
			p={padding}
			{...(ref && {ref})}
			{...props}
		>
			{children}
		</Spacing>
	)
}

Container.displayName = 'Container'

// Section component with consistent vertical spacing
export interface SectionProps extends Omit<SpacingProps, 'p' | 'm'> {
	paddingY?: SpacingProps['p']
	marginY?: SpacingProps['m']
}

export const Section = ({
	paddingY = 16,
	marginY,
	className,
	children,
	ref,
	...props
}: SectionProps & {ref?: React.RefObject<HTMLElement | null>}) => {
	const paddingClass = paddingY ? `py-[var(--space-${paddingY})]` : ''
	const marginClass = marginY ? `my-[var(--space-${marginY})]` : ''

	return (
		<Spacing
			className={cn(paddingClass, marginClass, className)}
			{...(ref && {ref})}
			{...props}
		>
			{children}
		</Spacing>
	)
}

Section.displayName = 'Section'

// Spacer component for adding consistent space
export interface SpacerProps {
	size?: SpacingProps['p']
	direction?: 'horizontal' | 'vertical'
}

export function Spacer({size = 4, direction = 'vertical'}: SpacerProps) {
	const sizeClass = `var(--space-${size})`

	if (direction === 'horizontal') {
		return <div style={{width: sizeClass}} />
	}

	return <div style={{height: sizeClass}} />
}

// Layout components with consistent spacing
export const PageHeader = ({
	paddingY = 8,
	className,
	children,
	ref,
	...props
}: Omit<SpacingProps, 'p' | 'm'> & {
	paddingY?: SpacingProps['p']
} & {ref?: React.RefObject<HTMLElement | null>}) => (
	<Section
		className={cn('border-[var(--color-border)] border-b', className)}
		paddingY={paddingY}
		{...(ref && {ref})}
		{...props}
	>
		{children}
	</Section>
)

PageHeader.displayName = 'PageHeader'

export const PageContent = ({
	padding = 6,
	className,
	children,
	ref,
	...props
}: Omit<SpacingProps, 'p'> & {
	padding?: SpacingProps['p']
} & {ref?: React.RefObject<HTMLElement | null>}) => (
	<Container
		className={cn('flex-1', className)}
		padding={padding}
		{...(ref && {ref})}
		{...props}
	>
		{children}
	</Container>
)

PageContent.displayName = 'PageContent'

export const PageFooter = ({
	paddingY = 6,
	className,
	children,
	ref,
	...props
}: Omit<SpacingProps, 'p' | 'm'> & {
	paddingY?: SpacingProps['p']
} & {ref?: React.RefObject<HTMLElement | null>}) => (
	<Section
		className={cn(
			'border-[var(--color-border)] border-t bg-[var(--color-surface)]',
			className
		)}
		paddingY={paddingY}
		{...(ref && {ref})}
		{...props}
	>
		{children}
	</Section>
)

PageFooter.displayName = 'PageFooter'
