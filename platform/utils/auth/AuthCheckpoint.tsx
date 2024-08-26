"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import {
	AuthCheckpointRedirecting,
	AuthCheckpointLoading,
} from "@/components/auth/auth-checkpoint";

export default function AuthCheckpoint({
	children,
	ifAuthenticated,
	ifUnauthenticated,
}: {
	readonly children: React.ReactNode;
	readonly ifAuthenticated?: string;
	readonly ifUnauthenticated?: string;
}) {
	const router = useRouter();
	const { authStatus } = useAuth();

	useEffect(() => {
		if (authStatus === "loading") return;

		if (authStatus === "authenticated") {
			if (ifAuthenticated) router.push(ifAuthenticated);
		}

		if (authStatus === "unauthenticated") {
			if (ifUnauthenticated) router.push(ifUnauthenticated);
		}
	}, [authStatus, ifAuthenticated, ifUnauthenticated, router]);

	if (authStatus === "loading") return <AuthCheckpointLoading />;

	if (authStatus === "authenticated" && ifAuthenticated) {
		return <AuthCheckpointRedirecting />;
	}

	if (authStatus === "unauthenticated" && ifUnauthenticated) {
		return <AuthCheckpointRedirecting />;
	}

	return children;
}
