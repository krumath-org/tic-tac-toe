# KruMath Integration (Tic-Tac-Toe)

Handoff and integration notes for mounting this project at
`https://krumath.com/tic-tac-toe`, following the KruMath Independent Project
Integration Specification.

## Handoff contract

```text
Project name: Tic-Tac-Toe
Project slug: tic-tac-toe
GitHub repository: https://github.com/krumath-org/tic-tac-toe
Cloudflare Worker name: krumath-org-tic-tac-toe
Production URL: https://krumath.com/tic-tac-toe
Authentication model: Hard gate
Supabase project: Existing KruMath Supabase (shared)
Required environment variables:
  VITE_SUPABASE_URL
  VITE_SUPABASE_ANON_KEY
Required database tables/policies: none (the game has no server data)
Required KruMath main-app changes:
  - /sign-in must read and safely validate `returnUrl` (same-origin paths only)
  - shared auth cookie must use path=/ so the session is visible under /tic-tac-toe
  - global logout must invalidate the shared Supabase session
Cloudflare route: krumath.com/tic-tac-toe* -> krumath-org-tic-tac-toe
Deploy command: npm run deploy
Verification status: see "Verification" below (live since 2026-09-26)
Known limitations: see "Known limitations" below
```

## Architecture

- Framework: TanStack Start (React 19) + Nitro, built with Vite, targeting the
  Cloudflare Workers (`cloudflare-module`) preset.
- The app is mounted under `/tic-tac-toe`. `vite.config.ts` sets
  `vite.base = "/tic-tac-toe/"` and declares
  `tanstackStart.router.basepath = "/tic-tac-toe"` so routing, asset URLs, and
  client navigation all work under the project path.
- The game lives at the project root (`/`). The legacy
  `/games/tic-tac-toe` path redirects to `/`.
- Authentication reuses the shared KruMath Supabase project and the same
  browser session. A user is authenticated only when there is a valid Supabase
  session and `user.is_anonymous !== true`.

### Auth flow

1. `src/features/auth/auth-context.tsx` loads the session via
   `supabase.auth.getSession()` and subscribes to `onAuthStateChange`.
2. `src/features/auth/AuthGate.tsx` gates the app:
   - `checking` -> renders an SSR-safe loading shell,
   - `authed` -> renders the game,
   - `anon` -> redirects to
     `https://krumath.com/sign-in?returnUrl=<current project path>`.
3. `src/features/nav/ProjectHeader.tsx` renders the Home button
   (`https://krumath.com/home`), the EN/ខ្មែរ language toggle, the GitHub link,
   the support/donation link (`https://krumath.com/pricing`), and the account
   control (Sign In when signed out; avatar menu with Account settings + Log out
   when signed in).
4. Log out calls the shared `supabase.auth.signOut()`, which clears the
   platform session; the gate then redirects back to sign in.

### Localization (English / Khmer)

The UI is bilingual. Khmer is a first-class locale, not a partial translation.

- `src/lib/i18n/dictionary.ts` — the `en` and `km` dictionaries (single source of
  truth), `translate()` with `{placeholder}` interpolation, and `LOCALES`.
- `src/lib/i18n/i18n-context.ts` — the context object.
- `src/lib/i18n/context.tsx` — `LocaleProvider`: starts on English for the server
  and first client render (hydration-safe), then adopts the stored choice, keeps
  `<html lang>` in sync, and mounts the tooltip provider.
- `src/lib/i18n/hooks.ts` — `useI18n` / `useTranslation` / `useSafeTranslation`.
- `src/features/nav/LanguageToggle.tsx` — the segmented EN / ខ្មែរ control; the
  choice persists in `localStorage` (`krumath.ttt.locale`).

`i18n-review.json` in the repo root is the owner-approved source copy; keep the
dictionary keys and the JSON in step when copy changes.

Server-rendered output (the `<head>` meta and the plain `src/lib/error-page.ts`
fallback) stays English, because the locale cannot be known before hydration. The
game page re-syncs `document.title` and the description meta on the client once a
locale is chosen.

### Static assets under the base path

Vite emits client assets to `assets/*` in `.output/public`, but the browser
requests them at `/tic-tac-toe/assets/*`. Cloudflare's `ASSETS` binding maps
paths literally, so `src/server.ts` forwards asset requests to the binding with
the `/tic-tac-toe` prefix stripped (see `serveStaticAsset`). This keeps the
`_headers` cache rule (`/assets/*`) effective and avoids duplicating assets on
disk.

## Local development

```sh
npm i
npm run dev
```

The dev server serves the project at `http://localhost:8081/tic-tac-toe/`
(the port may change; check the dev server output).

Environment variables live in `.env.local` (gitignored). See `.env.example`:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — the shared KruMath Supabase
  project (anon/public key only, never `service_role`).
- `VITE_DEV_AUTH_BYPASS=true` — dev-only; skips the gate so the game can be
  developed without a KruMath session. Has no effect in production builds.

## Build and deploy

```sh
npm run deploy
```

`deploy` runs three steps:

