import { useContext } from "react";

import { ThemeContext, type ThemeContextValue } from "./theme-context";

export function useOptionalTheme(): ThemeContextValue | null {
  return useContext(ThemeContext);
}

export function useTheme(): ThemeContextValue {
  const context = useOptionalTheme();
  if (!context) throw new Error("useTheme must be used inside a ThemeProvider.");
  return context;
}
