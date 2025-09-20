import {useCallback, useState} from 'react'
import {useTranslations} from '@/hooks/useTranslations'
import type {WordFormExercise} from '@/types/exercises'
import type {TranslationRequest} from '@/types/translations'

const JSON_VIEW_TRANSLATIONS: TranslationRequest[] = [
	{
		key: 'copyJson',
		fallback: 'Copy JSON'
	},
	{
		key: 'jsonCopied',
		fallback: 'JSON copied to clipboard'
	},
	{
		key: 'copyFailed',
		fallback: 'Failed to copy'
	}
]

interface JsonViewProps {
	exercise: WordFormExercise
}

export function JsonView({exercise}: JsonViewProps) {
	const {t} = useTranslations(JSON_VIEW_TRANSLATIONS)
	const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>(
		'idle'
	)

	const jsonString = JSON.stringify(exercise, null, 2)

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(jsonString)
			setCopyStatus('success')
			setTimeout(() => setCopyStatus('idle'), 2000)
		} catch {
			setCopyStatus('error')
			setTimeout(() => setCopyStatus('idle'), 2000)
		}
	}, [jsonString])

	const getButtonClasses = () => {
		switch (copyStatus) {
			case 'success':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
			case 'error':
				return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
			default:
				return 'bg-blue-600 text-white hover:bg-blue-700'
		}
	}

	const renderButtonContent = () => {
		switch (copyStatus) {
			case 'success':
				return (
					<>
						<svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
							<title>Success</title>
							<path
								clipRule='evenodd'
								d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
								fillRule='evenodd'
							/>
						</svg>
						{t('jsonCopied')}
					</>
				)
			case 'error':
				return (
					<>
						<svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
							<title>Error</title>
							<path
								clipRule='evenodd'
								d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
								fillRule='evenodd'
							/>
						</svg>
						{t('copyFailed')}
					</>
				)
			default:
				return (
					<>
						<svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
							<title>Copy</title>
							<path d='M8 2a1 1 0 000 2h2a1 1 0 100-2H8z' />
							<path d='M3 5a2 2 0 012-2 3 3 0 003 3h6a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L13.414 15H18v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2v2h-2v-2z' />
						</svg>
						{t('copyJson')}
					</>
				)
		}
	}

	return (
		<div className='p-6'>
			{/* Header with copy button */}
			<div className='mb-4 flex items-center justify-between'>
				<h3 className='font-semibold text-gray-900 text-lg dark:text-white'>
					{exercise.title}
				</h3>
				<button
					className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-colors ${getButtonClasses()}`}
					onClick={handleCopy}
					type='button'
				>
					{renderButtonContent()}
				</button>
			</div>

			{/* JSON content with syntax highlighting */}
			<div className='relative'>
				<pre className='overflow-auto rounded-lg bg-gray-50 p-4 text-sm leading-relaxed dark:bg-gray-900'>
					<code className='font-mono text-gray-800 dark:text-gray-200'>
						{jsonString.split('\n').map((line, index) => (
							<div className='min-h-[1.25rem]' key={`line-${index}`}>
								{/* Line numbers */}
								<span className='mr-4 select-none text-gray-400 dark:text-gray-600'>
									{String(index + 1).padStart(3, ' ')}
								</span>
								{/* Syntax highlighting */}
								<span
									dangerouslySetInnerHTML={{
										__html: highlightJsonLine(line)
									}}
								/>
							</div>
						))}
					</code>
				</pre>
			</div>
		</div>
	)
}

/**
 * Simple JSON syntax highlighting
 */
function highlightJsonLine(line: string): string {
	return (
		line
			// Strings (including keys)
			.replace(
				/"([^"\\]|\\.)*"/g,
				'<span class="text-green-600 dark:text-green-400">$&</span>'
			)
			// Numbers
			.replace(
				/\b\d+(\.\d+)?\b/g,
				'<span class="text-blue-600 dark:text-blue-400">$&</span>'
			)
			// Booleans
			.replace(
				/\b(true|false)\b/g,
				'<span class="text-purple-600 dark:text-purple-400">$&</span>'
			)
			// null
			.replace(
				/\bnull\b/g,
				'<span class="text-red-600 dark:text-red-400">$&</span>'
			)
			// Brackets and braces
			.replace(
				/[{}[\]]/g,
				'<span class="text-gray-600 dark:text-gray-300 font-bold">$&</span>'
			)
			// Colons and commas
			.replace(
				/[:,]/g,
				'<span class="text-gray-500 dark:text-gray-400">$&</span>'
			)
	)
}
