import type {
	ExerciseMetadata,
	WordFormCase,
	WordFormExercise
} from '@/types/exercises'
import {getExerciseSettings} from '@/types/exercises'

/**
 * Normalize Greek text for answer comparison
 */
export function normalizeGreekText(text: string): string {
	return text
		.trim() // remove leading and trailing spaces
		.toLowerCase() // convert to lowercase
		.normalize('NFC') // normalize Unicode (NFD → NFC)
}

/**
 * Normalize Greek text by removing tone marks
 * Used for more lenient answer comparison
 */
export function normalizeGreekTextWithoutTones(text: string): string {
	const normalized = normalizeGreekText(text)

	// Map of Greek characters with tone marks to their base forms
	const toneMap: Record<string, string> = {
		'\u03AC': '\u03B1', // ά -> α
		'\u03AD': '\u03B5', // έ -> ε
		'\u03AE': '\u03B7', // ή -> η
		'\u03AF': '\u03B9', // ί -> ι
		'\u03CC': '\u03BF', // ό -> ο
		'\u03CD': '\u03C5', // ύ -> υ
		'\u03CE': '\u03C9', // ώ -> ω
		'\u03B0': '\u03C5', // ΰ -> υ (diaeresis with tone mark)
		'\u0390': '\u03B9', // ΐ -> ι (diaeresis with tone mark)
		'\u0386': '\u03B1', // Ά -> α
		'\u0388': '\u03B5', // Έ -> ε
		'\u0389': '\u03B7', // Ή -> η
		'\u038A': '\u03B9', // Ί -> ι
		'\u038C': '\u03BF', // Ό -> ο
		'\u038E': '\u03C5', // Ύ -> υ
		'\u038F': '\u03C9' // Ώ -> ω
	}

	return normalized
		.split('')
		.map(char => toneMap[char] || char)
		.join('')
}

/**
 * Check answer correctness with support for multiple correct variants
 */
export function checkAnswer(
	userAnswer: string,
	correctAnswers: string[],
	ignoreTones = false
): boolean {
	const normalizeFunction = ignoreTones
		? normalizeGreekTextWithoutTones
		: normalizeGreekText
	const normalizedUserAnswer = normalizeFunction(userAnswer)

	return correctAnswers.some(
		correct => normalizeFunction(correct) === normalizedUserAnswer
	)
}

/**
 * Calculate total number of cases in exercise
 */
export function getTotalCases(exercise: WordFormExercise): number {
	return exercise.blocks.reduce((total, block) => total + block.cases.length, 0)
}

/**
 * Extract exercise metadata
 */
export function extractExerciseMetadata(
	exercise: WordFormExercise
): ExerciseMetadata {
	return {
		id: exercise.id,
		type: exercise.type,
		title: exercise.title,
		titleI18n: exercise.titleI18n,
		description: exercise.description,
		descriptionI18n: exercise.descriptionI18n,
		tags: exercise.tags,
		difficulty: exercise.difficulty,
		estimatedTimeMinutes: exercise.estimatedTimeMinutes,
		totalBlocks: exercise.blocks.length,
		totalCases: getTotalCases(exercise),
		enabled: exercise.enabled
	}
}

/**
 * Get specific case by block and case indices
 */
export function getCaseByIndices(
	exercise: WordFormExercise,
	blockIndex: number,
	caseIndex: number
): WordFormCase | undefined {
	const block = exercise.blocks[blockIndex]
	if (!block) return

	const case_ = block.cases[caseIndex]
	return case_ || undefined
}

/**
 * Get next indices (block, case) after current case
 */
export function getNextIndices(
	exercise: WordFormExercise,
	currentBlockIndex: number,
	currentCaseIndex: number
): {blockIndex: number; caseIndex: number} | null {
	const currentBlock = exercise.blocks[currentBlockIndex]
	if (!currentBlock) return null

	// If there are more cases in current block
	if (currentCaseIndex + 1 < currentBlock.cases.length) {
		return {
			blockIndex: currentBlockIndex,
			caseIndex: currentCaseIndex + 1
		}
	}

	// Move to next block
	if (currentBlockIndex + 1 < exercise.blocks.length) {
		return {
			blockIndex: currentBlockIndex + 1,
			caseIndex: 0
		}
	}

	// No more cases available
	return null
}

/**
 * Calculate completed cases count up to current position
 */
export function getCompletedCasesCount(
	exercise: WordFormExercise,
	currentBlockIndex: number,
	currentCaseIndex: number
): number {
	let completed = 0

	for (let blockIdx = 0; blockIdx < currentBlockIndex; blockIdx++) {
		const block = exercise.blocks[blockIdx]
		if (block) {
			completed += block.cases.length
		}
	}

	completed += currentCaseIndex

	return completed
}

/**
 * Shuffle exercise cases (if shuffleCases setting is enabled)
 */
export function shuffleExerciseCases(
	exercise: WordFormExercise
): WordFormExercise {
	const settings = getExerciseSettings(exercise)

	if (!settings.shuffleCases) {
		return exercise
	}

	const shuffledBlocks = exercise.blocks.map(block => ({
		...block,
		cases: [...block.cases].sort(() => Math.random() - 0.5)
	}))

	return {
		...exercise,
		blocks: shuffledBlocks
	}
}

/**
 * Filter exercises by tags
 */
export function filterExercisesByTags(
	exercises: ExerciseMetadata[],
	selectedTags: string[]
): ExerciseMetadata[] {
	if (selectedTags.length === 0) {
		return exercises
	}

	return exercises.filter(exercise =>
		selectedTags.some(tag => exercise.tags.includes(tag))
	)
}

/**
 * Filter exercises by difficulty
 */
export function filterExercisesByDifficulty(
	exercises: ExerciseMetadata[],
	difficulty: string | null
): ExerciseMetadata[] {
	if (!difficulty) {
		return exercises
	}

	return exercises.filter(exercise => exercise.difficulty === difficulty)
}

/**
 * Get all unique tags from exercises list
 */
export function getAllTags(exercises: ExerciseMetadata[]): string[] {
	const tagSet = new Set<string>()

	for (const exercise of exercises) {
		for (const tag of exercise.tags) {
			tagSet.add(tag)
		}
	}

	return Array.from(tagSet).sort()
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(
	correctAnswers: number,
	totalAnswers: number
): number {
	if (totalAnswers === 0) return 0
	return Math.round((correctAnswers / totalAnswers) * 100)
}

/**
 * Format duration in human readable format
 */
export function formatDuration(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000)
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = seconds % 60

	if (minutes === 0) {
		return `${remainingSeconds}s`
	}

	return `${minutes}m ${remainingSeconds}s`
}

/**
 * Safe generation of unique ID for case or block
 */
export function generateId(prefix: string): string {
	const timestamp = Date.now()
	const random = Math.random().toString(36).substring(2, 9)
	return `${prefix}-${timestamp}-${random}`
}
