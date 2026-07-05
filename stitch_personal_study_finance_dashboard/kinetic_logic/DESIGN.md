---
name: Kinetic Logic
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#525657'
  on-tertiary: '#ffffff'
  tertiary-container: '#6b6e70'
  on-tertiary-container: '#eff1f3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  mono:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is centered on cognitive clarity and intentionality. It targets high-performance individuals who require a personal dashboard that minimizes visual noise while maximizing data density. The aesthetic is **Corporate Modern** with a lean toward **Minimalism**, prioritizing functional elegance over decorative flourish.

The emotional response should be one of "calm control." By utilizing generous white space, a systematic grid, and a restricted color palette, the UI transforms complex financial and temporal data into an approachable, actionable interface. It draws inspiration from the utility of Notion and the structured clarity of modern calendar applications.

## Colors

The palette is anchored by "Productive Blue," a high-clarity primary hue used for interactive elements and primary brand touchpoints. 

- **Primary:** Used for call-to-actions, active states, and focus indicators.
- **Surface Strategy:** The background utilizes a series of soft greys (`#F8FAFC` to `#F1F5F9`) to create subtle "zones" of information without the need for heavy borders.
- **Semantic Logic:** Financial tracking relies on high-chroma Success (Income) and Error (Outcome) tokens to ensure immediate glanceability.
- **Text Hierarchy:** Deep Slate (`#0F172A`) is used for primary content to ensure AAA contrast, while Muted Slate (`#64748B`) handles secondary metadata.

## Typography

This design system utilizes a dual-font approach to balance technical precision with readability. **Geist** is employed for headings and labels to provide a clean, slightly technical aesthetic suitable for data-heavy environments. **Inter** is used for all body copy to ensure maximum legibility during prolonged reading sessions.

- **Numerical Data:** For financial tables and calendar dates, use the `mono` or `label-md` roles to maintain tabular alignment.
- **Scale:** On mobile devices, large displays should scale down to `headline-lg-mobile` to prevent awkward line breaks in dashboard widgets.
- **Tracking:** Headlines use a slight negative letter-spacing to feel tighter and more modern, while labels use positive tracking for clarity at small sizes.

## Layout & Spacing

The design system uses a **8px linear scale** for all spacing and layout decisions. The primary layout model is a **Fluid Grid** with a maximum container width of 1440px to ensure the dashboard remains readable on ultra-wide monitors.

- **Desktop (1024px+):** 12-column grid, 24px gutters, 40px side margins.
- **Tablet (768px - 1023px):** 8-column grid, 16px gutters, 24px side margins.
- **Mobile (Up to 767px):** 4-column grid, 16px gutters, 16px side margins. Content reflows vertically; horizontal scrolling is permitted only for data tables.
- **Density:** Dashboard widgets should use `lg` (24px) internal padding to maintain the "airy" feel of the system.

## Elevation & Depth

To maintain a flat, organized look, this design system avoids heavy drop shadows. Instead, it utilizes **Tonal Layers** and **Low-contrast Outlines** to define hierarchy.

1.  **Level 0 (Background):** Surface color (`#F8FAFC`).
2.  **Level 1 (Cards/Widgets):** White background with a 1px solid border (`#E2E8F0`). No shadow.
3.  **Level 2 (Hover/Active):** White background with a very soft, diffused shadow: `0px 4px 12px rgba(15, 23, 42, 0.05)`.
4.  **Level 3 (Modals/Popovers):** White background with a more pronounced shadow: `0px 12px 32px rgba(15, 23, 42, 0.1)`.

Separation between distinct content sections should be achieved via subtle background color shifts rather than physical depth metaphors.

## Shapes

The shape language is "Soft-Modern." A consistent `0.5rem` (8px) corner radius is applied to cards, buttons, and input fields to strike a balance between professional rigor and approachability.

- **Small Components (Checkboxes, Tags):** Use `rounded-sm` (4px).
- **Standard Components (Buttons, Inputs, Cards):** Use `rounded-md` (8px).
- **Large Components (Modals, Feature Sections):** Use `rounded-xl` (24px).
- **Special Elements:** Avatars and search bars may use the "Pill" (full round) treatment to distinguish them from structural dashboard widgets.

## Components

### Buttons
- **Primary:** Solid "Productive Blue" background, white text. No gradient.
- **Secondary:** White background, 1px border (`#E2E8F0`), Slate text.
- **States:** Hover states should darken the background by 5-10%; Active states should utilize a subtle inner shadow or further darkening.

### Input Fields
- Backgrounds are white with a 1px border (`#E2E8F0`). On focus, the border changes to "Productive Blue" with a 2px soft outer glow in the same hue at 10% opacity.

### Cards & Widgets
- Standard dashboard widgets feature a `label-sm` header and a 1px bottom divider. Padding is strictly enforced at 24px (Large Spacing).

### Chips & Tags
- Used for categories or financial status. For income/outcome, use a light-tint background (Success at 10% opacity) with high-contrast text.

### Lists & Tables
- Remove all vertical grid lines. Use horizontal dividers (`#F1F5F9`) only. Table headers use `label-sm` in Muted Slate with a subtle background tint.

### Progress Indicators
- Use thin (4px-6px) bars with rounded ends. The "Productive Blue" should represent "work in progress," while Success Green represents "completion."