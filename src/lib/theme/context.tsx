import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type ThemeMode,
} from "./theme-context";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function readSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Starts on `system` for both the server render and the first client render so
 * hydration matches, then adopts the stored choice in an effect. The `.dark`
 * class is applied by `THEME_INIT_SCRIPT` before hydration (no flash), and this
 * provider keeps it in sync afterwards — including live OS changes in `system`.
 *
 * The class is only touched once `ready` is true, so the provider never fights
 * the pre-hydration script and no wrong theme is ever painted.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [system, setSystem] = useState<ResolvedTheme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: ThemeMode = "system";
    try {
      const value = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemeMode(value)) stored = value;
    } catch {
      // Private mode or blocked storage; follow the system preference.
    }
    setModeState(stored);
    setSystem(readSystemTheme());
    setReady(true);
  }, []);

  // Track the OS preference so `system` follows it live.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystem(query.matches ? "dark" : "light");
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const resolved: ResolvedTheme = mode === "system" ? system : mode;

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
  }, [ready, resolved]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Persisting is best-effort; the session still switches theme.
    }
  }, []);

  const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
