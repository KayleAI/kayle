"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";

type AuthUser = {
  readonly id: string | null;
  readonly email: string | null;
  readonly name: string | null;
  readonly avatar: string | null;
};

interface AuthSessionContext {
  readonly session: Session | null;
  readonly data: AuthUser | null;
  readonly authStatus: "loading" | "authenticated" | "unauthenticated";
}

export const AuthContext = createContext<AuthSessionContext | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

async function getSession(): Promise<{ session: Session | null, user: AuthUser | null }> {
  const supabase = createClient();

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return {
      session: null,
      user: null,
    };
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, avatar")
    .single();

  if (error) {
    console.error("Error fetching user session:", error.message);
    return {
      session: null,
      user: null,
    };
  }

  return {
    session,
    user: data,
  };
}

export default function AuthProvider({
  children
}: {
  readonly children: React.ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthSessionContext["authStatus"]>("loading");

  useEffect(() => {
    async function loadSession() {
      const { session, user } = await getSession();
      setUser(user);
      setSession(session);
      setAuthStatus(session ? "authenticated" : "unauthenticated");
    }

    loadSession();
  }, [
    setSession,
  ]);

  const value = useMemo(() => ({
    session,
    data: user,
    authStatus: authStatus,
  }), [session, user, authStatus]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}