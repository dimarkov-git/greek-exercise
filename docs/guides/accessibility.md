# Accessibility guide

Guidelines and best practices for ensuring the Learn Greek application is accessible to all users, including those using assistive technologies.

## Accessibility standards

### Target compliance

- **WCAG 2.1 AA**: Minimum compliance level
- **Color contrast ratio**: ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- **Keyboard navigation**: Full functionality without mouse
- **Screen reader support**: Compatible with major screen readers

## Accessibility checklist

### Essential requirements

- [ ] **Semantic HTML**: Use proper HTML elements for their intended purpose
- [ ] **Keyboard navigation**: All interactive elements accessible via keyboard
- [ ] **Focus indicators**: Visible focus states on all focusable elements
- [ ] **Color contrast**: Meet WCAG AA standards (4.5:1 minimum)
- [ ] **Alternative text**: Meaningful alt text for all images
- [ ] **Labels**: Form inputs have associated labels
- [ ] **Headings**: Proper heading hierarchy (h1 → h2 → h3)
- [ ] **No keyboard traps**: Users can navigate away from any element

### Advanced requirements

- [ ] **ARIA landmarks**: Use semantic landmarks for navigation
- [ ] **Live regions**: Dynamic content updates announced to screen readers
- [ ] **Reduced motion**: Respect prefers-reduced-motion settings
- [ ] **High contrast mode**: Compatible with OS high contrast modes
- [ ] **Zoom support**: Functional up to 200% zoom level
- [ ] **Error handling**: Clear error messages with correction guidance

## Implementation guidelines

### Semantic HTML structure

```tsx
// ✅ Good: Semantic structure
<main>
  <header>
    <nav aria-label="Main navigation">
      <ul role="menubar">
        <li role="none">
          <a href="/" role="menuitem">Home</a>
        </li>
      </ul>
    </nav>
  </header>

  <section aria-labelledby="exercises-heading">
    <h2 id="exercises-heading">Available Exercises</h2>
    <ul>
      <li><a href="/exercise/1">Exercise 1</a></li>
    </ul>
  </section>
</main>

// ❌ Avoid: Generic divs without semantic meaning
<div>
  <div>
    <div>
      <a>Home</a>
    </div>
  </div>
</div>
```

### Keyboard navigation

```tsx
// ✅ Good: Proper keyboard handling
function ExerciseCard({ exercise, onSelect }: Props) {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(exercise.id)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyPress}
      onClick={() => onSelect(exercise.id)}
      aria-label={`Select exercise: ${exercise.title}`}
    >
      {exercise.title}
    </div>
  )
}
```

### Focus management

```tsx
import { useEffect, useRef } from 'react'

function Modal({ isOpen, onClose, title }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement

      // Focus modal
      modalRef.current?.focus()
    }

    return () => {
      // Restore focus when modal closes
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <h2 id="modal-title">{title}</h2>
      <button onClick={onClose} aria-label="Close modal">
        ×
      </button>
    </div>
  )
}
```

### Form accessibility

```tsx
function ExerciseForm({ onSubmit }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset>
        <legend>Exercise Details</legend>

        <div>
          <label htmlFor="exercise-title">Exercise Title</label>
          <input
            id="exercise-title"
            type="text"
            required
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <div id="title-error" role="alert" className="error">
              {errors.title}
            </div>
          )}
        </div>
      </fieldset>

      <button type="submit">Create Exercise</button>
    </form>
  )
}
```

### ARIA patterns

```tsx
// Accordion component
function ExerciseAccordion({ exercises }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div role="tablist">
      {exercises.map(exercise => (
        <div key={exercise.id}>
          <button
            role="tab"
            aria-expanded={expandedId === exercise.id}
            aria-controls={`panel-${exercise.id}`}
            onClick={() => setExpandedId(
              expandedId === exercise.id ? null : exercise.id
            )}
          >
            {exercise.title}
          </button>

          <div
            id={`panel-${exercise.id}`}
            role="tabpanel"
            aria-hidden={expandedId !== exercise.id}
            hidden={expandedId !== exercise.id}
          >
            {exercise.description}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Live regions for dynamic content

```tsx
function ExerciseProgress({ progress }: Props) {
  return (
    <div>
      <div aria-live="polite" aria-atomic="true">
        Progress: {progress}% complete
      </div>

      {/* For urgent announcements */}
      <div aria-live="assertive" className="sr-only">
        {progress === 100 && 'Exercise completed successfully!'}
      </div>
    </div>
  )
}
```

## Testing for accessibility

### Automated testing

```tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('has no accessibility violations', async () => {
  const { container } = render(<ExerciseList exercises={mockExercises} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Manual testing checklist

#### Keyboard navigation test

1. [ ] Tab through all interactive elements
2. [ ] Use Enter/Space to activate buttons and links
3. [ ] Use arrow keys in custom components (if applicable)
4. [ ] Ensure focus is visible and logical
5. [ ] Test Escape key functionality in modals/dropdowns

#### Screen reader test

1. [ ] Install NVDA (Windows) or VoiceOver (Mac)
2. [ ] Navigate using screen reader shortcuts
3. [ ] Verify all content is announced properly
4. [ ] Check landmark navigation works
5. [ ] Ensure form labels and errors are read correctly

#### Visual accessibility test

1. [ ] Increase browser zoom to 200%
2. [ ] Test in high contrast mode
3. [ ] Verify color contrast ratios
4. [ ] Test with reduced motion enabled
5. [ ] Check focus indicators are visible

## Tools and resources

### Development tools

- **axe-core**: Automated accessibility testing
- **eslint-plugin-jsx-a11y**: React-specific linting rules
- **Color Oracle**: Color blindness simulator
- **WAVE**: Web accessibility evaluation

### Browser extensions

- **axe DevTools**: In-browser accessibility scanner
- **Lighthouse**: Includes accessibility audit
- **Accessibility Insights**: Microsoft's accessibility testing tool

### Screen readers for testing

- **NVDA** (Windows): Free and widely used
- **VoiceOver** (Mac): Built into macOS
- **JAWS** (Windows): Popular commercial option
- **TalkBack** (Android): For mobile testing

## Common patterns and solutions

### Skip links

```tsx
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0"
    >
      Skip to main content
    </a>
  )
}
```

### Screen reader only content

```css
/* Tailwind utility: sr-only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only.focus:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Focus trap for modals

```tsx
import { useEffect, useRef } from 'react'

function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return containerRef
}
```

## Accessibility review process

### Development phase

1. [ ] Use semantic HTML elements
2. [ ] Implement keyboard navigation
3. [ ] Add appropriate ARIA attributes
4. [ ] Ensure color contrast compliance
5. [ ] Test with screen reader
6. [ ] Run automated accessibility tests

### Code review phase

1. [ ] Review HTML semantics
2. [ ] Check ARIA usage
3. [ ] Verify keyboard interaction patterns
4. [ ] Validate focus management
5. [ ] Confirm error handling accessibility

### QA testing phase

1. [ ] Manual keyboard navigation test
2. [ ] Screen reader compatibility test
3. [ ] High contrast mode test
4. [ ] Zoom functionality test (up to 200%)
5. [ ] Color contrast validation
6. [ ] Automated accessibility scan

### Pre-deployment checklist

1. [ ] All automated accessibility tests pass
2. [ ] Manual testing completed without issues
3. [ ] No WCAG AA violations found
4. [ ] Documentation updated with accessibility notes
5. [ ] Accessibility impact assessed and documented