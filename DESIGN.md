---
version: "alpha"
name: "Santhosh Portfolio Crimson Noir"
description: "Ultra-premium editorial 3D portfolio design system with high-contrast obsidian neutrals and radiant crimson accent."
colors:
  primary: "#D80027"
  secondary: "#A1A1AA"
  tertiary: "#18181B"
  neutral: "#09090B"
  surface: "#121216"
  surface-elevated: "#18181F"
  border: "#27272A"
  text-primary: "#FAFAFA"
  text-muted: "#9E9EA7"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  h1:
    fontFamily: "Outfit, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "Outfit, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "Geist Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  container:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.text-primary}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-secondary:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  badge:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  caption:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.text-muted}"
  divider:
    backgroundColor: "{colors.border}"
    height: "1px"
---

# Design System: Santhosh S — 3D Digital Marketing Portfolio

## 1. Visual Theme & Atmosphere
A dark, cinematic editorial portfolio combining high-density performance marketing data with dramatic 3D lighting. 
The atmosphere is disciplined, assertive, and meticulously crafted — drawing from high-end fashion and design agencies while delivering conversion-focused credibility.

- **Density:** 6/10 (Balanced editorial spacing with high-density data metric chips)
- **Variance:** 7/10 (Offset asymmetric splits, cutout hero portrait overlapping deep crimson display type)
- **Motion:** 8/10 (Cinematic spring physics, interactive 3D elements, magnetic cursor hover states)

## 2. Color Palette & Roles
- **Obsidian Carbon** (`#09090B`) — Primary dark canvas surface.
- **Deep Slate Surface** (`#121216`) — Card and modular container background.
- **Elevated Charcoal** (`#18181F`) — Interactive hover states and floating modals.
- **Crimson Fire** (`#D80027`) — Primary dynamic accent for CTAs, active indicators, and hero glow.
- **Pure Titanium** (`#FAFAFA`) — Primary display text and headline ink.
- **Cool Zinc** (`#A1A1AA`) — Body text and secondary descriptors.
- **Muted Steel** (`#9E9EA7`) — Timestamps, metadata labels, and subtle outlines (WCAG AA Compliant).
- **Structural Border** (`#27272A`) — 1px crisp structural borders with 0.6 opacity.

## 3. Typography Architecture
- **Display & Titles:** `Outfit` (Bold, Condensed, track-tight `-0.03em`)
- **Body & Editorial:** `Geist` (Balanced legibility, max 65ch per line)
- **Metrics & Technical:** `Geist Mono` (Monospaced alignment for numbers, ROAS stats, and dates)

## 4. Component Stylings
- **Buttons:** Pill-shaped (`rounded-full`), tactile scale push feedback on press (`scale-95`). Glowing accent underline on hover.
- **Cards:** Subtle 1px zinc borders with deep surface fill. 3D perspective tilt on cursor hover with dynamic specular lighting.
- **Interactive Badges:** Capsule chips with glowing status dot (`Available for Projects`).
- **3D Canvas:** Lightweight WebGL scene rendering interactive geometric marketing badges and smooth depth field.

## 5. Layout Principles
- Split-screen asymmetric hero with giant typographic backdrop behind layered subject cutout.
- Horizontal infinite-scroll marquee for 20 client brand logos.
- Vertical 5-stage interactive workflow timeline (01 Discover → 02 Ideate → 03 Create → 04 Optimize → 05 Scale).
- Grid-first architecture with strict single-column collapse on viewports `< 768px`.

## 6. Motion Philosophy
- Spring physics default: `stiffness: 120, damping: 18` for weighty, organic interaction.
- Smooth locomotive scroll or Lenis smooth-scroll feel with staggered section entrance reveals.
- Real-time CSS theme injection for instant zero-code personalization.

## 7. Anti-Patterns (Banned)
- No emojis anywhere in the interface.
- No `Inter` or generic serif fonts.
- No pure black (`#000000`).
- No generic AI blue/purple neon glows.
- No fabricated metrics without editable admin controls.
- No rigid 3-equal-column generic card rows.

