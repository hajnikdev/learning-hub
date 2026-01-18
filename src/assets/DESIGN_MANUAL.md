# Angular Template Best Practices

- **Always use the latest Angular control flow blocks:**
  - Use `@for` instead of `*ngFor` for iteration.
  - Use `@if` instead of `*ngIf` for conditionals.
  - Prefer these new blocks for clarity, performance, and future compatibility.

# Angular State Management

- **Use Angular signals for all component and service state:**
  - Prefer `signal()` for local state instead of `BehaviorSubject` or component properties.
  - Use signals for reactive state updates and template binding.
  - Use `effect()` for side effects and derived state.
  - Avoid legacy RxJS state patterns unless integrating with external streams.
# Angular Template Best Practices

- **Always use the latest Angular control flow blocks:**
  - Use `@for` instead of `*ngFor` for iteration.
  - Use `@if` instead of `*ngIf` for conditionals.
  - Prefer these new blocks for clarity, performance, and future compatibility.

# Design Manual for Learning Hub

This design manual defines the core style and configuration guidelines for building all features, containers, and components in the Learning Hub Angular project. Update this file as your design evolves.

## Colors
- **Primary Color:** #1976d2 (blue)
- **Accent Color:** #ff4081 (pink)
- **Background Color:** #f5f5f5 (light gray)
- **Text Color:** #222222 (dark gray)
- **Error Color:** #d32f2f (red)

## Typography
- **Font Family:** 'Roboto', Arial, sans-serif
- **Base Font Size:** 16px
- **Font Weights:** 400 (normal), 500 (medium), 700 (bold)

## Spacing
- **Base Unit:** 8px
- **Margin Sizes:**
  - xs: 4px
  - sm: 8px
  - md: 16px
  - lg: 24px
  - xl: 32px
- **Padding Sizes:**
  - xs: 4px
  - sm: 8px
  - md: 16px
  - lg: 24px
  - xl: 32px

## Borders
- **Border Radius:** 4px (default)
- **Border Width:** 1px (default)
- **Border Color:** #e0e0e0 (light gray)

## Shadows
- **Elevation 1:** 0 1px 3px rgba(0,0,0,0.12)
- **Elevation 2:** 0 3px 6px rgba(0,0,0,0.16)

## Buttons
- **Primary Button:**
  - Background: Primary Color
  - Text: #fff
  - Border Radius: 4px
  - Padding: 8px 16px
- **Accent Button:**
  - Background: Accent Color
  - Text: #fff
  - Border Radius: 4px
  - Padding: 8px 16px

## Forms
- **Input Border Radius:** 4px
- **Input Border Color:** #bdbdbd
- **Input Padding:** 8px

## Containers
- **Default Padding:** 16px
- **Default Margin:** 16px
- **Background:** #fff
- **Border Radius:** 4px

---

> **Note:** Always refer to this manual when building or updating components. If you change any design parameter, update this file.
