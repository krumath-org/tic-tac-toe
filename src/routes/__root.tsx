import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { AuthGate } from "@/features/auth/AuthGate";
import { ProjectHeader } from "@/features/nav/ProjectHeader";
import { LocaleProvider } from "@/lib/i18n/context";
import { translate } from "@/lib/i18n/dictionary";
import { useSafeTranslation } from "@/lib/i18n/hooks";
import { BASE_PATH } from "@/lib/krumath";
import { ThemeProvider } from "@/lib/theme/context";
import { THEME_INIT_SCRIPT } from "@/lib/theme/theme-context";

const BASE_URL = import.meta.env.BASE_URL;

// Server-rendered fallback meta (English): the locale cannot be known before hydration.
const ROOT_TITLE = translate("en", "meta.rootTitle");
const ROOT_DESCRIPTION = translate("en", "meta.rootDescription");

function NotFoundComponent() {
  const t = useSafeTranslation();
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("error.notFoundTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("error.notFoundBody")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("error.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const t = useSafeTranslation();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t("error.loadTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("error.loadBody")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("error.tryAgain")}
          </button>
          <a
            href={`${BASE_PATH}/`}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("error.goHome")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: ROOT_TITLE },
      { name: "description", content: ROOT_DESCRIPTION },
      { name: "author", content: "KruMath" },
      { property: "og:title", content: ROOT_TITLE },
      { property: "og:description", content: ROOT_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        // Kantumruy Pro is the Khmer face KruMath standardises on; it also carries the
        // Latin glyphs, so Khmer mode renders the whole UI in it (see styles.css).
        href: "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap",
      },
      { rel: "icon", href: `${BASE_URL}favicon.svg`, type: "image/svg+xml" },
      { rel: "icon", href: `${BASE_URL}favicon.ico`, type: "image/x-icon" },
      { rel: "apple-touch-icon", href: `${BASE_URL}favicon.png` },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Runs before first paint so the stored/system theme is already applied. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            {/* dvh, not vh: the game should fill the visible screen even while
                mobile browser chrome is showing. */}
            <div className="flex min-h-dvh flex-col">
              <ProjectHeader />
              <div className="flex min-h-0 flex-1 flex-col">
                {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                <AuthGate>
                  <Outlet />
                </AuthGate>
              </div>
            </div>
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
