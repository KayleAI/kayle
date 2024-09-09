// Types
import type { Metadata } from "next";
import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import type { Twitter } from "next/dist/lib/metadata/types/twitter-types";

// Constants
const url = new URL(`https://${process.env?.VERCEL_PROJECT_PRODUCTION_URL ?? "kayle.ai"}`);

const site = {
	title: "Content moderation made simple.",
	description:
		"An all-in-one, easy-to-use, and affordable content moderation platform built for startups and enterprises.",
	url: url ?? new URL("https://kayle.ai"),
	name: "Kayle",
};

export const rootOpenGraph: OpenGraph = {
	locale: "en",
	type: "website",
	url: site.url.href,
	siteName: site.name,
	title: {
		default: site.title,
		template: "%s - Kayle",
	},
	description: site.description,
};

export const rootTwitter: Twitter = {
	title: {
		default: site.title,
		template: "%s - Kayle",
	},
	description: site.description,
	card: "summary_large_image",
	creator: "@kaylehq",
	site: "@kaylehq",
};

export const rootMetadata: Metadata = {
	metadataBase: site.url,
	title: {
		default: site.title,
		template: "%s - Kayle",
	},
	description: site.description,
	applicationName: site.name,
	openGraph: rootOpenGraph,
	twitter: rootTwitter,
};

export function GenerateSEO({
	title = site.title,
	description = site.description,
	url,
	image,
	siteName = site.name,
	screenshotData = "",
}: {
	title?: string;
	description?: string;
	url?: string;
	image?: string;
	siteName?: string;
	screenshotData?: string;
} = {}): Metadata {
	const metadata = {
		...rootMetadata,
		title: `${title} - Kayle`,
		description,
		alternates: {
			canonical: url,
		},
		icons: [],
		openGraph: {
			...rootOpenGraph,
			url,
			title: `${title} - ${siteName ?? rootOpenGraph.siteName}`,
			description,
		} as OpenGraph,
		twitter: {
			...rootTwitter,
			title: `${title} - ${siteName ?? rootOpenGraph.siteName}`,
			description,
		} as Twitter,
	} as Metadata;

	const screenshot = {
		// add any screenshot data here
		url: `${metadata.metadataBase}seo/marketing${screenshotData}`,
		width: 1200,
		height: 630,
		alt: title,
		type: "image/png",
	};

	if (metadata?.openGraph) {
		metadata.openGraph.images = image ? [image] : [screenshot];
	}

	if (metadata?.twitter) {
		metadata.twitter.images = image ? [image] : [screenshot];
	}

	if (siteName) {
		metadata.applicationName = siteName;
		if (metadata?.openGraph) {
			metadata.openGraph.siteName = siteName;
		}
	}

	return metadata;
}
