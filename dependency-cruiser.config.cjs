'use strict'
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		// Cross-slice imports (slices cannot import from each other)
		{
			name: 'no-cross-pages',
			severity: 'warn',
			comment:
				'Pages should not import from other pages (cross-slice dependency)',
			from: {path: '^src/pages/([^/]+)'},
			to: {
				path: '^src/pages/',
				pathNot: '^src/pages/$1(/|$)'
			}
		},
		{
			name: 'no-cross-widgets',
			severity: 'warn',
			comment:
				'Widgets should not import from other widgets (cross-slice dependency)',
			from: {path: '^src/widgets/([^/]+)'},
			to: {
				path: '^src/widgets/',
				pathNot: '^src/widgets/$1(/|$)'
			}
		},
		{
			name: 'no-cross-features',
			severity: 'warn',
			comment:
				'Features should not import from other features (cross-slice dependency)',
			from: {path: '^src/features/([^/]+)'},
			to: {
				path: '^src/features/',
				pathNot: '^src/features/$1(/|$)'
			}
		},
		{
			name: 'no-cross-entities',
			severity: 'error',
			comment:
				'Entities cannot import from other entities (cross-slice dependency)',
			from: {path: '^src/entities/([^/]+)'},
			to: {
				path: '^src/entities/',
				pathNot: '^src/entities/$1(/|$)'
			}
		},

		// Upward imports (layers cannot import from upper layers)
		{
			name: 'no-pages-to-app',
			severity: 'error',
			comment: 'Pages cannot import from app layer',
			from: {path: '^src/pages'},
			to: {path: '^src/app'}
		},
		{
			name: 'no-widgets-to-upper',
			severity: 'error',
			comment: 'Widgets cannot import from app or pages layers',
			from: {path: '^src/widgets'},
			to: {path: '^src/(app|pages)'}
		},
		{
			name: 'no-features-to-upper',
			severity: 'error',
			comment: 'Features cannot import from app, pages, or widgets layers',
			from: {path: '^src/features'},
			to: {path: '^src/(app|pages|widgets)'}
		},
		{
			name: 'no-entities-to-upper',
			severity: 'error',
			comment: 'Entities cannot import from app, pages, widgets, or features',
			from: {path: '^src/entities'},
			to: {path: '^src/(app|pages|widgets|features)'}
		},
		{
			name: 'no-shared-to-layers',
			severity: 'error',
			comment: 'Shared cannot import from any FSD layers',
			from: {path: '^src/shared'},
			to: {path: '^src/(app|pages|widgets|features|entities)'}
		}
	],
	options: {
		tsPreCompilationDeps: true
	}
}
