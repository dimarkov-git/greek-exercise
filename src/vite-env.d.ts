/// <reference types="vite/client" />

import type DetachedWindowApi from 'happy-dom/lib/window/DetachedWindowAPI.js'

declare global {
	interface Window {
		happyDOM?: DetachedWindowApi
	}
}

declare module 'rollup-plugin-visualizer' {
	import type {Plugin} from 'vite'

	interface VisualizerOptions {
		readonly filename?: string
		readonly template?: 'treemap' | 'sunburst' | 'network'
		readonly gzipSize?: boolean
		readonly brotliSize?: boolean
		readonly json?: boolean
	}

	export function visualizer(options?: VisualizerOptions): Plugin
}
