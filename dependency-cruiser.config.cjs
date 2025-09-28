'use strict'
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		{
			name: 'pages-layer-boundary',
			severity: 'error',
			comment: 'Pages may touch widgets, features, entities, shared only',
			from: {path: '^src/pages'},
			to: {pathNot: '^src/(pages|widgets|features|entities|shared)'}
		},
		{
			name: 'widgets-layer-boundary',
			severity: 'error',
			comment: 'Widgets may touch features, entities, shared only',
			from: {path: '^src/widgets'},
			to: {pathNot: '^src/(widgets|features|entities|shared)'}
		},
		{
			name: 'features-layer-boundary',
			severity: 'error',
			comment: 'Features may touch entities, shared only',
			from: {path: '^src/features'},
			to: {pathNot: '^src/(features|entities|shared)'}
		},
		{
			name: 'entities-layer-boundary',
			severity: 'error',
			comment: 'Entities may touch shared only',
			from: {path: '^src/entities'},
			to: {pathNot: '^src/(entities|shared)'}
		},
		{
			name: 'no-deep-public-imports',
			severity: 'error',
			comment: 'Always import through slice index files',
			from: {path: '^src/(app|processes|pages|widgets|features|entities)'},
			to: {
				path: '^src/(pages|widgets|features|entities)/.+/(ui|model|api|lib)/',
				pathNot: 'index\\.(ts|tsx)$'
			}
		}
	],
	options: {
		tsPreCompilationDeps: true
	}
}
