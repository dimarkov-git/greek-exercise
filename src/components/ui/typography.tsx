import {cva, type VariantProps} from 'class-variance-authority'
import {createElement, forwardRef, type HTMLAttributes} from 'react'
import {cn} from '@/lib/utils'

// Typography variants using design tokens
const typographyVariants = cva('text-[var(--color-text-primary)]', {
	variants: {
		// Size variants mapping to CSS custom properties
		size: {
			caption: 'text-[var(--text-caption)] leading-[var(--leading-snug)]',
			'body-small':
				'text-[var(--text-body-small)] leading-[var(--leading-normal)]',
			body: 'text-[var(--text-body)] leading-[var(--leading-normal)]',
			'body-large':
				'text-[var(--text-body-large)] leading-[var(--leading-normal)]',
			subtitle: 'text-[var(--text-subtitle)] leading-[var(--leading-tight)]',
			title: 'text-[var(--text-title)] leading-[var(--leading-tight)]',
			heading: 'text-[var(--text-heading)] leading-[var(--leading-tight)]',
			'display-small':
				'text-[var(--text-display-small)] leading-[var(--leading-tight)]',
			display: 'text-[var(--text-display)] leading-[var(--leading-tight)]',
			'display-large':
				'text-[var(--text-display-large)] leading-[var(--leading-none)]',
			hero: 'text-[var(--text-hero)] leading-[var(--leading-none)]',
			'hero-large':
				'text-[var(--text-hero-large)] leading-[var(--leading-none)]',
			'hero-xl': 'text-[var(--text-hero-xl)] leading-[var(--leading-none)]',
			// Legacy size support for backward compatibility
			xs: 'text-[var(--text-xs)] leading-[var(--leading-normal)]',
			sm: 'text-[var(--text-sm)] leading-[var(--leading-normal)]',
			base: 'text-[var(--text-base)] leading-[var(--leading-normal)]',
			lg: 'text-[var(--text-lg)] leading-[var(--leading-normal)]',
			xl: 'text-[var(--text-xl)] leading-[var(--leading-tight)]',
			'2xl': 'text-[var(--text-2xl)] leading-[var(--leading-tight)]',
			'3xl': 'text-[var(--text-3xl)] leading-[var(--leading-tight)]',
			'4xl': 'text-[var(--text-4xl)] leading-[var(--leading-tight)]',
			'5xl': 'text-[var(--text-5xl)] leading-[var(--leading-tight)]',
			'6xl': 'text-[var(--text-6xl)] leading-[var(--leading-none)]',
			'7xl': 'text-[var(--text-7xl)] leading-[var(--leading-none)]',
			'8xl': 'text-[var(--text-8xl)] leading-[var(--leading-none)]',
			'9xl': 'text-[var(--text-9xl)] leading-[var(--leading-none)]'
		},
		// Weight variants
		weight: {
			light: 'font-light',
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold',
			extrabold: 'font-extrabold'
		},
		// Color variants using design tokens
		color: {
			primary: 'text-[var(--color-text-primary)]',
			secondary: 'text-[var(--color-text-secondary)]',
			tertiary: 'text-[var(--color-text-tertiary)]',
			inverse: 'text-[var(--color-text-inverse)]',
			success: 'text-[var(--color-success)]',
			error: 'text-[var(--color-error)]',
			warning: 'text-[var(--color-warning)]',
			info: 'text-[var(--color-info)]',
			muted: 'text-[var(--color-text-tertiary)]'
		},
		// Alignment variants
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
			justify: 'text-justify'
		},
		// Transform variants
		transform: {
			none: '',
			uppercase: 'uppercase',
			lowercase: 'lowercase',
			capitalize: 'capitalize'
		},
		// Decoration variants
		decoration: {
			none: '',
			underline: 'underline',
			'line-through': 'line-through'
		}
	},
	defaultVariants: {
		size: 'body',
		weight: 'normal',
		color: 'primary',
		align: 'left',
		transform: 'none',
		decoration: 'none'
	}
})

// Map semantic HTML elements to appropriate default sizes
const elementSizeDefaults = {
	h1: 'hero',
	h2: 'display-large',
	h3: 'heading',
	h4: 'title',
	h5: 'subtitle',
	h6: 'body-large',
	p: 'body',
	span: 'body',
	div: 'body',
	small: 'caption',
	strong: 'body',
	em: 'body',
	blockquote: 'body-large'
} as const

