---
name: Commerce Ops Console
description: Internal operations dashboard for reviewing and managing community deals.
colors:
  background: "#e8ebf0"
  backgroundSoft: "#f3f5f8"
  surface: "#ffffff"
  surfaceMuted: "#d5dbe4"
  sidebar: "#d8dde5"
  ink: "#12151c"
  mutedInk: "#4d5563"
  border: "#c9d0db"
  primary: "#181c23"
  primarySoft: "rgba(7, 9, 13, 0.08)"
  success: "#087052"
  successSoft: "rgba(21, 143, 104, 0.12)"
  warning: "#8a4f00"
  warningSoft: "rgba(184, 108, 0, 0.12)"
  danger: "#b4232a"
  dangerSoft: "rgba(214, 64, 69, 0.12)"
  info: "#1d4ed8"
  infoSoft: "#eff6ff"
  revenue: "#6d28d9"
  revenueSoft: "#f5f3ff"
typography:
  display:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "0.75rem"
  md: "1rem"
  pill: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "11px 20px"
  button-primary-hover:
    backgroundColor: "#07090d"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.mutedInk}"
    rounded: "{rounded.sm}"
    padding: "11px 20px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
  nav-item:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "20px"
  status-badge:
    backgroundColor: "{colors.successSoft}"
    textColor: "{colors.success}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: Commerce Ops Console

## Overview

**Creative North Star: "The Review Desk"**

This system is a working desk for internal operators, not a showcase. The mood is calm, precise, and operator-first: a cool gray canvas, white working surfaces, and a quiet neutral shell that keeps navigation anchored without stealing attention from the task.

The visual language should read as dependable at a glance. Hierarchy does the heavy lifting, not ornament. Primary controls are near-black; chroma is reserved for workflow state and feedback: green for success, amber for pending work, and red for rejection and error. That keeps the screen legible in motion and makes status obvious without noise.

This system explicitly rejects the product anti-references in `PRODUCT.md`: marketing-style SaaS dashboards with ornamental hero sections and empty polish; playful or whimsical commerce UI that undercuts operational seriousness; over-decorated controls, novelty navigation, or custom affordances for standard tasks; glassy, noisy, or gradient-heavy treatment that competes with the work; and inconsistent component patterns across list, detail, and form screens.

**Key Characteristics:**
- Calm by default, decisive on state change.
- One sans family across headings, labels, and body text.
- Light neutral canvas surfaces with a low-contrast control shell.
- Semantic color accents, not decorative color.
- Familiar task UI with consistent controls across screens.

## Colors

The palette is restrained and functional: cool-gray working surfaces, a neutral navigation shell, and a small semantic accent set for review state. The `.dark` token block in `src/app/globals.css` is the source of truth for the corresponding dark palette.

### Primary
- **Operator Ink** (`#181c23`): primary actions, selected indicators, and focus accents that need to feel confident rather than loud.

### Secondary
- **Queue Amber** (`#8a4f00`): pending review, attention-needed chips, and compact highlights that should read as caution without becoming alarm.

### Tertiary
- **Reject Red** (`#b4232a`): reject state, validation errors, and negative feedback moments.

### Neutral
- **Cool Canvas** (`#e8ebf0`): the main page background.
- **Soft Canvas** (`#f3f5f8`): supporting neutral used in the base CSS token layer.
- **Pure Surface** (`#ffffff`): cards, panels, tables, and forms.
- **Frost Surface** (`#d5dbe4`): secondary table/header surfaces and low-emphasis fills.
- **Neutral Shell** (`#d8dde5`): sidebar navigation surface.
- **Slate Ink** (`#12151c`): primary text and the strongest labels.
- **Muted Slate** (`#4d5563`): supporting copy, helper text, and metadata.
- **Hairline Slate** (`#c9d0db`): borders, separators, and control strokes.

### Named Rules
**The Shell Rule.** The sidebar remains a distinct neutral surface in light mode and a near-black surface in dark mode.

**The State Rule.** Accent colors belong to actual states. If there is no state, there is no chroma.

## Typography

**Display Font:** Geist, Arial, Helvetica, sans-serif  
**Body Font:** Geist, Arial, Helvetica, sans-serif

