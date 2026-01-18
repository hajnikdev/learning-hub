## Responsive and rem-based design

- All feature layouts use rem units for spacing, border-radius, and sizing.
- Use media queries for mobile (max-width: 600px) to adjust padding, margin, and font-size.
- Example:
  ```scss
  padding: 2rem 8vw;
  @media (max-width: 600px) {
    padding: 0.75rem 2vw;
  }
  ```
- Cards, sections, and lists reduce padding and gap on mobile for better fit.
- All new features should follow this responsive, rem-based system.
## Design Manual: Spacing and Units

- All spacing, border-radius, and layout values use rem units for scalability and accessibility.
- 1rem = 16px (browser default)
- Example conversions:
  - 4px = 0.25rem
  - 8px = 0.5rem
  - 12px = 0.75rem
  - 16px = 1rem
  - 20px = 1.25rem
  - 24px = 1.5rem
  - 32px = 2rem
- Use rem for:
  - Padding and margin
  - Border radius
  - Table cell spacing
  - Code/pre block padding
- This ensures consistent scaling across devices and user settings.

### Example

```scss
padding: 1.25rem 8vw; // instead of 20px 8vw
border-radius: 0.25rem; // instead of 4px
```

> All new styles should follow this rem-based spacing system.
