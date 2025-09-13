# Greek exercises

The Greek exercises project is a Greek language learning website with interactive exercises for mastering the Greek
language.

## Project Overview

The application features:

- Dynamic main landing page with exercise module selection
- Multiple interactive exercise types
- Unified visual design with a gradient theme
- Reusable exercise engine for consistent user experience
- Progress tracking and scoring system
- Retry mechanism for incorrect answers
- All user interfaces in Greek, documentation in English, hits in the user language

## Architecture

The application uses a modular client-side architecture:

- **Static HTML/CSS/JavaScript** - No backend required, can be hosted on any static hosting service
- **Reusable exercise engine** - Common exercise logic (`exercise-engine.js`) separated from exercise-specific data
- **Dynamic module loading** - Exercise cards are rendered dynamically from configuration
- **Data-Driven exercises** - Exercise content stored in separate data files for easy maintenance
- **Generic terminology** - Exercise engine uses generic terms instead of exercise-specific terms

### File Structure

```
/
├── index.html              # Main landing page (Greek UI, dynamic module loading)
├── styles.css              # Shared styles with gradient theme
├── .gitignore              # Git ignore file
├── README.md               # Project documentation
├── data/                   # Data files
├── exercises/              # Exercise HTML pages
└── js/                     # JavaScript files
    ├── exercises.js        # Exercise configuration for main page
    ├── exercise-engine.js  # Reusable exercise engine class
    └── [execsise-name]-exercise.js # Exersise specific initialization
```

## How to Add a new exercise

To add a new exercise module to the application:

### 1. Create the data file (`data/[exercise-name]-data.js`)

```javascript
const exerciseNameData = [
    {
        name: 'Block name',
        english: 'English translation for a block name',
        cases: [
            {
                prompt: 'Question/Prompt',
                correct: 'Answer',
                english: 'English translation for the prompt'
            },
            // ... more cases
        ]
    }
    // ... more blocks
];
```

### 2. Create the HTML file (`exercises/[exercise-name].html`)

- Copy an existing exercise HTML (e.g., `pronouns.html`)
- Update the title and header
- Update element IDs if needed (currentBlock, prompt)
- Link to your data file and exercise an initialization script

### 3. Create the initialization script (`js/[exercise-name]-exercise.js`)

### 4. Add to exercises configuration (`js/exercises.js`)

## Development

To run the project locally:

1. Open `index.html` in a web browser
2. No build process or dependencies are required
3. All exercises work offline once loaded

## Deployment

Every push to `main` automatically deploys the site to GitHub Pages. During the
workflow run the [`scripts/versionize.sh`](scripts/versionize.sh) script appends
the current commit's short hash as a `?v=<hash>` query string to all local
`.css` and `.js` references in the HTML files so browsers always fetch the
latest assets.

The workflow publishes the directory indicated by the `PUBLISH_DIR` environment
variable (default: repository root). If your site lives in a different
subdirectory, edit `.github/workflows/pages.yml` and change `PUBLISH_DIR` to the
folder you want to publish.
