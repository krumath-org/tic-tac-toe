import { Github, Heart, Home, LogOut, Settings, type LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth/auth-context";
import { LanguageToggle } from "@/features/nav/LanguageToggle";
import { ThemeToggle } from "@/features/nav/ThemeToggle";
import { useTranslation } from "@/lib/i18n/hooks";
import {
  GITHUB_REPO_URL,
  KRUMATH_HOME_URL,
  KRUMATH_PRICING_URL,
  KRUMATH_SETTINGS_URL,
  krumathSignInUrl,
} from "@/lib/krumath";

const ICON_LINK_CLASS =
  "inline-flex size-9 items-center justify-center rounded-md text-foreground/60 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Minimal project-wide navigation: the way back to KruMath, a language toggle, the
 * project's GitHub repo, the support/donation link, and an account control that
 * sign-posts the shared KruMath sign-in and sign-out (no project-only login form).
 */
export function ProjectHeader() {
  const { status, user, signOut } = useAuth();
  const t = useTranslation();
  const email = user?.email ?? t("account.fallbackName");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-2 px-4 sm:px-6">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="px-2 text-brand hover:bg-brand/10 hover:text-brand-hover"
          aria-label={t("nav.homeAria")}
        >
          <a href={KRUMATH_HOME_URL}>
            <Home aria-hidden="true" />
            <span className="hidden font-medium sm:inline">{t("nav.home")}</span>
          </a>
        </Button>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageToggle />

          <IconLink href={GITHUB_REPO_URL} label={t("nav.github")} icon={Github} opensInNewTab />
          <IconLink href={KRUMATH_PRICING_URL} label={t("nav.donate")} icon={Heart} opensInNewTab />

          {status === "authed" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t("account.label")}>
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">
                      {email.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                  {email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={KRUMATH_SETTINGS_URL} className="cursor-pointer">
                    <Settings aria-hidden="true" />
                    {t("account.settings")}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void signOut()}>
                  <LogOut aria-hidden="true" />
                  {t("account.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : status === "anon" ? (
            <Button asChild size="sm">
              <a href={krumathSignInUrl()}>{t("account.signIn")}</a>
            </Button>
          ) : (
            <div className="h-9 w-9" aria-hidden="true" />
          )}
        </div>
      </div>
    </header>
  );
}

function IconLink({
  href,
  label,
  icon: Icon,
  opensInNewTab,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  opensInNewTab?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          aria-label={label}
          {...(opensInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={ICON_LINK_CLASS}
        >
          <Icon className="size-4" aria-hidden="true" />
        </a>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
