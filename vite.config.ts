// The shared Vite config below already wires up every plugin this app needs — do NOT add
// them again or the build breaks on duplicates:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only, Cloudflare target), VITE_* env injection, the @ path alias,
//     React/TanStack dedupe, error-logger plugins, and dev-server port/host detection.
// Extra config can be passed through defineConfig({ vite: { ... } }).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Mounted under https://krumath.com/tic-tac-toe, so the app must not assume it owns "/".
// `vite.base` prefixes client asset URLs; TanStack Start derives the router basepath from it,
// while `tanstackStart.router.basepath` declares it explicitly for the route manifest.
const BASE_PATH = "/tic-tac-toe/";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    router: { basepath: BASE_PATH.replace(/\/$/, "") },
  },
  vite: {
    base: BASE_PATH,
  },
});
