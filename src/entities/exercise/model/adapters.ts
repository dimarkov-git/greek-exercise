import type {
	ExerciseMetadataDto,
	ExercisesListDto,
	FlashCardDto,
	FlashcardExerciseDto,
	WordFormBlockDto,
	WordFormCaseDto,
	WordFormExerciseDto
} from '@/entities/exercise'
import type {Language} from '@/shared/model'
import type {
	ExerciseLibraryViewModel,
	ExerciseSource,
	ExerciseSummary,
	FlashcardExerciseWithDefaults,
	WordFormExerciseWithDefaults
} from './domain-types'
import type {FlashCard, SRSSettings} from './flashcard-types'
import {DEFAULT_SRS_SETTINGS} from './flashcard-types'
import type {
	ExerciseMetadata,
	ExerciseSettings,
	WordFormBlock,
	WordFormCase
} from './types'
import {DEFAULT_EXERCISE_SETTINGS} from './types'

const DIFFICULTY_ORDER: ExerciseMetadata['difficulty'][] = [
	'a0',
	'a1',
	'a2',
	'b1',
	'b2',
	'c1',
	'c2'
]

const LANGUAGE_ORDER: Language[] = ['el', 'en', 'ru']

function isLanguage(value: string): value is Language {
	return value === 'el' || value === 'en' || value === 'ru'
}

function sortTags(tags: string[]): string[] {
	return Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b))
}

type I18nLike = Partial<Record<Language, string>> | undefined

function normalizeI18nRecord(
	record: I18nLike
): Partial<Record<Language, string>> | undefined {
	if (!record) {
		return
	}

	const normalized: Partial<Record<Language, string>> = {}

	for (const [key, value] of Object.entries(record)) {
		if (isLanguage(key)) {
			normalized[key] = value
		}
	}

	return normalized
}

export function toExerciseSummary(
	metadata: ExerciseMetadataDto,
	source: ExerciseSource = 'builtin'
): ExerciseSummary {
	const {
		titleI18n: rawTitleI18n,
		descriptionI18n: rawDescriptionI18n,
		...rest
	} = metadata
	const titleI18n = normalizeI18nRecord(rawTitleI18n)
	const descriptionI18n = normalizeI18nRecord(rawDescriptionI18n)
	const languageMetadata: {
		titleI18n?: Partial<Record<Language, string>>
		descriptionI18n?: Partial<Record<Language, string>>
	} = {}

	if (titleI18n) {
		languageMetadata.titleI18n = titleI18n
	}

	if (descriptionI18n) {
		languageMetadata.descriptionI18n = descriptionI18n
	}

	// Collect all available languages: base language + translation languages
	const translationLanguages = new Set<Language>()
	translationLanguages.add(metadata.language)

	if (titleI18n) {
		for (const lang of Object.keys(titleI18n)) {
			if (isLanguage(lang)) {
				translationLanguages.add(lang)
			}
		}
	}

	if (descriptionI18n) {
		for (const lang of Object.keys(descriptionI18n)) {
			if (isLanguage(lang)) {
				translationLanguages.add(lang)
			}
		}
	}

	const summary = {
		...rest,
		...languageMetadata,
		tags: sortTags(metadata.tags),
		availableLanguages: Array.from(translationLanguages).sort(
			(a, b) => LANGUAGE_ORDER.indexOf(a) - LANGUAGE_ORDER.indexOf(b)
		),
		source
	}

	return summary as ExerciseSummary
}

function collectUniqueTags(exercises: ExerciseSummary[]): string[] {
	const tags = new Set<string>()

	for (const exercise of exercises) {
		for (const tag of exercise.tags) {
			tags.add(tag)
		}
	}

	return Array.from(tags).sort((a, b) => a.localeCompare(b))
}

function collectUniqueDifficulties(
	exercises: ExerciseSummary[]
): ExerciseMetadata['difficulty'][] {
	const difficulties = new Set<ExerciseMetadata['difficulty']>()

	for (const exercise of exercises) {
		difficulties.add(exercise.difficulty)
	}

	return DIFFICULTY_ORDER.filter(difficulty => difficulties.has(difficulty))
}

function collectUniqueLanguages(exercises: ExerciseSummary[]): Language[] {
	const languages = new Set<Language>()

	for (const exercise of exercises) {
		languages.add(exercise.language)
	}

	return LANGUAGE_ORDER.filter(language => languages.has(language))
}

export function createExerciseLibraryViewModel(
	metadataList: ExercisesListDto
): ExerciseLibraryViewModel {
	const exercises = metadataList.map(metadata => toExerciseSummary(metadata))
	const enabled = exercises.filter(exercise => exercise.enabled).length

	return {
		exercises,
		filterOptions: {
			tags: collectUniqueTags(exercises),
			difficulties: collectUniqueDifficulties(exercises),
			languages: collectUniqueLanguages(exercises)
		},
		totals: {
			total: exercises.length,
			enabled
		}
	}
}

function normalizeWordFormCase(caseDto: WordFormCaseDto): WordFormCase {
	const promptHintI18n = normalizeI18nRecord(caseDto.promptHintI18n)
	const hintI18n = normalizeI18nRecord(caseDto.hintI18n)

	return {
		id: caseDto.id,
		prompt: caseDto.prompt,
		correct: caseDto.correct,
		...(caseDto.hint ? {hint: caseDto.hint} : {}),
		...(promptHintI18n ? {promptHintI18n} : {}),
		...(hintI18n ? {hintI18n} : {})
	}
}

