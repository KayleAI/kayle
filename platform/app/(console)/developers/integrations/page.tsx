"use client";

import { Card } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { type Integration, integrations } from "@repo/config/integrations";
import { PageHeading } from "@repo/ui/page-heading";

export default function IntegrationsDashboard() {
	return (
		<div>
			<PageHeading
				title="Integrations Dashboard"
				description="Explore our integrations and connect your favorite tools to your workspace."
			/>
			<main className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
				{integrations.map((integration: Integration) => (
					<Card
						key={integration.slug}
						title={integration.name}
						description={integration.description}
						href={`/developers/integrations/${integration.slug}`}
						className="p-4 relative"
					>
						<div className="flex flex-row gap-x-4">
							<div className="size-12 flex flex-col items-center justify-center">
								<integration.icon className="fill-zinc-900 dark:fill-zinc-100 size-10" />
							</div>
						</div>
						{integration?.comingSoon !== undefined &&
							integration.comingSoon && (
								<div className="absolute top-1 right-1">
									<Badge color="purple">Coming soon!</Badge>
								</div>
							)}
					</Card>
				))}
			</main>
		</div>
	);
}
