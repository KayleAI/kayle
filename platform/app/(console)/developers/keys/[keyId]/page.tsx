"use client";

import { Button } from "@repo/ui/button";
import { Code } from "@repo/ui/text";
import { useRouter, notFound } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { OrgArea } from "@/components/auth/org-area";
import { useOrg } from "@/utils/auth/OrgProvider";
import { toast } from "sonner";
import { getApiKey } from "@/actions/keys/get-api-key";
import { deleteApiKey } from "@/actions/keys/delete-api-key";
import { updateApiKey } from "@/actions/keys/update-api-key";
import { getApiUsage } from "@/actions/keys/get-api-usage";

export default function SpecificKey({
	params: { keyId = null },
}: {
	readonly params: {
		keyId: string | null;
	};
}) {
	const router = useRouter();
	const orgs = useOrg();

	const [buttonsDisabled, setButtonsDisabled] = useState(false);

	const [loading, setLoading] = useState(true);
	const [keyData, setKeyData] = useState(null as any);
	const [usageData, setUsageData] = useState(null as any);

	const getKey = useCallback(async () => {
		if (!keyId) return;
		if (!orgs?.activeOrg?.id) return;

		const { data: key, error } = await getApiKey(keyId, orgs?.activeOrg?.id);
		const { data: usage, error: usageError } = await getApiUsage({
			orgId: orgs?.activeOrg?.id,
			keyId,
			type: "key",
		});

		if (error) {
			console.error(error);
			return;
		}

		if (usageError) {
			console.error(usageError);
			return;
		}

		setKeyData(key || null);
		setUsageData(usage || null);
		setLoading(false);
	}, [keyId, orgs?.activeOrg?.id]);

	useEffect(() => {
		if (keyId !== null && orgs?.activeOrg?.id !== undefined) {
			getKey();
		}
	}, [keyId, orgs?.activeOrg?.id, getKey]);

	if (!keyId) {
		return notFound();
	}

	return (
		<OrgArea
			authRequired
			acceptRoles={["Owner", "Admin", "Developer"]}
			loading={loading}
		>
			<main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
				<div className="flex flex-row justify-end items-center gap-x-2">
					<Button
						disabled={buttonsDisabled}
						color={keyData?.enabled ? "amber" : "emerald"}
						onClick={async () => {
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

										await getKey();
										setButtonsDisabled(false);
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
						}}
					>
						{keyData?.enabled ? "Suspend API Key" : "Activate API Key"}
					</Button>
					<Button
						disabled={buttonsDisabled}
						color="red"
						onClick={async () => {
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

										await getKey();
										setButtonsDisabled(false);
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
							router.push("/developers/keys");
						}}
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
					{usageData?.length === 0 ? (
						<div>No usage data available.</div>
					) : (
						<pre>{JSON.stringify(usageData, null, 2)}</pre>
					)}
				</div>
				<pre>{JSON.stringify(keyData, null, 2)}</pre>
			</main>
		</OrgArea>
	);
}
