import { LOCALES } from "@/lib/i18n/dictionary";
import { useI18n } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

/**
 * Compact EN / ខ្មែរ segmented control. The stored locale drives every string in the
 * app; this is the only control that changes it.
 */
export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className="flex items-center rounded-full bg-muted p-0.5 ring-1 ring-border"
    >
      {LOCALES.map((option) => {
        const label = option === "en" ? t("lang.en") : t("lang.km");
        const aria = option === "en" ? t("lang.switchToEn") : t("lang.switchToKm");
        return (
          <button
            key={option}
            type="button"
            lang={option}
            onClick={() => setLocale(option)}
            aria-pressed={locale === option}
            aria-label={aria}
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              // The Khmer option keeps the KruMath Khmer face even while English is active.
              option === "km" && "font-khmer",
              locale === option
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
