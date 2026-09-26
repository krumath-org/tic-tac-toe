import { translate } from "@/lib/i18n/dictionary";
import { KRUMATH_HOME_URL } from "@/lib/krumath";

/**
 * Plain HTML fallback served when SSR fails before React can render, so it cannot
 * use the component tree or the locale provider. Copy comes from the English
 * dictionary so it stays in step with the app (see docs/krumath-integration.md).
 */
export function renderErrorPage(): string {
  const title = translate("en", "error.loadTitle");
  const body = translate("en", "error.loadBody");
  const tryAgain = translate("en", "error.tryAgain");
  const goToKruMath = translate("en", "error.goToKruMath");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${title}</h1>
      <p>${body}</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">${tryAgain}</button>
        <a class="secondary" href="${KRUMATH_HOME_URL}">${goToKruMath}</a>
      </div>
    </div>
  </body>
</html>`;
}
