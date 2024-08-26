import { Card, CardGroup } from "@repo/ui/card";
import { PageHeading } from "@repo/ui/page-heading";

const options = [
	{
		id: "developers",
		href: "/developers",
		name: "Developer Portal",
		description: "Integrate Kayle into your platform.",
	},
];

export default async function Dashboard() {
	return (
		<>
			<PageHeading title="Platform Dashboard" description="" />
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
		</>
	);
}
