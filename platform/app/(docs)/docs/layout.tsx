import type { Metadata } from "next";
import glob from "fast-glob";

import { Layout } from "@/components/docs/Layout";
import type { Section } from "@/components/docs/SectionProvider";

export const metadata: Metadata = {
	title: {
		template: "%s - Kayle API Reference",
		default: "Kayle API Reference",
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pages = await glob("**/*.mdx", { cwd: "app/(docs)/docs" });
	const allSectionsEntries = (await Promise.all(
		pages.map(async (filename) => [
			`/docs/${filename.replace(/(^|\/)page\.mdx$/, "")}`.replace(/\/$/, ''),
			(await import(`./${filename}`)).sections,
		]),
	)) as Array<[string, Array<Section>]>;
	const allSections = Object.fromEntries(allSectionsEntries);

	return (
		<div className="w-full">
			<Layout allSections={allSections}>{children}</Layout>
		</div>
	);
}
