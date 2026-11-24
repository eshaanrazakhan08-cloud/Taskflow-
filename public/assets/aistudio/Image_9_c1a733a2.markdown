---
name: TaskFlow Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#494bd6'
  on-tertiary: '#ffffff'
  tertiary-container: '#9699ff'
  on-tertiary-container: '#1d17b2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  code-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style
The design system embodies calm precision, intentional focus, and frictionless momentum. Built for makers, knowledge workers, and high-output teams, it strips away cognitive clutter to prioritize clarity and task execution. The emotional response is one of composed mastery—relieving the anxiety of sprawling backlogs with surgical hierarchy, crisp feedback, and instant keyboard-driven ergonomics.

Drawing from the functional discipline of high-craft developer tooling and minimalist workspace software, the visual aesthetic pairs razor-sharp structural boundaries with luminous micro-accents. Interfaces feel tactile yet weightless: neutral, quiet canvas layers recede into the periphery, allowing high-priority statuses and emerald progress signals to command immediate, decisive attention.

## Colors
The palette leverages a high-contrast functional color architecture:
- **Primary Emerald (`#10B981`):** Represents resolution, active progress, success states, and positive momentum. Used purposefully for active toggles, completed milestones, key action anchors, and selection rings.
- **Secondary Slate (`#0F172A`):** The grounding dark tone for primary headers, high-emphasis text, and contrast badges in light mode, as well as the deep void tone in dark mode.
- **Tertiary Indigo (`#6366F1`):** A discreet auxiliary tone deployed selectively for contextual links, calendar synchronizations, and intelligence/automation tags.
- **Neutral Slate Scale (`#64748B` mid-slate base):**
  - Light mode surfaces build from canvas ground `#F9FAFB` through container `#F3F4F6` up to active elevated card layers at `#FFFFFF`. Border delineations rely on razor-thin `#E5E7EB`.
  - Dark mode transitions smoothly to an obsidian spectrum: background `#090D16`, surface container `#111827`, elevated card `#1E293B`, and subtle border boundaries at `#334155`.
- **Semantic Priority Accents:**
  - High Priority: Crimson Rose (`#F43F5E`)
  - Medium Priority: Amber Gold (`#F59E0B`)
  - Low Priority: Slate Ice (`#94A3B8`)
- **Category Pill Palette:**
  - Work: Indigo (`#6366F1`)
  - Personal: Violet (`#8B5CF6`)
  - College: Sky (`#0EA5E9`)
  - Projects: Amber (`#F59E0B`)
  - Health: Teal (`#14B8A6`)
  - Other: Cool Zinc (`#71717A`)

## Typography
Typography is strictly utilitarian and set entirely in Inter. Type scales favor compact, high-density layouts optimized for quick parsing and rapid task triage. 

- Use negative tracking (`-0.01em` to `-0.03em`) on all headings from 18px upwards to eliminate typographic sprawl and project an editorial, software-grade sharpness.
- Regular weights (`400`) are reserved for task titles, notes, and body reading matter.
- Medium (`500`) and Semi-Bold (`600`) weights anchor system metadata, shortcuts, navigation tiers, priority flags, and micro-labels.
- All uppercase micro-labels (`label-sm`) require tracking widened to `+0.03em` for clean legibility at small sizes.

## Layout & Spacing
The layout model employs a fluid column structure contained within max-width productivity viewports:
- **Canvas Shell:** Fluid sidebar navigation docked to a dynamic main workspace container capped at `1280px` on ultra-wide screens to prevent scanning fatigue.
- **Desktop (1024px+):** Collapsible vertical utility sidebar (240px default, 64px icon rail), alongside multi-panel task lists and detail panes. Default gutter is `1rem`, outer margin is `2rem`.
- **Tablet (768px - 1023px):** Two-pane layout with sliding flyout details. Margin pulls in to `1.5rem`.
- **Mobile (<768px):** Single-column stacked task view with sticky top triage filters and bottom-anchored action triggers. Gutter narrows to `0.75rem` (`gutter-mobile`) and canvas margin adapts to `1rem` (`margin-mobile`).
- **Rhythm:** Spacing follows an obsessive 4px baseline sub-grid (`0.25rem`). Vertical spacing between task line items is pinned strictly to `space-xs` and `space-sm` for dense information scanning, while workspace panels breathe through `space-lg` and `space-xl`.

