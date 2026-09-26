/**
 * Prepares the Nitro Cloudflare build for deployment.
 *
 * Injects the production zone route so the deploy registers
 * `krumath.com/tic-tac-toe*` -> `krumath-org-tic-tac-toe`. Keeping the route in
 * the deploy pipeline (instead of only in the Cloudflare dashboard) means every
 * deploy keeps the public URL in sync with the Worker.
 *
 * Run it via `npm run deploy` (build -> prepare -> wrangler deploy).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const wranglerPath = resolve(".output/server/wrangler.json");

/** Public URL for this project: https://krumath.com/tic-tac-toe */
const PRODUCTION_ROUTE = {
  pattern: "krumath.com/tic-tac-toe*",
  zone_name: "krumath.com",
};

if (!existsSync(wranglerPath)) {
  console.error(`Missing ${wranglerPath} - run "npm run build" first.`);
  process.exit(1);
}

const config = JSON.parse(readFileSync(wranglerPath, "utf8"));
config.routes = [PRODUCTION_ROUTE];

writeFileSync(wranglerPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

console.log(`Injected route ${PRODUCTION_ROUTE.pattern} -> ${config.name}`);
