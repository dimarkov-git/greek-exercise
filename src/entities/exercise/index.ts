// Base exercise types

// API
export {createExerciseFallbackResolver} from './api/fallback'
export {exerciseMswHandlers} from './api/msw-handlers'
export {
	exerciseLibraryQueryOptions,
	exerciseQueryOptions,
	wordFormExerciseQueryOptions
} from './api/queryOptions'
export {useExercise, useExercises} from './api/useExercises'
// Exercise component factory
export type {ExerciseComponentSet} from './lib/exercise-component-factory'
export {
	canExecuteExercise,
	canLearnExercise,
	getExerciseComponents,
	getExerciseLearnView,
	getExerciseLibraryCard,
	getExerciseRenderer,
	getExerciseTypeAvailability
} from './lib/exercise-component-factory'
// Library utilities
export {
	calculateAccuracy,
	checkAnswer,
	extractExerciseMetadata,
	filterExercisesByDifficulty,
	filterExercisesByTags,
	formatDuration,
	generateId,
	getAllTags,
	getCaseByIndices,
	getCompletedCasesCount,
	getNextIndices,
	getTotalCases,
	normalizeGreekText,
	normalizeGreekTextWithoutTones,
	shuffleExerciseCases
} from './lib/exercises'
// Adapters
export {
	createExerciseLibraryViewModel,
	toExerciseSummary,
	toFlashcardExerciseWithDefaults,
	toWordFormExerciseWithDefaults
} from './model/adapters'
// Custom exercise utilities
export {
	wordFormExerciseJsonToExercise,
	wordFormExerciseJsonToMetadata
} from './model/custom'
// Custom exercises store
export {
	type CustomExerciseRecord,
	type CustomExercisesState,
	selectCustomExerciseList,
	selectCustomExercises,
	useCustomExercisesStore
} from './model/custom-exercises-store'
// Domain types
export type {
	ExerciseFilterSelection,
	ExerciseLibraryFilterOptions,
	ExerciseLibraryTotals,
	ExerciseLibraryViewModel,
	ExerciseSource,
	ExerciseSummary,
	FlashcardExerciseWithDefaults,
	WordFormExerciseWithDefaults
} from './model/domain-types'
// Exercise renderer contracts (multi-type architecture)
export type {
	ExerciseLearnViewProps,
	ExerciseLibraryCardProps,
	ExerciseProgress,
	ExerciseRendererProps,
	ExerciseResult as ExerciseResultContract,
	ExerciseState as ExerciseStateContract,
	ExerciseStatistics,
	ExerciseStatus as ExerciseStatusContract,
	ExerciseSummary as ExerciseSummaryContract,
	ExerciseTypeComponents,
	ExerciseViewMode,
	TranslationFunction
} from './model/exercise-renderer-contract'
export {
	calculateAccuracy as calculateExerciseAccuracy,
	calculateProgress as calculateExerciseProgress,
	getLocalizedDescription,
	getLocalizedTitle,
	hasI18nSupport
} from './model/exercise-renderer-contract'
// Exercise type registry
export {
	type ExerciseTypeRegistry,
	exerciseTypeRegistry,
	getSupportedExerciseTypes,
	isExerciseTypeSupported
} from './model/exercise-type-registry'
// Flashcard types (kept in entities for backwards compatibility with FSD rules)
// TODO: Gradually migrate consumers to import from features
export type {
	CardState,
	FlashCard,
	FlashcardExercise,
	FlashcardExerciseResult,
	FlashcardExerciseStats,
	FlashcardReviewResult,
	FlashcardState,
	FlashcardStatus,
	QualityRating,
	SRSData,
	SRSSettings
} from './model/flashcard-types'
export {
	DEFAULT_SRS_SETTINGS,
	getSRSSettings,
	QUALITY_LABELS
} from './model/flashcard-types'
// Schema DTO types
export type {
	ExerciseMetadataDto,
	ExerciseSettingsDto,
	ExercisesListDto,
	FlashCardDto,
	FlashcardExerciseDto,
	SRSSettingsDto,
	WordFormBlockDto,
	WordFormCaseDto,
	WordFormExerciseDto
} from './model/schemas'
// Schemas
export {
	ExerciseMetadataSchema,
	ExerciseSettingsSchema,
	ExercisesListSchema,
	FlashCardSchema,
	FlashcardExerciseSchema,
	SRSSettingsSchema,
	validateExercisesList,
	validateFlashcardExercise,
	validateWordFormExercise,
	WordFormBlockSchema,
	WordFormCaseSchema,
	WordFormExerciseSchema
} from './model/schemas'
// Selectors
export {
	createMemoizedSelector,
	selectDifficultyOptions,
	selectExerciseLibraryViewModel,
	selectFilteredExercises,
	selectFilterOptions,
	selectHasEnabledExercises,
	selectLanguageOptions,
	selectTagOptions
} from './model/selectors'
// Word-form types (kept in entities for backwards compatibility with FSD rules)
// TODO: Gradually migrate consumers to import from features
export type {
	Difficulty,
	ExerciseEvent,
	ExerciseMetadata,
	ExerciseResult,
	ExerciseSettings,
	ExerciseState,
	ExerciseStatus,
	ExerciseType,
	PartialExerciseSettings,
	TagStats,
	WordFormBlock,
	WordFormCase,
	WordFormExercise,
	WordFormExerciseJSON
} from './model/types'
export {
	DEFAULT_EXERCISE_SETTINGS,
	exerciseToJSON,
	getExerciseSettings
} from './model/types'

// Testing utilities (not for production use)
export * as testing from './testing'
