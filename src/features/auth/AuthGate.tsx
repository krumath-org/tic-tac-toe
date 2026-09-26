import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { useTranslation } from "@/lib/i18n/hooks";
import { krumathSignInUrl } from "@/lib/krumath";
import { useAuth } from "./auth-context";

/**
 * Hard gate: only a valid non-anonymous KruMath session can see the project.
 *
 * SSR and the first client render both report `checking`, so the shell is
 * hydration-safe; the redirect happens in an effect once auth is known.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const t = useTranslation();

  useEffect(() => {
    if (status === "anon" && typeof window !== "undefined") {
      window.location.replace(krumathSignInUrl());
    }
  }, [status]);

  if (status === "authed") return <>{children}</>;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-1 flex-col items-center justify-center gap-3 pb-24 text-sm text-muted-foreground"
    >
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span>{status === "anon" ? t("auth.redirecting") : t("auth.checking")}</span>
    </div>
  );
}
