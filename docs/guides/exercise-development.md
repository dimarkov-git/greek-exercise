# Exercise development guide

This guide explains how to create and configure exercises for the **Learn Greek** application.

## 📋 Overview

The exercise system supports multiple types of language learning exercises. Currently implemented:

- **Word-form exercises**: Greek verb conjugation, noun declension, etc.

## 🗂️ Exercise data structure

### File organization

```
src/mocks/data/exercises/
├── verbs-be.json           # Greek verb είμαι (to be)
├── verbs-have.json         # Greek verb έχω (to have) - planned
├── pronouns.json           # Greek pronouns - planned
└── ...                     # Additional exercises
```

### JSON structure

Every exercise follows this basic structure:

```json
{
  "enabled": true,
  "id": "unique-exercise-id",
  "type": "word-form",
  "title": "Greek title",
  "titleI18n": {
    "en": "English title",
    "ru": "Russian title"
  },
  "description": "Greek description",
  "descriptionI18n": {
    "en": "English description",
    "ru": "Russian description"
  },
  "tags": ["tag1", "tag2"],
  "difficulty": "beginner",
  "settings": {},
  "blocks": []
}
```

## 🎯 Word-form exercises

### Complete example

Based on the existing `verbs-be.json`:

```json
{
  "enabled": true,
  "id": "verbs-be",
  "type": "word-form",
  "title": "Εξάσκηση ρήματος είμαι",
  "titleI18n": {
    "en": "Verb 'to be' practice",
    "ru": "Практика глагола 'быть'"
  },
  "description": "Κατακτήστε την κλίση του ρήματος είμαι σε όλους τους χρόνους",
  "descriptionI18n": {
    "en": "Master conjugation of the verb 'to be' in all tenses",
    "ru": "Освойте спряжение глагола 'быть' во всех временах"
  },
  "tags": ["verbs", "irregular-verbs", "basic", "conjugation"],
  "difficulty": "beginner",
  "settings": {
    "autoAdvance": true,
    "autoAdvanceDelayMs": 1500,
    "allowSkip": false,
    "shuffleCases": false
  },
  "blocks": [
    {
      "id": "be-present",
      "name": "είμαι (Ενεστώτας)",
      "nameHintI18n": {
        "en": "to be (present tense)",
        "ru": "быть (настоящее время)"
      },
      "cases": [
        {
          "id": "be-present-1s",
          "prompt": "εγώ ___",
          "promptHintI18n": {
            "en": "I am",
            "ru": "я есть"
          },
          "correct": ["είμαι"],
          "hint": null,
          "hintI18n": null
        }
      ]
    }
  ]
}
```

### Field descriptions

#### Exercise metadata

| Field                  | Type     | Required | Description                                        |
|------------------------|----------|----------|----------------------------------------------------|
| `enabled`              | boolean  | ✅        | Whether exercise appears in library                |
| `id`                   | string   | ✅        | Unique identifier (kebab-case)                     |
| `type`                 | string   | ✅        | Exercise type (`"word-form"`)                      |
| `title`                | string   | ✅        | Greek title                                        |
| `titleI18n`            | object   | ✅        | Translated titles (`en`, `ru`)                     |
| `description`          | string   | ✅        | Greek description                                  |
| `descriptionI18n`      | object   | ✅        | Translated descriptions                            |
| `tags`                 | string[] | ✅        | Tags for filtering/grouping                        |
| `difficulty`           | string   | ✅        | `"beginner"` \\| `"intermediate"` \\| `"advanced"` |

#### Exercise settings

| Field                | Type    | Default | Description                       |
|----------------------|---------|---------|-----------------------------------|
| `autoAdvance`        | boolean | `true`  | Auto-proceed after correct answer |
| `autoAdvanceDelayMs` | number  | `1000`  | Delay before auto-advance (ms)    |
| `allowSkip`          | boolean | `false` | Allow skipping questions          |
| `shuffleCases`       | boolean | `false` | Randomize question order          |

#### Blocks and cases

| Field                    | Type     | Required | Description               |
|--------------------------|----------|----------|---------------------------|
| `blocks[].id`            | string   | ✅        | Unique block identifier   |
| `blocks[].name`          | string   | ✅        | Greek block name          |
| `blocks[].nameHintI18n`  | object   | ❌        | Translated block name     |
| `blocks[].cases`         | array    | ✅        | Array of questions        |
| `cases[].id`             | string   | ✅        | Unique case identifier    |
| `cases[].prompt`         | string   | ✅        | Greek prompt/question     |
| `cases[].promptHintI18n` | object   | ❌        | Translated prompt         |
| `cases[].correct`        | string[] | ✅        | Array of correct answers  |
| `cases[].hint`           | string   | ❌        | Optional Greek hint       |
| `cases[].hintI18n`       | object   | ❌        | Optional translated hints |

