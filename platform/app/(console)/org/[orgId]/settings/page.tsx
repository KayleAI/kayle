"use client";

import { OrgArea } from "@/components/auth/org-area";
import { OrgSelect } from "@/components/auth/org-select";
import { useOrg } from "@/utils/auth/OrgProvider";

export default function OrganisationSettings({
	params: { orgId },
}: {
	readonly params: {
		readonly orgId: string;
	};
}) {
	const orgs = useOrg();

	if (orgId === "_") {
		return <OrgSelect url="/org/_/settings" />;
	}

	return (
		<OrgArea
			authRequired
			acceptRoles={["Owner", "Admin"]}
			loading={orgs?.status === "pending"}
		>
			<main />
		</OrgArea>
	);
}
