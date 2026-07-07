# Ops Cockpit — React + Vite + Tailwind

Same dashboard as the single-file HTML version, restructured as a proper React project.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build
```

## Structure

```
src/
  data.js                  # mock action items, anomalies, i18n strings, style maps
  index.css                # Tailwind directives + custom CSS (split-flap, low-bw mode)
  App.jsx                  # top-level state: language, theme, low-bandwidth, focus index,
                            # item approve/hold state, and the j/k/a/h keyboard shortcuts
  main.jsx                 # React root
  components/
    Header.jsx              # title, live clock, language/theme/low-bandwidth toggles, palette trigger
    ActionQueue.jsx          # top-5 list, approve/hold/undo, keyboard focus ring
    LiveMetric.jsx           # split-flap countdown to next dispatch cutoff + live counter
    AnomalyPanel.jsx         # system-flagged anomalies list, scroll-to + highlight target
    CommandPalette.jsx       # ⌘K / Ctrl+K searchable overlay — jump to any item or anomaly
    Flap.jsx                 # reusable split-flap digit with flip animation on change
```

## Command palette

Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) anywhere, or click "Jump to anything" in the
header. It searches action-item titles, context, owners, and IDs, plus anomaly systems and
descriptions, live as you type. `↑`/`↓` move the selection, `Enter` jumps to it — the action
queue scrolls to and focuses the row, the anomaly panel scrolls to and briefly rings the
matching entry. `Esc` or a click outside closes it.

The palette temporarily suspends the `j/k/a/h` row shortcuts while open (its own arrow/enter
handling takes over), and `⌘K`/`Ctrl+K` itself works everywhere, including while typing in
the palette's own search box, so it doubles as the close gesture too.

State lives in `App.jsx` and is passed down as props — the dashboard is small enough that
this stays readable without reaching for a state library. `itemState` (open/approved/held)
and `focusedIdx` are the two pieces of state that the keyboard shortcuts, mouse clicks, and
rendering all need to agree on, so they're lifted to the one place that owns the keydown
listener.

Design rationale (palette, type, layout, the split-flap signature element, and how each
required/stretch item was met) is unchanged from the original HTML build — see the
accompanying design README from that version for the full writeup.

## Notes

- Tailwind config (`tailwind.config.js`) carries the same custom tokens (`ink`, `paper`,
  `signal-amber/red/teal`, `font-display/body/mono`) as the HTML build, so visuals match
  exactly — nothing was re-derived from Tailwind defaults.
- No routing, no external state library, no CSS-in-JS: this stays close to what a small
  ops tooling team could realistically maintain.
- `npm install` could not be verified to complete in this sandboxed environment (no
  registry access), so the build hasn't been run end-to-end here — worth a
  `npm run build` on your machine as a first step.
