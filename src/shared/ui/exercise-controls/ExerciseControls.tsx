/**
 * Exercise Controls Component
 *
 * Reusable header controls for exercises:
 * - Back to Library button
 * - Auto-advance toggle
 * - Settings button
 */

import {Link} from 'react-router'
import type {TranslationEntry} from '@/shared/lib/i18n'
import {loadTranslations} from '@/shared/lib/i18n'
import {
	ExerciseSettingsPanel,
	type ExerciseSettingsPanelProps
} from '../exercise-settings-panel'
import {translations} from './translations'

type ExerciseTranslator = (entry: string | TranslationEntry) => string

interface BackButtonProps {
	t: ExerciseTranslator
}

function BackButton({t}: BackButtonProps) {
	return (
		<Link
			className='flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
			data-testid='exercise-back-button'
			to='/exercises'
		>
			<svg
				className='h-5 w-5'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<title>{t(translations.backArrow)}</title>
				<path
					d='M15 19l-7-7 7-7'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
				/>
			</svg>
			{t(translations.backToLibrary)}
		</Link>
	)
}

interface AutoAdvanceToggleProps {
	t: ExerciseTranslator
	onToggleAutoAdvance: () => void
	autoAdvanceEnabled: boolean
}

function AutoAdvanceToggle({
	t,
	onToggleAutoAdvance,
	autoAdvanceEnabled
}: AutoAdvanceToggleProps) {
	return (
		<button
			className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
				autoAdvanceEnabled
					? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
					: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
			}`}
			data-enabled={autoAdvanceEnabled}
			data-testid='auto-advance-toggle'
			onClick={onToggleAutoAdvance}
			title={
				autoAdvanceEnabled
					? t(translations.autoAdvanceEnabled)
					: t(translations.autoAdvanceDisabled)
			}
			type='button'
		>
			{autoAdvanceEnabled ? (
				<svg
					className='h-4 w-4'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<title>{t(translations.autoAdvanceEnabledIcon)}</title>
					<path
						d='M14.828 14.828a4 4 0 01-5.656 0M9 10h6m-3-3v6m3.586-5.414L16 7.172V20a2 2 0 01-2 2H10a2 2 0 01-2-2V7.172l.414-.414A2 2 0 019.828 6h4.344a2 2 0 011.414.586z'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
					/>
				</svg>
			) : (
				<svg
					className='h-4 w-4'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<title>{t(translations.autoAdvanceDisabledIcon)}</title>
					<path
						d='M10 9v6m4-6v6'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
					/>
				</svg>
			)}
			{t(translations.autoAdvance)}
		</button>
	)
}

export interface ExerciseControlsProps<
	T extends Record<string, unknown> = Record<string, unknown>
> {
	/**
	 * Show back to library button
	 */
	showBackButton?: boolean
	/**
	 * Show auto-advance toggle
	 */
	showAutoAdvanceToggle?: boolean
	/**
	 * Auto-advance enabled state
	 */
	autoAdvanceEnabled?: boolean
	/**
	 * Auto-advance toggle handler
	 */
	onToggleAutoAdvance?: (() => void) | undefined
	/**
	 * Show settings button
	 */
	showSettings?: boolean
	/**
	 * Settings panel props (required if showSettings is true)
	 */
	settingsProps?:
		| Omit<ExerciseSettingsPanelProps<T>, 'isOpen' | 'onToggle' | 'children'>
		| undefined
}

/**
 * Exercise Controls Component
 *
 * Provides consistent header controls across all exercise types
 */
export function ExerciseControls<
	T extends Record<string, unknown> = Record<string, unknown>
>({
	showBackButton = true,
	showAutoAdvanceToggle = false,
	autoAdvanceEnabled = true,
	onToggleAutoAdvance,
	showSettings = false,
	settingsProps
}: ExerciseControlsProps<T>) {
	const {t} = loadTranslations(translations)

	return (
		<div className='mb-4 flex items-center justify-between'>
			{showBackButton && <BackButton t={t as ExerciseTranslator} />}

			<div className='flex items-center gap-2'>
				{showAutoAdvanceToggle && onToggleAutoAdvance && (
					<AutoAdvanceToggle
						autoAdvanceEnabled={autoAdvanceEnabled}
						onToggleAutoAdvance={onToggleAutoAdvance}
						t={t as ExerciseTranslator}
					/>
				)}
				{showSettings && settingsProps && (
					<ExerciseSettingsPanel {...settingsProps} />
				)}
			</div>
		</div>
	)
}
