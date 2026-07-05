---
name: Interlink Digital
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#31353c'
  on-surface: '#e0e2eb'
  on-surface-variant: '#c1c6d5'
  inverse-surface: '#e0e2eb'
  inverse-on-surface: '#2d3037'
  outline: '#8b919f'
  outline-variant: '#414753'
  surface-tint: '#aac7ff'
  primary: '#aac7ff'
  on-primary: '#002f64'
  primary-container: '#1275e2'
  on-primary-container: '#000512'
  inverse-primary: '#005db8'
  secondary: '#aec7f7'
  on-secondary: '#143057'
  secondary-container: '#2d476f'
  on-secondary-container: '#9db6e4'
  tertiary: '#ffb68c'
  on-tertiary: '#532200'
  tertiary-container: '#c05900'
  on-tertiary-container: '#0d0300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458d'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#aec7f7'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#2d476f'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#763400'
  background: '#10131a'
  on-background: '#e0e2eb'
  surface-variant: '#31353c'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
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
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
---

# Design System: Interlink Digital

## Brand & Style
Interlink Digital is a technical, high-performance brand focused on reliability and precision. The visual style is Corporate Modern, emphasizing clarity, professional trust, and a refined dark-mode experience. It utilizes a balanced layout with Inter's neutral, geometric forms to convey a sense of engineering excellence and digital-native sophistication.

## Colors
The system operates primarily in a dark mode environment. The primary color is a technical blue (#1275e2) used for high-emphasis actions. Secondary accents are provided by a muted blue-grey (#5f78a3), and a tertiary burnt orange (#c55b00) is used for specialized alerts or highlights. Neutral tones (#74777f) provide the structural foundation for surfaces and text.

## Typography
The system uses the Inter font family for all text levels to ensure maximum legibility across digital interfaces.
- **Headlines:** Set in Inter with bold weights (up to 32px) for clear hierarchy.
- **Body:** Inter regular (14px-16px) for optimal reading comfort.
- **Labels:** Inter medium (12px) with increased letter spacing for utility and functional clarity.

## Layout & Spacing
A fluid grid system is used with an 8px base spacing unit.
- **Gutter:** 16px.
- **Margins:** 16px on mobile, scaling to 24px on desktop.
The rhythm is intentional, using even increments of the 8px base to ensure alignment and visual stability across all screen sizes.

## Elevation & Depth
Depth is created through tonal layers. As elements move "closer" to the user, the surface color becomes slightly lighter. Low-opacity shadows are used only on floating elements like modals or menus to maintain a clean, modern aesthetic.

## Shapes
The design adopts a "Rounded" geometry (level 2). 
- **Standard Radius:** 0.5rem (8px) for buttons and inputs.
- **Large Radius:** 1rem (16px) for cards and sections.
- **Extra Large Radius:** 1.5rem (24px) for major containers.

## Components
- **Buttons:** High-contrast primary blue buttons with 8px rounded corners.
- **Input Fields:** Semi-transparent neutral backgrounds with subtle borders and rounded corners.
- **Cards:** Elevated tonal surfaces with 16px rounding to group related content.
- **Chips:** Pill-shaped (rounded-full) indicators for tags and status updates.
- **Lists:** Structured with minimal dividers and consistent 16px internal padding.