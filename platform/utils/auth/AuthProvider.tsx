"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { createClient } from "@/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";

type AuthUser = {
	readonly id: string | null;
	readonly email: string | null;
	readonly name: string | null;
	readonly avatar: string | null;
	readonly role: string | null;
};

export interface AuthSessionContext {
	readonly session: Session | null;
	readonly data: AuthUser | null;
	readonly authStatus: "loading" | "authenticated" | "unauthenticated";
	readonly updateAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthSessionContext>({
	session: null,
	data: null,
	authStatus: "loading",
	updateAuth: () => Promise.resolve(),
});

export function useAuth() {
	return useContext(AuthContext);
}

async function getSession(): Promise<{
	session: Session | null;
	user: AuthUser | null;
}> {
	const supabase = createClient();

	const {
		data: { session },
		error: sessionError,
	} = await supabase.auth.getSession();

	if (sessionError || !session) {
		return {
			session: null,
			user: null,
		};
	}

	const { data, error } = await supabase
		.from("user_details")
		.select("id, email, name, avatar, users(role)")
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
		user: {
			id: data?.id,
			email: data?.email,
			name: data?.name,
			avatar: data?.avatar,
			role: data?.users?.[0]?.role,
		},
	};
}

export default function AuthProvider({
	children,
}: {
	readonly children: React.ReactNode;
}): JSX.Element {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [authStatus, setAuthStatus] =
		useState<AuthSessionContext["authStatus"]>("loading");

	const updateAuth = useCallback(async () => {
		const { session, user } = await getSession();
		setUser(user);
		setSession(session);
		setAuthStatus(session ? "authenticated" : "unauthenticated");
	}, []);

	useEffect(() => {
		updateAuth();
	}, [updateAuth]);

	const value = useMemo(
		() => ({
			session,
			data: user,
			authStatus,
			updateAuth,
		}),
		[session, user, authStatus, updateAuth],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
