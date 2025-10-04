import {useExercises} from '@/entities/exercise'
import {loadTranslations} from '@/shared/lib/i18n'
import {Head} from '@/shared/ui/head'
import {LoadingOrError} from '@/shared/ui/loading-or-error'
import {exerciseLibraryTranslations} from './lib/translations'
import {useExerciseFiltering} from './model/useExerciseFiltering'
import {ExerciseFilters} from './ui/ExerciseFilters'
import {ExerciseGrid} from './ui/ExerciseGrid'
import {LibraryHeader} from './ui/LibraryHeader'
import {UserSettings} from './ui/UserSettings'

export function ExerciseLibrary() {
	const {t} = loadTranslations(exerciseLibraryTranslations)
	const {data: exerciseLibrary, isLoading, error} = useExercises()

	const {
		filteredExercises,
		selectedTags,
		setSelectedTags,
		selectedDifficulties,
		setSelectedDifficulties,
		selectedLanguages,
		setSelectedLanguages,
		selectedTypes,
		setSelectedTypes,
		tagOptions,
		difficultyOptions,
		languageOptions,
		typeOptions,
		clearFilters
	} = useExerciseFiltering(exerciseLibrary)

	const errorProps = error instanceof Error ? {error} : undefined

	return (
		<>
			<Head title={t(exerciseLibraryTranslations.exerciseLibrary)} />
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<div className='mx-auto max-w-6xl px-4 py-8'>
					<LibraryHeader t={t} translations={exerciseLibraryTranslations} />

					{(isLoading || error) && <LoadingOrError {...errorProps} />}

					{exerciseLibrary && (
						<>
							<UserSettings t={t} translations={exerciseLibraryTranslations} />

							<ExerciseFilters
								difficultyOptions={difficultyOptions}
								languageOptions={languageOptions}
								selectedDifficulties={selectedDifficulties}
								selectedLanguages={selectedLanguages}
								selectedTags={selectedTags}
								selectedTypes={selectedTypes}
								setSelectedDifficulties={setSelectedDifficulties}
								setSelectedLanguages={setSelectedLanguages}
								setSelectedTags={setSelectedTags}
								setSelectedTypes={setSelectedTypes}
								t={t}
								tagOptions={tagOptions}
								translations={exerciseLibraryTranslations}
								typeOptions={typeOptions}
							/>

							<ExerciseGrid
								exercises={filteredExercises}
								onClearFilters={clearFilters}
								t={t}
								translations={exerciseLibraryTranslations}
							/>
						</>
					)}
				</div>
			</div>
		</>
	)
}
