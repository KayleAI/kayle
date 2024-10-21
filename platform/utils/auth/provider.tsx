"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useSession } from "@repo/auth/client";

type AuthUser = {
	readonly id: string;
	readonly email: string;
	readonly emailVerified: boolean;
	readonly name: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly image?: string;
	readonly role?: string;
};

export interface AuthSessionContext {
	readonly session: any;
	readonly user: AuthUser | null;
	readonly status: "loading" | "authenticated" | "unauthenticated";
}

export const AuthContext = createContext<AuthSessionContext>({
	session: null,
	user: null,
	status: "loading",
});

export function useAuth() {
	return useContext(AuthContext);
}

export default function AuthProvider({
	children,
}: {
	readonly children: React.ReactNode;
}): JSX.Element {
	const session = useSession();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [status, setStatus] = useState<AuthSessionContext["status"]>("loading");

	useEffect(() => {
		const authenticated = session.data?.user
			? "authenticated"
			: "unauthenticated";
		setUser(session.data?.user ?? null);
		setStatus(session.isPending ? "loading" : authenticated);
	}, [session]);

	const value = useMemo(
		() => ({
			session,
			user,
			status,
		}),
		[session, user, status],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
