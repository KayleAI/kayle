"use client";

import { PageHeading } from "@repo/ui/page-heading";
import ContactPageClient from "./page.client";

export default function ContactPage() {
	return (
		<div>
			<PageHeading
				title="Contact the Kayle team"
				description="Have a question or need help? Send us a message and we’ll get back to you as soon as possible."
			/>
			<ContactPageClient />
		</div>
	);
}
