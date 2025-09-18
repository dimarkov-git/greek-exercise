import {AnimatePresence, motion} from 'framer-motion'
import type React from 'react'
import {useEffect, useRef, useState} from 'react'
import {useSettingsStore} from '@/stores/settings'
import type {Language} from '@/types/settings'

interface HintSystemProps {
	/** Основной текст (на греческом) */
	primaryText: string
	/** Подсказки на разных языках */
	hints: Record<Language, string>
	/** Дополнительный класс для стилизации */
	className?: string
	/** Иконка для кнопки подсказки */
	icon?: React.ReactNode
	/** Позиция tooltip'а */
	placement?: 'top' | 'bottom' | 'left' | 'right'
}

type PlacementType = 'top' | 'bottom' | 'left' | 'right'

function getTooltipClasses(placement: PlacementType): string {
	const baseClasses =
		'absolute z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg'
	const maxWidth = 'max-w-xs'

	if (placement === 'top') {
		return `${baseClasses} ${maxWidth} bottom-full left-1/2 transform -translate-x-1/2 mb-2`
	}
	if (placement === 'bottom') {
		return `${baseClasses} ${maxWidth} top-full left-1/2 transform -translate-x-1/2 mt-2`
	}
	if (placement === 'left') {
		return `${baseClasses} ${maxWidth} right-full top-1/2 transform -translate-y-1/2 mr-2`
	}
	// placement === 'right'
	return `${baseClasses} ${maxWidth} left-full top-1/2 transform -translate-y-1/2 ml-2`
}

function getArrowClasses(placement: PlacementType): string {
	const baseClasses = 'absolute w-2 h-2 bg-gray-900 transform rotate-45'

	if (placement === 'top') {
		return `${baseClasses} top-full left-1/2 -translate-x-1/2 -translate-y-1/2`
	}
	if (placement === 'bottom') {
		return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 translate-y-1/2`
	}
	if (placement === 'left') {
		return `${baseClasses} left-full top-1/2 -translate-x-1/2 -translate-y-1/2`
	}
	// placement === 'right'
	return `${baseClasses} right-full top-1/2 translate-x-1/2 -translate-y-1/2`
}

function useMobileDetection() {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
		}

		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	return isMobile
}

function useClickOutside(
	isVisible: boolean,
	hintRef: React.RefObject<HTMLDivElement>,
	triggerRef: React.RefObject<HTMLButtonElement>,
	onClose: () => void
) {
	useEffect(() => {
		if (!isVisible) return

		const handleClickOutside = (event: MouseEvent) => {
			if (
				hintRef.current &&
				triggerRef.current &&
				!hintRef.current.contains(event.target as Node) &&
				!triggerRef.current.contains(event.target as Node)
			) {
				onClose()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isVisible, hintRef, triggerRef, onClose])
}

function HintButton({
	icon,
	hintText,
	isMobile,
	isVisible,
	onToggle,
	onMouseEnter,
	onMouseLeave,
	triggerRef
}: {
	icon?: React.ReactNode
	hintText: string
	isMobile: boolean
	isVisible: boolean
	onToggle: () => void
	onMouseEnter: () => void
	onMouseLeave: () => void
	triggerRef: React.RefObject<HTMLButtonElement>
}) {
	const handleClick = () => {
		if (isMobile && 'vibrate' in navigator && !isVisible) {
			navigator.vibrate(50)
		}
		onToggle()
	}

	return (
		<button
			aria-label={`Показать подсказку: ${hintText}`}
			className='rounded p-1 text-blue-500 transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
			onClick={handleClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			ref={triggerRef}
			style={{
				minWidth: '24px',
				minHeight: '24px'
			}}
			type='button'
		>
			{icon || (
				<svg
					className='h-4 w-4'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<title>Hint icon</title>
					<path
						d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
					/>
				</svg>
			)}
		</button>
	)
}

function HintTooltip({
	placement,
	hintText,
	hintRef
}: {
	placement: PlacementType
	hintText: string
	hintRef: React.RefObject<HTMLDivElement>
}) {
	return (
		<motion.div
			animate={{opacity: 1, scale: 1, y: 0}}
			className={getTooltipClasses(placement)}
			exit={{opacity: 0, scale: 0.8, y: placement === 'top' ? 10 : -10}}
			initial={{
				opacity: 0,
				scale: 0.8,
				y: placement === 'top' ? 10 : -10
			}}
			ref={hintRef}
			transition={{duration: 0.15, ease: 'easeOut'}}
		>
			{hintText}
			<div className={getArrowClasses(placement)} />
		</motion.div>
	)
}

/**
 * Универсальная система подсказок с адаптивным UI
 * - Hover на десктопе
 * - Тап на мобильных устройствах
 * - Автоматическое позиционирование tooltip'ов
 */
export function HintSystem({
	primaryText,
	hints,
	className = '',
	icon,
	placement = 'top'
}: HintSystemProps) {
	const [isHintVisible, setIsHintVisible] = useState(false)
	const hintRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const {userLanguage} = useSettingsStore()
	const isMobile = useMobileDetection()

	useClickOutside(isHintVisible, hintRef, triggerRef, () =>
		setIsHintVisible(false)
	)

	const hintText = hints[userLanguage] || hints.en || ''
	const hasHint = hintText.length > 0

	const handleToggle = () => {
		if (!hasHint) return
		setIsHintVisible(!isHintVisible)
	}

	const handleMouseEnter = () => {
		if (!isMobile && hasHint) {
			setIsHintVisible(true)
		}
	}

	const handleMouseLeave = () => {
		if (!isMobile) {
			setIsHintVisible(false)
		}
	}

	if (!hasHint) {
		return <span className={className}>{primaryText}</span>
	}

	return (
		<div className={`relative inline-block ${className}`}>
			<div className='flex items-center gap-2'>
				<span>{primaryText}</span>
				<HintButton
					hintText={hintText}
					icon={icon}
					isMobile={isMobile}
					isVisible={isHintVisible}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onToggle={handleToggle}
					triggerRef={triggerRef}
				/>
			</div>

			<AnimatePresence>
				{isHintVisible && (
					<HintTooltip
						hintRef={hintRef}
						hintText={hintText}
						placement={placement}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}

/**
 * Упрощенная версия HintSystem для быстрого использования
 */
interface SimpleHintProps {
	children: string
	hint: string
	className?: string
}

export function SimpleHint({children, hint, className = ''}: SimpleHintProps) {
	// Create Record<Language, string> for compatibility with HintSystem
	const hints: Record<Language, string> = {
		el: hint,
		ru: hint,
		en: hint
	}

	return (
		<HintSystem className={className} hints={hints} primaryText={children} />
	)
}
