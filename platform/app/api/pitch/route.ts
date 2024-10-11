import { NextResponse } from "next/server";

export async function GET() {
	const [waitlistSignups, githubStars, customers, moderations] =
		await Promise.all([
			getWaitlistSignups(),
			getGithubStars(),
			getCustomers(),
			getModerations(),
		]);

	return NextResponse.json({
		waitlistSignups,
		githubStars,
		customers,
		moderations,
	});
}

/**
 * Gets the number of waitlist signups
 *
 * @returns The number of waitlist signups
 */
async function getWaitlistSignups() {
	return 7;
}

/**
 * Gets the number of stars on the Kayle GitHub repository once every hour
 *
 * @returns The number of stars on the Kayle GitHub repository
 */
async function getGithubStars() {
	const owner = "KayleAI";
	const repo = "kayle";
	const url = `https://api.github.com/repos/${owner}/${repo}`;

	try {
		const response = await fetch(url, {
			next: { revalidate: 3600 },
			headers: {
				Accept: "application/vnd.github.v3+json",
				Authorization: process.env.GITHUB_TOKEN
					? `Bearer ${process.env.GITHUB_TOKEN}`
					: "",
			},
		});

		if (!response.ok) {
			throw new Error(`GitHub API request failed: ${response.statusText}`);
		}

		const data = await response.json();
		return data.stargazers_count;
	} catch (error) {
		console.error("Error fetching GitHub stars:", error);
		return 2;
	}
}

/**
 * Gets the number of customers
 *
 * @returns The number of customers
 */
async function getCustomers() {
	return 1;
}

/**
 * Gets the number of moderations
 *
 * @returns The number of moderations
 */
async function getModerations() {
	return 300;
}