1. `npm run build` — Vite/Nitro production build.
2. `node scripts/prepare-deploy.mjs` — injects the production zone route into the
   generated Worker config.
3. `npx wrangler deploy --config .output/server/wrangler.json` — uploads the
   Worker, assets, and route.

Build output:

- `.output/public` — static assets
- `.output/server/index.mjs` — the Cloudflare Worker entry
- `.output/server/wrangler.json` — generated Worker config (name
  `krumath-org-tic-tac-toe`)

The route `krumath.com/tic-tac-toe* -> krumath-org-tic-tac-toe` is declared in
`scripts/prepare-deploy.mjs` rather than only in the Cloudflare dashboard, so
every deploy keeps the public URL in sync. It is a more specific route than the
main site Worker's `krumath.com` custom domain, so it takes precedence while
`/`, `/home`, `/sign-in`, and `/auth/*` stay on the main Worker.

`wrangler` is invoked through `npx` because this repo does not pin it as a
dependency (installing it requires `bun`, which manages `bun.lock`).

Provide the Supabase variables as build-time env vars (the client reads
`import.meta.env.VITE_*`), or bake them in through the deploy pipeline. Vite
loads `.env.local`, which is gitignored — never commit real values.

## Security notes

- Only the public anon key is used; `service_role` is never exposed.
- The hard gate is a client-side route guard. This is appropriate here because
  the project has no server functions, database, or secrets — the bundle
  contains only public game code. If the project ever gains sensitive
  server-side data, move enforcement server-side (validate the session in the
  Worker before serving protected responses).
- Anonymous Supabase sessions are never treated as authenticated.
- `returnUrl` is provided exactly as `returnUrl`; validation is the KruMath
  `/sign-in` page's responsibility (reject external / protocol-relative paths).

## Verification

Verified against the production build, the dev server, and the live Worker.

Local / build:

- [x] `tsc --noEmit` and `npm run lint` pass (pre-existing UI warnings only).
- [x] Server-rendered HTML references base-prefixed assets and shows the gate
      shell (the game is not server-rendered before auth).
- [x] Signed-out visit redirects to
      `https://krumath.com/sign-in?returnUrl=https%3A%2F%2Fkrumath.com%2Ftic-tac-toe%2F`.
- [x] Supabase URL + anon key are baked into the client bundle at build time and
      the dev-only auth bypass is dead-code eliminated from production.

Live (`https://krumath.com/tic-tac-toe`, Worker `krumath-org-tic-tac-toe`):

- [x] `GET /tic-tac-toe/` returns 200 HTML titled `Tic-Tac-Toe | KruMath`.
- [x] `/tic-tac-toe/assets/*` (JS + CSS), `/tic-tac-toe/favicon.svg` return 200.
- [x] `/tic-tac-toe/games/tic-tac-toe` returns 307 to `/tic-tac-toe/`.
- [x] Route `krumath.com/tic-tac-toe*` is registered to the Worker.

Localization:

- [x] The EN/ខ្មែរ toggle switches every string, `<html lang>`, and the document
      title.
- [x] The choice persists across reload (`krumath.ttt.locale` in `localStorage`).
- [x] Difficulty names, board/cell aria-labels, status text, the header, and the
      React 404/error pages all follow the locale.

Still needs a manual browser pass (cannot be verified with HTTP requests alone):

- [ ] Signed-in visit renders the game instead of redirecting to sign in.
- [ ] Logout in one app is reflected in the other.

## Known limitations

- Server-rendered `<head>` meta and the plain `src/lib/error-page.ts` fallback are
  always English (the locale is client-only). The game page updates the document
  title/description after hydration, and the React 404/error boundaries are
  localized.
- Theme follows the operating system by default. The header's Light/Dark/System
  menu overrides it, and the choice persists in `localStorage`
  (`krumath.ttt.theme`). An inline script in `src/routes/__root.tsx` applies the
  theme before first paint, so there is no flash of the wrong theme.
- Session sharing is confirmed: the main KruMath browser client
  (`apps/web/src/config/supabase-browser.ts`) persists the session in
  `localStorage` under the default key `sb-<project-ref>-auth-token` — not
  `@supabase/ssr` cookies — so this app's client reads the same session on the
  `krumath.com` origin with no storage adapter. If the main app ever moves the
  browser session to cookies, add a matching adapter in
  `src/lib/supabase/client.ts`.
- Post-sign-in return uses an **absolute** `returnUrl`
  (`https://krumath.com/tic-tac-toe/`). The main app's
  `navigatePostAuthRedirect` only does a full page load for absolute URLs or
  paths listed in `FEATURE_APP_PATH_PREFIXES`; a relative path would trigger a
  client-side `router.push` into a route the main Next.js app does not own.
  Adding `/tic-tac-toe` to `FEATURE_APP_PATH_PREFIXES` in the KruMath repo
  (`packages/shared/src/constants/mainSite.ts`) is recommended as a follow-up
  and would make relative return URLs work too.
- The gate is client-side (see Security notes).
- Real auth can only be verified with the shared Supabase credentials.
