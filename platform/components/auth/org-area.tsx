"use client";

import { useAuth } from "@/utils/auth/AuthProvider";
import { useOrg } from "@/utils/auth/OrgProvider";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

const possibleRoles = ["Owner", "Admin", "Moderator", "Developer", "Guest"];

type PossibleRole = (typeof possibleRoles)[number];

export function OrgArea({
	authRequired = false,
	acceptRoles = [],
	loading = false,
	children,
}: {
	readonly authRequired?: boolean;
	readonly acceptRoles?: PossibleRole[] | "any";
	readonly loading?: boolean;
	readonly children: React.ReactNode;
}): React.ReactNode {
	const user = useAuth();
	const orgs = useOrg();

	if (user?.authStatus === "loading" || orgs?.status === "pending") {
		return (
			<AuthAreaContainer>
				<Heading level={3} className="tracking-tighter">
					Loading...
				</Heading>
				<Text>
					Please wait while we check your organisation authentication status.
				</Text>
				<div className="mt-4 flex flex-col sm:flex-row gap-x-4">
					<Button plain disabled>
						Verifying...
					</Button>
				</div>
			</AuthAreaContainer>
		);
	}

	if (authRequired && user?.authStatus === "unauthenticated") {
		return (
			<AuthAreaContainer>
				<Heading level={3} className="tracking-tighter">
					Authentication Required
				</Heading>
				<Text>You need to be logged in to access this page.</Text>
				<div className="mt-4 flex flex-col sm:flex-row gap-x-4">
					<Button href="/sign-in">Sign in to continue</Button>
				</div>
			</AuthAreaContainer>
		);
	}

	if (acceptRoles !== "any" && acceptRoles.length > 0) {
		if (!acceptRoles.includes(orgs?.activeOrg?.role as PossibleRole)) {
			return (
				<AuthAreaContainer>
					<Heading level={3} className="tracking-tighter">
						Access Denied
					</Heading>
					<Text>Contact your organisation administrator for access.</Text>
					<div className="mt-4 flex flex-col sm:flex-row gap-x-4">
						<Button plain disabled>
							Access Denied
						</Button>
					</div>
				</AuthAreaContainer>
			);
		}
	}

	if (loading) {
		return (
			<AuthAreaContainer>
				<Heading level={3} className="tracking-tighter">
					Please wait while we load your data
				</Heading>
				<Text>Loading your organisation data.</Text>
				<div className="mt-4 flex flex-col sm:flex-row gap-x-4">
					<Button plain disabled>
						Loading...
					</Button>
				</div>
			</AuthAreaContainer>
		);
	}

	return children;
}

function AuthAreaContainer({
	children,
}: {
	readonly children: React.ReactNode;
}): React.ReactNode {
	return (
		<div
			className="h-64 w-full bg-repeat flex flex-col sm:justify-center items-center bg-zinc-100 dark:bg-zinc-800 px-4 py-6 border border-zinc-200 dark:border-zinc-700 rounded-lg gap-4"
			style={{
				backgroundImage: "url(/dots.svg)",
			}}
		>
			{children}
		</div>
	);
}
