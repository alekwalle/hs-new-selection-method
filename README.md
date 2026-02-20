# Highcharts Pricing Selector

A small React + Vite UI that replicates a Highcharts pricing selector with core seat toggle, optional add-ons, and a live total pill.

## Features
- Core seat toggle with Add/Remove and green selected state
- Add-on modules (Stock, Maps, Gantt) with muted/active states and remove toggle
- Price totals update automatically based on seats and selected add-ons
- Clear action resets seats and selections
- Desktop-first styling per provided reference mocks

## Tech
- React + TypeScript (Vite)
- CSS modules via global stylesheet
- ESLint configured via eslint.config.js

## Prices
- Core: 185 USD per seat
- Stock: 185 USD
- Maps: 65 USD
- Gantt: 37 USD
a
## Getting Started
```bash
npm install
npm run dev
```
Then open the printed local URL (usually http://localhost:5173).

## Notes
- No external secrets or APIs are required.
- Total pill sits below the main card and reflects current selections.
