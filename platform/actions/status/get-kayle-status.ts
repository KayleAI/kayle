"use server";

export async function getKayleStatus(): Promise<
	"okay" | "degraded" | "down" | "pending"
> {
	if (
		!process.env.BETTER_STACK_STATUS_PAGE_ID ||
		!process.env.BETTER_STACK_API_KEY
	) {
		return "pending";
	}

	try {
		const response = await fetch(
			`https://betteruptime.com/api/v2/status-pages/${process.env.BETTER_STACK_STATUS_PAGE_ID}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.BETTER_STACK_API_KEY}`,
				},
			},
		);

		const data = await response.json();

		const state = data?.data?.attributes?.aggregate_state?.toLowerCase() ?? "pending";

		if (state === "operational") {
			return "okay";
		}

		if (state === "downtime") {
			return "down";
		}

		if (state === "degraded") {
			return "degraded";
		}

		return "pending";
	} catch (error) {
		console.error("Error fetching or parsing status:", error);
		return "pending";
	}
}
