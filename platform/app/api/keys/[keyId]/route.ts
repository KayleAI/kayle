import { type NextRequest, NextResponse } from "next/server";

import { Unkey } from "@unkey/api";
import { createClient } from "@repo/db/server";

const unkey = new Unkey({ rootKey: process.env.UNKEY_AUTH_TOKEN! });

export async function GET(
	req: NextRequest,
	{
		params: { keyId },
	}: {
		params: {
			keyId: string;
		};
	},
) {
	const supabase = createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	const org_id = req.nextUrl.searchParams.get("org_id") ?? null;

	if (error) {
		return NextResponse.json(
			{
				status: "error",
				message: "Failed to fetch API keys",
				keys: null,
			},
			{
				status: 500,
			},
		);
	}

	if (!user) {
		return NextResponse.json(
			{
				status: "error",
				message: "User not found",
				keys: null,
			},
			{
				status: 404,
			},
		);
	}

	const response = await fetch(
		`https://api.unkey.dev/v1/keys.getKey?keyId=${keyId}`,
		{
			method: "GET",
			headers: { Authorization: `Bearer ${process.env.UNKEY_AUTH_TOKEN!}` },
		},
	);

	const result = await response.json();

	if (result.error) {
		return NextResponse.json(
			{
				status: "error",
				message: result.error.message,
			},
			{
				status: 500,
			},
		);
	}

	const { data: orgs, error: orgError } = await supabase
		.from("organisations")
		.select("*");

	if (orgError || !orgs) {
		return NextResponse.json(
			{
				status: "error",
				message: "Failed to fetch organisations.",
				keys: null,
			},
			{
				status: 500,
			},
		);
	}

	const org = orgs.find((o: any) => o.id === org_id);

	if (!org) {
		return NextResponse.json(
			{
				status: "error",
				message: "Organisation not found.",
				keys: null,
			},
			{
				status: 404,
			},
		);
	}

	if (result.ownerId !== org_id) {
		return NextResponse.json(
			{
				status: "error",
				message: "Unauthorized",
			},
			{
				status: 401,
			},
		);
	}

	// start time is 28 days ago in UNIX ms time
	const startTime = new Date().getTime() - 2419200000;

	const usageNumbers = await fetch(
		`https://api.unkey.dev/v1/keys.getVerifications?keyId=${keyId}&start=${startTime}&granularity=day`,
		{
			method: "GET",
			headers: { Authorization: `Bearer ${process.env.UNKEY_AUTH_TOKEN!}` },
		},
	);

	const usage = await usageNumbers.json();

	if (usage.error) {
		return NextResponse.json(
			{
				status: "error",
				message: usage.error.message,
			},
			{
				status: 500,
			},
		);
	}

	return NextResponse.json(
		{
			status: "success",
			key: {
				name: result.name,
				hint: result.start,
				created_at: result.createdAt,
				enabled: result.enabled,
				usage: usage.verifications || [],
			},
		},
		{
			status: 200,
		},
	);
}

export async function POST(
	req: NextRequest,
	{
		params: { keyId },
	}: {
		params: {
			keyId: string;
		};
	},
) {
	const { action } = await req.json();

	const supabase = createClient();

	const { data, error } = await supabase.auth.getUser();

	if (error) {
		return NextResponse.json(
			{
				status: "error",
				message: "Failed to fetch API keys",
				keys: null,
			},
			{
				status: 500,
			},
		);
	}

	if (!data) {
		return NextResponse.json(
			{
				status: "error",
				message: "User not found",
				keys: null,
			},
			{
				status: 404,
			},
		);
	}

	const response = await fetch(
		`https://api.unkey.dev/v1/keys.getKey?keyId=${keyId}`,
		{
			method: "GET",
			headers: { Authorization: `Bearer ${process.env.UNKEY_AUTH_TOKEN!}` },
		},
	);

	const result = await response.json();

	if (result.error) {
		return NextResponse.json(
			{
				status: "error",
				message: result.error.message,
			},
			{
				status: 500,
			},
		);
	}

	if (result.ownerId !== data.user.id) {
		return NextResponse.json(
			{
				status: "error",
				message: "Unauthorized",
			},
			{
				status: 401,
			},
		);
	}

	switch (action) {
		case "activate":
			await unkey.keys.update({ keyId: keyId, enabled: true });
			break;
		case "suspend":
			await unkey.keys.update({ keyId: keyId, enabled: false });
			break;
		case "revoke":
			await unkey.keys.delete({ keyId: keyId });
			break;
		default:
			return NextResponse.json(
				{
					status: "error",
					message: "Invalid action",
				},
				{
					status: 400,
				},
			);
	}

	return NextResponse.json(
		{
			status: "success",
			message: "Key change successful",
			key: action,
		},
		{
			status: 200,
		},
	);
}
