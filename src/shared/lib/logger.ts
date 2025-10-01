/**
 * Development logger utility that provides type-safe console methods
 * with automatic dead code elimination in production builds.
 */

const createLogger = () => {
	if (import.meta.env.DEV) {
		return {
			// biome-ignore lint/suspicious/noConsole: centralized development logger
			log: console.log.bind(console),
			// biome-ignore lint/suspicious/noConsole: centralized development logger
			warn: console.warn.bind(console),
			// biome-ignore lint/suspicious/noConsole: centralized development logger
			error: console.error.bind(console),
			// biome-ignore lint/suspicious/noConsole: centralized development logger
			info: console.info.bind(console),
			// biome-ignore lint/suspicious/noConsole: centralized development logger
			debug: console.debug.bind(console)
		}
	}

	// No-op functions for production
	// biome-ignore lint/suspicious/noEmptyBlockStatements: intentional noop for production
	const noop = () => {}
	return {
		log: noop,
		warn: noop,
		error: noop,
		info: noop,
		debug: noop
	}
}

export const logger = createLogger()
