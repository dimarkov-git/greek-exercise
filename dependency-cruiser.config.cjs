'use strict'
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		{
			name: 'pages-layer-boundary',
			severity: 'error',
			comment:
				'Pages may touch widgets, features, entities, shared only (and node_modules)',
			from: {path: '^src/pages'},
			to: {
				path: '^src/',
				pathNot: '^src/(pages|widgets|features|entities|shared|app)'
			}
		},
		{
			name: 'widgets-layer-boundary',
			severity: 'error',
			comment:
				'Widgets may touch features, entities, shared only (and node_modules)',
			from: {path: '^src/widgets'},
			to: {
				path: '^src/',
				pathNot: '^src/(widgets|features|entities|shared|app)'
			}
		},
		{
			name: 'features-layer-boundary',
			severity: 'error',
			comment: 'Features may touch entities, shared only (and node_modules)',
			from: {path: '^src/features'},
			to: {
				path: '^src/',
				pathNot: '^src/(features|entities|shared|app)'
			}
		},
		{
			name: 'entities-layer-boundary',
			severity: 'error',
			comment: 'Entities may touch shared only (and node_modules)',
			from: {path: '^src/entities'},
			to: {
				path: '^src/',
				pathNot: '^src/(entities|shared|app)'
			}
		},
		{
			name: 'shared-layer-boundary',
			severity: 'error',
			comment: 'Shared may not import from upper layers',
			from: {path: '^src/shared'},
			to: {
				path: '^src/',
				pathNot: '^src/(shared|app)'
			}
		}
	],
	options: {
		tsPreCompilationDeps: true
	}
}
