import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { BASE_PATH } from "./lib/krumath";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

// The app is mounted at BASE_PATH, so client assets are requested at
// `/tic-tac-toe/assets/*`, but they physically live at `assets/*` in the
// Cloudflare static assets directory. Nitro's Cloudflare handler only delegates
// unprefixed public asset paths to the ASSETS binding, so we forward the
// prefixed requests ourselves with the base path stripped.
const STATIC_PREFIXES = [`${BASE_PATH}/assets/`];
const STATIC_FILES = new Set([
  `${BASE_PATH}/favicon.ico`,
  `${BASE_PATH}/favicon.png`,
  `${BASE_PATH}/favicon.svg`,
  `${BASE_PATH}/robots.txt`,
]);

type AssetsBinding = { fetch: (request: Request) => Promise<Response> };

function getAssetsBinding(env: unknown): AssetsBinding | undefined {
  const fromArg = (env as { ASSETS?: AssetsBinding } | undefined)?.ASSETS;
  if (fromArg) return fromArg;
  // Nitro's Cloudflare preset stores the bindings on globalThis before invoking
  // the app; the Vite SSR service does not receive `env` as an argument.
  return (globalThis as { __env__?: { ASSETS?: AssetsBinding } }).__env__?.ASSETS;
}

async function serveStaticAsset(request: Request, env: unknown): Promise<Response | null> {
  const assets = getAssetsBinding(env);
  if (!assets) return null;

  if (request.method !== "GET" && request.method !== "HEAD") return null;

  const url = new URL(request.url);
  const isAssetPath = STATIC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
  const isStaticFile = STATIC_FILES.has(url.pathname);
  if (!isAssetPath && !isStaticFile) return null;

  const stripped = new URL(request.url);
  stripped.pathname = url.pathname.slice(BASE_PATH.length);

  try {
    const response = await assets.fetch(
      new Request(stripped.toString(), { method: request.method, headers: request.headers }),
    );
    if (response.status !== 404) return response;
    // Hashed build assets must return their real 404; optional static files
    // (favicon/robots) fall through to the app when absent.
    if (isAssetPath) return response;
  } catch (error) {
    console.error(error);
  }

  return null;
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const asset = await serveStaticAsset(request, env);
    if (asset) return asset;

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
