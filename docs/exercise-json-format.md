# Exercise JSON format specification

Complete specification of JSON structure for exercises in the Greek learning application.

## Overview

Exercises are defined as JSON files with strict validation schemas. Each exercise contains metadata, configuration settings, and content blocks organized into individual questions (cases).

## Exercise types

Currently supported exercise type:

- `word-form` - Word form practice exercises (conjugations, declensions, etc.)

## Complete JSON structure

### Root exercise object

```json
{
  "enabled": true,
  "id": "unique-exercise-id",
  "type": "word-form",
  "title": "Εξάσκηση ρήματος είμαι",
  "titleI18n": {
    "en": "Verb 'to be' practice",
    "ru": "Практика глагола 'быть'"
  },
  "description": "Κλίση του ρήματος είμαι σε όλους τους βασικούς χρόνους",
  "descriptionI18n": {
    "en": "Conjugation of 'to be' in all basic tenses",
    "ru": "Спряжение глагола «быть» во всех основных временах"
  },
  "tags": ["word-form", "verbs", "irregular-verbs"],
  "difficulty": "a1",
  "estimatedTimeMinutes": 10,
  "settings": {
    "autoAdvance": true,
    "autoAdvanceDelayMs": 1500,
    "allowSkip": false,
    "shuffleCases": false
  },
  "blocks": [...]
}
```

### Field definitions

#### Required fields

| Field                  | Type                       | Description                              | Validation                                                 |
| ---------------------- | -------------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| `enabled`              | `boolean`                  | Whether exercise is visible in library   | Required                                                   |
| `id`                   | `string`                   | Unique exercise identifier               | Required, used for routing                                 |
| `type`                 | `"word-form"`              | Exercise type (currently only word-form) | Required, must be literal "word-form"                      |
| `title`                | `string`                   | Exercise title in Greek                  | Required                                                   |
| `titleI18n`            | `Record<Language, string>` | Translated titles for interface          | Required, must contain 'en', 'ru', 'el'                    |
| `description`          | `string`                   | Exercise description in Greek            | Required                                                   |
| `descriptionI18n`      | `Record<Language, string>` | Translated descriptions                  | Required, must contain 'en', 'ru', 'el'                    |
| `tags`                 | `string[]`                 | Filtering tags for library               | Required                                                   |
| `difficulty`           | `Difficulty`               | Exercise difficulty level                | Required, one of: "a0", "a1", "a2", "b1", "b2", "c1", "c2" |
| `estimatedTimeMinutes` | `number`                   | Estimated completion time                | Required, must be ≥ 0                                      |
| `blocks`               | `WordFormBlock[]`          | Exercise content blocks                  | Required, must contain ≥ 1 block                           |

#### Optional fields

| Field      | Type               | Description                     | Default               |
| ---------- | ------------------ | ------------------------------- | --------------------- |
| `settings` | `ExerciseSettings` | Exercise behavior configuration | Applied from defaults |

### Exercise settings

Controls exercise behavior and user experience:

```json
{
	"autoAdvance": true,
	"autoAdvanceDelayMs": 1500,
	"allowSkip": false,
	"shuffleCases": false
}
```

| Field                | Type      | Description                        | Default | Effect on UI                             |
| -------------------- | --------- | ---------------------------------- | ------- | ---------------------------------------- |
| `autoAdvance`        | `boolean` | Auto-advance after correct answers | `true`  | Shows toggle in exercise header          |
| `autoAdvanceDelayMs` | `number`  | Delay before auto-advancing (ms)   | `1500`  | Controls timing of automatic progression |
| `allowSkip`          | `boolean` | Allow skipping questions           | `false` | Shows/hides skip button                  |
| `shuffleCases`       | `boolean` | Randomize question order           | `false` | Affects question sequence                |

### Exercise blocks

Each block represents a thematic group of related questions:

```json
{
  "id": "be-present",
  "name": "είμαι (Ενεστώτας)",
  "nameHintI18n": {
    "en": "to be (present)",
    "ru": "быть (настоящее время)"
  },
  "cases": [...]
}
```

| Field          | Type                       | Description             | Required | Effect on UI                   |
| -------------- | -------------------------- | ----------------------- | -------- | ------------------------------ |
| `id`           | `string`                   | Unique block identifier | ✓        | Used internally, not displayed |
| `name`         | `string`                   | Block name in Greek     | ✓        | Displayed as section header    |
| `nameHintI18n` | `Record<Language, string>` | Translation hints       | ✓        | Shown via hint system button   |
| `cases`        | `WordFormCase[]`           | Individual questions    | ✓        | Must contain ≥ 1 case          |

### Individual cases (questions)

Each case represents one question-answer pair:

```json
{
	"id": "be-present-1s",
	"prompt": "εγώ ___",
	"promptHintI18n": {
		"en": "I am",
		"ru": "я есть"
	},
	"correct": ["είμαι"],
	"hint": "εί___",
	"hintI18n": {
		"en": "I a_",
		"ru": "я е___"
	}
}
```

