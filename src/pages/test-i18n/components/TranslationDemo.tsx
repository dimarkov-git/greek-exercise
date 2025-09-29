import {motion} from 'framer-motion'
import {
	type TestShowcaseTranslationKey,
	testShowcaseTranslations,
	useTranslations
} from '@/shared/lib/i18n'

interface TranslationDemoProps {
	readonly isLoading: boolean
	readonly scenario: 'basic' | 'missing' | 'status' | 'fixed' | 'unicode'
	readonly t: (key: TestShowcaseTranslationKey) => string
}

function BasicDemo({t}: Pick<TranslationDemoProps, 't'>) {
	return (
		<div className='space-y-4'>
			<div className='rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700'>
				<h4 className='font-medium text-gray-900 dark:text-white'>
					{t('testI18n.demo.greeting')}
				</h4>
				<p className='mt-2 text-gray-600 dark:text-gray-300'>
					{t('testI18n.demo.welcome')}
				</p>
				<p className='mt-2 text-gray-600 dark:text-gray-300'>
					{t('testI18n.demo.instructions')}
				</p>
			</div>

			<div className='rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
				<p className='font-medium text-blue-800 text-sm dark:text-blue-200'>
					Sample Content:
				</p>
				<p className='mt-1 text-blue-700 dark:text-blue-300'>
					{t('testI18n.scenarios.basic.sampleText')}
				</p>
				<div className='mt-2 whitespace-pre-wrap text-blue-700 text-sm dark:text-blue-300'>
					{t('testI18n.scenarios.basic.multilineText')}
				</div>
			</div>
		</div>
	)
}

function MissingDemo({t}: Pick<TranslationDemoProps, 't'>) {
	const {t: tFallback} = useTranslations(testShowcaseTranslations, {
		missingPolicy: 'fallback'
	})
	const {t: tKey} = useTranslations(testShowcaseTranslations, {
		missingPolicy: 'key'
	})

	return (
		<div className='space-y-4'>
			<div className='grid gap-4 md:grid-cols-2'>
				<div className='rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20'>
					<h4 className='font-medium text-green-800 dark:text-green-200'>
						{t('testI18n.scenarios.missing.fallbackPolicy')}
					</h4>
					<p className='mt-2 text-green-700 dark:text-green-300'>
						{tFallback(
							'testI18n.scenarios.missing.missingKey' as TestShowcaseTranslationKey
						)}
					</p>
					<code className='mt-2 block font-mono text-green-600 text-xs dark:text-green-400'>
						Policy: "fallback"
					</code>
				</div>

				<div className='rounded-md border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20'>
					<h4 className='font-medium text-orange-800 dark:text-orange-200'>
						{t('testI18n.scenarios.missing.keyPolicy')}
					</h4>
					<p className='mt-2 text-orange-700 dark:text-orange-300'>
						{tKey(
							'testI18n.scenarios.missing.missingKey' as TestShowcaseTranslationKey
						)}
					</p>
					<code className='mt-2 block font-mono text-orange-600 text-xs dark:text-orange-400'>
						Policy: "key"
					</code>
				</div>
			</div>

			<div className='rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20'>
				<p className='text-sm text-yellow-800 dark:text-yellow-200'>
					<strong>Note:</strong> The missing key
					"testI18n.scenarios.missing.missingKey" demonstrates how the i18n
					system handles translation keys that don't exist in the current
					language.
				</p>
			</div>
		</div>
	)
}

function StatusDemo({
	t,
	isLoading
}: Pick<TranslationDemoProps, 't' | 'isLoading'>) {
	const {status, missingKeys, error} = useTranslations(testShowcaseTranslations)

	return (
		<div className='space-y-4'>
			<div className='rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700'>
				<dl className='grid gap-4 sm:grid-cols-2'>
					<div>
						<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
							Current Status
						</dt>
						<dd className='mt-1 font-semibold text-gray-900 dark:text-white'>
							{t(
								`testI18n.scenarios.status.${status}` as TestShowcaseTranslationKey
							)}
						</dd>
					</div>
					<div>
						<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
							Loading
						</dt>
						<dd className='mt-1 font-semibold text-gray-900 dark:text-white'>
							{isLoading ? 'Yes' : 'No'}
						</dd>
					</div>
					<div>
						<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
							Missing Keys
						</dt>
						<dd className='mt-1 font-semibold text-gray-900 dark:text-white'>
							{missingKeys.length}
						</dd>
					</div>
					<div>
						<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
							Error
						</dt>
						<dd className='mt-1 font-semibold text-gray-900 dark:text-white'>
							{error ? error.message : 'None'}
						</dd>
					</div>
				</dl>
			</div>

			{isLoading && (
				<motion.div
					animate={{opacity: [0.5, 1, 0.5]}}
					className='rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'
					transition={{repeat: Number.POSITIVE_INFINITY, duration: 1.5}}
				>
					<p className='text-blue-800 dark:text-blue-200'>
						Loading translations...
					</p>
				</motion.div>
			)}
		</div>
	)
}

