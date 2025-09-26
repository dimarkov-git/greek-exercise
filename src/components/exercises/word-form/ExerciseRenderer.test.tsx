import {render, screen} from '@testing-library/react'
import type React from 'react'
import {act} from 'react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {ExerciseRenderer} from './ExerciseRenderer'
import type {WordFormViewState} from './hooks/useWordFormExercise'
import type {PulseState} from '../shared/PulseEffect'
import type {ExerciseEvent, WordFormExercise} from '@/types/exercises'
import {useSettingsStore} from '@/stores/settings'
import {DEFAULT_SETTINGS} from '@/types/settings'

vi.mock('@/components/Head', () => ({
        Head: ({children}: {children?: React.ReactNode}) => <>{children}</>
}))

const completionScreenMock = vi.fn()
vi.mock('./CompletionScreen', () => ({
        CompletionScreen: (props: Record<string, unknown>) => {
                completionScreenMock(props)
                return <div data-testid='completion-screen'>{props.exerciseTitle as string}</div>
        }
}))

const exerciseContentMock = vi.fn()
vi.mock('./ExerciseContent', () => ({
        ExerciseContent: (props: Record<string, unknown>) => {
                exerciseContentMock(props)
                return <div data-testid='exercise-content' />
        }
}))

vi.mock('@/hooks/useTranslations', () => ({
        useTranslations: () => ({
                t: (key: string) => key,
                status: 'complete' as const,
                missingKeys: [] as string[]
        })
}))

describe('ExerciseRenderer', () => {
        const exercise: WordFormExercise = {
                enabled: true,
                id: 'exercise-1',
                type: 'word-form',
                title: 'Είμαι',
                titleI18n: {en: 'To be', ru: 'Быть'},
                description: 'Description',
                descriptionI18n: {en: 'Description', ru: 'Описание'},
                tags: ['verbs'],
                difficulty: 'a1',
                estimatedTimeMinutes: 5,
                settings: {
                        autoAdvance: true,
                        autoAdvanceDelayMs: 500,
                        allowSkip: true,
                        shuffleCases: false
                },
                blocks: [
                        {
                                id: 'present',
                                name: 'Ενεστώτας',
                                nameHintI18n: {en: 'Present'},
                                cases: [
                                        {
                                                id: 'case-1',
                                                prompt: 'εγώ ___',
                                                promptHintI18n: {en: 'I'},
                                                correct: ['είμαι'],
                                                hint: 'ρήμα',
                                                hintI18n: {en: 'verb'}
                                        }
                                ]
                        }
                ]
        }

        const baseState: WordFormViewState = {
                answer: {
                        value: '',
                        isCorrect: null,
                        showAnswer: false,
                        incorrectAttempts: 0
                },
                autoAdvanceEnabled: true,
                status: 'WAITING_INPUT',
                progress: {completed: 0, current: 1, total: 1},
                stats: {correct: 0, incorrect: 0},
                hints: {name: false, prompt: false, additional: false},
                startedAt: 1_000,
                exercise,
                currentBlock: exercise.blocks[0],
                currentCase: exercise.blocks[0]?.cases[0]
        }

        const pulseState: PulseState = 'correct'

        beforeEach(() => {
                act(() => {
                        useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
                })
                completionScreenMock.mockReset()
                exerciseContentMock.mockReset()
        })

        it('renders completion screen when exercise is completed', () => {
                const handleEvent = vi.fn()
                const state: WordFormViewState = {
                        ...baseState,
                        status: 'COMPLETED',
                        stats: {correct: 3, incorrect: 1},
                        progress: {completed: 1, current: 1, total: 1}
                }

                render(
                        <ExerciseRenderer
                                clearPulse={vi.fn()}
                                handleAnswerChange={vi.fn()}
                                handleAutoAdvanceToggle={vi.fn()}
                                handleEvent={handleEvent}
                                handleSubmit={vi.fn()}
                                onExit={vi.fn()}
                                pulseState={pulseState}
                                state={state}
                        />
                )

                expect(screen.getByTestId('completion-screen')).toHaveTextContent('To be')
                const props = completionScreenMock.mock.calls.at(-1)?.[0] as {
                        onRestart: () => void
                        correctCount: number
                        incorrectCount: number
                        totalCases: number
                }
                expect(props.correctCount).toBe(3)
                expect(props.incorrectCount).toBe(1)
                expect(props.totalCases).toBe(1)

                props.onRestart()
                expect(handleEvent).toHaveBeenCalledWith({type: 'RESTART'})
        })

        it('shows fallback content when current case is missing', () => {
                const state: WordFormViewState = {
                        ...baseState,
                        currentBlock: undefined,
                        currentCase: undefined
                }

                render(
                        <ExerciseRenderer
                                clearPulse={vi.fn()}
                                handleAnswerChange={vi.fn()}
                                handleAutoAdvanceToggle={vi.fn()}
                                handleEvent={vi.fn()}
                                handleSubmit={vi.fn()}
                                pulseState={null}
                                state={state}
                        />
                )

                expect(
                        screen.getByText('error.couldNotLoadExercise')
                ).toBeInTheDocument()
                expect(exerciseContentMock).not.toHaveBeenCalled()
        })

        it('renders exercise content with interaction handlers', () => {
                const handleSubmit = vi.fn()
                const handleEvent = vi.fn<(event: ExerciseEvent) => void>()
                const handleToggle = vi.fn()
                const handleAnswerChange = vi.fn()
                const clearPulse = vi.fn()

                render(
                        <ExerciseRenderer
                                clearPulse={clearPulse}
                                handleAnswerChange={handleAnswerChange}
                                handleAutoAdvanceToggle={handleToggle}
                                handleEvent={handleEvent}
                                handleSubmit={handleSubmit}
                                pulseState={pulseState}
                                state={baseState}
                        />
                )

                expect(screen.getByTestId('exercise-content')).toBeInTheDocument()
                const props = exerciseContentMock.mock.calls.at(-1)?.[0] as Record<string, unknown>

                expect(props?.onSubmit).toBe(handleSubmit)
                expect(props?.onToggleAutoAdvance).toBe(handleToggle)
                expect(props?.onAnswerChange).toBe(handleAnswerChange)
                expect(props?.onPulseComplete).toBe(clearPulse)
                expect(props?.exercise).toBe(baseState.exercise)

                const onSkip = props?.onSkip as (() => void) | undefined
                expect(onSkip).toBeTypeOf('function')
                onSkip?.()
                expect(handleEvent).toHaveBeenCalledWith({type: 'SKIP'})
        })

        it('prefers translated exercise title based on user language', () => {
                act(() => {
                        useSettingsStore.getState().setUserLanguage('ru')
                })

                const state: WordFormViewState = {
                        ...baseState,
                        status: 'COMPLETED'
                }

                render(
                        <ExerciseRenderer
                                clearPulse={vi.fn()}
                                handleAnswerChange={vi.fn()}
                                handleAutoAdvanceToggle={vi.fn()}
                                handleEvent={vi.fn()}
                                handleSubmit={vi.fn()}
                                pulseState={pulseState}
                                state={state}
                        />
                )

                expect(screen.getByTestId('completion-screen')).toHaveTextContent('Быть')
        })
})
