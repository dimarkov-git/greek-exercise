/**
 * Exercise Settings Panel
 *
 * Collapsible panel for modifying exercise settings during execution.
 * Supports different setting types with validation and reset functionality.
 */

import {useEffect, useState} from 'react'
import {loadTranslations} from '@/shared/lib/i18n'
import {Button, GhostButton, OutlineButton} from '../button'
import {exerciseSettingsTranslations} from './translations'

export interface SettingField {
	key: string
	type: 'boolean' | 'number'
	label: string
	description?: string
	min?: number
	max?: number
	step?: number
	requiresReload?: boolean
}

export interface ExerciseSettingsPanelProps<T extends Record<string, unknown>> {
	currentSettings: T
	fields: SettingField[]
	onApply: (newSettings: T) => void
	onReset: () => void
	isOpen?: boolean
	onToggle?: () => void
}

/**
 * Exercise Settings Panel Component
 *
 * Generic panel for displaying and editing exercise settings.
 * Can be used with any exercise type by providing appropriate fields.
 */
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: Complex modal component with form
export function ExerciseSettingsPanel<T extends Record<string, unknown>>({
	currentSettings,
	fields,
	onApply,
	onReset,
	isOpen: controlledIsOpen,
	onToggle: controlledOnToggle
}: ExerciseSettingsPanelProps<T>) {
	const {t} = loadTranslations(exerciseSettingsTranslations)
	const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
	const [localSettings, setLocalSettings] = useState<T>(currentSettings)
	const [isDirty, setIsDirty] = useState(false)
	const [hasReloadRequiredChanges, setHasReloadRequiredChanges] =
		useState(false)

	// Use controlled or uncontrolled state
	const isOpen = controlledIsOpen ?? uncontrolledIsOpen
	const handleToggle =
		controlledOnToggle ?? (() => setUncontrolledIsOpen(!uncontrolledIsOpen))

	// Sync local settings when currentSettings change from outside
	useEffect(() => {
		setLocalSettings(currentSettings)
		setIsDirty(false)
		setHasReloadRequiredChanges(false)
	}, [currentSettings])

	const handleFieldChange = (key: string, value: boolean | number) => {
		setLocalSettings(prev => ({...prev, [key]: value}))
		setIsDirty(true)

		// Check if this field or any changed field requires reload
		const changedField = fields.find(f => f.key === key)
		if (changedField?.requiresReload) {
			setHasReloadRequiredChanges(true)
		} else {
			// Check if any other changed field requires reload
			const hasOtherReloadFields = fields.some(
				field =>
					field.requiresReload &&
					localSettings[field.key] !== currentSettings[field.key]
			)
			setHasReloadRequiredChanges(hasOtherReloadFields)
		}
	}

	const handleApply = () => {
		onApply(localSettings)
		setIsDirty(false)
		setHasReloadRequiredChanges(false)
		handleToggle()
	}

	const handleCancel = () => {
		setLocalSettings(currentSettings)
		setIsDirty(false)
		setHasReloadRequiredChanges(false)
		handleToggle()
	}

	const handleResetToDefaults = () => {
		onReset()
		setIsDirty(false)
		setHasReloadRequiredChanges(false)
		handleToggle()
	}

	return (
		<div className='relative'>
			{/* Settings trigger button */}
			<GhostButton
				aria-expanded={isOpen}
				aria-label={t(exerciseSettingsTranslations['exerciseSettings.title'])}
				className='cursor-pointer gap-2'
				onClick={handleToggle}
				size='sm'
				type='button'
			>
				<svg
					aria-hidden='true'
					className='size-5'
					fill='none'
					stroke='currentColor'
					strokeWidth={2}
					viewBox='0 0 24 24'
				>
					<title>Settings icon</title>
					<path
						d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
					<path
						d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
				{t(exerciseSettingsTranslations['exerciseSettings.title'])}
			</GhostButton>

			{/* Settings panel */}
			{isOpen && (
				<div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm'>
					<div className='my-8 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800'>
						<div className='mb-4 flex items-center justify-between'>
							<h2 className='font-semibold text-gray-900 text-xl dark:text-white'>
								{t(exerciseSettingsTranslations['exerciseSettings.title'])}
							</h2>
							<button
								aria-label={t(
									exerciseSettingsTranslations['exerciseSettings.close']
								)}
								className='cursor-pointer rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
								onClick={handleCancel}
								type='button'
							>
								<svg
									aria-hidden='true'
									className='size-6'
									fill='none'
									stroke='currentColor'
									strokeWidth={2}
									viewBox='0 0 24 24'
								>
									<title>Close icon</title>
									<path
										d='M6 18L18 6M6 6l12 12'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</button>
						</div>

						<p className='mb-6 text-gray-600 text-sm dark:text-gray-400'>
							{t(exerciseSettingsTranslations['exerciseSettings.description'])}
						</p>

						{/* Settings fields */}
						<div className='space-y-4'>
							{fields.map(field => (
								<div className='space-y-2' key={field.key}>
									<label
										className='flex items-start justify-between gap-3'
										htmlFor={`setting-${field.key}`}
									>
										<div className='flex-1'>
											<div className='font-medium text-gray-900 text-sm dark:text-white'>
												{field.label}
											</div>
											{field.description && (
												<div className='mt-1 text-gray-600 text-xs dark:text-gray-400'>
													{field.description}
												</div>
											)}
											{field.requiresReload && (
												<div className='mt-1 text-orange-600 text-xs dark:text-orange-400'>
													⚠️{' '}
													{t(
														exerciseSettingsTranslations[
															'exerciseSettings.requiresReload'
														]
													)}
												</div>
											)}
										</div>
										{field.type === 'boolean' ? (
											<input
												checked={localSettings[field.key] as boolean}
												className='mt-1 size-5 cursor-pointer rounded border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600'
												id={`setting-${field.key}`}
												onChange={e =>
													handleFieldChange(field.key, e.target.checked)
												}
												type='checkbox'
											/>
										) : (
											<input
												className='w-24 rounded-lg border-2 border-gray-300 bg-white px-3 py-1.5 text-right text-gray-900 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600'
												id={`setting-${field.key}`}
												max={field.max}
												min={field.min}
												onChange={e =>
													handleFieldChange(field.key, Number(e.target.value))
												}
												step={field.step ?? 1}
												type='number'
												value={localSettings[field.key] as number}
											/>
										)}
									</label>
								</div>
							))}
						</div>

						{/* Action buttons */}
						<div className='mt-6 grid grid-cols-2 gap-3 overflow-hidden'>
							<Button
								className='min-w-0'
								disabled={!isDirty}
								motionEnabled={false}
								onClick={handleApply}
								size='default'
								type='button'
								variant='primary'
							>
								<span className='block overflow-hidden text-ellipsis whitespace-nowrap'>
									{hasReloadRequiredChanges
										? t(
												exerciseSettingsTranslations[
													'exerciseSettings.applyAndReload'
												]
											)
										: t(exerciseSettingsTranslations['exerciseSettings.apply'])}
								</span>
							</Button>
							<OutlineButton
								className='min-w-0'
								motionEnabled={false}
								onClick={handleResetToDefaults}
								size='default'
								type='button'
							>
								<span className='block overflow-hidden text-ellipsis whitespace-nowrap'>
									{t(exerciseSettingsTranslations['exerciseSettings.reset'])}
								</span>
							</OutlineButton>
						</div>

						<div className='mt-3'>
							<OutlineButton
								className='w-full'
								onClick={handleCancel}
								size='default'
								type='button'
							>
								{t(exerciseSettingsTranslations['exerciseSettings.cancel'])}
							</OutlineButton>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
