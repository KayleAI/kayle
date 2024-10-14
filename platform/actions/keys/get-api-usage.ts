"use server";

import { createClient } from "@repo/db/server";
import { unkey } from "@/utils/unkey";

export async function getApiUsage({
	orgId,
	keyId,
	type = "key",
}: {
	orgId: string;
	keyId: string;
	type: "key" | "org";
}) {
	const supabase = createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) {
		return {
			error: "Failed to fetch user data.",
			data: null,
		};
	}

	if (!user) {
		return {
			error: "User not found",
			data: null,
		};
	}

	const { data: orgs, error: orgError } = await supabase
		.from("organisations")
		.select("id");

	if (orgError || !orgs) {
		return {
			error: "Failed to fetch organisations.",
			data: null,
		};
	}

	const org = orgs.find((org) => org.id === orgId);

	if (!org) {
		return {
			error: "Organisation not found.",
			data: null,
		};
	}

	const { result, error: unkeyError } = await unkey.keys.getVerifications({
		...(type === "key" ? { keyId } : { ownerId: org.id }),
	});

	if (unkeyError) {
		return {
			error: "Failed to fetch key usage",
			data: null,
		};
	}

	return {
		error: null,
		data: result?.verifications,
	};
}
