import {motion} from 'framer-motion'
import {testShowcaseTranslations, useTranslations} from '@/shared/lib/i18n'
import {Head} from '@/shared/ui/head'
import {TranslatedText} from '@/shared/ui/translated-text'
import {LanguageControls} from './components/LanguageControls'
import {ScenarioTabs} from './components/ScenarioTabs'

export function TestI18nPage() {
	const {t, isLoading, currentLanguage, status, missingKeys} = useTranslations(
		testShowcaseTranslations
	)

	return (
		<>
			<Head title={t('testI18n.pageTitle')} />
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<div className='mx-auto max-w-6xl px-4 py-8'>
					{/* Page Header */}
					<motion.div
						animate={{opacity: 1, y: 0}}
						className='mb-8'
						initial={{opacity: 0, y: -20}}
					>
						<div className='text-center'>
							<TranslatedText
								as='h1'
								className='mb-4 font-bold text-3xl text-gray-900 md:text-4xl dark:text-white'
								isLoading={isLoading}
								skeletonHeight='3rem'
								skeletonWidth='400px'
								text={t('testI18n.pageTitle')}
							/>
							<TranslatedText
								as='p'
								className='mx-auto max-w-2xl text-gray-600 text-lg dark:text-gray-300'
								isLoading={isLoading}
								skeletonHeight='1.5rem'
								skeletonWidth='600px'
								text={t('testI18n.pageDescription')}
							/>
						</div>
					</motion.div>

					{/* Language Controls */}
					<motion.div
						animate={{opacity: 1, y: 0}}
						className='mb-8'
						initial={{opacity: 0, y: 20}}
						transition={{delay: 0.2}}
					>
						<LanguageControls
							currentLanguage={currentLanguage}
							isLoading={isLoading}
							missingKeys={missingKeys}
							status={status}
							t={t}
						/>
					</motion.div>

					{/* Test Scenarios */}
					<motion.div
						animate={{opacity: 1, y: 0}}
						initial={{opacity: 0, y: 20}}
						transition={{delay: 0.4}}
					>
						<ScenarioTabs isLoading={isLoading} t={t} />
					</motion.div>
				</div>
			</div>
		</>
	)
}
