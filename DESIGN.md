---
name: Clearwell
description: High-clarity water refilling and delivery logistics design system
colors:
  primary: "oklch(0.48 0.16 248)"
  primary-foreground: "oklch(0.99 0 0)"
  secondary: "oklch(0.95 0.02 230)"
  secondary-foreground: "oklch(0.25 0.05 240)"
  background: "oklch(0.985 0.003 240)"
  foreground: "oklch(0.18 0.02 245)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.18 0.02 245)"
  muted: "oklch(0.955 0.005 240)"
  muted-foreground: "oklch(0.48 0.02 240)"
  accent: "oklch(0.95 0.015 240)"
  accent-foreground: "oklch(0.18 0.02 245)"
  destructive: "oklch(0.58 0.2 25)"
  border: "oklch(0.90 0.008 240)"
  input: "oklch(0.90 0.008 240)"
  ring: "oklch(0.48 0.16 248)"
typography:
  display:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  caption:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  micro:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  button-sm:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "7px"
  md: "8.5px"
  lg: "10px"
  xl: "13px"
  2xl: "16px"
  3xl: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  input-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
---

# Design System: Clearwell

## Overview

**Creative North Star: "The Pure Utility"**

Clearwell's design system is an instrument-grade, high-clarity interface crafted for rapid physical dispatch, container tracking, and clean water delivery operations. It rejects ornamental bloat in favor of tactile confidence, crisp typographic contrast, and reliable readability under demanding field and warehouse conditions.

The interface prioritizes glanceability: station operators tracking stock counts across multiple tanks and racks, dispatchers matching orders to delivery windows, and riders verifying container swaps on mobile screens in direct sunlight. High surface contrast, structured border-first boundaries, and snappy micro-interactions convey precision and dependability.

**Key Characteristics:**
- Utilitarian precision with high information density and zero visual clutter.
- Tactile feedback (`active:scale-[0.985]`) on interactive controls for tangible responsiveness.
- Tonal layering with border-first structure and discrete micro-shadows.
- Monospace typographic accents for financial amounts, serials, and container tallies.

## Colors

The palette balances clean mineral whites with authoritative deep ocean cobalt and soft glacial washes, evoking pure filtered drinking water and technical discipline.

### Primary
- **Deep Ocean Cobalt** (`oklch(0.48 0.16 248)`): The primary brand anchor. Used deliberately for key action buttons, active navigation markers, selection rings, and critical status highlights.

### Secondary
- **Glacial Slate** (`oklch(0.95 0.02 230)`): Soft cyan-slate wash used for secondary buttons, subtle badge backgrounds, and contextual grouping containers.

### Neutral
- **Crisp Canvas** (`oklch(0.985 0.003 240)`): Base canvas background providing a clean, glare-free working surface.
- **Pure Card White** (`oklch(1 0 0)`): Surface fill for data cards, modal sheets, and tabular panels.
- **Deep Slate Text** (`oklch(0.18 0.02 245)`): High-contrast primary text ensuring AAA legibility.
- **Muted Steel** (`oklch(0.48 0.02 240)`): Secondary text for timestamps, labels, and helper descriptions.
- **Border Slate** (`oklch(0.90 0.008 240)`): 1px structural hairline border for crisp component boundaries.

### Named Rules
**The Rarity of Deep Ocean Rule.** Deep Ocean Cobalt is reserved strictly for primary calls-to-action, confirmed statuses, and active focus rings. It covers less than 10% of any view, preserving its visual authority.

## Typography

**Display Font:** Plus Jakarta Sans (with system sans-serif fallback)  
**Body Font:** Plus Jakarta Sans (with system sans-serif fallback)  
**Label/Mono Font:** JetBrains Mono (with monospace fallback)  

**Character:** Technical, geometric warmth with calibrated legibility features (`cv02`, `cv03`, `cv04`, `cv11`) paired with robust tabular monospace precision.

### Hierarchy
- **Display** (Bold 700, `clamp(2rem, 5vw, 3.5rem)`, line-height 1.1): Hero headlines, landing value propositions, and primary operational totals.
- **Headline** (Semi-bold 600, `1.75rem`, line-height 1.25): Dashboard section titles and major card headings.
- **Title** (Semi-bold 600, `1.125rem`, line-height 1.4): Table headers, dialog headers, and metric card titles.
- **Body** (Regular 400 / Medium 500, `0.875rem`, line-height 1.5): Standard data rows, form labels, customer addresses, and order descriptions. Max line length 65–75ch.
- **Label** (Medium 500, `0.75rem` / 12px, letter-spacing 0.02em): Standard badges, order IDs, currency figures (`$3.00`), delivery slots (`7 – 10 AM`), and container counts.
- **Caption** (Medium 500, `11px`, letter-spacing 0.02em): Compact table timestamps, secondary card metadata, and form microcopy.
- **Micro** (Medium 500, `10px`, letter-spacing 0.03em): High-density status chips, sub-badge counters, and auxiliary metadata.

