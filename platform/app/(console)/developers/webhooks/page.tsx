"use client";

import { Card } from "@repo/ui/card";
import { PageHeading } from "@repo/ui/page-heading";

export default function WebhookDashboard() {
	return (
		<>
			<PageHeading
				title="Webhook Dashboard"
				description="Webhooks are coming soon!"
			/>
			<main className="my-8">
				<Card
					title="Webhooks"
					description="Webhooks are coming soon!"
					className="p-4"
				/>
			</main>
		</>
	);
}
