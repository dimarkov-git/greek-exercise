import type {Language} from '@/shared/model'

export interface UserPreferences {
	language: Language
	theme: 'light' | 'dark' | 'system'
	notifications: boolean
	soundEnabled: boolean
}

export interface UserProgress {
	exercisesCompleted: number
	totalScore: number
	averageAccuracy: number
	streakDays: number
	lastExerciseDate: Date | null
}

export interface User {
	id: string
	preferences: UserPreferences
	progress: UserProgress
	createdAt: Date
	updatedAt: Date
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
	language: 'en',
	theme: 'system',
	notifications: true,
	soundEnabled: true
}

export const DEFAULT_USER_PROGRESS: UserProgress = {
	exercisesCompleted: 0,
	totalScore: 0,
	averageAccuracy: 0,
	streakDays: 0,
	lastExerciseDate: null
}
