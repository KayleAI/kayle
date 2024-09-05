import assert from "node:assert";
import * as cheerio from "cheerio";
import { Feed } from "feed";

export async function GET(req: Request) {
	const siteUrl =
		process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "https://kayle.ai";

	if (!siteUrl) {
		throw new Error(
			"Missing VERCEL_PROJECT_PRODUCTION_URL environment variable",
		);
	}

	const author = {
		name: "Kayle",
		email: "team@kayle.ai",
	};

	const feed = new Feed({
		title: "Kayle",
		description: "Open-source realtime content moderation.",
		author,
		id: siteUrl,
		link: siteUrl,
		image: `${siteUrl}/favicon.ico`,
		favicon: `${siteUrl}/favicon.ico`,
		copyright: `All rights reserved ${new Date().getFullYear()}`,
		feedLinks: {
			rss2: `${siteUrl}/changelog/feed.xml`,
		},
	});

	const html = await (await fetch(new URL("/", req.url))).text();
	const $ = cheerio.load(html);

	$("article").each(function () {
		const id = $(this).attr("id");
		assert(typeof id === "string");

		const url = `${siteUrl}/#${id}`;
		const heading = $(this).find("h2").first();
		const title = heading.text();
		const date = $(this).find("time").first().attr("datetime");

		// Tidy content
		heading.remove();
		$(this).find("h3 svg").remove();

		const content = $(this).find("[data-mdx-content]").first().html();

		assert(typeof title === "string");
		assert(typeof date === "string");
		assert(typeof content === "string");

		feed.addItem({
			title,
			id: url,
			link: url,
			content,
			author: [author],
			contributor: [author],
			date: new Date(date),
		});
	});

	return new Response(feed.rss2(), {
		status: 200,
		headers: {
			"content-type": "application/xml",
			"cache-control": "s-maxage=31556952",
		},
	});
}