## 🔧 Development workflow

### 1. Create exercise JSON file

Create a new file in `src/mocks/data/exercises/`:

```bash
touch src/mocks/data/exercises/your-exercise.json
```

### 2. Define exercise structure

```json
{
  "enabled": true,
  "id": "your-exercise",
  "type": "word-form",
  // ... rest of the structure
}
```

### 3. Register exercise in MSW handlers

Update `src/mocks/handlers.ts` to include your exercise:

```typescript
// Add to the exercises registry
const exerciseFiles = {
  'verbs-be': () => import('./data/exercises/verbs-be.json'),
  'your-exercise': () => import('./data/exercises/your-exercise.json'), // Add this
}
```

### 4. Test your exercise

1. **Start dev server**: `pnpm dev`
2. **Navigate to library**: `http://localhost:5173/exercises`
3. **Find your exercise** in the list
4. **Test the exercise flow**

### 5. Validate JSON structure

The app uses Valibot schemas for exercise data validation and Zod for UI component validation. Invalid exercises will show error messages in development.

## 📝 Writing guidelines

### Content guidelines

#### Greek text

- Use proper Greek characters (not Latin look-alikes)
- Include appropriate accents and breathing marks
- Follow Modern Greek spelling conventions

#### Translations

- Provide accurate English and Russian translations
- Keep translations concise and clear
- Use consistent terminology across exercises

#### Hints

- Make hints helpful but not giving away answers
- Use `hint` for Greek grammatical hints
- Use `hintI18n` for translations/explanations

### Technical guidelines

#### IDs and naming

- Use kebab-case for IDs: `verbs-be`, `pronouns-personal`
- Make IDs descriptive and unique
- Use consistent naming across similar exercises

#### Tags

Use relevant tags for filtering:

- **Grammar**: `verbs`, `nouns`, `adjectives`, `pronouns`
- **Skill level**: `basic`, `intermediate`, `advanced`
- **Type**: `conjugation`, `declension`, `vocabulary`
- **Regularity**: `regular`, `irregular`

#### Difficulty levels

- **Beginner**: Basic vocabulary, present tense, simple concepts
- **Intermediate**: Past/future tenses, more complex grammar
- **Advanced**: Complex sentences, rare vocabulary, nuanced grammar

#### Multiple correct answers

Support variations in acceptable answers:

```json
{
  "prompt": "εγώ ___",
  "correct": ["είμαι", "ειμαι"]  // With and without accent
}
```

The system automatically normalizes Greek text for comparison.

## 🎨 Exercise design patterns

### Progressive difficulty

Structure blocks from simple to complex:

```json
{
  "blocks": [
    {
      "name": "Ενεστώτας (Present)",
      "cases": [/* Simple present forms */]
    },
    {
      "name": "Παρελθόντας (Past)",
      "cases": [/* Past tense forms */]
    },
    {
      "name": "Μέλλοντας (Future)",
      "cases": [/* Future tense forms */]
    }
  ]
}
```

### Contextual prompts

Make prompts clear and contextual:

```json
{
  "prompt": "εγώ ___ στο σπίτι",
  "promptHintI18n": {
    "en": "I ___ at home",
    "ru": "я ___ дома"
  },
  "correct": ["είμαι"]
}
```

### Hint system usage

**When to use hints**:

- Complex grammatical concepts
- Irregular forms
- Cultural context needed

**When not to use hints**:

- Simple vocabulary
- Direct translations
- Repetitive patterns

```json
{
  "hint": "Χρησιμοποιείται το θα + μορφή ενεστώτα",
  "hintI18n": {
    "en": "Uses θα + present form",
    "ru": "Использует θα + форма настоящего времени"
  }
}
```

## 🧪 Testing exercises

### Manual testing checklist

- [ ] Exercise appears in library
- [ ] Correct answers are accepted
- [ ] Incorrect answers show feedback
- [ ] Hints display properly
- [ ] Progress tracking works
- [ ] Auto-advance works (if enabled)
- [ ] Completion screen shows statistics
- [ ] All languages display correctly

### Common issues

