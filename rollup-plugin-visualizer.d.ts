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
