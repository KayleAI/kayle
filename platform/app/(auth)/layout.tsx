"use client";

import AuthCheckpoint from "@/utils/auth/checkpoint";

export default function AuthLayout({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	return (
		<AuthCheckpoint ifAuthenticated={"/dashboard"}>{children}</AuthCheckpoint>
	);
}
