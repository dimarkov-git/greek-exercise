// Base exercise types

export {
	DEFAULT_FLASHCARD_SETTINGS,
	DEFAULT_MULTIPLE_CHOICE_SETTINGS,
	DEFAULT_WORD_FORM_SETTINGS
} from '@/shared/model'
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
	toMultipleChoiceExerciseWithDefaults,
	toWordFormExerciseWithDefaults
} from './model/adapters'
// Custom exercise utilities
export {
	customExerciseJsonToMetadata,
	flashcardExerciseJsonToMetadata,
	wordFormExerciseJsonToExercise,
	wordFormExerciseJsonToMetadata
} from './model/custom'
// Custom exercises store
export {
	type CustomExerciseJSON,
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
	MultipleChoiceExerciseWithDefaults,
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
	FlashcardExerciseJSON,
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
	flashcardExerciseToJSON,
	getSRSSettings,
	QUALITY_LABELS
} from './model/flashcard-types'
// Multiple-choice types (kept in entities for FSD compliance)
export type {
	MultipleChoiceExercise,
	MultipleChoiceOption,
	MultipleChoiceQuestion
} from './model/multiple-choice-types'
// Schema DTO types
export type {
	ExerciseMetadataDto,
	ExerciseSettingsDto,
	ExercisesListDto,
	FlashCardDto,
	FlashcardExerciseDto,
	MultipleChoiceExerciseDto,
	MultipleChoiceOptionDto,
	MultipleChoiceQuestionDto,
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
	MultipleChoiceExerciseSchema,
	MultipleChoiceOptionSchema,
	MultipleChoiceQuestionSchema,
	SRSSettingsSchema,
	validateExercisesList,
	validateFlashcardExercise,
	validateMultipleChoiceExercise,
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
	selectTagOptions,
	selectTypeOptions
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
