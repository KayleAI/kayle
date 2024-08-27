"use server";

import { createClient } from "@repo/db/server";
import { Unkey, verifyKey } from "@unkey/api";

const unkey = new Unkey({
	rootKey: process.env.UNKEY_AUTH_TOKEN!,
	cache: "no-store",
});

export async function listAllKeys(orgId: string) {
	const supabase = createClient();

	if (!orgId) {
		return {
			error: "Missing organisation ID",
			data: null,
		};
	}

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
			error: "Not authenticated.",
			data: null,
		};
	}

	const { data: orgs, error: orgError } = await supabase
		.from("organisations")
		.select("*");

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

	const keys = await unkey.apis.listKeys({
		apiId: process.env.UNKEY_API_ID!,
		ownerId: orgId,
	});

	return {
		error: null,
		data: keys?.result?.keys,
	};
}