export interface TypographyProps
	extends Omit<HTMLAttributes<HTMLElement>, 'color'>,
		VariantProps<typeof typographyVariants> {
	as?: keyof JSX.IntrinsicElements
	truncate?: boolean
	responsive?: boolean
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
	(
		{
			className,
			size,
			weight,
			color,
			align,
			transform,
			decoration,
			as = 'p',
			truncate = false,
			responsive = true,
			children,
			...props
		},
		ref
	) => {
		// Use semantic defaults if size is not explicitly provided
		const effectiveSize =
			size ||
			(elementSizeDefaults[
				as as keyof typeof elementSizeDefaults
			] as TypographyProps['size'])

		return createElement(
			as,
			{
				className: cn(
					typographyVariants({
						size: effectiveSize,
						weight,
						color,
						align,
						transform,
						decoration
					}),
					truncate && 'truncate',
					className
				),
				ref,
				...props
			},
			children
		)
	}
)

Typography.displayName = 'Typography'

// Semantic typography components for common use cases
export function Heading({
	as = 'h2',
	size = 'heading',
	weight = 'semibold',
	...props
}: TypographyProps) {
	return <Typography as={as} size={size} weight={weight} {...props} />
}

export function Title({
	as = 'h3',
	size = 'title',
	weight = 'semibold',
	...props
}: TypographyProps) {
	return <Typography as={as} size={size} weight={weight} {...props} />
}

export function Subtitle({
	as = 'h4',
	size = 'subtitle',
	weight = 'medium',
	...props
}: TypographyProps) {
	return <Typography as={as} size={size} weight={weight} {...props} />
}

export function Body({as = 'p', size = 'body', ...props}: TypographyProps) {
	return <Typography as={as} size={size} {...props} />
}

export function BodySmall({
	as = 'p',
	size = 'body-small',
	...props
}: TypographyProps) {
	return <Typography as={as} size={size} {...props} />
}

export function BodyLarge({
	as = 'p',
	size = 'body-large',
	...props
}: TypographyProps) {
	return <Typography as={as} size={size} {...props} />
}

export function Caption({
	as = 'small',
	size = 'caption',
	color = 'secondary',
	...props
}: TypographyProps) {
	return <Typography as={as} color={color} size={size} {...props} />
}

export function Display({
	as = 'h1',
	size = 'display',
	weight = 'bold',
	...props
}: TypographyProps) {
	return <Typography as={as} size={size} weight={weight} {...props} />
}

export function DisplayLarge({
	as = 'h1',
	size = 'display-large',
	weight = 'bold',
	...props
}: TypographyProps) {
	return <Typography as={as} size={size} weight={weight} {...props} />
}

export function Hero({
	as = 'h1',
	size = 'hero',
	weight = 'extrabold',
	...props
}: TypographyProps) {
	return <Typography as={as} size={size} weight={weight} {...props} />
}

export function HeroLarge({
	as = 'h1',
	size = 'hero-large',
	weight = 'extrabold',
	...props
}: TypographyProps) {
	return <Typography as={as} size={size} weight={weight} {...props} />
}

export function Blockquote({
	as = 'blockquote',
	size = 'body-large',
	color = 'secondary',
	className,
	...props
}: TypographyProps) {
	return (
		<Typography
			as={as}
			className={cn(
				'border-[var(--color-border)] border-l-4 pl-4 italic',
				className
			)}
			color={color}
			size={size}
			{...props}
		/>
	)
}

export function Code({
	as = 'code',
	size = 'body-small',
	className,
	...props
}: TypographyProps) {
	return (
		<Typography
			as={as}
			className={cn(
				'rounded bg-[var(--color-surface)] px-2 py-1 font-mono',
				className
			)}
			size={size}
			{...props}
		/>
	)
}

export function Pre({
	as = 'pre',
	size = 'body-small',
	className,
	...props
}: TypographyProps) {
	return (
		<Typography
			as={as}
			className={cn(
				'overflow-x-auto rounded-lg bg-[var(--color-surface)] p-4 font-mono',
				className
			)}
			size={size}
			{...props}
		/>
	)
}

// Link component with proper styling
export function Link({
	as = 'a',
	size = 'body',
	color = 'primary',
	className,
	...props
}: TypographyProps) {
	return (
		<Typography
			as={as}
			className={cn(
				'underline decoration-current underline-offset-2 transition-colors hover:opacity-80',
				className
			)}
			color={color}
			size={size}
			{...props}
		/>
	)
}

// List components
export function List({
	as = 'ul',
	size = 'body',
	className,
	...props
}: TypographyProps) {
	return (
		<Typography
			as={as}
			className={cn('list-inside space-y-1', className)}
			size={size}
			{...props}
		/>
	)
}

export function OrderedList({
	as = 'ol',
	size = 'body',
	className,
	...props
}: TypographyProps) {
	return (
		<Typography
			as={as}
			className={cn('list-inside list-decimal space-y-1', className)}
			size={size}
			{...props}
		/>
	)
}

export function ListItem({
	as = 'li',
	size = 'body',
	...props
}: TypographyProps) {
	return <Typography as={as} size={size} {...props} />
}
