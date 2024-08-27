// API Keys
import { listAllKeys } from "@/actions/keys/list-all-keys";

// Components
import { ListKeys } from "@/components/console/keys/list/main";
import { ListKeysLoading } from "@/components/console/keys/list/loading";

// Functions
import { Suspense } from "react";
import { OrgSelect } from "@/components/auth/org-select";

export default async function DisplayUserKeys({
	searchParams: { orgId },
}: {
	readonly searchParams: {
		orgId: string;
	};
}) {
	if (!orgId || orgId === "_") {
		return <OrgSelect url="/developers/keys?orgId=_" type="id" />;
	}

	const { data: keys, error: keysError } = await listAllKeys(orgId);

	if (keysError) {
		return <div>Error: {keysError}</div>;
	}

	return (
		<Suspense fallback={<ListKeysLoading />}>
			<ListKeys keys={keys} loading={false} orgId={orgId} />
		</Suspense>
	);
}
