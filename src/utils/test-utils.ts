export function detectAutomationEnvironment(): boolean {
	if (typeof navigator === 'undefined') {
		return false
	}

	if (navigator.webdriver) {
		return true
	}

	const userAgent = navigator.userAgent ?? ''
	return userAgent.toLowerCase().includes('playwright')
}
