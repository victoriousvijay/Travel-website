# Design System - Flight Desk International

This document defines the visual layout, theme, color hierarchy, typography, and visual assets of Flight Desk International.

## Color System
We use a clean, modern high-contrast color scheme that builds trust and highlights core conversion points.
- **Midnight Slate**: `#0B192C` (Primary background, deep cards, headers)
- **Rich Sapphire**: `#1E3E62` (Structural content backgrounds, alternate blocks)
- **Air Blue**: `#008DDA` (Primary brand accent, links, highlighted chips, lines)
- **Sky Ice Accent**: `#41C9E2` (Secondary indicators, highlights, borders)
- **Saffron Glow**: `#FF6500` (High-visibility CTAs, Primary Conversion points)
- **Warm Sand**: `#F1F6F9` (Light neutral backgrounds, body container backdrops)
- **White**: `#FFFFFF` (Card surfaces, clean backdrops)
- **Success Green**: `#10B981` (Verified badges, deal alerts, live status)

## Typography
- **Headings (Display)**: `Space Grotesk` (Google Font) or fallback `Plus Jakarta Sans`. Clean, professional, travel-forward structure.
- **Body & Controls**: `Inter` (UI standard) for optimal legibility, readability, and contrast on dense tables and forms.
- **System Metrics & Airport Codes**: `JetBrains Mono` for code listings, currency metrics, flight routes, and timings.

## Elevation & Spacing
- Cards are styled with `border border-slate-100 rounded-2xl bg-white shadow-sm`.
- Sections feature rhythmic, non-robotic vertical padding (e.g. `py-12 sm:py-20`).

## Interactive Cursor
- Small inner pointer dot (`w-1.5 h-1.5 bg-brand`) accompanied by a soft spring outer ring (`w-8 h-8 border border-brand/50`).
- Disables smoothly on touchscreens (`pointer: coarse`) and reduced-motion environments.