function FixedDemo({t}: Pick<TranslationDemoProps, 't'>) {
	return (
		<div className='space-y-4'>
			<div className='rounded-md border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20'>
				<h4 className='font-medium text-purple-800 dark:text-purple-200'>
					Fixed Language Examples:
				</h4>
				<div className='mt-3 space-y-2'>
					<div className='flex items-center justify-between'>
						<span className='text-purple-700 dark:text-purple-300'>
							Title (always English):
						</span>
						<span className='font-semibold text-purple-900 dark:text-purple-100'>
							{t('testI18n.scenarios.fixed.title')}
						</span>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-purple-700 dark:text-purple-300'>
							Greek Sample (always Greek):
						</span>
						<span className='font-semibold text-purple-900 dark:text-purple-100'>
							{t('testI18n.scenarios.unicode.greekSample')}
						</span>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-purple-700 dark:text-purple-300'>
							Cyrillic Sample (always Russian):
						</span>
						<span className='font-semibold text-purple-900 dark:text-purple-100'>
							{t('testI18n.scenarios.unicode.cyrillicSample')}
						</span>
					</div>
				</div>
			</div>

			<div className='rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700'>
				<p className='text-gray-600 text-sm dark:text-gray-300'>
					<strong>Fixed language keys</strong> remain in their designated
					language regardless of the current UI language setting. This is useful
					for proper nouns, technical terms, or content that should always
					appear in a specific language.
				</p>
			</div>
		</div>
	)
}

function UnicodeDemo({t}: Pick<TranslationDemoProps, 't'>) {
	return (
		<div className='space-y-4'>
			<div className='grid gap-4 md:grid-cols-3'>
				<div className='rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
					<h4 className='font-medium text-blue-800 dark:text-blue-200'>
						Greek (Ελληνικά)
					</h4>
					<p className='mt-2 text-blue-700 text-lg dark:text-blue-300'>
						{t('testI18n.scenarios.unicode.greekSample')}
					</p>
				</div>

				<div className='rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
					<h4 className='font-medium text-red-800 dark:text-red-200'>
						Russian (Русский)
					</h4>
					<p className='mt-2 text-lg text-red-700 dark:text-red-300'>
						{t('testI18n.scenarios.unicode.cyrillicSample')}
					</p>
				</div>

				<div className='rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20'>
					<h4 className='font-medium text-green-800 dark:text-green-200'>
						Mixed Content
					</h4>
					<p className='mt-2 text-green-700 text-lg dark:text-green-300'>
						{t('testI18n.scenarios.unicode.mixedSample')}
					</p>
				</div>
			</div>

			<div className='rounded-md border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20'>
				<h4 className='font-medium text-indigo-800 dark:text-indigo-200'>
					Unicode Support
				</h4>
				<p className='mt-2 text-indigo-700 text-sm dark:text-indigo-300'>
					The i18n system properly handles Unicode characters including Greek
					letters (α, β, γ, δ), Cyrillic script, accented characters, and
					complex scripts. All text is normalized and properly encoded for
					consistent display and processing.
				</p>
			</div>
		</div>
	)
}

export function TranslationDemo({
	scenario,
	isLoading,
	t
}: TranslationDemoProps) {
	// biome-ignore lint/nursery/noUnnecessaryConditions: scenario is a union type requiring switch handling
	switch (scenario) {
		case 'basic':
			return <BasicDemo t={t} />
		case 'missing':
			return <MissingDemo t={t} />
		case 'status':
			return <StatusDemo isLoading={isLoading} t={t} />
		case 'fixed':
			return <FixedDemo t={t} />
		case 'unicode':
			return <UnicodeDemo t={t} />
		default:
			return null
	}
}
