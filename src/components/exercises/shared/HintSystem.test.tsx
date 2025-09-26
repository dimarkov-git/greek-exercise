import {act, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {HintSystem, SimpleHint} from './HintSystem'
import {useSettingsStore} from '@/stores/settings'
import {DEFAULT_SETTINGS} from '@/types/settings'

vi.mock('@/hooks/useTranslations', () => ({
        useTranslations: () => ({
                t: (key: string) => `t:${key}`,
                status: 'complete' as const,
                missingKeys: [] as string[]
        })
}))

describe('HintSystem', () => {
        beforeEach(() => {
                act(() => {
                        useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
                })
        })

        it('renders only primary text when no hints provided', () => {
                render(
                        <HintSystem
                                hints={{}}
                                primaryText='Γειά'
                        />
                )

                expect(screen.getByText('Γειά')).toBeInTheDocument()
                expect(screen.queryByRole('button')).not.toBeInTheDocument()
        })

        it('toggles hint visibility on click and closes when clicking outside', async () => {
                const user = userEvent.setup()

                render(
                        <HintSystem
                                hints={{en: 'Hello'}}
                                placement='bottom'
                                primaryText='Χαίρετε'
                        />
                )

                const button = screen.getByRole('button', {
                        name: 'Показать подсказку: Hello'
                })

                await user.click(button)

                const tooltip = await screen.findByText('Hello')
                expect(tooltip).toHaveClass('top-full')

                await user.click(document.body)

                await waitFor(() => {
                        expect(screen.queryByText('Hello')).not.toBeInTheDocument()
                })
        })

        it('uses language fallbacks when hint for current language is missing', async () => {
                const user = userEvent.setup()

                act(() => {
                        useSettingsStore.getState().setUserLanguage('el')
                })

                render(
                        <HintSystem
                                hints={{en: 'Fallback hint'}}
                                primaryText='λέξη'
                        />
                )

                const button = screen.getByRole('button', {
                        name: 'Показать подсказку: Fallback hint'
                })

                await user.click(button)
                await screen.findByText('Fallback hint')
        })

        it('SimpleHint proxies props to HintSystem with generated hints', async () => {
                const user = userEvent.setup()

                render(
                        <SimpleHint hint='Απάντηση'>Κείμενο</SimpleHint>
                )

                const button = screen.getByRole('button', {
                        name: 'Показать подсказку: Απάντηση'
                })

                await user.click(button)
                await screen.findByText('Απάντηση')
        })
})
