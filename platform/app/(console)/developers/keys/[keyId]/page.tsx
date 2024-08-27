// API Keys
import { getApiKey } from "@/actions/keys/get-api-key";
import { getApiUsage } from "@/actions/keys/get-api-usage";

// Components
import { ManageKey } from "@/components/console/keys/manage/main";
import { ManageKeyLoading } from "@/components/console/keys/manage/loading";

// Functions
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function SpecificKey({
	params: { keyId = null },
	searchParams: { orgId },
}: {
	readonly params: {
		keyId: string | null;
	};
	readonly searchParams: {
		orgId: string;
	};
}) {
	if (!keyId || !orgId) {
		return notFound();
	}

	const { data: keyData, error: keyError } = await getApiKey(keyId, orgId);
	const { data: usageData, error: usageError } = await getApiUsage({
		orgId,
		keyId,
		type: "key",
	});

	if (keyError || usageError) {
		console.error(`[ERROR]: ${keyError}, ${usageError}`);
		return notFound();
	}

	return (
		<Suspense fallback={<ManageKeyLoading />}>
			<ManageKey keyId={keyId} keyData={keyData} keyUsage={usageData} />
		</Suspense>
	);
}
