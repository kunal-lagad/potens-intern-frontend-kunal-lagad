# Ops Cockpit — React + Vite + Tailwind

Ops Cockpit is a mock operations dashboard for a morning briefing workflow. It gives an operator a short ranked queue of decisions, live dispatch cutoff metrics, anomaly alerts, bilingual UI copy, low-bandwidth mode, dark mode, keyboard shortcuts, audio feedback, and a command palette for jumping around quickly.

The app is intentionally frontend-only. All operational data is mock data in `src/data.js`; no data leaves the browser.

## How to run it

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## What is included

- A top 5 action list for decisions needed today, with one-line context and approve / hold actions.
- A panel of automated-system anomalies using mock JSON-style data from `src/data.js`.
- A ticking live counter for the next dispatch cutoff and queued orders.
- Full bilingual toggle between English and Hindi.
- Desktop-optimised layout that also responds cleanly on tablet screens.
- Tailwind-based styling with custom tokens for color, typography, spacing, and dark mode.
- Keyboard shortcuts for power users: `j` / `k` navigation, `a` to approve, and `h` to hold.
- Low-bandwidth toggle that removes decorative visuals, disables heavier effects, and switches to a sparser layout.
- Dark mode designed as a complete operational theme, not just a cosmetic color inversion.
- Command palette with `Cmd+K` / `Ctrl+K` search across queue items and anomalies.
- Browser-generated audio cues for approve and hold actions, disabled in low-bandwidth mode.

## Project structure

```text
src/
  App.jsx                  Top-level app state and keyboard orchestration
  data.js                  Mock queue items, anomalies, i18n strings, style maps
  index.css                Tailwind directives plus custom animation/low-bandwidth CSS
  main.jsx                 React entry point
  components/
    Header.jsx             Clock, language/theme/low-bandwidth toggles, palette trigger
    ActionQueue.jsx        Ranked decision list with approve/hold/undo interactions
    LiveMetric.jsx         Cutoff countdown, queued-order metric, Recharts visuals
    AnomalyPanel.jsx       System-flagged anomalies with command-palette highlight target
    CommandPalette.jsx     Searchable overlay for jumping to actions or anomalies
    Flap.jsx               Reusable split-flap animation wrapper
  utils/
    audio.js               Web Audio API tones for decision feedback
```

## Design decisions

The dashboard is built as a compact operational tool rather than a landing page. The first screen is the working surface: queue on the left, live metrics and anomalies on the right, with controls kept in a sticky header.

State is kept in `App.jsx` because the app is small and the shared state is limited: language, theme, low-bandwidth mode, focused queue row, item decision states, palette visibility, and anomaly highlight state. Pulling in a state library would add more machinery than the app currently needs.

The command palette is included because ops dashboards get more useful when keyboard-first users can jump directly to a specific order, system, or anomaly. While the palette is open, it owns arrow/enter/escape handling so the queue shortcuts do not fight it.

Low-bandwidth mode is treated as a real product mode, not just a visual toggle. It disables decorative animation, avoids custom font loading, removes heavier glass effects, and suppresses audio/extra visual flourishes where possible.

The bilingual copy is stored next to the mock data instead of routed through a full i18n library. That keeps the prototype understandable while still proving that the layout can handle Hindi and English.

The split-flap metric is the signature visual element. It gives the dispatch cutoff a sense of urgency without needing a backend or live data feed.

## What is broken or unfinished

- The dashboard uses mock data only. Queue actions, anomalies, charts, and live counters are not connected to a backend.
- Decisions are not persisted. Refreshing the page resets approve/hold state, theme, language, and low-bandwidth mode.
- The cutoff countdown has an edge case during the exact cutoff minute: once seconds have passed after a cutoff time, it can roll toward the next day instead of the next same-day cutoff.
- Audio relies on the browser Web Audio API and may be blocked or delayed until after a user interaction, depending on browser policy.


## What I would build next

Because this version is frontend-only and uses mock data, the next step would be turning it into a real operations tool:

1. Add a backend API for queue items, anomalies, user decisions, and audit history.
2. Replace mock data with live operational data or a realistic event stream.
3. Persist approve/hold decisions, user preferences, and notes across sessions.
4. Add authentication, role-based access, and tests around the main decision workflow.

## AI use log

| Tool | Approximate usage | Used for |
| --- | ---: | --- |
| Claude | ~5-8 messages | Used for brainstorming dashboard feature ideas, copy polish, and sanity-checking the product direction. |
| Antigravity | ~5-10 messages/actions | Used for UI implementation assistance, layout iteration, and improving the dashboard's interactive feel. |
| Design.com | ~1 logo generation session | Used to generate and refine logo concepts for the Ops Cockpit brand direction. |
| Codex / GPT-5 in Codex desktop | ~10 messages | Used for project analysis, README rewrite, code-comment review, and documentation cleanup. |
