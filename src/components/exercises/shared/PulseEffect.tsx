import {AnimatePresence, motion} from 'framer-motion'
import type {ReactNode} from 'react'

interface PulseEffectProps {
	children: ReactNode
	isCorrect: boolean | null // null = no effect, true = green, false = red
	onAnimationComplete?: (() => void) | undefined
	className?: string
}

/**
 * Компонент для анимации импульса (зеленый/красный) после ответа
 * Используется для визуальной обратной связи при проверке ответов
 */
export function PulseEffect({
	children,
	isCorrect,
	onAnimationComplete,
	className = ''
}: PulseEffectProps) {
	// Define colors for different states
	const getEffectColors = (correct: boolean) => ({
		shadow: correct
			? 'rgba(34, 197, 94, 0.4)' // green for correct answer
			: 'rgba(239, 68, 68, 0.4)', // red for incorrect answer
		border: correct
			? '#22c55e' // green border
			: '#ef4444' // red border
	})

	return (
		<div className={`relative ${className}`}>
			<AnimatePresence>
				{isCorrect !== null && (
					<motion.div
						animate={{
							scale: [1, 1.02, 1],
							boxShadow: [
								'0 0 0 0 transparent',
								`0 0 0 8px ${getEffectColors(isCorrect).shadow}`,
								'0 0 0 0 transparent'
							],
							borderWidth: ['0px', '2px', '0px'],
							borderColor: [
								'transparent',
								getEffectColors(isCorrect).border,
								'transparent'
							]
						}}
						className='pointer-events-none absolute inset-0 rounded-lg'
						exit={{
							scale: 1,
							boxShadow: '0 0 0 0 transparent',
							borderWidth: '0px',
							borderColor: 'transparent'
						}}
						initial={{
							scale: 1,
							boxShadow: '0 0 0 0 transparent',
							borderWidth: '0px',
							borderColor: 'transparent'
						}}
						onAnimationComplete={() => {
							onAnimationComplete?.()
						}}
						style={{
							borderStyle: 'solid'
						}}
						transition={{
							duration: 0.6,
							ease: [0.4, 0.0, 0.2, 1],
							times: [0, 0.3, 1]
						}}
					/>
				)}
			</AnimatePresence>

			{/* Main content */}
			<div className='relative z-10'>{children}</div>
		</div>
	)
}

// Simple component for quick pulse usage
interface QuickPulseProps {
	children: ReactNode
	trigger: boolean | null
	onComplete?: () => void
	className?: string
}

export function QuickPulse({
	children,
	trigger,
	onComplete,
	className = ''
}: QuickPulseProps) {
	return (
		<PulseEffect
			className={className}
			isCorrect={trigger}
			onAnimationComplete={onComplete}
		>
			{children}
		</PulseEffect>
	)
}
