import {motion} from 'framer-motion'
import {useMemo} from 'react'
import type {WordFormExercise} from '@/entities/exercise'
import {
	DEFAULT_WORD_FORM_SETTINGS,
	getExerciseSettings
} from '@/entities/exercise'
import type {TranslationEntry} from '@/shared/lib/i18n'
import {loadTranslations} from '@/shared/lib/i18n'
import type {WordFormSettings} from '@/shared/model'
import {
	ExerciseControls,
	exerciseSettingsTranslations,
	type SettingField
} from '@/shared/ui'
import {translations} from './translations'

interface ExerciseHeaderProps {
	title: string
	blockName?: string
	progress?: {
		current: number
		total: number
	}
	onToggleAutoAdvance?: () => void
	autoAdvanceEnabled?: boolean
	showBackButton?: boolean
	exercise?: WordFormExercise
	onSettingsChange?: (newSettings: Partial<WordFormSettings>) => void
}

type ExerciseTranslator = (entry: string | TranslationEntry) => string

function ProgressBar({
	progress,
	t
}: {
	progress: {current: number; total: number}
	t: ExerciseTranslator
}) {
	return (
		<div className='w-full' data-testid='exercise-progress'>
			<div className='mb-2 flex items-center justify-between'>
				<span className='text-gray-600 text-sm dark:text-gray-400'>
					{t(translations.progress)}
				</span>
				<span
					className='font-medium text-gray-900 text-sm dark:text-white'
					data-progress-current={progress.current}
					data-progress-total={progress.total}
					data-testid='progress-text'
				>
					{progress.current} {t(translations.progressOf)} {progress.total}
				</span>
			</div>

			<div className='h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
				<motion.div
					animate={{
						width: `${(progress.current / progress.total) * 100}%`
					}}
					className='h-2 rounded-full bg-blue-600'
					initial={{width: 0}}
					transition={{duration: 0.5, ease: 'easeOut'}}
				/>
			</div>
		</div>
	)
}

/**
 * Exercise header with progress and controls
 */
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: Complex header with settings panel
export function ExerciseHeader({
	title,
	progress,
	onToggleAutoAdvance,
	autoAdvanceEnabled = true,
	showBackButton = true,
	exercise,
	onSettingsChange
}: ExerciseHeaderProps) {
	const {t} = loadTranslations(translations)
	const {t: tSettings} = loadTranslations(exerciseSettingsTranslations)

	const settingsFields: SettingField[] = useMemo(
		// biome-ignore lint/complexity/noExcessiveLinesPerFunction: Settings fields configuration array
		() => [
			{
				key: 'autoAdvance',
				type: 'boolean',
				label: tSettings(
					exerciseSettingsTranslations['exerciseSettings.autoAdvance']
				),
				description: tSettings(
					exerciseSettingsTranslations['exerciseSettings.autoAdvanceDesc']
				),
				requiresReload: false
			},
			{
				key: 'autoAdvanceDelayMs',
				type: 'number',
				label: tSettings(
					exerciseSettingsTranslations['exerciseSettings.autoAdvanceDelayMs']
				),
				description: tSettings(
					exerciseSettingsTranslations[
						'exerciseSettings.autoAdvanceDelayMsDesc'
					]
				),
				min: 0,
				max: 5000,
				step: 100,
				requiresReload: false
			},
			{
				key: 'allowSkip',
				type: 'boolean',
				label: tSettings(
					exerciseSettingsTranslations['exerciseSettings.allowSkip']
				),
				description: tSettings(
					exerciseSettingsTranslations['exerciseSettings.allowSkipDesc']
				),
				requiresReload: false
			},
			{
				key: 'shuffleCases',
				type: 'boolean',
				label: tSettings(
					exerciseSettingsTranslations['exerciseSettings.shuffleCases']
				),
				description: tSettings(
					exerciseSettingsTranslations['exerciseSettings.shuffleCasesDesc']
				),
				requiresReload: true
			},
			{
				key: 'shuffleBlocks',
				type: 'boolean',
				label: tSettings(
					exerciseSettingsTranslations['exerciseSettings.shuffleBlocks']
				),
				description: tSettings(
					exerciseSettingsTranslations['exerciseSettings.shuffleBlocksDesc']
				),
				requiresReload: true
			},
			{
				key: 'allowSkipTone',
				type: 'boolean',
				label: tSettings(
					exerciseSettingsTranslations['exerciseSettings.allowSkipTone']
				),
				description: tSettings(
					exerciseSettingsTranslations['exerciseSettings.allowSkipToneDesc']
				),
				requiresReload: true
			}
		],
		[tSettings]
	)

	const currentSettings = useMemo(
		() =>
			exercise
				? (getExerciseSettings(exercise) as unknown as WordFormSettings)
				: DEFAULT_WORD_FORM_SETTINGS,
		[exercise, exercise?.settings]
	)

	const handleSettingsApply = (newSettings: Record<string, unknown>) => {
		if (!onSettingsChange) return

		// Check if only autoAdvance changed (runtime setting)
		const settingsKeys = Object.keys(newSettings)
		const onlyAutoAdvanceChanged =
			settingsKeys.length === 1 && settingsKeys[0] === 'autoAdvance'

		if (onlyAutoAdvanceChanged) {
			// For runtime settings like autoAdvance, just toggle without restarting
			const settings = newSettings as Partial<WordFormSettings>
			const autoAdvanceChanged = settings.autoAdvance !== autoAdvanceEnabled
			if (onToggleAutoAdvance && autoAdvanceChanged) {
				onToggleAutoAdvance()
			}
		} else {
			// For other settings, pass them to onSettingsChange
			onSettingsChange(newSettings as Partial<WordFormSettings>)
		}
	}

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-8'
			initial={{opacity: 0, y: -20}}
		>
			{/* Top row with back button and controls */}
			<ExerciseControls
				autoAdvanceEnabled={autoAdvanceEnabled}
				onToggleAutoAdvance={onToggleAutoAdvance ?? undefined}
				settingsProps={
					onSettingsChange && exercise
						? {
								currentSettings: {...currentSettings} as Record<
									string,
									unknown
								>,
								fields: settingsFields,
								onApply: handleSettingsApply,
								onReset: () =>
									({...DEFAULT_WORD_FORM_SETTINGS}) as Record<string, unknown>
							}
						: undefined
				}
				showAutoAdvanceToggle={true}
				showBackButton={showBackButton}
				showSettings={Boolean(onSettingsChange && exercise)}
			/>

			{/* Заголовок упражнения */}
			<div className='mb-4 text-center'>
				<h1 className='mb-2 font-bold text-3xl text-gray-900 dark:text-white'>
					{title}
				</h1>
			</div>

			{progress && (
				<ProgressBar progress={progress} t={t as ExerciseTranslator} />
			)}
		</motion.div>
	)
}
