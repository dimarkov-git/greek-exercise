import {cva, type VariantProps} from 'class-variance-authority'
import {forwardRef, type InputHTMLAttributes} from 'react'
import {cn} from '@/lib/utils'

const inputVariants = cva(
	// Base styles using CSS custom properties
	'flex w-full border-2 bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text-primary)] transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'rounded-lg border-[var(--color-border)] focus-visible:border-[var(--color-primary)] focus-visible:ring-[var(--color-focus-ring)]',
				success:
					'rounded-lg border-[var(--color-success)] bg-[var(--color-success)]/5 focus-visible:border-[var(--color-success)] focus-visible:ring-[var(--color-success)]/20',
				error:
					'rounded-lg border-[var(--color-error)] bg-[var(--color-error)]/5 focus-visible:border-[var(--color-error)] focus-visible:ring-[var(--color-error)]/20',
				warning:
					'rounded-lg border-[var(--color-warning)] bg-[var(--color-warning)]/5 focus-visible:border-[var(--color-warning)] focus-visible:ring-[var(--color-warning)]/20',
				info: 'rounded-lg border-[var(--color-info)] bg-[var(--color-info)]/5 focus-visible:border-[var(--color-info)] focus-visible:ring-[var(--color-info)]/20',
				ghost:
					'border-transparent bg-transparent focus-visible:border-[var(--color-border-strong)] focus-visible:bg-[var(--color-surface)] focus-visible:ring-[var(--color-focus-ring)]'
			},
			size: {
				sm: 'h-8 px-3 py-1 text-xs',
				default: 'h-10 px-4 py-2 text-sm',
				lg: 'h-12 px-6 py-3 text-base',
				xl: 'h-14 px-8 py-4 text-lg'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

// Helper function to get icon size classes
function getIconSize(size: 'sm' | 'default' | 'lg' | 'xl' | null) {
	const sizeMap = {
		sm: 'h-3 w-3',
		default: 'h-4 w-4',
		lg: 'h-5 w-5',
		xl: 'h-6 w-6'
	}
	return sizeMap[size ?? 'default']
}

// Helper function to get padding classes
function getPaddingClasses(
	hasIcon: boolean,
	iconPosition: 'left' | 'right',
	hasClearable: boolean,
	isLoading: boolean,
	size: 'sm' | 'default' | 'lg' | 'xl' | null
) {
	let leftPadding = ''
	let rightPadding = ''

	if (hasIcon && iconPosition === 'left') {
		if (size === 'sm') leftPadding = 'pl-8'
		else if (size === 'lg') leftPadding = 'pl-12'
		else leftPadding = 'pl-10'
	}

	if ((hasIcon && iconPosition === 'right') || hasClearable || isLoading) {
		if (size === 'sm') rightPadding = 'pr-8'
		else if (size === 'lg') rightPadding = 'pr-12'
		else rightPadding = 'pr-10'
	}

	return cn(leftPadding, rightPadding)
}

export interface InputProps
	extends InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {
	loading?: boolean
	icon?: React.ReactNode
	iconPosition?: 'left' | 'right'
	clearable?: boolean
	onClear?: () => void
}

// Left Icon Component
function LeftIcon({
	icon,
	size
}: {
	icon: React.ReactNode
	size: 'sm' | 'default' | 'lg' | 'xl' | null
}) {
	return (
		<div
			className={cn(
				'-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 flex items-center text-[var(--color-text-tertiary)]',
				getIconSize(size)
			)}
		>
			{icon}
		</div>
	)
}

// Loading Spinner Component
function LoadingSpinner({size}: {size: 'sm' | 'default' | 'lg' | 'xl' | null}) {
	return (
		<div
			className={cn(
				'animate-spin rounded-full border-2 border-current border-t-transparent',
				getIconSize(size)
			)}
		/>
	)
}

// Clear Button Component
function ClearButton({
	onClear,
	size
}: {
	onClear?: () => void
	size: 'sm' | 'default' | 'lg' | 'xl' | null
}) {
	return (
		<button
			className='rounded-full p-0.5 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-focus-ring)]'
			onClick={onClear}
			type='button'
		>
			<svg
				className={getIconSize(size)}
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<title>Clear input</title>
				<path
					d='M6 18L18 6M6 6l12 12'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
				/>
			</svg>
		</button>
	)
}

// Right Icon Component
function RightIcon({
	icon,
	size
}: {
	icon: React.ReactNode
	size: 'sm' | 'default' | 'lg' | 'xl' | null
}) {
	return (
		<div className={cn('text-[var(--color-text-tertiary)]', getIconSize(size))}>
			{icon}
		</div>
	)
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			variant,
			size,
			type,
			loading = false,
			icon,
			iconPosition = 'left',
			clearable = false,
			onClear,
			value,
			disabled,
			...props
		},
		ref
	) => {
		const hasIcon = Boolean(icon)
		const hasClearable = clearable && value && !disabled
		const isLoading = loading && !disabled

		const paddingClass = getPaddingClasses(
			hasIcon,
			iconPosition,
			hasClearable,
			isLoading,
			size
		)

		return (
			<div className='relative'>
				{/* Left Icon */}
				{hasIcon && iconPosition === 'left' && (
					<LeftIcon icon={icon} size={size} />
				)}

				<input
					className={cn(
						inputVariants({variant, size}),
						paddingClass,
						className
					)}
					disabled={disabled || loading}
					ref={ref}
					type={type}
					value={value}
					{...props}
				/>

				{/* Right side content */}
				<div className='-translate-y-1/2 absolute top-1/2 right-3 flex items-center gap-2'>
					{/* Loading Spinner */}
					{isLoading && <LoadingSpinner size={size} />}

					{/* Clear Button */}
					{hasClearable && !isLoading && (
						<ClearButton onClear={onClear} size={size} />
					)}

					{/* Right Icon */}
					{hasIcon &&
						iconPosition === 'right' &&
						!hasClearable &&
						!isLoading && <RightIcon icon={icon} size={size} />}
				</div>
			</div>
		)
	}
)

Input.displayName = 'Input'

// Specialized input variants for common use cases
export function SearchInput(props: Omit<InputProps, 'icon' | 'type'>) {
	const searchIcon = (
		<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
			<title>Search</title>
			<path
				d='M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
			/>
		</svg>
	)

	return (
		<Input
			clearable={true}
			icon={searchIcon}
			iconPosition='left'
			type='search'
			{...props}
		/>
	)
}

export function EmailInput(props: Omit<InputProps, 'icon' | 'type'>) {
	const emailIcon = (
		<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
			<title>Email</title>
			<path
				d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
			/>
		</svg>
	)

	return <Input icon={emailIcon} iconPosition='left' type='email' {...props} />
}

export function PasswordInput(props: Omit<InputProps, 'icon' | 'type'>) {
	const lockIcon = (
		<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
			<title>Password</title>
			<path
				d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
			/>
		</svg>
	)

	return (
		<Input icon={lockIcon} iconPosition='left' type='password' {...props} />
	)
}

export function NumberInput(props: Omit<InputProps, 'type'>) {
	return <Input type='number' {...props} />
}

export function TextInput(props: Omit<InputProps, 'type'>) {
	return <Input type='text' {...props} />
}

export function LoadingInput({loading, ...props}: InputProps) {
	return <Input loading={loading} {...props} />
}
