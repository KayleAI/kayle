import { NextRequest, NextResponse } from "next/server";

import { Unkey } from "@unkey/api";
import { createClient } from "@/lib/supabase/server";

const unkey = new Unkey({ rootKey: process.env.UNKEY_AUTH_TOKEN! });

export async function GET(
  {
    params: {
      keyId,
    },
  }: {
    params: {
      keyId: string;
    };
  },
) {
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

  const user_id = data.user.id;

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

  if (result.ownerId !== user_id) {
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
      "status": "success",
      "key": {
        "name": result.name,
        "hint": result.start,
        "created_at": result.createdAt,
        "enabled": result.enabled,
        "usage": usage.verifications || [],
      },
    },
    {
      status: 200,
    },
  );
}
