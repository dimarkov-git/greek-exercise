import {AnimatePresence, motion} from 'framer-motion'
import type {ReactNode} from 'react'
import {cn} from '@/lib/utils'

export type PulseState = 'correct' | 'incorrect' | 'skip' | null

interface PulseEffectProps {
	children: ReactNode
	pulseState: PulseState // null = no effect, 'correct' = green, 'incorrect' = red, 'skip' = yellow
	onAnimationComplete?: (() => void) | undefined
	className?: string
}

function getEffectColors(state: 'correct' | 'incorrect' | 'skip') {
	if (state === 'correct') {
		return {
			shadow: 'rgba(34, 197, 94, 0.4)', // green for correct answer
			border: '#22c55e' // green border
		}
	}
	if (state === 'incorrect') {
		return {
			shadow: 'rgba(239, 68, 68, 0.4)', // red for incorrect answer
			border: '#ef4444' // red border
		}
	}
	// skip case
	return {
		shadow: 'rgba(234, 179, 8, 0.4)', // yellow for skipped answer
		border: '#eab308' // yellow border
	}
}

export function PulseEffect({
	children,
	pulseState,
	onAnimationComplete,
	className = ''
}: PulseEffectProps) {
	return (
		<div className={cn('relative', className)}>
			<AnimatePresence>
				{pulseState !== null && (
					<motion.div
						animate={{
							scale: [1, 1.02, 1],
							boxShadow: [
								'0 0 0 0 transparent',
								`0 0 0 8px ${getEffectColors(pulseState).shadow}`,
								'0 0 0 0 transparent'
							],
							borderWidth: ['0px', '2px', '0px'],
							borderColor: [
								'transparent',
								getEffectColors(pulseState).border,
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
	trigger: PulseState
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
			onAnimationComplete={onComplete}
			pulseState={trigger}
		>
			{children}
		</PulseEffect>
	)
}
