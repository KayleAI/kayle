"use client";

import { OrgArea } from "@/components/auth/org-area";
import { OrgSelect } from "@/components/auth/org-select";
import { useOrg } from "@/utils/auth/OrgProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeading } from "@repo/ui/page-heading";

export default function Organisation({
	params: { orgId = "_" },
}: {
	readonly params: {
		readonly orgId: string;
	};
}) {
	const orgs = useOrg();
	const router = useRouter();

	useEffect(() => {
		if (orgId !== orgs?.activeOrg?.slug) {
			/**import { newUrl } from "@/utils/url";
      router.push(newUrl({ organisationSlug: orgs?.activeOrg?.slug ?? "", url: "/org/_" }));*/
			router.refresh();
		}
	}, [orgs?.activeOrg, orgId, router]);

	if (orgId === "_") {
		return <OrgSelect url="/org/_" />;
	}

	return (
		<OrgArea authRequired acceptRoles="any">
			<PageHeading title="Organisation" description="" />
		</OrgArea>
	);
}
