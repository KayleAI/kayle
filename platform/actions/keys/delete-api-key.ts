"use server";

import { Unkey } from "@unkey/api";
import { getApiKey } from "./get-api-key";

const unkey = new Unkey({
	rootKey: process.env.UNKEY_AUTH_TOKEN || '',
	cache: "no-store",
});

export async function deleteApiKey(keyId: string, orgId: string) {
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

	const { error: deleteError } = await unkey.keys.delete({
		keyId,
	});

	if (deleteError) {
		return {
			error: "Failed to delete key",
			data: null,
		};
	}

	return {
		error: null,
		data: null,
	};
}
