"use client";

// UI
import { Button } from "@repo/ui/button";
import { Code } from "@repo/ui/text";
import { toast } from "sonner";

// Auth
import { OrgArea } from "@/components/auth/org-area";
import { useOrg } from "@/utils/auth/OrgProvider";

// Functions
import React, { useState } from "react";
import { useRouter, notFound } from "next/navigation";

// API Keys
import { deleteApiKey } from "@/actions/keys/delete-api-key";
import { updateApiKey } from "@/actions/keys/update-api-key";

export function ManageKey({
	keyId,
	keyData,
	keyUsage,
}: {
	keyId: string;
	keyData: any;
	keyUsage: any;
}) {
	const router = useRouter();
	const orgs = useOrg();

	const [buttonsDisabled, setButtonsDisabled] = useState(false);

	const suspendAPIKey = React.useCallback(() => {
		toast.promise(
			new Promise((resolve, reject) => {
				setButtonsDisabled(true);

				setTimeout(async () => {
					try {
						if (!orgs?.activeOrg?.id)
							throw new Error(
								"Something went wrong. Please try again.",
							);
						if (keyData?.enabled) {
							await updateApiKey({
								keyId,
								orgId: orgs?.activeOrg?.id,
								values: {
									enabled: false,
								},
							});
						} else {
							await updateApiKey({
								keyId,
								orgId: orgs?.activeOrg?.id,
								values: {
									enabled: true,
								},
							});
						}
					} catch {
						setButtonsDisabled(false);
						return reject(
							new Error("Failed to perform action on key."),
						);
					}

					setButtonsDisabled(false);
					router.refresh();
					return resolve(true);
				}, 500);
			}),
			{
				loading: keyData?.enabled
					? "Suspending API Key..."
					: "Activating API Key...",
				success: (_) =>
					`API Key ${keyData?.enabled ? "suspended" : "activated"}.`,
				error: (error) =>
					`Error: ${error.message}`.replace("Error: Error: ", ""),
			},
		);
	}, [orgs, keyData, keyId, router]);

	const deleteAPIKey = React.useCallback(() => {
		toast.promise(
			new Promise((resolve, reject) => {
				setButtonsDisabled(true);

				setTimeout(async () => {
					try {
						if (!orgs?.activeOrg?.id)
							throw new Error(
								"Something went wrong. Please try again.",
							);
						await deleteApiKey(keyId, orgs?.activeOrg?.id);
					} catch {
						setButtonsDisabled(false);
						return reject(new Error("Failed to delete key."));
					}

					setButtonsDisabled(false);
					router.push("/developers/keys");
					return resolve(true);
				}, 500);
			}),
			{
				loading: "Deleting API Key...",
				success: (_) => "API Key deleted.",
				error: (error) =>
					`Error: ${error.message}`.replace("Error: Error: ", ""),
			},
		);
	}, [orgs, keyId, router]);

	if (!keyId) {
		return notFound();
	}

	return (
		<OrgArea authRequired acceptRoles={["Owner", "Admin", "Developer"]}>
			<main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
				<div className="flex flex-row justify-end items-center gap-x-2">
					<Button
						disabled={buttonsDisabled}
						color={keyData?.enabled ? "amber" : "emerald"}
						onClick={suspendAPIKey}
					>
						{keyData?.enabled ? "Suspend API Key" : "Activate API Key"}
					</Button>
					<Button
						disabled={buttonsDisabled}
						color="red"
						onClick={deleteAPIKey}
					>
						Delete API Key
					</Button>
				</div>
				<div>
					<h1 className="text-2xl font-bold">
						{keyData?.name ?? "Unnamed Key"}
					</h1>
					<Code>{keyId}</Code>
				</div>
				<div className="mt-4">
					<h2 className="text-lg font-semibold">Usage Graph</h2>
					{keyUsage?.length === 0 ? (
						<div>No usage data available.</div>
					) : (
						<pre>{JSON.stringify(keyUsage, null, 2)}</pre>
					)}
				</div>
				<pre>{JSON.stringify(keyData, null, 2)}</pre>
			</main>
		</OrgArea>
	);
}
