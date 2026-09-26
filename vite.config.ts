// The shared Vite config below already wires up every plugin this app needs — do NOT add
// them again or the build breaks on duplicates:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only, Cloudflare target), VITE_* env injection, the @ path alias,
//     React/TanStack dedupe, error-logger plugins, and dev-server port/host detection.
// Extra config can be passed through defineConfig({ vite: { ... } }).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
