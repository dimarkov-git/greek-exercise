/**
 * Multiple-choice exercise types
 *
 * Type definitions for multiple-choice question exercises.
 */

import type {
	Difficulty,
	Language,
	PartialMultipleChoiceSettings
} from '@/shared/model'

/**
 * Answer option for a multiple-choice question
 */
export interface MultipleChoiceOption {
	/** Unique option ID */
	id: string
	/** Option text in primary language */
	text: string
	/** Localized option text */
	textI18n?: Partial<Record<Language, string>>
}

/**
 * Multiple-choice question
 */
export interface MultipleChoiceQuestion {
	/** Unique question ID */
	id: string
	/** Question text in primary language */
	text: string
	/** Localized question text */
	textI18n?: Partial<Record<Language, string>>
	/** Answer options (2-6 options) */
	options: MultipleChoiceOption[]
	/** ID of the correct option */
	correctOptionId: string
	/** Optional hint in primary language */
	hint?: string
	/** Localized hints */
	hintI18n?: Partial<Record<Language, string>>
}

/**
 * Complete multiple-choice exercise structure
 */
export interface MultipleChoiceExercise {
	/** Whether exercise is enabled */
	enabled: boolean
	/** Unique exercise ID */
	id: string
	/** Exercise type */
	type: 'multiple-choice'
	/** Primary language */
	language: Language
	/** Title in primary language */
	title: string
	/** Localized titles */
	titleI18n?: Partial<Record<Language, string>>
	/** Description in primary language */
	description: string
	/** Localized descriptions */
	descriptionI18n?: Partial<Record<Language, string>>
	/** Filtering tags */
	tags: string[]
	/** Difficulty level */
	difficulty: Difficulty
	/** Exercise settings */
	settings?: PartialMultipleChoiceSettings
	/** List of questions */
	questions: MultipleChoiceQuestion[]
}
