# Word-form exercise guide

This guide explains how to create word-form exercises in JSON format for the Learn Greek application. Word-form
exercises help students practice different forms of words, including verb conjugations, noun declensions, and other
grammatical transformations.

## Overview

Word-form exercises present students with a series of prompts where they must fill in the correct form of a word. Each
exercise consists of:

- **Blocks**: Groups of related word forms (e.g., "to read" verb conjugation in present tense)
- **Cases**: Individual prompts within a block (e.g., "I read", "you read", "he reads")

The exercise tracks progress, validates answers against multiple possible correct forms, and provides hints in different
languages.

## Field reference

### Root level fields

#### Required fields

| Field         | Type    | Description                                                                                                            |
|---------------|---------|------------------------------------------------------------------------------------------------------------------------|
| `enabled`     | boolean | Whether this exercise is available to users. Set to `true` for active exercises.                                       |
| `id`          | string  | Unique identifier for the exercise. Use kebab-case (e.g., `verbs-present-tense`). Must be unique across all exercises. |
| `type`        | string  | Exercise type. Must be `"word-form"` for word-form exercises.                                                          |
| `language`    | string  | Primary language of exercise content. Use `"el"` for Greek, `"en"` for English, `"ru"` for Russian.                    |
| `title`       | string  | Exercise title in the primary language (Greek). Displayed in the exercise library.                                     |
| `description` | string  | Exercise description in the primary language (Greek). Explains what the exercise covers.                               |
| `difficulty`  | string  | CEFR difficulty level. Valid values: `"a0"`, `"a1"`, `"a2"`, `"b1"`, `"b2"`, `"c1"`, `"c2"`.                           |
| `blocks`      | array   | Array of exercise blocks. Must contain at least 1 block. See [Block structure](#block-structure).                      |

#### Optional fields

| Field             | Type   | Default | Description                                                                      |
|-------------------|--------|---------|----------------------------------------------------------------------------------|
| `titleI18n`       | object | -       | Translations of the title in interface languages. Keys: `"en"`, `"ru"`.          |
| `descriptionI18n` | object | -       | Translations of the description. Keys: `"en"`, `"ru"`.                           |
| `tags`            | array  | `[]`    | Array of strings for filtering exercises (e.g., `["verbs", "irregular-verbs"]`). |

### Block structure

Each block represents a group of related word forms (e.g., a verb conjugation in one tense, or noun forms).

#### Required fields

| Field   | Type   | Description                                                                                   |
|---------|--------|-----------------------------------------------------------------------------------------------|
| `id`    | string | Unique identifier for the block within this exercise. Use kebab-case.                         |
| `name`  | string | Block name in Greek (e.g., verb infinitive, noun nominative singular). Displayed to the user. |
| `cases` | array  | Array of cases (questions) in this block. Must contain at least 1 case.                       |

#### Optional fields

| Field          | Type   | Description                                                                                                     |
|----------------|--------|-----------------------------------------------------------------------------------------------------------------|
| `nameHintI18n` | object | Translations of the block name. Helps users understand what word/form they're practicing. Keys: `"en"`, `"ru"`. |

### Case structure

Each case is an individual question within a block.

#### Required fields

| Field     | Type   | Description                                                                                                                           |
|-----------|--------|---------------------------------------------------------------------------------------------------------------------------------------|
| `id`      | string | Unique identifier for the case within this block. Use kebab-case.                                                                     |
| `prompt`  | string | Question prompt in Greek with `___` indicating where to fill in the answer (e.g., `"εγώ ___"`).                                       |
| `correct` | array  | Array of correct answers in Greek. Must contain at least 1 answer. Multiple answers allow for variations (e.g., `["μιλάω", "μιλώ"]`). |

#### Optional fields

| Field            | Type   | Description                                                                                      |
|------------------|--------|--------------------------------------------------------------------------------------------------|
| `promptHintI18n` | object | Translations of the prompt. Helps users understand what the question asks. Keys: `"en"`, `"ru"`. |

### I18n object structure

Internationalization (i18n) objects provide translations for interface languages. The keys must be valid language codes.

Valid language codes:

- `"en"` - English
- `"ru"` - Russian

Example:

```json
{
  "en": "to read",
  "ru": "читать"
}
```

**Important**: Not all languages need to be present. You can provide translations for just one language if needed, but
providing all translations improves the user experience.

## Validation rules

The application validates exercises using the following rules:

### Root level validation

1. `id` must be a non-empty string and unique across all exercises
2. `type` must be exactly `"word-form"`
3. `language` must be `"el"`, `"en"`, or `"ru"`
4. `difficulty` must be one of: `"a0"`, `"a1"`, `"a2"`, `"b1"`, `"b2"`, `"c1"`, `"c2"`
5. `blocks` array must contain at least one block
6. `tags` array (if provided) must contain strings

### Block validation

1. Each `block.id` must be unique within the exercise
2. `block.name` must be a non-empty string
3. `block.cases` array must contain at least one case

### Case validation

1. Each `case.id` must be unique within the block
2. `case.prompt` must be a non-empty string
3. `case.correct` array must contain at least one non-empty string

### I18n validation

1. If provided, i18n objects must have valid language codes as keys (`"en"`, `"ru"`)
2. Values must be non-empty strings

## Examples

### Example 1: Simple verb conjugation

A basic exercise for conjugating a single verb in the present tense:

```json
{
  "enabled": true,
  "id": "verb-read-present",
  "type": "word-form",
  "language": "el",
  "title": "Συζυγία του ρήματος διαβάζω",
  "titleI18n": {
    "en": "Conjugation of 'to read'",
    "ru": "Спряжение глагола 'читать'"
  },
  "description": "Εξάσκηση στη συζυγία του ρήματος διαβάζω στον ενεστώτα",
  "descriptionI18n": {
    "en": "Practice conjugating 'to read' in present tense",
    "ru": "Практика спряжения глагола 'читать' в настоящем времени"
  },
  "tags": [
    "verbs",
    "present-tense"
  ],
  "difficulty": "a1",
  "blocks": [
    {
      "id": "read-present",
      "name": "διαβάζω",
      "nameHintI18n": {
        "en": "to read",
        "ru": "читать"
      },
      "cases": [
        {
          "id": "i",
          "prompt": "εγώ ___",
          "promptHintI18n": {
            "en": "I read",
            "ru": "я читаю"
          },
          "correct": [
            "διαβάζω"
          ]
        },
        {
          "id": "you-sg",
          "prompt": "εσύ ___",
          "promptHintI18n": {
            "en": "you read (sg.)",
            "ru": "ты читаешь"
          },
          "correct": [
            "διαβάζεις"
          ]
        },
        {
          "id": "he",
          "prompt": "αυτός/αυτή/αυτό ___",
          "promptHintI18n": {
            "en": "he/she/it reads",
            "ru": "он/она/оно читает"
          },
          "correct": [
            "διαβάζει"
          ]
        }
      ]
    }
  ]
}
```

### Example 2: Multiple verb conjugations with shuffling

An exercise with multiple verbs, shuffled cases for varied practice:

```json
{
  "enabled": true,
  "id": "common-verbs-present",
  "type": "word-form",
  "language": "el",
  "title": "Συνήθη ρήματα στον Ενεστώτα",
  "titleI18n": {
    "en": "Common Verbs in Present Tense",
    "ru": "Обычные глаголы в настоящем времени"
  },
  "description": "Εξάσκηση με κοινά ρήματα στον ενεστώτα",
  "descriptionI18n": {
    "en": "Practice common verbs in present tense",
    "ru": "Практика обычных глаголов в настоящем времени"
  },
  "tags": [
    "verbs",
    "present-tense",
    "common-words"
  ],
  "difficulty": "a1",
  "blocks": [
    {
      "id": "read",
      "name": "διαβάζω",
      "nameHintI18n": {
        "en": "to read",
        "ru": "читать"
      },
      "cases": [
        {
          "id": "i",
          "prompt": "εγώ ___",
          "promptHintI18n": {
            "en": "I read",
            "ru": "я читаю"
          },
          "correct": [
            "διαβάζω"
          ]
        },
        {
          "id": "you-sg",
          "prompt": "εσύ ___",
          "promptHintI18n": {
            "en": "you read (sg.)",
            "ru": "ты читаешь"
          },
          "correct": [
            "διαβάζεις"
          ]
        },
        {
          "id": "they",
          "prompt": "αυτοί/αυτές/αυτά ___",
          "promptHintI18n": {
            "en": "they read",
            "ru": "они читают"
          },
          "correct": [
            "διαβάζουν",
            "διαβάζουνε"
          ]
        }
      ]
    },
    {
      "id": "speak",
      "name": "μιλάω / μιλώ",
      "nameHintI18n": {
        "en": "to speak",
        "ru": "говорить"
      },
      "cases": [
        {
          "id": "i",
          "prompt": "εγώ ___",
          "promptHintI18n": {
            "en": "I speak",
            "ru": "я говорю"
          },
          "correct": [
            "μιλάω",
            "μιλώ"
          ]
        },
        {
          "id": "you-sg",
          "prompt": "εσύ ___",
          "promptHintI18n": {
            "en": "you speak (sg.)",
            "ru": "ты говоришь"
          },
          "correct": [
            "μιλάς"
          ]
        }
      ]
    }
  ]
}
```

## Best practices

### Content guidelines

1. **Use authentic Greek**: Ensure all Greek text uses proper spelling, grammar, and accent marks
2. **Provide context**: Use complete sentences or meaningful phrases rather than isolated words
3. **Multiple correct answers**: Include all acceptable variations in the `correct` array (e.g., formal and informal
   forms)
4. **Progressive difficulty**: Start with common, regular patterns before introducing exceptions
5. **Group related forms**: Keep related word forms together in the same block

### Structure guidelines

1. **Descriptive IDs**: Use clear, descriptive kebab-case IDs (e.g., `present-1s`, `nominative-singular`)
2. **Logical ordering**: Order cases logically (e.g., 1st/2nd/3rd person, singular/plural)
3. **Consistent hints**: Provide hints consistently across all blocks and cases
4. **Appropriate tags**: Use relevant, searchable tags for filtering (e.g., `verbs`, `nouns`, `irregular-verbs`)
5. **Block size**: Keep blocks focused (3–6 cases per block is ideal for verb conjugations)

### Translation guidelines

1. **Complete translations**: Provide both English and Russian translations when possible
2. **Natural language**: Translate meaning, not word-for-word
3. **Indicate gender/number**: Include gender and number information in hints where relevant (e.g., "(sg.)", "(pl.)", "(
   male)", "(female)")
4. **Provide context**: Hints should clarify what the student needs to answer

## Common mistakes

### 1. Missing required fields

**❌ Wrong:**

```json
{
  "id": "my-exercise",
  "type": "word-form"
}
```

**✅ Correct:**

```json
{
  "enabled": true,
  "id": "my-exercise",
  "type": "word-form",
  "language": "el",
  "title": "Τίτλος",
  "description": "Περιγραφή",
  "difficulty": "a1",
  "blocks": [
    ...
  ]
}
```

### 2. Empty correct answers array

**❌ Wrong:**

```json
{
  "id": "case-1",
  "prompt": "εγώ ___",
  "correct": []
}
```

**✅ Correct:**

```json
{
  "id": "case-1",
  "prompt": "εγώ ___",
  "correct": [
    "διαβάζω"
  ]
}
```

### 3. Invalid difficulty level

**❌ Wrong:**

```json
{
  "difficulty": "beginner"
}
```

**✅ Correct:**

```json
{
  "difficulty": "a1"
}
```

### 4. Missing fill-in placeholder

**❌ Wrong (unclear where to fill in):**

```json
{
  "prompt": "εγώ διαβάζω"
}
```

**✅ Correct:**

```json
{
  "prompt": "εγώ ___"
}
```

### 5. Duplicate IDs

**❌ Wrong:**

```json
{
  "blocks": [
    {
      "id": "verb-1",
      "cases": [
        {
          "id": "i",
          "prompt": "εγώ ___",
          "correct": [
            "..."
          ]
        },
        {
          "id": "i",
          "prompt": "εσύ ___",
          "correct": [
            "..."
          ]
        }
      ]
    }
  ]
}
```

**✅ Correct:**

```json
{
  "blocks": [
    {
      "id": "verb-1",
      "cases": [
        {
          "id": "i",
          "prompt": "εγώ ___",
          "correct": [
            "..."
          ]
        },
        {
          "id": "you-sg",
          "prompt": "εσύ ___",
          "correct": [
            "..."
          ]
        }
      ]
    }
  ]
}
```

### 6. Invalid language code

**❌ Wrong:**

```json
{
  "titleI18n": {
    "english": "My Title",
    "russian": "Мой заголовок"
  }
}
```

**✅ Correct:**

```json
{
  "titleI18n": {
    "en": "My Title",
    "ru": "Мой заголовок"
  }
}
```
