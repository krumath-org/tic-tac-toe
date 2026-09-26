import { useContext } from "react";

import { translate } from "./dictionary";
import { I18nContext, type I18nContextValue } from "./i18n-context";

export function useOptionalI18n(): I18nContextValue | null {
  return useContext(I18nContext);
}

export function useI18n(): I18nContextValue {
  const context = useOptionalI18n();
  if (!context) throw new Error("useI18n must be used inside a LocaleProvider.");
  return context;
}

export function useTranslation(): I18nContextValue["t"] {
  return useI18n().t;
}

/**
 * Like `useTranslation`, but falls back to English instead of throwing when there
 * is no provider. Used by the root error/not-found boundaries, which can render
 * above the provider if the root component itself fails.
 */
export function useSafeTranslation(): I18nContextValue["t"] {
  const context = useOptionalI18n();
  return context ? context.t : (key, params) => translate("en", key, params);
}
