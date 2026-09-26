import { Check, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import { useTranslation } from "@/lib/i18n/hooks";
import type { ThemeMode } from "@/lib/theme/theme-context";
import { useTheme } from "@/lib/theme/hooks";

const OPTIONS: { mode: ThemeMode; icon: LucideIcon; labelKey: TranslationKey }[] = [
  { mode: "light", icon: Sun, labelKey: "theme.light" },
  { mode: "dark", icon: Moon, labelKey: "theme.dark" },
  { mode: "system", icon: Monitor, labelKey: "theme.system" },
];

/**
 * Light / Dark / System menu. The trigger shows the theme currently in effect,
 * and the choice is remembered across visits (`krumath.ttt.theme`).
 */
export function ThemeToggle() {
  const { mode, resolved, setMode } = useTheme();
  const t = useTranslation();
  const TriggerIcon = mode === "system" ? Monitor : resolved === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("theme.label")}>
          <TriggerIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map(({ mode: option, icon: Icon, labelKey }) => (
          <DropdownMenuItem
            key={option}
            onSelect={() => setMode(option)}
            className="cursor-pointer"
          >
            <Icon aria-hidden="true" />
            <span>{t(labelKey)}</span>
            {mode === option && <Check className="ml-auto" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
