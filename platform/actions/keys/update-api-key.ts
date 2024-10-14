"use server";

import { Unkey } from "@unkey/api";
import { getApiKey } from "./get-api-key";

const rootKey = process.env.UNKEY_AUTH_TOKEN || "";

if (!rootKey) {
	throw new Error(
		"UNKEY_AUTH_TOKEN environment variable is not set or is empty.",
	);
}

const unkey = new Unkey({
	rootKey: rootKey,
	cache: "no-store",
});

export async function updateApiKey({
	keyId,
	orgId,
	values,
}: {
	keyId: string;
	orgId: string;
	values: {
		enabled?: boolean;
	};
}) {
	const { data: keyData, error: keyError } = await getApiKey(keyId, orgId);

	if (keyError) {
		return {
			error: keyError,
			data: null,
		};
	}

	if (!keyData) {
		return {
			error: "Key not found",
			data: null,
		};
	}

	const { error: updateError } = await unkey.keys.update({
		keyId,
		enabled: values.enabled,
	});

	if (updateError) {
		return {
			error: updateError,
			data: null,
		};
	}

	return {
		error: null,
		data: "success",
	};
}