| Field            | Type                       | Description                | Required | Effect on UI                                       |
| ---------------- | -------------------------- | -------------------------- | -------- | -------------------------------------------------- |
| `id`             | `string`                   | Unique case identifier     | ✓        | Used internally for progress tracking              |
| `prompt`         | `string`                   | Question text in Greek     | ✓        | Main question display                              |
| `correct`        | `string[]`                 | Accepted correct answers   | ✓        | Must contain ≥ 1 answer, case-sensitive validation |
| `promptHintI18n` | `Record<Language, string>` | Question translation       | Optional | Hint button next to question                       |
| `hint`           | `string`                   | Additional Greek hint      | Optional | Additional hint button                             |
| `hintI18n`       | `Record<Language, string>` | Translated additional hint | Optional | Localized additional hint                          |

## Behavioral dependencies

### Exercise execution flow

1. **Initialization**: Exercise settings merged with defaults
2. **Block progression**: Sequential by default, randomized if `shuffleCases: true`
3. **Question display**: Shows current question with available hints
4. **Answer validation**: Compares user input against all values in `correct` array
5. **Feedback display**:
   - Correct: Green pulse, auto-advance if enabled
   - Incorrect: Red pulse, show correct answer briefly
6. **Progression**: Advance to next question after delay or user action

### Hint system behavior

The hint system provides contextual help through interactive buttons:

1. **Block name hint**: Always available, shows translation of block `name`
2. **Question hint**: Available when `promptHintI18n` is provided
3. **Additional hint**: Available when `hint` or `hintI18n` is provided

**Desktop behavior**: Hover to show hints
**Mobile behavior**: Tap to toggle hints, tap outside to hide

### Settings impact on UX

| Setting                    | Value                            | UI Impact                          |
| -------------------------- | -------------------------------- | ---------------------------------- |
| `autoAdvance: true`        | Shows toggle switch in header    | User can disable during exercise   |
| `autoAdvanceDelayMs: 1500` | 1.5s delay after correct answer  | Gives user time to see feedback    |
| `allowSkip: false`         | No skip button shown             | Forces completion of all questions |
| `shuffleCases: true`       | Questions appear in random order | Different sequence each time       |

### Validation and error handling

- **Schema validation**: All exercises validated against Valibot schemas on load
- **Runtime validation**: User answers trimmed and compared case-sensitively
- **Multiple correct answers**: First match in `correct` array used for display
- **Missing translations**: Falls back to English, then to translation key

## Language support

### Supported languages

- `el` - Greek (primary study language)
- `en` - English (fallback)
- `ru` - Russian

### Translation requirements

All `*I18n` fields must include translations for all supported languages:

```json
{
	"titleI18n": {
		"el": "Greek title",
		"en": "English title",
		"ru": "Russian title"
	}
}
```

### Fallback chain

1. User's selected interface language
2. English (`en`)
3. Translation key itself (error state)

## Example exercises

### Minimal exercise

```json
{
	"enabled": true,
	"id": "minimal-example",
	"type": "word-form",
	"title": "Παράδειγμα",
	"titleI18n": {
		"en": "Example",
		"ru": "Пример"
	},
	"description": "Απλό παράδειγμα",
	"descriptionI18n": {
		"en": "Simple example",
		"ru": "Простой пример"
	},
	"tags": ["example"],
	"difficulty": "a1",
	"estimatedTimeMinutes": 5,
	"blocks": [
		{
			"id": "block-1",
			"name": "Λέξη",
			"nameHintI18n": {
				"en": "Word",
				"ru": "Слово"
			},
			"cases": [
				{
					"id": "case-1",
					"prompt": "μία ___",
					"correct": ["λέξη"]
				}
			]
		}
	]
}
```

### Advanced exercise with all features

```json
{
	"enabled": true,
	"id": "advanced-example",
	"type": "word-form",
	"title": "Προχωρημένο παράδειγμα",
	"titleI18n": {
		"en": "Advanced example",
		"ru": "Продвинутый пример"
	},
	"description": "Παράδειγμα με όλες τις δυνατότητες",
	"descriptionI18n": {
		"en": "Example with all features",
		"ru": "Пример со всеми возможностями"
	},
	"tags": ["example", "advanced", "verbs"],
	"difficulty": "b1",
	"estimatedTimeMinutes": 15,
	"settings": {
		"autoAdvance": false,
		"autoAdvanceDelayMs": 2000,
		"allowSkip": true,
		"shuffleCases": true
	},
	"blocks": [
		{
			"id": "advanced-block",
			"name": "είμαι (Ενεστώτας)",
			"nameHintI18n": {
				"en": "to be (present)",
				"ru": "быть (настоящее время)"
			},
			"cases": [
				{
					"id": "advanced-case",
					"prompt": "εγώ ___",
					"promptHintI18n": {
						"en": "I am",
						"ru": "я есть"
					},
					"correct": ["είμαι", "ειμαι"],
					"hint": "εί___",
					"hintI18n": {
						"en": "I a_",
						"ru": "я е___"
					}
				}
			]
		}
	]
}
```

## File organization

Exercise JSON files should be placed in:

- `src/mocks/data/exercises/` - For development and testing
- Exercise files should use kebab-case naming: `verbs-be.json`, `nouns-basic.json`

## Validation

All exercises are validated using Valibot schemas defined in `src/schemas/exercises.ts`. The validation ensures:

- Required fields are present
- Data types are correct
- Arrays have minimum required length
- Enum values are valid
- Nested objects follow proper structure

Use the validation functions:

- `validateWordFormExercise(data)` - Validate complete exercise
- `validateWordFormBlock(data)` - Validate individual block
- `validateExercisesList(data)` - Validate exercise metadata list
