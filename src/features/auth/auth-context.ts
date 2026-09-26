import { createContext, useContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type AuthStatus = "checking" | "authed" | "anon";

export type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * KruMath treats a user as authenticated only with a real Supabase session.
 * Anonymous sessions (and expired/invalid ones) are not authenticated.
 */
export function isValidSession(session: Session | null): session is Session {
  return Boolean(session && session.user && session.user.is_anonymous !== true);
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within <AuthProvider>.");
  }
  return context;
}
