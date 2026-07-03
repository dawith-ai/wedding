# Contributing to wedding

Thanks for your interest! **wedding** is a free, serverless mobile invitation
builder — 13 themes plus AI-generated custom themes, with all data encoded into
the share link (no backend). Contributions are welcome: new themes, event types,
translations, accessibility, and bug fixes.

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build      # production build (runs icon generation + tsc + vite)
```

## Quality gate (run before you push)

Every push to `main` runs the same checks in CI. Run them locally first:

```bash
npm run preview -- --host 127.0.0.1 --port 4173 &   # serve the build
npm run smoke            # Playwright smoke across all themes
npm run verify:all       # feature / theme / PWA / legibility checks
npm run audit:pwa        # Lighthouse thresholds (PWA / perf / a11y / SEO)
```

A change that introduces horizontal overflow on small screens (320px), a
contrast/legibility regression, or a console error will fail the gate.

## Adding a theme

1. Add the theme to the theme registry in `src/data/themes.ts` (Google Fonts
   query, color tokens, and layout signature).
2. Run `npm run smoke` — the new theme is picked up automatically and must pass
   its assertions with no console/request errors.
3. Verify it at 320px and 360px widths (the CI checks both).

## Ground rules

- **No backend.** All invitation data must stay encoded in the share link.
  Don't add server calls that persist user data.
- **Keep it accessible.** Respect `prefers-reduced-motion`, maintain contrast,
  and keep tap targets usable.
- **Small, focused PRs** with a clear description. Keep the CI gate green.

## Reporting bugs

Open an issue with the theme, device/viewport, and steps to reproduce. A
screenshot at the failing width is very helpful.