### Named Rules
**The Monospace Count Doctrine.** All inventory counts, container tallies, time slots, and financial totals must be rendered in JetBrains Mono or tabular numbers (`tnum`) for instantaneous vertical scanning.

## Layout

- **Grid & Spacing:** 8-point baseline rhythm with compact 4px micro-steps (`xs: 4px`, `sm: 8px`, `md: 16px`, `lg: 24px`, `xl: 32px`).
- **Container Strategy:** Max width `max-w-7xl` for administrative dashboards and `max-w-5xl` for customer/rider operational screens.
- **Density:** Compact yet touch-accessible: desktop rows maintain 36–40px heights with generous horizontal padding; mobile targets maintain minimum 44x44px hitboxes.

## Elevation & Depth

Surfaces are flat-at-rest. Clearwell avoids heavy ambient dropshadows, relying on crisp 1px structural borders (`border-border/80`) and tonal background shifts for visual hierarchy.

### Shadow Vocabulary
- **Micro Rest** (`shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`): Applied to cards and interactive buttons at rest to separate them gently from canvas.
- **Micro Hover** (`shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`): Elevation rise on hovered cards, active rows, and dropdown triggers.
- **Overlay Lift** (`shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)`): Reserved strictly for floating modal sheets, popovers, and notifications.

### Named Rules
**The Flat-At-Rest Doctrine.** Surfaces never float unprompted. Depth is conveyed by borders at rest, and shadows appear strictly as interactive state responses (hover, active, modal focus).

## Shapes

- **Corner Strategy:** Smooth, consistent rounded corners governed by `--radius: 0.625rem` (10px).
- **Controls & Buttons:** `rounded-lg` (10px) on standard controls; `rounded-md` (8.5px) on compact badges and chips.
- **Containers & Panels:** `rounded-xl` (13px) for data cards, map wrappers, and dialog modals.
- **Borders:** Consistent 1px crisp borders (`border-border/80`) defining every interactive boundary.

## Components

### Buttons
- **Shape:** `rounded-lg` (10px), height `h-8` (32px default) or `h-9` (36px lg).
- **Primary:** Deep Ocean Cobalt background, white text, subtle `shadow-xs`. Hover: `bg-primary/90`. Active: `active:scale-[0.985]`.
- **Secondary:** Glacial Slate background, deep slate text. Hover: `bg-secondary/80`.
- **Outline:** Crisp border (`border-border/80`), canvas background, hover to `bg-muted`.

### Cards & Panels (`.tactile-card`)
- **Corner Style:** `rounded-xl` (13px).
- **Background:** White (`--card`) on canvas (`--background`).
- **Border:** `1px solid oklch(0.90 0.008 240)`.
- **Hover:** Border darkens subtly to `oklch(0.85 0.01 240)` with `shadow-sm` transition.

### Inputs & Selects
- **Height & Radius:** `h-9` (36px), `rounded-lg` (10px).
- **Stroke & Fill:** `border-border/80` with canvas background.
- **Focus:** Sharp ring highlight (`focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring`).

### Badges & Status Chips
- **Container Swaps:** Specific semantic status chips:
  - *Swapped / Returned*: Green wash (`oklch(0.95 0.05 150)` background, emerald text).
  - *Pending Collection*: Amber wash (`oklch(0.95 0.06 75)` background, amber text).
  - *Missing Deposit*: Red wash (`oklch(0.95 0.05 25)` background, destructive text).

## Do's and Don'ts

### Do:
- **Do** format all currency, container totals, order codes, and delivery slots in JetBrains Mono.
- **Do** incorporate the `tactile-btn` micro-interaction (`active:scale-[0.985]`) on all clickable triggers.
- **Do** maintain high visual contrast on all rider delivery and map interfaces for outdoor daylight legibility.
- **Do** keep cards and panels structured with crisp 1px borders rather than heavy ambient blur shadows.

### Don't:
- **Don't** use flashy neon gradients, AI/crypto purple glows, or heavy decorative glassmorphism.
- **Don't** use low-contrast muted pastels for critical operational statuses (e.g. uncollected container deposits).
- **Don't** create unstructured floating elements without clear boundary borders.
