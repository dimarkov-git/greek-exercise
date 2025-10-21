import {cva, type VariantProps} from 'class-variance-authority'
import type {HTMLAttributes, RefObject} from 'react'
import {cn} from '@/shared/lib'

const cardVariants = cva(
	// Base styles using CSS custom properties
	'relative rounded-xl border bg-[var(--color-surface)] text-[var(--color-text-primary)] transition-all duration-200',
	{
		variants: {
			variant: {
				default: 'border-[var(--color-border)] shadow-[var(--shadow-sm)]',
				elevated: 'border-[var(--color-border)] shadow-[var(--shadow-md)]',
				floating: 'border-[var(--color-border)] shadow-[var(--shadow-lg)]',
				outline: 'border-[var(--color-border-strong)] shadow-none',
				ghost: 'border-transparent shadow-none bg-transparent',
				primary:
					'border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 shadow-[var(--shadow-sm)]',
				success:
					'border-[var(--color-success)]/20 bg-[var(--color-success)]/5 shadow-[var(--shadow-sm)]',
				error:
					'border-[var(--color-error)]/20 bg-[var(--color-error)]/5 shadow-[var(--shadow-sm)]',
				warning:
					'border-[var(--color-warning)]/20 bg-[var(--color-warning)]/5 shadow-[var(--shadow-sm)]',
				info: 'border-[var(--color-info)]/20 bg-[var(--color-info)]/5 shadow-[var(--shadow-sm)]'
			},
			padding: {
				none: 'p-0',
				sm: 'p-4',
				default: 'p-6',
				lg: 'p-8',
				xl: 'p-10'
			},
			interactive: {
				false: '',
				true: 'cursor-pointer hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border-strong)] active:scale-[0.98]'
			}
		},
		defaultVariants: {
			variant: 'default',
			padding: 'default',
			interactive: false
		}
	}
)

export interface CardProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {
	asChild?: boolean
}

export const Card = ({
	className,
	variant,
	padding,
	interactive,
	ref,
	...props
}: CardProps & {ref?: RefObject<HTMLDivElement | null>}) => (
	<div
		className={cn(cardVariants({variant, padding, interactive, className}))}
		ref={ref}
		{...props}
	/>
)

Card.displayName = 'Card'

// Card Header Component
const cardHeaderVariants = cva(
	'flex flex-col space-y-1.5 p-6 border-b border-[var(--color-border-subtle)]',
	{
		variants: {
			padding: {
				none: 'p-0 pb-0',
				sm: 'p-4 pb-4',
				default: 'p-6 pb-6',
				lg: 'p-8 pb-8'
			}
		},
		defaultVariants: {
			padding: 'default'
		}
	}
)

export interface CardHeaderProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardHeaderVariants> {}

export const CardHeader = ({
	className,
	padding,
	ref,
	...props
}: CardHeaderProps & {ref?: RefObject<HTMLDivElement | null>}) => (
	<div
		className={cn(cardHeaderVariants({padding, className}))}
		ref={ref}
		{...props}
	/>
)

CardHeader.displayName = 'CardHeader'

// Card Title Component
export const CardTitle = ({
	className,
	ref,
	...props
}: HTMLAttributes<HTMLHeadingElement> & {
	ref?: RefObject<HTMLParagraphElement | null>
}) => (
	<h3
		className={cn(
			'font-semibold text-2xl text-[var(--color-text-primary)] leading-none tracking-tight',
			className
		)}
		ref={ref}
		{...props}
	/>
)

CardTitle.displayName = 'CardTitle'

// Card Description Component
export const CardDescription = ({
	className,
	ref,
	...props
}: HTMLAttributes<HTMLParagraphElement> & {
	ref?: RefObject<HTMLParagraphElement | null>
}) => (
	<p
		className={cn('text-[var(--color-text-secondary)] text-sm', className)}
		ref={ref}
		{...props}
	/>
)

CardDescription.displayName = 'CardDescription'

// Card Content Component
const cardContentVariants = cva('p-6 pt-0', {
	variants: {
		padding: {
			none: 'p-0',
			sm: 'p-4 pt-0',
			default: 'p-6 pt-0',
			lg: 'p-8 pt-0'
		}
	},
	defaultVariants: {
		padding: 'default'
	}
})

export interface CardContentProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardContentVariants> {}

export const CardContent = ({
	className,
	padding,
	ref,
	...props
}: CardContentProps & {ref?: RefObject<HTMLDivElement | null>}) => (
	<div
		className={cn(cardContentVariants({padding, className}))}
		ref={ref}
		{...props}
	/>
)

CardContent.displayName = 'CardContent'

// Card Footer Component
const cardFooterVariants = cva(
	'flex items-center p-6 pt-0 border-t border-[var(--color-border-subtle)]',
	{
		variants: {
			padding: {
				none: 'p-0 pt-0',
				sm: 'p-4 pt-0',
				default: 'p-6 pt-0',
				lg: 'p-8 pt-0'
			}
		},
		defaultVariants: {
			padding: 'default'
		}
	}
)

export interface CardFooterProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardFooterVariants> {}

export const CardFooter = ({
	className,
	padding,
	ref,
	...props
}: CardFooterProps & {ref?: RefObject<HTMLDivElement | null>}) => (
	<div
		className={cn(cardFooterVariants({padding, className}))}
		ref={ref}
		{...props}
	/>
)

CardFooter.displayName = 'CardFooter'

// Specialized card variants for common use cases
export function ElevatedCard(props: Omit<CardProps, 'variant'>) {
	return <Card variant='elevated' {...props} />
}

export function FloatingCard(props: Omit<CardProps, 'variant'>) {
	return <Card variant='floating' {...props} />
}

export function OutlineCard(props: Omit<CardProps, 'variant'>) {
	return <Card variant='outline' {...props} />
}

export function GhostCard(props: Omit<CardProps, 'variant'>) {
	return <Card variant='ghost' {...props} />
}

export function PrimaryCard(props: Omit<CardProps, 'variant'>) {
	return <Card variant='primary' {...props} />
}

export function SuccessCard(props: Omit<CardProps, 'variant'>) {
	return <Card variant='success' {...props} />
}

export function ErrorCard(props: Omit<CardProps, 'variant'>) {
	return <Card variant='error' {...props} />
}

export function WarningCard(props: Omit<CardProps, 'variant'>) {
	return <Card variant='warning' {...props} />
}

export function InfoCard(props: Omit<CardProps, 'variant'>) {
	return <Card variant='info' {...props} />
}

export function InteractiveCard(props: Omit<CardProps, 'interactive'>) {
	return <Card interactive={true} {...props} />
}

// Complete card example components
export function ExerciseCard({
	title,
	description,
	children,
	...props
}: CardProps & {
	title: string
	description?: string
	children?: React.ReactNode
}) {
	return (
		<Card variant='elevated' {...props}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			{children && <CardContent>{children}</CardContent>}
		</Card>
	)
}

export function SettingsCard({
	title,
	description,
	children,
	...props
}: CardProps & {
	title: string
	description?: string
	children?: React.ReactNode
}) {
	return (
		<Card variant='outline' {...props}>
			<CardHeader>
				<CardTitle className='text-lg'>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			{children && <CardContent>{children}</CardContent>}
		</Card>
	)
}