## Elevation & Depth
Depth is produced via subtle tonal layering and hairline boundaries rather than heavy drop shadows:
- **Ground Tier (Canvas):** Flat base surface (`#F9FAFB` light, `#090D16` dark). No shadow.
- **Mid Tier (Panels & Cards):** Surface container (`#FFFFFF` light, `#111827` dark) framed by a 1px border (`#E5E7EB` light, `#1E293B` dark) paired with an ultra-faint ambient diffusion: `0 1px 2px 0 rgba(0, 0, 0, 0.04)`.
- **High Tier (Dropdowns, Command Palette, Modals):** Elevated container (`#FFFFFF` light, `#1E293B` dark) with a crisp 1px perimeter border and dual-layer directional shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.08)`.
- **Hover Micro-Lifts:** Cards and list rows do not shift vertical physical position; instead, interaction is communicated instantaneously through a border tint shift to `#D1D5DB` (light) or `#334155` (dark) alongside a subtle surface illumination.

## Shapes
The shape language implements a calibrated, modern rounded geometry:
- Default elements (input fields, task rows, buttons, dropdown menus) adhere to `rounded` (0.5rem / 8px).
- Larger container panels, modals, and board columns scale to `rounded-lg` (1rem / 16px).
- Inline category tags, status pills, and user avatars break into full-radius stadium silhouettes (`9999px`) to visually distinguish them from structural layouts and inputs.

## Components

### Buttons
- **Primary:** Emerald background (`#10B981`), pure white text, 8px radius, height 36px (compact) or 40px (standard). On hover, darkens to `#059669` with an inner subtle ring highlight.
- **Secondary:** Surface background with 1px border (`#E5E7EB`), text `#0F172A`. On hover, subtle background shift to `#F3F4F6`.
- **Ghost / Icon:** Transparent background, slate text (`#64748B`), hovering reveals a soft fill (`#F3F4F6` light, `#1E293B` dark). Keyboard shortcuts (e.g., `⌘K`) appear as monospaced badges aligned to the right edge.

### Chips & Category Pills
- Pill-shaped (`rounded-full`), padding `2px 8px`, typography `label-sm`.
- Styled as semi-transparent tonal fills with matching high-contrast text:
  - *Personal:* `#8B5CF6`/10 background, `#7C3AED` text.
  - *College:* `#0EA5E9`/10 background, `#0284C7` text.
  - *Work:* `#6366F1`/10 background, `#4F46E5` text.
  - *Projects:* `#F59E0B`/10 background, `#D97706` text.
  - *Health:* `#14B8A6`/10 background, `#0D9488` text.
  - *Other:* `#64748B`/10 background, `#475569` text.

### Task Lists & Row Items
- Compact horizontal rows separated by hairline border dividers (`#F3F4F6`).
- Interactive hover shows a soft surface wash (`#F8FAFC`).
- Right-aligned metadata cluster: priority icon, due date tag, category pill, and assignees.
- Left-aligned drag-handle reveals only on pointer hover.

### Checkboxes & Completion Triggers
- 18px geometric circles with an unselected 1.5px border (`#D1D5DB`).
- Hovering reveals a translucent emerald tint inside the ring.
- Checking triggers a brief spring scale transform, snaps to solid `#10B981`, and presents a crisp white micro-checkmark while task title transitions to strikethrough with a subdued neutral tone (`#94A3B8`).

### Priority Indicators
- Compact flags or dot clusters:
  - **High:** Crimson Rose (`#F43F5E`) flag icon with an optional subtle background pill for critical timelines.
  - **Medium:** Amber (`#F59E0B`) icon or double-bar graphic.
  - **Low:** Slate (`#94A3B8`) icon or single-bar graphic.

### Input Fields
- Height 38px, font size 14px, 8px border radius.
- Background `#FFFFFF` (light) or `#0F172A` (dark) encased in a 1px border (`#E5E7EB`).
- Focus state activates an immediate Emerald border (`#10B981`) combined with a 2px emerald outer aura ring (`rgba(16, 185, 129, 0.15)`).

### Command Palette & Quick Add
- Centered modal anchored at top 15% of viewport with a blurred backdrop scrim.
- Clean search input with prominent green search cursor, keyboard hotkey guides, and instantaneous filter feedback across tags, priorities, and dates.