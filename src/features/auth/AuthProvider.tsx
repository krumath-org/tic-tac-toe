import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  AuthContext,
  isValidSession,
  type AuthContextValue,
  type AuthStatus,
} from "./auth-context";

// Dev-only escape hatch so the game can be developed without a KruMath session.
// `import.meta.env.DEV` is false in production builds, so this is dead code there.
const DEV_BYPASS = import.meta.env.DEV && import.meta.env.VITE_DEV_AUTH_BYPASS === "true";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(DEV_BYPASS ? "authed" : "checking");
  const [user, setUser] = useState<AuthContextValue["user"]>(null);

  useEffect(() => {
    if (DEV_BYPASS) {
      setStatus("authed");
      return;
    }

    if (!isSupabaseConfigured) {
      console.error(
        "[krumath] Supabase env vars are missing, so the user is treated as signed out. " +
          "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or set VITE_DEV_AUTH_BYPASS=true for local development.",
      );
      setStatus("anon");
      return;
    }

    const supabase = getSupabaseClient();
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setStatus(isValidSession(data.session) ? "authed" : "anon");
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setStatus(isValidSession(session) ? "authed" : "anon");
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      // Signs out of the shared KruMath session; the auth listener above then
      // flips the gate to `anon` and the user is redirected to sign in.
      await getSupabaseClient().auth.signOut();
    } else {
      setUser(null);
      setStatus("anon");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, signOut }),
    [status, user, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
