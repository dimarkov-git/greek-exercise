import {motion} from 'framer-motion'
import {loadTranslations} from '@/shared/lib/i18n'
import {Head} from '@/shared/ui/head'
import {
	BuilderHero,
	JsonEditorPanel,
	PreviewPanel,
	SavedExercisesSection,
	TypeSelectorPanel,
	ValidationPanel
} from './exercise-builder/components'
import {
	type BuilderTranslator,
	type ExerciseBuilderState,
	useExerciseBuilderState,
	useFormattedSavedExercises
} from './exercise-builder/state'
import {exerciseBuilderPageTranslations} from './translations'

interface ExerciseBuilderViewProps extends ExerciseBuilderState {
	readonly t: BuilderTranslator
}

export function ExerciseBuilder() {
	const {t} = loadTranslations(exerciseBuilderPageTranslations)
	const state = useExerciseBuilderState(t as unknown as BuilderTranslator)

	return (
		<ExerciseBuilderView {...state} t={t as unknown as BuilderTranslator} />
	)
}

function ExerciseBuilderView({
	t,
	selectedType,
	jsonValue,
	validation,
	saveStatus,
	savedExercises,
	previewExercise,
	hasErrors,
	handleTypeChange,
	handleJsonChange,
	handleReset,
	handleFormat,
	handleSave,
	handleLoadSaved,
	handleDeleteSaved
}: ExerciseBuilderViewProps) {
	const formattedSavedExercises = useFormattedSavedExercises(savedExercises)

	return (
		<>
			<Head title={t(exerciseBuilderPageTranslations.exerciseBuilder)} />
			<motion.div
				animate={{opacity: 1}}
				className='min-h-screen bg-gray-50 pb-16 dark:bg-gray-950'
				initial={{opacity: 0}}
			>
				<div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
					<BuilderHero t={t} />
					<div className='mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start'>
						<section className='space-y-6'>
							<TypeSelectorPanel
								onTypeChange={handleTypeChange}
								selectedType={selectedType}
								t={t}
							/>
							<JsonEditorPanel
								hasErrors={hasErrors}
								jsonValue={jsonValue}
								onFormat={handleFormat}
								onJsonChange={handleJsonChange}
								onReset={handleReset}
								onSave={handleSave}
								saveStatus={saveStatus}
								t={t}
							/>
						</section>
						<section className='space-y-6'>
							<ValidationPanel
								hasErrors={hasErrors}
								t={t}
								validationErrors={validation.errors}
							/>
							<PreviewPanel previewExercise={previewExercise} t={t} />
							<SavedExercisesSection
								formattedSavedExercises={formattedSavedExercises}
								onDelete={handleDeleteSaved}
								onLoad={handleLoadSaved}
								t={t}
							/>
						</section>
					</div>
				</div>
			</motion.div>
		</>
	)
}