#### JSON validation errors

- Missing required fields
- Invalid language codes
- Wrong data types

#### Text input issues

- Greek text encoding problems
- Accent/tone mismatches
- Case sensitivity issues

#### Translation problems

- Missing translations for some languages
- Inconsistent terminology
- Cultural context issues

### Debugging tools

Use browser developer tools:

1. **Network tab**: Check exercise loading
2. **Console**: Look for validation errors
3. **React DevTools**: Inspect component state
4. **TanStack Query DevTools**: Monitor API calls

## 📊 Exercise analytics

### Built-in metrics

The system automatically tracks:

- Questions answered correctly/incorrectly
- Time spent per question
- Hints accessed
- Exercise completion rate
- Overall accuracy

### Custom metrics

Add custom tracking by extending the exercise data:

```json
{
  "metadata": {
    "trackingId": "greek-verbs-basic",
    "category": "grammar",
    "subcategory": "verbs"
  }
}
```

## 🚀 Advanced features

### Dynamic content

Create exercises with computed content:

```json
{
  "cases": [
    {
      "prompt": "{{ randomPronoun }} ___",
      "correct": ["{{ conjugatedForm }}"],
      "variables": {
        "randomPronoun": ["εγώ", "εσύ", "αυτός"],
        "conjugatedForm": ["είμαι", "είσαι", "είναι"]
      }
    }
  ]
}
```

*Note: This feature is planned but not yet implemented.*

### Audio integration

Prepare exercises for future audio support:

```json
{
  "cases": [
    {
      "prompt": "εγώ ___",
      "audioUrl": "/audio/exercises/verbs-be/ego.mp3",
      "correct": ["είμαι"]
    }
  ]
}
```

### Image support

Add visual context:

```json
{
  "cases": [
    {
      "prompt": "Αυτό είναι ___",
      "imageUrl": "/images/exercises/nouns/house.jpg",
      "correct": ["σπίτι"]
    }
  ]
}
```

## 📋 Best practices

### Development

1. **Start small**: Create simple exercises first
2. **Test frequently**: Validate after each change
3. **Use version control**: Commit working exercises
4. **Document changes**: Update this guide when adding features

### Content creation

1. **Be consistent**: Follow established patterns
2. **Provide context**: Make questions clear
3. **Include variety**: Mix question types within blocks
4. **Think mobile**: Ensure content works on small screens

### Performance

1. **Keep files reasonable**: < 50KB per exercise
2. **Optimize images**: Use appropriate formats and sizes
3. **Minimize nesting**: Avoid overly complex block structures
4. **Test loading**: Verify performance on slow connections

## 🎯 Exercise templates

### Basic verb conjugation

```json
{
  "enabled": true,
  "id": "verbs-{verb-name}",
  "type": "word-form",
  "title": "Εξάσκηση ρήματος {verb}",
  "titleI18n": {
    "en": "Verb '{english-verb}' practice",
    "ru": "Практика глагола '{russian-verb}'"
  },
  "tags": ["verbs", "conjugation"],
  "difficulty": "beginner",
  "blocks": [
    {
      "id": "{verb}-present",
      "name": "{verb} (Ενεστώτας)",
      "cases": [
        {
          "id": "{verb}-present-1s",
          "prompt": "εγώ ___",
          "correct": ["{1st-person-singular}"]
        }
      ]
    }
  ]
}
```

### Noun declension template

```json
{
  "enabled": true,
  "id": "nouns-{noun-category}",
  "type": "word-form",
  "title": "Κλίση {noun-category}",
  "tags": ["nouns", "declension"],
  "blocks": [
    {
      "id": "{noun}-nominative",
      "name": "Ονομαστική",
      "cases": [
        {
          "prompt": "ο/η/το ___",
          "correct": ["{nominative-form}"]
        }
      ]
    }
  ]
}
```

## 📚 Resources

### Greek language resources

- [Greek Grammar Reference](https://en.wikipedia.org/wiki/Modern_Greek_grammar)
- [Greek Verb Conjugation](https://cooljugator.com/gr)
- [Greek Unicode Characters](https://www.unicode.org/charts/PDF/U0370.pdf)

### Development tools

- [JSON Validator](https://jsonlint.com/)
- [Valibot Documentation](https://valibot.dev/) - Exercise data validation
- [Zod Documentation](https://zod.dev/) - UI component validation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Testing resources

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Playwright Testing](https://playwright.dev/)

Happy exercise development! 🎉
