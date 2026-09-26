import { createContext } from "react";

/** What the user picked. `system` follows the operating system preference. */
export type ThemeMode = "light" | "dark" | "system";

/** What is actually painted once `system` is resolved. */
export type ResolvedTheme = "light" | "dark";

export type ThemeContextValue = {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_STORAGE_KEY = "krumath.ttt.theme";

/**
 * Runs in `<head>` before the app hydrates so the correct theme is painted on the
 * very first frame (no white flash when the user prefers dark). Kept as a string
 * so it can be inlined without a separate request.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var e=document.documentElement,k="${THEME_STORAGE_KEY}",s=localStorage.getItem(k),d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light"}catch(t){}})();`;
