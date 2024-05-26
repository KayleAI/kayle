"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";

export const AuthContext = createContext<Session | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

async function getSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export default function AuthProvider({
  children
}: {
  readonly children: React.ReactNode;
}): JSX.Element {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function loadSession() {
      const session = await getSession();
      setSession(session);
    }

    loadSession();
  }, [
    setSession,
  ]);

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
}