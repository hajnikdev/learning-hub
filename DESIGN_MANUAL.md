# Learning Hub Design Manual

## Table of Contents
1. [Colors](#colors)
2. [Spacing & Units](#spacing--units)
3. [Typography](#typography)
4. [Shadows](#shadows)
5. [Layout](#layout)
6. [Components](#components)
7. [Responsive Design](#responsive-design)

---

## Colors

### Primary Colors
- **Primary Blue**: `#1976d2` - Used for headers, links, primary actions
- **Primary Blue Hover**: `#1565c0` - Hover state for primary elements
- **Primary Blue Light**: `rgba(25, 118, 210, 0.2)` - For backgrounds and borders

### Neutral Colors
- **Background**: `#f5f5f5` - Main page background
- **Card Background**: `#fff` - Cards, dialogs, and elevated surfaces
- **Text Primary**: `#222` - Main text color
- **Text Secondary**: `#333` - Secondary text
- **Text Tertiary**: `#444` - Labels and less important text

### Border Colors
- **Border Light**: `#e0e0e0` - Card borders, subtle dividers
- **Border Medium**: `#ccc` - Input borders, stronger dividers
- **Border Primary**: `#1976d2` - Primary action borders

### Status Colors
- **Error**: `#d32f2f` - Error messages and delete actions
- **Success**: (to be defined)
- **Warning**: (to be defined)

---

## Spacing & Units

### Base Unit System
All spacing uses **rem units** for scalability and accessibility.
- 1rem = 16px (browser default)

### Spacing Scale
- **0.25rem** (4px) - Minimal spacing
- **0.35rem** (5.6px) - Tight spacing for grouped items
- **0.5rem** (8px) - Compact spacing
- **0.75rem** (12px) - Small spacing
- **1rem** (16px) - Base spacing
- **1.25rem** (20px) - Medium spacing
- **1.5rem** (24px) - Large spacing
- **2rem** (32px) - Extra large spacing

### Page Spacing (Horizontal)
- **Desktop**: `padding: 0 8vw` - Consistent left/right spacing
- **Mobile**: `padding: 0 4vw` - Reduced for smaller screens
- **Minimum Mobile**: `padding: 0 2vw` - For very tight layouts

### Page Spacing (Vertical)
- **Desktop**: `padding-top: 2rem; padding-bottom: 2rem`
- **Mobile**: `padding-top: 1rem; padding-bottom: 1rem`

### Border Radius
- **Small**: `0.25rem` (4px) - Inputs, small elements
- **Medium**: `0.375rem` (6px) - Buttons
- **Large**: `0.5rem` (8px) - Cards, dialogs

---

## Typography

### Font Family
```scss
font-family: 'Roboto', Arial, sans-serif;
```

### Font Sizes
- **Hero**: `2.2rem` - Main dashboard title
- **H1**: `2rem` - Page titles
- **H2**: `1.3rem` - Section headings
- **H3**: `1.1rem` - Card titles, article titles
- **Body**: `1rem` - Default text size
- **Small**: `0.875rem` (14px) - Labels, secondary text
- **Tiny**: `0.8rem` (12.8px) - Error messages, hints

### Font Weights
- **Normal**: `400` - Body text
- **Medium**: `500` - Card titles
- **Semi-Bold**: `600` - Buttons, important text
- **Bold**: `700` - Headings, navigation brand

---

## Shadows

### Elevation System
```scss
/* Level 1 - Subtle elevation (cards at rest) */
box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.08);

/* Level 2 - Default elevation (cards) */
box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.12);

/* Level 3 - Hover elevation (cards hover) */
box-shadow: 0 0.1875rem 0.375rem rgba(0, 0, 0, 0.16);

/* Level 4 - Dropdown/Menu elevation */
box-shadow: 0 0.1875rem 0.75rem rgba(0, 0, 0, 0.12);

/* Level 5 - Navigation/Header elevation */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
```

---

## Layout

### Container Widths
- **Page Content**: No max-width, uses viewport width with padding
- **Dialog Width**: `min(92vw, 28rem)` for simple dialogs
- **Dialog Width (Large)**: `min(92vw, 36rem)` for complex dialogs
- **Auth Card**: `max-width: 420px`

### Flexbox Layout
All pages use a flex layout to occupy full height:
```scss
:host {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
}

.page-content {
  flex: 1;
  min-height: 0; // Important for overflow to work
  overflow-y: auto;
  overflow-x: hidden;
}
```

### Navigation Bar
- **Height**: `56px`
- **Horizontal Padding**: `0 8vw` (matches page content)
- **Background**: `#1976d2`
- **Position**: `sticky` with `top: 0`
- **Z-Index**: `20`

---

## Components

### Buttons

#### Primary Button
```scss
.btn--primary {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 0.9rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: #1565c0;
  }
}
```

#### Secondary Button (Outlined)
```scss
.btn--secondary {
  background: #fff;
  color: #1976d2;
  border: 0.0625rem solid #1976d2;
  border-radius: 0.375rem;
  padding: 0.35rem 0.65rem;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: rgba(25, 118, 210, 0.04);
  }
}
```

### Cards
```scss
.card {
  background: #fff;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.5rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.12);
  padding: 1rem 1.25rem;
  transition: box-shadow 0.2s, border-color 0.2s;
  
  &:hover {
    box-shadow: 0 0.1875rem 0.375rem rgba(0, 0, 0, 0.16);
    border-color: #1976d2;
  }
}
```

### Dialogs
```scss
dialog {
  position: relative;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.5rem;
  min-width: min(92vw, 28rem);
  padding: 1.5rem;
  max-height: 90vh;
  overflow-y: auto;
  
  /* Hide scrollbar when loading overlay is visible */
  &:has(.dialog-loader-overlay) {
    overflow: hidden;
  }
}

.dialog-loader-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 0.5rem;
  backdrop-filter: blur(1px);
}
```

### Input Fields
```scss
.field__input {
  padding: 0.6rem 0.75rem;
  border: 0.0625rem solid #ccc;
  border-radius: 0.25rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
  
  &--invalid {
    border-color: #d32f2f;
  }
}
```

### Mobile Menu (Hamburger)
```scss
.hamburger-menu {
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
}

.hamburger-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}
```

---

## Responsive Design

### Breakpoints
- **Mobile**: `max-width: 600px`
- **Tablet**: `max-width: 768px`
- **Desktop**: `> 768px`

### Mobile Adjustments
1. **Padding**: Reduce from `8vw` to `4vw` or `2vw`
2. **Font Sizes**: Consider reducing large headers
3. **Actions**: Convert action buttons to hamburger menu (3-dot menu)
4. **Navigation**: Show hamburger menu instead of inline actions
5. **Spacing**: Reduce gaps and margins by ~33-50%

### Responsive Pattern Example
```scss
.page-container {
  padding: 2rem 8vw;
  
  @media (max-width: 600px) {
    padding: 1rem 4vw;
  }
}

.section-gap {
  gap: 1rem;
  
  @media (max-width: 600px) {
    gap: 0.75rem;
  }
}
```

---

## Usage Guidelines

### Consistency Rules
1. **Always use the same horizontal padding** for navigation and page content
2. **Use CSS variables** where possible for easy theming
3. **Follow the spacing scale** - don't use arbitrary values
4. **Use the elevation system** for consistent shadows
5. **Test at all breakpoints** before considering work complete
6. **Never show scrollbars** when loading overlays are visible
7. **Use flex: 1** on main content areas to fill available space

### Example Complete Page Layout
```scss
:host {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.page-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f5f5f5;
  padding: 2rem 8vw;
  
  @media (max-width: 600px) {
    padding: 1rem 4vw;
  }
}
```
