"use server";

import { createClient } from "@repo/db/server";

import { Unkey } from "@unkey/api";

const unkey = new Unkey({
	rootKey: process.env.UNKEY_AUTH_TOKEN || '',
	cache: "no-store",
});

export async function createApiKey({
	name,
	orgId,
	testMode,
}: {
	name: string;
	orgId: string;
	testMode: boolean;
}) {
	const supabase = createClient();

	const {
		data: { user },
		error: supaError,
	} = await supabase.auth.getUser();

	if (supaError || !user) {
		return {
			error: "Failed to fetch user data.",
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

	const org = orgs.find((o: any) => o.id === orgId);

	if (!org) {
		return {
			error: "Organisation not found.",
			data: null,
		};
	}

	const created = await unkey.keys.create({
		apiId: process.env.UNKEY_API_ID || '',
		prefix: testMode ? "kk_test" : "kk_live",
		byteLength: 32,
		...(testMode && {
			ratelimit: {
				type: "fast",
				limit: 10,
				refillRate: 1,
				refillInterval: 60000,
			},
		}),
		ownerId: orgId,
		meta: {
			org_id: orgId,
			created_by: user.id,
		},
		enabled: true,
		name: name,
		environment: testMode ? "test" : "live",
	});

	if (!created) {
		return {
			error: "Failed to create key.",
			data: null,
		};
	}

	return {
		error: null,
		data: {
			keys: created.result,
		},
	};
}
