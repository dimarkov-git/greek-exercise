# Tailwind CSS & UI/UX Development Guide

## Overview

This guide provides comprehensive instructions for Tailwind CSS development in the Learn Greek application, following modern v4 best practices and the established design system.

## Table of Contents

- [Design System](#design-system)
- [Component Development](#component-development)
- [Dark Mode Implementation](#dark-mode-implementation)
- [Responsive Design](#responsive-design)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Performance Optimization](#performance-optimization)
- [Testing UI Components](#testing-ui-components)

## Design System

### CSS Custom Properties

Our design system is built on CSS custom properties defined in `src/global.css`. **Always use CSS variables instead of hardcoded values:**

```css
/* ✅ Good - Uses design tokens */
.button {
  background-color: var(--color-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

/* ❌ Bad - Hardcoded values */
.button {
  background-color: #2563eb;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Color System

```typescript
// Semantic colors - automatically adapt to light/dark themes
'bg-[var(--color-primary)]'
'text-[var(--color-text-primary)]'
'border-[var(--color-border)]'

// Status colors
'bg-[var(--color-success)]'
'bg-[var(--color-error)]'
'bg-[var(--color-warning)]'
'bg-[var(--color-info)]'

// Surface colors
'bg-[var(--color-background)]'
'bg-[var(--color-surface)]'
'bg-[var(--color-surface-elevated)]'
```

### Typography Scale

Use semantic typography components with fluid sizing:

```tsx
import { Hero, Heading, Title, Body, Caption } from '@/components/ui/typography'

// ✅ Good - Semantic components with automatic sizing
<Hero>Main headline</Hero>
<Heading>Section title</Heading>
<Body>Regular content</Body>
<Caption color="secondary">Helper text</Caption>

// ✅ Also good - Custom Typography with fluid sizing
<Typography size="display" weight="bold">Custom heading</Typography>
```

### Spacing System

Use the 8px grid system via CSS variables:

```tsx
// ✅ Good - Design system spacing
'p-[var(--space-4)]'    // 16px
'mt-[var(--space-6)]'   // 24px
'gap-[var(--space-2)]'  // 8px

// ❌ Bad - Arbitrary values
'p-4'                   // Not using design tokens
'mt-6'                  // Not using design tokens
```

## Component Development

### Component Variant System

Use `class-variance-authority` (CVA) for consistent component variants:

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const componentVariants = cva(
  // Base styles using CSS custom properties
  'inline-flex items-center justify-center rounded-lg transition-all',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
        secondary: 'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)]',
        outline: 'border-2 border-[var(--color-border)] bg-transparent hover:bg-[var(--color-hover-overlay)]'
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
)

export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

export const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Layout Components

Use semantic layout components for consistent structure:

```tsx
import { Container, Stack, Grid } from '@/components/ui/spacing'

// ✅ Good - Semantic layout components
<Container size="xl">
  <Stack space={6}>
    <Heading>Page Title</Heading>
    <Grid cols={3} space={4}>
      <Card>Item 1</Card>
      <Card>Item 2</Card>
      <Card>Item 3</Card>
    </Grid>
  </Stack>
</Container>

// ❌ Bad - Manual layout with hardcoded classes
<div className="max-w-7xl mx-auto px-4">
  <div className="flex flex-col gap-6">
    <h1>Page Title</h1>
    <div className="grid grid-cols-3 gap-4">
      {/* Items */}
    </div>
  </div>
</div>
```

## Dark Mode Implementation

### Automatic Theme Variables

Dark mode is handled automatically through CSS custom properties. **Never use Tailwind's `dark:` prefix with hardcoded colors:**

```tsx
// ✅ Good - Automatic theme adaptation
className="bg-[var(--color-surface)] text-[var(--color-text-primary)]"

// ❌ Bad - Manual dark mode classes
className="bg-white text-black dark:bg-gray-900 dark:text-white"
```

### Theme Toggle Usage

```tsx
import { useSettingsStore } from '@/stores/settings'

function MyComponent() {
  const { theme, setTheme } = useSettingsStore()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className="bg-[var(--color-surface)] text-[var(--color-text-primary)]"
    >
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  )
}
```

## Responsive Design

### Fluid Typography

Typography scales automatically using `clamp()`. No additional responsive classes needed:

```tsx
// ✅ Good - Automatic fluid sizing
<Typography size="hero">Responsive title</Typography>

// ❌ Bad - Manual responsive classes (not needed)
<h1 className="text-2xl md:text-4xl lg:text-6xl">Title</h1>
```

### Responsive Components

Use component props for responsive behavior:

```tsx
// ✅ Good - Component handles responsiveness
<Grid cols={3} responsive={true}>
  {/* Automatically: cols-1 md:cols-2 lg:cols-3 */}
</Grid>

<Container size="xl" center={true}>
  {/* Responsive container with centering */}
</Container>
```

### Mobile-First Approach

When custom responsive classes are needed, use mobile-first:

```tsx
// ✅ Good - Mobile-first responsive
'flex flex-col md:flex-row'
'text-sm md:text-base lg:text-lg'
'p-[var(--space-4)] md:p-[var(--space-6)]'
```

## Accessibility Guidelines

### ARIA Patterns

Always include appropriate ARIA attributes:

```tsx
// ✅ Good - Accessible button
<button
  aria-label="Close dialog"
  aria-pressed={isActive}
  disabled={isLoading}
  className="..."
>
  {isLoading && <div aria-hidden="true" className="animate-spin..." />}
  {children}
</button>

// ✅ Good - Accessible form input
<input
  aria-label="Email address"
  aria-describedby="email-error"
  aria-invalid={hasError}
  className="..."
/>
{hasError && (
  <div id="email-error" role="alert">
    Please enter a valid email
  </div>
)}
```

### Focus States

Ensure all interactive elements have focus states:

```tsx
// ✅ Good - Proper focus styling
'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]'

// ❌ Bad - Removing focus without replacement
'focus:outline-none' // Only if you add custom focus styles
```

### Color Contrast

Use semantic colors that maintain contrast in both themes:

```tsx
// ✅ Good - High contrast text
'text-[var(--color-text-primary)]'     // High contrast
'text-[var(--color-text-secondary)]'   // Medium contrast
'text-[var(--color-text-tertiary)]'    // Low contrast (use sparingly)

// ❌ Bad - Poor contrast
'text-gray-400' // May fail contrast ratios
```

## Performance Optimization

### Component Memoization

Use `React.memo` for components that re-render frequently:

```tsx
import { memo } from 'react'

export const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
  onAction
}: Props) {
  // Component implementation
})

// For forwardRef components
export const MemoizedComponent = memo(
  forwardRef<HTMLElement, Props>((props, ref) => {
    // Implementation
  })
)
```

### CSS-in-JS Optimization

Avoid runtime CSS generation. Use CSS custom properties instead:

```tsx
// ✅ Good - CSS custom properties
<div
  className="bg-[var(--color-primary)]"
  style={{ '--custom-size': `${dynamicValue}px` } as React.CSSProperties}
/>

// ❌ Bad - Runtime style generation
<div
  className="bg-blue-500"
  style={{ backgroundColor: dynamicColor }} // Causes re-renders
/>
```

### Bundle Optimization

Import components efficiently:

```tsx
// ✅ Good - Direct imports
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// ✅ Also good - Barrel imports from index files
import { Button, Card } from '@/components/ui'

// ❌ Bad - Importing entire libraries
import * as Components from '@/components/ui' // Imports everything
```

## Testing UI Components

### Visual Testing

Test component variants and states:

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders all variants correctly', () => {
    const { rerender } = render(<Button variant="primary">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--color-primary)]')

    rerender(<Button variant="secondary">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--color-secondary)]')
  })

  it('handles loading state with accessibility', () => {
    render(<Button loading={true} loadingText="Saving...">Save</Button>)
    const button = screen.getByRole('button')

    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toBeDisabled()
    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })
})
```

### Accessibility Testing

Test keyboard navigation and screen reader support:

```tsx
import userEvent from '@testing-library/user-event'

it('supports keyboard navigation', async () => {
  const user = userEvent.setup()
  const onClose = vi.fn()

  render(<Dialog onClose={onClose}>Content</Dialog>)

  // Test Escape key
  await user.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalled()

  // Test Tab navigation
  await user.tab()
  expect(screen.getByRole('button')).toHaveFocus()
})
```

### Responsive Testing

Test component behavior at different viewport sizes:

```tsx
import { render } from '@testing-library/react'

it('adapts to different screen sizes', () => {
  // Mock viewport
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 320,
  })

  render(<Grid cols={3} responsive={true}>Content</Grid>)

  const grid = screen.getByText('Content').parentElement
  expect(grid).toHaveClass('grid-cols-1') // Mobile-first
})
```

## Common Patterns

### Loading States

```tsx
// ✅ Good - Accessible loading pattern
{isLoading ? (
  <div role="status" aria-label="Loading content">
    <div aria-hidden="true" className="animate-pulse">
      <SkeletonCard />
    </div>
  </div>
) : (
  <ContentComponent />
)}
```

### Error States

```tsx
// ✅ Good - Accessible error handling
{error ? (
  <div role="alert" className="text-[var(--color-error)]">
    <Icon aria-hidden="true" />
    {error.message}
  </div>
) : null}
```

### Interactive States

```tsx
// ✅ Good - Clear interactive states
className={cn(
  'transition-all duration-200',
  'hover:bg-[var(--color-hover-overlay)]',
  'active:bg-[var(--color-active-overlay)]',
  'disabled:opacity-50 disabled:pointer-events-none',
  isSelected && 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
)}
```

## Best Practices Summary

### ✅ Do's

1. **Use CSS custom properties** for all colors, spacing, and shadows
2. **Use semantic components** (Button, Card, Typography) over raw HTML
3. **Follow the 8px grid** for consistent spacing
4. **Include ARIA attributes** for accessibility
5. **Test component variants** and states
6. **Use React.memo** for performance-critical components
7. **Follow mobile-first** responsive design
8. **Use CVA** for component variants
9. **Prefer design tokens** over hardcoded values
10. **Test with screen readers** and keyboard navigation

### ❌ Don'ts

1. **Don't use hardcoded colors** like `bg-blue-500`
2. **Don't use `dark:` prefix** with hardcoded colors
3. **Don't ignore accessibility** attributes
4. **Don't create runtime styles** unless absolutely necessary
5. **Don't bypass the design system** without good reason
6. **Don't forget to test** component variants
7. **Don't use arbitrary values** without CSS custom properties
8. **Don't create components** without proper TypeScript types
9. **Don't skip responsive testing**
10. **Don't ignore performance** implications

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [CVA Documentation](https://cva.style/docs)
- [WCAG AA Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Examples Repository

See `src/components/ui/` for complete examples of:
- Button variants with accessibility
- Input components with icons and loading states
- Card systems with semantic structure
- Typography with fluid responsive scaling
- Layout components with consistent spacing

---

**For project-specific guidelines, see [CLAUDE.md](../../CLAUDE.md)**
**For accessibility requirements, see [Accessibility Guide](accessibility.md)**