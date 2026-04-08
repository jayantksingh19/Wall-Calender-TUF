# 📅 Wall Calendar — Interactive React Component

A polished, interactive wall calendar built with **Next.js** (App Router) and **React**. Submitted as a frontend engineering challenge.

---

## ✨ Features

### Core Requirements ✅

| Feature | Implementation |
|---|---|
| **Wall Calendar Aesthetic** | Spiral binding (animated on hover), full-bleed hero photo per month, clean 7×6 date grid |
| **Date Range Selector** | Click start → click end. Live hover preview while selecting. Visual states for start, end, in-between. Clear button. |
| **Integrated Notes** | Attach a note to any date range. Saved notes list with click-to-reload and per-note delete. Persisted via `localStorage`. |
| **Fully Responsive** | Desktop: side-by-side grid + notes panel. Tablet ≤820px: narrower sidebar. Mobile ≤600px: fully stacked, touch-friendly. |

### Bonus / Standout Features 🌟

| Feature | Details |
|---|---|
| 🌙 **Dark mode** | Full dark theme toggle in the top bar. Every component adapts — card, sidebar, inputs, stats, legend. |
| 📊 **Range Stats bar** | When a range is selected, a pill shows total days, weeks, and any holidays within the range. |
| 🎬 **Page-flip animation** | 3D perspective `rotateY` flip when navigating months (left or right). |
| 📱 **Touch swipe** | Swipe left/right on mobile to change month (≥50 px threshold). |
| 🎉 **Holiday markers** | Dot on public holidays + fixed-position tooltip on hover. Holidays within range appear in stats pill. |
| 💾 **localStorage persistence** | Notes survive page refreshes and tab closes. |
| 📊 **Month progress bar** | Subtle bar on hero image showing % of month elapsed (animated on load). |
| 🎨 **Per-month theming** | Each month has a unique accent colour applied across grid, notes, stats, and focus rings. |
| ✨ **Today indicator** | Pulsing accent-coloured ring on the current date, every month. |
| ♿ **Accessibility** | `role`, `tabIndex`, `aria-label` on all interactive elements. Keyboard navigable (Enter to select). |
| 🖱️ **Micro-interactions** | Day cell scale on hover/active, nav button scale, save button lift, saved note slide, spiral coil hover. |

---

## 🗂 Project Structure

```
wall-calendar/
├── app/
│   ├── layout.js            # Root layout + page metadata
│   ├── page.js              # Renders <WallCalendar />
│   └── globals.css          # Minimal body reset only
│
└── components/
    │
    ├── WallCalendar.jsx     # Root — composition only. No business logic.
    │                          Owns: dark mode state, derived display strings, flip class.
    │
    ├── useCalendar.js       # Custom hook — ALL calendar state & event handlers.
    │                          month/year nav, date range selection, notes CRUD,
    │                          touch/swipe, holiday tooltip, flip animation state.
    │
    ├── CalendarStyles.jsx   # Single source of truth for ALL global CSS.
    │                          Breakpoints, animations, pseudo-selectors, dark mode.
    │
    ├── CalendarHeader.jsx   # Spiral binding + hero image + nav buttons + progress bar.
    │   ├── <SpiralBinding>    Renders 16 coils with hover animation.
    │   └── <NavButton>        Prev / next month buttons inside the hero.
    │
    ├── CalendarGrid.jsx     # Day-of-week headers + date grid + range bar + stats.
    │   ├── <DayHeaders>       Sun–Sat labels, weekend colour.
    │   ├── <DayCell>          Individual date circle with range highlight & holiday dot.
    │   ├── <RangeBar>         Status text + Clear button below the grid.
    │   └── <RangeStats>       Days / weeks / holidays pill (imported component).
    │
    ├── NotesSidebar.jsx     # Notes editor + saved notes list + legend.
    │   ├── <NotesEditor>      Textarea + Save button, disabled until range complete.
    │   ├── <SavedNotesList>   Scrollable list with click-to-load and delete.
    │   └── <Legend>           Dot legend for holiday / today / range.
    │
    ├── RangeStats.jsx       # Stats pill: days, weeks, holidays in selected range.
    ├── HolidayTooltip.jsx   # Fixed-position tooltip for holiday dots.
    ├── ThemeToggle.jsx      # Light / dark mode pill button.
    │
    ├── constants.js         # MONTHS, DAYS, MONTH_THEME, HERO_IMAGES, HOLIDAYS, LS_KEY
    └── utils.js             # toKey, fmt, fmtShort, getHoliday, buildCells,
                               getMonthProgress, loadNotes, persistNotes
```

### Architecture Decisions

**`useCalendar` custom hook** — All state and handlers extracted out of the JSX. `WallCalendar.jsx` becomes a pure layout/composition layer with zero `useState` calls of its own (except dark mode). Makes state logic independently testable without rendering anything.

**`CalendarStyles.jsx`** — A dedicated component for the global `<style>` block. All responsive breakpoints, CSS animations, pseudo-selector styles (`:hover`, `:focus`, `::placeholder`), and dark-mode overrides live in one discoverable file — no hunting across multiple components.

**Subcomponents co-located per file** — `DayCell`, `RangeBar`, `DayHeaders` live inside `CalendarGrid.jsx`; `NotesEditor`, `SavedNotesList`, `Legend` inside `NotesSidebar.jsx`. This groups related logic without fragmenting into too many tiny files, while still keeping each piece clearly named and bounded.

**Pure utility functions** — `buildCells`, `getMonthProgress`, `getDayCount` are side-effect-free functions in `utils.js`, making them trivially unit-testable.

**Dark mode via prop drilling (not Context)** — For a component this size, prop drilling is clearer and more explicit than a Context provider. Theme tokens (`{ page, card, sidebar, border }`) are computed once in the root and passed down as a single `theme` object.

**No external CSS libraries** — Inline styles for layout/spacing + one `<style>` block for CSS that requires pseudo-selectors and media queries. Zero runtime CSS-in-JS overhead.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🛠 Tech Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router, `"use client"`) |
| **Language** | JavaScript (React 19, hooks) |
| **Styling** | Inline styles + single `<style>` block (no CSS libs) |
| **Persistence** | `localStorage` |
| **Fonts** | Google Fonts — Lora (display) + Manrope (UI) |
| **Images** | Unsplash (royalty-free, no API key needed) |

---

## 🌐 Deploy on Netlify

1. Push code to GitHub
2. Go to netlify.com → Add New Site → Import from GitHub
3. Select repo → Deploy

🔗 Live Demo: https://wall-calender.netlify.app
