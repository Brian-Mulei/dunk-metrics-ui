# DunkMetrics frontend

React SPA for the DunkMetrics NBA site: daily games, team pages, standings, player stats, news. Data comes from the Kotlin backend (`../DunkMetrics`, a separate repo).

Stack: React 18, react-router-dom 7, axios, Tailwind 3, Vite 6, lucide-react icons. Tests: Vitest + Testing Library on jsdom.

## Commands

- `npm run dev` — dev server on http://localhost:3000, talking to the **production** API by default. To use a local backend: `VITE_API_BASE_URL=http://localhost:8080 npm run dev`.
- `npm test` — Vitest, runs in CI before the build.
- `npm run build` — production bundle in `dist/`.
- `npm run lint` — ESLint. Already fails on existing code (missing prop-types, unused `React` imports), and CI doesn't run it; keep new files clean of real errors.

## Structure

- `src/App.jsx` — routes, each page lazy-loaded: `/` HomePage (games by date), `/team/:id` TeamPage, `/standings` StandingsTable, `/stats` StatsPage, `/news` NewsPage. All sit inside `components/Layout.jsx`.
- `src/components/Layout.jsx` — navbar, team sidebar (static at `lg`+, slide-in drawer with backdrop below that), page area (the only scrolling region) and news sidebar (`xl`+ only). Nav links are defined once in `Navbar.jsx` (`NAV_LINKS`) and shared with the mobile menu.
- `src/apis/apis.js` — **all HTTP goes through here.** `cachedGet` de-duplicates identical in-flight requests and caches results per URL+params for a TTL (games 30s, news 2m, standings 5m, stats 10m). Failed requests aren't cached. Base URL comes from `VITE_API_BASE_URL`, falling back to the production backend.
- `src/assets/data/teams.jsx` — static team list (ids, names, codes, logo paths) used by the sidebar, filters and `utils/LogoPicker.js`. Logos are SVGs in `public/assets/logos`.
- `src/utils/` — `LogoPicker` (logo/code by team id), `DateFormater`, `StatFormatter` (`formatStat`, `formatPct`, `getInitials`; missing values render as "–").

## Conventions

- Data fetching is plain `useEffect` + `useState` calling an `apis.js` function; guard against setting state after unmount/param change with a `cancelled` flag (see `TeamPage`, `StatsPage`). No global store.
- Loading states are pulse skeletons using `bg-surfaceTonal-a10 animate-pulse`.
- Colors are custom Tailwind tokens from `tailwind.config.js`: `surface-a0…a50` (dark backgrounds), `surfaceTonal-*`, `primary-a0…a50` (lime accent), `light-a0`/`dark-a0`. Don't introduce other palettes.
- Mobile first: design for ~360px, then `sm`/`md`/`lg`/`xl` up. No fixed rem heights on page content; let the layout's `main` scroll. Wide tables get a phone card layout (`md:hidden` list + `hidden md:block` table, see `StatsPage`).
- Images from outside sources use `loading="lazy"`. Player photos go through `PlayerHeadshot`, which falls back to initials when the URL is missing or fails.
- Team stats on the team page are optional: if `/stats/team` fails, the page renders without them. Keep new backend-dependent features tolerant like this because the frontend and backend deploy separately on Coolify.

## Tests

Tests sit next to the code (`*.test.js(x)`); setup in `src/test/setup.js`. Mock `../apis/apis` with `vi.mock` for page tests; `apis.test.js` mocks `axios` itself.

## Deployment

Coolify serves the prebuilt `dist/` with nginx (`Dockerfile` has no build stage and no SPA fallback, so deep-link refreshes may 404). CI (`.github/workflows/frontend-ci.yml`) runs `npm ci`, `npm test`, `npm run build`.
