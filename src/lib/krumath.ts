/**
 * Shared KruMath platform links and helpers.
 *
 * The project is mounted at https://krumath.com/tic-tac-toe and reuses the
 * platform's identity, so sign-in always goes through the main KruMath app.
 */
export const KRUMATH_ORIGIN = "https://krumath.com";

export const KRUMATH_HOME_URL = `${KRUMATH_ORIGIN}/home`;

/** Donation / support link, labelled "Support KruMath" in the header. */
export const KRUMATH_PRICING_URL = `${KRUMATH_ORIGIN}/pricing`;

export const KRUMATH_SETTINGS_URL = `${KRUMATH_ORIGIN}/settings`;

export const GITHUB_REPO_URL = "https://github.com/krumath-org/tic-tac-toe";

/** The project's public path prefix (matches `vite.config.ts` base). */
export const BASE_PATH = "/tic-tac-toe";

/** Build the KruMath sign-in URL, preserving the current project route. */
export function krumathSignInUrl(returnUrl?: string): string {
  const target = returnUrl ?? currentReturnUrl();
  return `${KRUMATH_ORIGIN}/sign-in?returnUrl=${encodeURIComponent(target)}`;
}

/**
 * The current same-origin URL (including query) to return to after sign-in.
 * Falls back to the project root outside the browser.
 *
 * Emitted as an absolute URL on the production origin on purpose: the main app's
 * `navigatePostAuthRedirect` only performs a full page load for absolute URLs
 * (or paths it lists as separate Worker apps), and a client-side `router.push`
 * to `/tic-tac-toe` would 404 because the main Next.js app does not own that
 * route. Relative elsewhere, where the origin is not sign-in whitelisted.
 */
export function currentReturnUrl(): string {
  if (typeof window === "undefined") return `${BASE_PATH}/`;
  const path = `${window.location.pathname}${window.location.search}`;
  if (window.location.origin === KRUMATH_ORIGIN) return `${KRUMATH_ORIGIN}${path}`;
  return path;
}
