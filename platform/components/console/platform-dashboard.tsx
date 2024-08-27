"use client";

import { useOrg } from "@/utils/auth/OrgProvider";
import { Card, CardGroup } from "@repo/ui/card";
import { PageHeading } from "@repo/ui/page-heading";
import { OrgArea } from "../auth/org-area";

const options = [
	{
		id: "policies",
		href: "/policies",
		name: "Manage Policies",
		description: "Create and manage moderation policies for your organisation.",
	},
	{
		id: "moderation",
		href: "/moderation",
		name: "Moderation",
		description:
			"Visit the moderation dashboard to review your users’ content.",
	},
	{
		id: "developers",
		href: "/developers",
		name: "Developer Portal",
		description: "Integrate content moderation into your platform.",
	},
];

export function PlatformDashboard() {
	const orgs = useOrg();

	return (
		<OrgArea acceptRoles="any" authRequired>
			<PageHeading
				title={orgs?.activeOrg?.name}
				description="This is your organisation’s dashboard."
			/>
			<CardGroup className="my-8">
				{options.map((option) => (
					<Card
						key={option.id}
						href={option.href}
						title={option.name}
						description={option.description}
					/>
				))}
			</CardGroup>
		</OrgArea>
	);
}
