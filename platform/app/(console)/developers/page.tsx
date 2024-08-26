"use client";

import { Card, CardGroup } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { PageHeading } from "@repo/ui/page-heading";

const options = [
	{
		slug: "keys",
		name: "API Keys",
		description: "Manage your API keys.",
	},
	{
		slug: "integrations",
		name: "Integrations",
		description: "Connect Kayle to external services.",
	},
	{
		slug: "webhooks",
		name: "Webhooks",
		description: "Connect Kayle to your own services.",
		comingSoon: true,
	},
];

export default function DeveloperDashboard() {
	return (
		<>
			<PageHeading title="Developer Dashboard" description="" />
			<CardGroup className="my-8">
				{options.map((option) => (
					<Card
						key={option.slug}
						href={`/developers/${option.slug}`}
						title={option.name}
						description={option.description}
						className="p-4 relative"
					>
						{option.comingSoon && (
							<Badge className="absolute top-1 right-1" color="purple">
								Coming Soon
							</Badge>
						)}
					</Card>
				))}
			</CardGroup>
		</>
	);
}
