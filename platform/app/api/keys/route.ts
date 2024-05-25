export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

import { Unkey, verifyKey } from "@unkey/api";

const unkey = new Unkey({ rootKey: process.env.UNKEY_AUTH_TOKEN! });

export async function GET() {
  // GET the API keys associated with the current user
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

  const keys = await unkey.apis.listKeys({
    apiId: process.env.UNKEY_API_ID!,
    ownerId: user_id,
  });

  return NextResponse.json(
    {
      status: "success",
      message: "API keys fetched",
      keys: keys?.result?.keys || [],
    },
    {
      status: 200,
    },
  );
}

export async function DELETE(req: NextRequest) {
  const { api_key } = await req.json();
  const supabase = createClient();

  const { data, error: supaError } = await supabase.auth.getUser();

  if (supaError || !data) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch user data.",
        keys: null,
      },
      {
        status: 500,
      },
    );
  }

  const { result, error: unkeyError } = await verifyKey({
    key: api_key,
    apiId: process.env.UNKEY_API_ID!,
  });

  if (unkeyError || !result?.valid) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to validate key.",
        keys: null,
      },
      {
        status: 400,
      },
    );
  }

  if (result.ownerId !== data.user.id) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized",
        keys: null,
      },
      {
        status: 403,
      },
    );
  }

  const { error: deleteError } = await unkey.keys.delete({
    keyId: api_key,
  });

  if (deleteError) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete key",
        keys: null,
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(
    {
      status: "success",
      message: "Key deleted",
      keys: null,
    },
    {
      status: 200,
    },
  );
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { test_mode, key_name } = await req.json();

  const { data, error: supaError } = await supabase.auth.getUser();

  if (supaError || !data) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch user data.",
        keys: null,
      },
      {
        status: 500,
      },
    );
  }

  const created = await unkey.keys.create({
    apiId: process.env.UNKEY_API_ID!,
    prefix: test_mode ? "kk_test" : "kk_live",
    byteLength: 20,
    ...test_mode && {
      ratelimit: {
        type: "fast",
        limit: 10,
        refillRate: 1,
        refillInterval: 60000,
      },
    },
    ownerId: data.user.id,
    enabled: true,
    name: key_name,
    environment: test_mode ? "test" : "live",
  });

  if (!created) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create key",
        keys: null,
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(
    {
      status: "success",
      message: "Key created",
      keys: created.result,
    },
    {
      status: 200,
    },
  );
}
