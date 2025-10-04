import type {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {useEffect, useState} from 'react'
import {environment} from '@/app/config'
import {logger} from '@/shared/lib'

let DevtoolsComponent: typeof ReactQueryDevtools | null = null

export function QueryDevtools() {
	const [Devtools, setDevtools] = useState<typeof ReactQueryDevtools | null>(
		DevtoolsComponent
	)

	useEffect(() => {
		if (!environment.enableQueryDevtools || DevtoolsComponent) {
			return
		}

		let isActive = true

		import('@tanstack/react-query-devtools')
			.then(module => {
				if (!isActive) {
					return
				}

				DevtoolsComponent = module.ReactQueryDevtools
				setDevtools(() => DevtoolsComponent)
			})
			.catch(error => {
				logger.warn('Failed to load React Query Devtools', error)
			})

		return () => {
			isActive = false
		}
	}, [])

	if (!(environment.enableQueryDevtools && Devtools)) {
		return null
	}

	return <Devtools initialIsOpen={false} />
}