**Character:** One family carries the whole app. The result should feel familiar, efficient, and low-friction rather than editorial or decorative. Labels are compact and disciplined; headings are bold but not theatrical.

### Hierarchy
- **Display** (700, 2.25rem, 1.1): used for page titles and the top of the decision stack.
- **Headline** (700, 1.5rem, 1.2): section titles, card headings, and major panel labels.
- **Title** (600, 1rem, 1.3): field labels, table cells that need weight, and compact UI headings.
- **Body** (400, 0.875rem, 1.5): default reading size for descriptions, helper text, and form content. Keep prose in the 65–75ch range.
- **Label** (600, 0.75rem, 0.08em): metadata, workspace labels, and compact navigational signposts.

### Named Rules
**The One Family Rule.** Geist does all the work. Do not introduce a second font family for drama.

**The Quiet Label Rule.** Uppercase tracked labels are allowed only when they help scanability, not as a repeated section eyebrow.

## Elevation

This system uses tonal layering first and light shadow second. Surfaces are mostly flat at rest, with 1px borders and subtle hover lift. Depth is never theatrical; it exists to clarify hierarchy, separate surfaces, and support state.

### Shadow Vocabulary
- **Base lift** (`0 1px 2px rgba(15,23,42,0.03)`): default card, table, and panel depth.
- **Hover lift** (`0 12px 28px rgba(15,23,42,0.07)`): interactive cards and summary surfaces that should feel responsive.
- **Accent glow** (`0 8px 24px rgba(52,211,153,0.18)`): the logo mark and other small evergreen accents.

### Named Rules
**The Low-Blur Rule.** Shadows support the layout, not the brand mood. If the shadow is what you notice first, it is too strong.

**The Border-First Rule.** Borders define the shape; shadows only confirm the surface.

## Components

The component vocabulary is consistent across dashboard, list, detail, and forms. Card shape stays between 12px and 16px, inputs and buttons stay at 12px, and pills are reserved for badges and status chips.

### Buttons
- Primary buttons are filled near-black controls with light text and a 12px radius.
- Secondary buttons stay white with a slate border and subdued text.
- Hover states darken the fill or lift the surface slightly; focus states use a visible emerald outline or ring.

### Inputs and Selects
- Fields are white, 12px radius, 1px slate borders, and compact vertical padding.
- Focus uses the primary ink border and a soft neutral ring, not a custom glow effect.
- Error states switch the border and helper text to rose.

### Cards and Panels
- Standard cards use white surfaces, subtle borders, and a low base shadow.
- Dark surfaces are reserved for the dark theme; light-theme panels use the documented gray token scale.
- Padding is generous enough for scanning, but never so large that the page starts to feel promotional.

### Navigation
- Primary navigation is a vertical shell on desktop and an overflowable row on smaller widths.
- Active nav items use a filled state instead of a left stripe or decorative marker.
- Iconography is simple, geometric, and mostly monochrome.

### Tables
- Tables are dense but readable: sticky headers are not necessary here, but row separators, truncated titles, monospaced IDs, and tabular numerals make scanning easier.
- Hover feedback is a faint neutral tint, not a dramatic row takeover.

### Status Badges
- Status chips are pill-shaped, low-height, and semantic.
- Pending uses amber, approved uses emerald, rejected uses rose, and draft stays neutral.
- The dot and label should read as one unit.

## Do's and Don'ts

### Do:
- **Do** keep the page on the cool-gray or white working surfaces defined in `src/app/globals.css`.
- **Do** use the same 12px button and input radius everywhere so the app feels like one system.
- **Do** use green, amber, and red only when they communicate a real state or state-adjacent context.
- **Do** keep body text dark and high-contrast; helper text may soften, but it must remain readable.
- **Do** use the same control vocabulary across the dashboard, deal list, detail page, and forms.

### Don't:
- **Don't** ship marketing-style SaaS dashboards with ornamental hero sections and empty polish.
- **Don't** make playful or whimsical commerce UI that undercuts operational seriousness.
- **Don't** add over-decorated controls, novelty navigation, or custom affordances for standard tasks.
- **Don't** lean on glassy, noisy, or gradient-heavy treatment that competes with the work.
- **Don't** let list, detail, and form screens drift into inconsistent component patterns.
- **Don't** turn utility labels into a repeated eyebrow system; use them sparingly and only when they improve scanability.
