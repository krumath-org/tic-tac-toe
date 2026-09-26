import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { LOCALE_STORAGE_KEY, translate, type Locale } from "./dictionary";
import { I18nContext } from "./i18n-context";

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "km";
}

/**
 * Starts on English for both the server render and the first client render so
 * hydration matches, then adopts the stored choice. Reading localStorage during
 * render would desync the two.
 *
 * Also mounts the tooltip provider, which the header's icon controls rely on.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(stored)) setLocaleState(stored);
    } catch {
      // Private mode or blocked storage; English is a fine default.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Persisting is best-effort; the session still switches language.
    }
  }, []);

  const t = useCallback(
    (key: Parameters<typeof translate>[1], params?: Parameters<typeof translate>[2]) =>
      translate(locale, key, params),
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={0}>
      <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    </TooltipProvider>
  );
}
