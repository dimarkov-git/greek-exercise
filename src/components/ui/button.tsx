import {cva, type VariantProps} from 'class-variance-authority'
import {motion} from 'framer-motion'
import {type ButtonHTMLAttributes, forwardRef} from 'react'
import {cn} from '@/lib/utils'

const buttonVariants = cva(
	// Base styles using CSS custom properties
	'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				primary:
					'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] focus-visible:ring-[var(--color-focus-ring)]',
				secondary:
					'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)] active:bg-[var(--color-secondary-active)] focus-visible:ring-[var(--color-focus-ring)]',
				success:
					'bg-[var(--color-success)] text-white hover:bg-[var(--color-success-hover)] active:bg-[var(--color-success-active)] focus-visible:ring-[var(--color-focus-ring)]',
				error:
					'bg-[var(--color-error)] text-white hover:bg-[var(--color-error-hover)] active:bg-[var(--color-error-active)] focus-visible:ring-[var(--color-focus-ring)]',
				warning:
					'bg-[var(--color-warning)] text-white hover:bg-[var(--color-warning-hover)] active:bg-[var(--color-warning-active)] focus-visible:ring-[var(--color-focus-ring)]',
				info: 'bg-[var(--color-info)] text-white hover:bg-[var(--color-info-hover)] active:bg-[var(--color-info-active)] focus-visible:ring-[var(--color-focus-ring)]',
				outline:
					'border-2 border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-hover-overlay)] hover:border-[var(--color-border-strong)] active:bg-[var(--color-active-overlay)] focus-visible:ring-[var(--color-focus-ring)]',
				ghost:
					'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-hover-overlay)] active:bg-[var(--color-active-overlay)] focus-visible:ring-[var(--color-focus-ring)]',
				link: 'bg-transparent text-[var(--color-primary)] underline-offset-4 hover:underline hover:text-[var(--color-primary-hover)] active:text-[var(--color-primary-active)] focus-visible:ring-[var(--color-focus-ring)]'
			},
			size: {
				sm: 'h-8 px-3 text-xs',
				default: 'h-10 px-4 py-2',
				lg: 'h-12 px-6 text-base',
				xl: 'h-14 px-8 text-lg',
				icon: 'h-10 w-10 p-0'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'default'
		}
	}
)

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
	loading?: boolean
	motionEnabled?: boolean
	loadingText?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			loading = false,
			motionEnabled = true,
			loadingText,
			disabled,
			children,
			...props
		},
		ref
	) => {
		const isDisabled = disabled || loading

		const buttonContent = (
			<>
				{loading && (
					<div
						aria-hidden='true'
						className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent'
					/>
				)}
				{loading && loadingText ? loadingText : children}
			</>
		)

		const buttonElement = (
			<button
				aria-busy={loading}
				aria-disabled={isDisabled}
				className={cn(buttonVariants({variant, size, className}))}
				disabled={isDisabled}
				ref={ref}
				{...props}
			>
				{buttonContent}
			</button>
		)

		// Enhanced button with motion effects
		if (motionEnabled && !isDisabled) {
			return (
				<motion.div
					transition={{type: 'spring', stiffness: 400, damping: 25}}
					whileHover={{scale: 1.02}}
					whileTap={{scale: 0.98}}
				>
					{buttonElement}
				</motion.div>
			)
		}

		return buttonElement
	}
)

Button.displayName = 'Button'

// Specialized button variants for common use cases
export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
	return <Button variant='primary' {...props} />
}

export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
	return <Button variant='secondary' {...props} />
}

export function SuccessButton(props: Omit<ButtonProps, 'variant'>) {
	return <Button variant='success' {...props} />
}

export function ErrorButton(props: Omit<ButtonProps, 'variant'>) {
	return <Button variant='error' {...props} />
}

export function WarningButton(props: Omit<ButtonProps, 'variant'>) {
	return <Button variant='warning' {...props} />
}

export function InfoButton(props: Omit<ButtonProps, 'variant'>) {
	return <Button variant='info' {...props} />
}

export function OutlineButton(props: Omit<ButtonProps, 'variant'>) {
	return <Button variant='outline' {...props} />
}

export function GhostButton(props: Omit<ButtonProps, 'variant'>) {
	return <Button variant='ghost' {...props} />
}

export function LinkButton(props: Omit<ButtonProps, 'variant'>) {
	return <Button variant='link' {...props} />
}

export function IconButton(props: Omit<ButtonProps, 'size'>) {
	return <Button size='icon' {...props} />
}

export function LoadingButton({loading, children, ...props}: ButtonProps) {
	return (
		<Button loading={loading ?? false} {...props}>
			{loading ? 'Loading...' : children}
		</Button>
	)
}