function normalizeWordFormBlock(blockDto: WordFormBlockDto): WordFormBlock {
	const nameHintI18n = normalizeI18nRecord(blockDto.nameHintI18n)
	return {
		id: blockDto.id,
		name: blockDto.name,
		cases: blockDto.cases.map(normalizeWordFormCase),
		...(nameHintI18n ? {nameHintI18n} : {})
	}
}

export function toWordFormExerciseWithDefaults(
	exercise: WordFormExerciseDto
): WordFormExerciseWithDefaults {
	const normalizedTags = Array.isArray(exercise.tags)
		? sortTags(exercise.tags)
		: []

	const settings: ExerciseSettings = {
		autoAdvance:
			exercise.settings?.autoAdvance ?? DEFAULT_EXERCISE_SETTINGS.autoAdvance,
		autoAdvanceDelayMs:
			exercise.settings?.autoAdvanceDelayMs ??
			DEFAULT_EXERCISE_SETTINGS.autoAdvanceDelayMs,
		allowSkip:
			exercise.settings?.allowSkip ?? DEFAULT_EXERCISE_SETTINGS.allowSkip,
		shuffleCases:
			exercise.settings?.shuffleCases ?? DEFAULT_EXERCISE_SETTINGS.shuffleCases
	}

	const titleI18n = normalizeI18nRecord(exercise.titleI18n)
	const descriptionI18n = normalizeI18nRecord(exercise.descriptionI18n)

	const normalizedExercise: WordFormExerciseWithDefaults = {
		enabled: exercise.enabled,
		id: exercise.id,
		type: exercise.type,
		language: exercise.language,
		title: exercise.title,
		description: exercise.description,
		tags: normalizedTags,
		difficulty: exercise.difficulty,
		estimatedTimeMinutes: exercise.estimatedTimeMinutes,
		settings,
		blocks: exercise.blocks.map(normalizeWordFormBlock),
		...(titleI18n ? {titleI18n} : {}),
		...(descriptionI18n ? {descriptionI18n} : {})
	}

	return normalizedExercise
}

function normalizeFlashCard(cardDto: FlashCardDto): FlashCard {
	const frontHintI18n = normalizeI18nRecord(cardDto.frontHintI18n)
	const backHintI18n = normalizeI18nRecord(cardDto.backHintI18n)
	const additionalHintI18n = normalizeI18nRecord(cardDto.additionalHintI18n)

	return {
		id: cardDto.id,
		front: cardDto.front,
		back: cardDto.back,
		...(frontHintI18n ? {frontHintI18n} : {}),
		...(backHintI18n ? {backHintI18n} : {}),
		...(cardDto.additionalHint ? {additionalHint: cardDto.additionalHint} : {}),
		...(additionalHintI18n ? {additionalHintI18n} : {}),
		...(cardDto.tags ? {tags: sortTags(cardDto.tags)} : {})
	}
}

export function toFlashcardExerciseWithDefaults(
	exercise: FlashcardExerciseDto
): FlashcardExerciseWithDefaults {
	const normalizedTags = Array.isArray(exercise.tags)
		? sortTags(exercise.tags)
		: []

	const settings: ExerciseSettings = {
		autoAdvance:
			exercise.settings?.autoAdvance ?? DEFAULT_EXERCISE_SETTINGS.autoAdvance,
		autoAdvanceDelayMs:
			exercise.settings?.autoAdvanceDelayMs ??
			DEFAULT_EXERCISE_SETTINGS.autoAdvanceDelayMs,
		allowSkip:
			exercise.settings?.allowSkip ?? DEFAULT_EXERCISE_SETTINGS.allowSkip,
		shuffleCases:
			exercise.settings?.shuffleCases ?? DEFAULT_EXERCISE_SETTINGS.shuffleCases
	}

	const srsSettings: SRSSettings = {
		newCardsPerDay:
			exercise.srsSettings?.newCardsPerDay ??
			DEFAULT_SRS_SETTINGS.newCardsPerDay,
		reviewsPerDay:
			exercise.srsSettings?.reviewsPerDay ?? DEFAULT_SRS_SETTINGS.reviewsPerDay,
		graduatingInterval:
			exercise.srsSettings?.graduatingInterval ??
			DEFAULT_SRS_SETTINGS.graduatingInterval,
		easyInterval:
			exercise.srsSettings?.easyInterval ?? DEFAULT_SRS_SETTINGS.easyInterval
	}

	const titleI18n = normalizeI18nRecord(exercise.titleI18n)
	const descriptionI18n = normalizeI18nRecord(exercise.descriptionI18n)

	const normalizedExercise: FlashcardExerciseWithDefaults = {
		enabled: exercise.enabled,
		id: exercise.id,
		type: exercise.type,
		language: exercise.language,
		title: exercise.title,
		description: exercise.description,
		tags: normalizedTags,
		difficulty: exercise.difficulty,
		estimatedTimeMinutes: exercise.estimatedTimeMinutes,
		settings,
		srsSettings,
		cards: exercise.cards.map(normalizeFlashCard),
		...(titleI18n ? {titleI18n} : {}),
		...(descriptionI18n ? {descriptionI18n} : {})
	}

	return normalizedExercise
}
