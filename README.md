# KruMath Tic-Tac-Toe

A minimalist Tic-Tac-Toe game that plays like a native part of
[KruMath](https://krumath.com). Pick a difficulty, tap a cell, and play against an
AI that ranges from nearly random to unbeatable.

**Live:** <https://krumath.com/tic-tac-toe>

## Features

- **Player vs. computer** with six genuine difficulty levels — from `Beginner`
  (mostly random) to `Impossible` (perfect minimax).
- **Growing boards** — each level steps up the board size (3×3 → 8×8) and win
  length (3 → 5 in a row).
- **Instant play** — the board is ready on load; difficulty defaults to `Medium`
  and persists in `localStorage`.
- **Score tracking** — wins, draws, and losses are kept locally between games.
- **Bilingual UI** — English and Khmer (EN / ខ្មែរ), persisted per browser.
- **Light / dark / system theme** applied before first paint (no flash).
- **Keyboard and screen-reader friendly** — semantic grid, ARIA labels, visible
  focus, and `prefers-reduced-motion` respected.
- **Responsive** — mobile-first, fits the viewport from 320 px up.
- **Gated** behind the shared KruMath Supabase session.

## Tech stack

| Layer     | Choice                                                                          |
| --------- | ------------------------------------------------------------------------------- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19)                         |
| Build     | [Vite 8](https://vite.dev) + [Nitro](https://nitro.build) (`cloudflare-module`) |
| Language  | TypeScript (strict)                                                             |
| Styling   | [Tailwind CSS v4](https://tailwindcss.com) + shadcn/ui primitives               |
| Auth      | [Supabase](https://supabase.com) (shared KruMath project)                       |
| Hosting   | [Cloudflare Workers](https://workers.cloudflare.com)                            |

## Getting started

### Prerequisites

- Node.js 20+ and npm (the repo also ships `bun.lock`, but npm works)
- A Cloudflare account with access to the `krumath.com` zone (for deploys only)

### Install and run

```sh
git clone https://github.com/krumath-org/tic-tac-toe.git
cd tic-tac-toe
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

The project is mounted under `/tic-tac-toe`, so the dev server prints a URL like
`http://localhost:8081/tic-tac-toe/` (the port may vary).

### Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable                 | Required | Description                                                                                                                        |
| ------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Yes      | Shared KruMath Supabase project URL.                                                                                               |
| `VITE_SUPABASE_ANON_KEY` | Yes      | Supabase **anon / publishable** key. Never the `service_role` key.                                                                 |
| `VITE_DEV_AUTH_BYPASS`   | No       | `true` skips the auth gate in **dev builds only**, so the game can be developed without a session. It has no effect in production. |

`.env.local` is gitignored. Only `.env.example` (with empty values) is committed.

## Scripts

| Script              | What it does                                                             |
| ------------------- | ------------------------------------------------------------------------ |
| `npm run dev`       | Start the Vite dev server.                                               |
| `npm run build`     | Production build (client + SSR + Cloudflare Worker) into `.output/`.     |
| `npm run build:dev` | Build in development mode.                                               |
| `npm run preview`   | Preview the production build locally.                                    |
| `npm run deploy`    | Build, inject the production route, and deploy the Worker with Wrangler. |
| `npm run lint`      | Run ESLint.                                                              |
| `npm run format`    | Format with Prettier.                                                    |

## Deployment

```sh
npm run deploy
```

This runs `vite build`, then `scripts/prepare-deploy.mjs` (which injects the
`krumath.com/tic-tac-toe*` route into the generated Worker config), then
`wrangler deploy`. It requires a Cloudflare login with access to the `krumath.com`
zone — run `npx wrangler login` once beforehand.

- **Worker:** `krumath-org-tic-tac-toe`
- **Route:** `krumath.com/tic-tac-toe* → krumath-org-tic-tac-toe`
- **Production URL:** <https://krumath.com/tic-tac-toe>

Supabase values are read from the build environment (`import.meta.env.VITE_*`), so
they must be present when `npm run deploy` runs.

## Architecture

### Mounted under a base path

The app lives at `/tic-tac-toe`, not `/`. `vite.config.ts` sets
`base = "/tic-tac-toe/"` and the TanStack Start router basepath to match.

Because Vite emits assets at `assets/*` but the browser requests them at
`/tic-tac-toe/assets/*`, `src/server.ts` forwards those requests to the Cloudflare
`ASSETS` binding with the prefix stripped. This keeps the generated `_headers`
cache rules effective without duplicating files on disk.

### Authentication

The project reuses the shared KruMath Supabase project and browser session — there
is no project-specific login form.

1. `src/features/auth/AuthProvider.tsx` loads the session and subscribes to auth
   changes.
2. `src/features/auth/AuthGate.tsx` renders a loading shell while `checking`, the
   app when `authed`, and redirects to `krumath.com/sign-in` when `anon`.
3. A user counts as authenticated only with a valid session where
   `user.is_anonymous !== true`.

The gate is client-side. That is appropriate here because the project has no
server functions, database, or secrets — the bundle contains only public game code.
If the project ever gains sensitive server-side data, enforcement should move into
the Worker.

### Localization

English and Khmer share one dictionary (`src/lib/i18n/dictionary.ts`). To keep
hydration deterministic, the server and first client render always use English,
then the stored choice is adopted in an effect. Server-rendered `<head>` meta and
the plain HTML error fallback stay English by design.

### Theming

An inline script (`THEME_INIT_SCRIPT`) applies the stored/system theme before first
paint, so there is no flash of the wrong theme. `ThemeProvider` keeps the `dark`
class in sync afterwards, including live OS changes.

### Game AI

`src/lib/tic-tac-toe/ai.ts` is an original, dependency-free implementation:

- **3×3** uses exhaustive depth-aware minimax (perfect play available).
- **Larger boards** use a threat-based line evaluation with a shallow negamax
  search over candidate cells near existing marks.
- Each difficulty tunes board size, search depth, and a "noise" rate (the chance
  of playing a random legal move), so the levels genuinely differ.

The rules live in `src/lib/tic-tac-toe/engine.ts`, separate from the UI and the AI.

## Project structure

```text
src/
├── components/ui/        # shadcn/ui primitives actually used by the app
├── features/
│   ├── auth/             # AuthProvider, AuthGate, context
│   ├── nav/              # ProjectHeader, language & theme toggles
│   └── tic-tac-toe/      # Board page, difficulty select, result dialog
├── lib/
│   ├── i18n/             # EN/KM dictionary, provider, hooks
│   ├── theme/            # Theme provider, hooks, init script
│   ├── tic-tac-toe/      # engine.ts (rules) + ai.ts (move selection)
│   ├── krumath.ts        # Platform links and return-URL helpers
│   ├── error-page.ts     # Plain HTML SSR fallback
│   └── supabase/client.ts
├── routes/               # File-based routes (__root, index, legacy redirect)
├── server.ts             # Cloudflare Worker entry (asset forwarding, error fallback)
└── start.ts              # Request middleware (error handler + CSRF)
docs/                     # Integration notes
scripts/prepare-deploy.mjs
```

## Security

- The Supabase **anon / publishable** key is the only credential used; the
  `service_role` key is never referenced.
- Real values live in `.env.local` (gitignored). `.env.example` contains no secrets.
- Anonymous Supabase sessions are never treated as authenticated.
- The `returnUrl` passed to KruMath sign-in is validated by the main app
  (same-origin only) to prevent open redirects.

See [docs/krumath-integration.md](docs/krumath-integration.md) for the full
integration contract, verification status, and security notes.

## License

Released under the [MIT License](LICENSE).
