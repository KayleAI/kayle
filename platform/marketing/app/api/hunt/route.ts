import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const KAYLE_API_KEY = process.env.KAYLE_API_KEY!;

  // make request to the Kayle Engine -> https://engine.kayle.ai
  const response = await fetch("https://engine.kayle.ai/v1/moderate/text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${KAYLE_API_KEY}`,
    },
    body: JSON.stringify({
      type: "text",
      data: text,
      user_id: "kayle-test-user",
    }),
  });

  // parse the response
  const { severity, violations } = await response.json();

  console.log(severity, violations);

  // return the response
  return NextResponse.json({ severity, violations });
}
