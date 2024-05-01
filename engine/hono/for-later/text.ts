/**
 * This file uses Cloudflare Vectorize
 * 
 * Since Vectorize is NOT Generally Available at time of creation
 * we've opted to use the current, Supabase, equivalent
 * and all code has been commented out
 * 
 * note: the code is not fully functional.
 *


import { Context } from "hono";
import { env } from "hono/adapter";

import { drizzle } from "drizzle-orm/d1";

interface ModerationResponse {
  type: string;
  request_id: string | null;
  severity: number;
  violations: string[];
  action: string | null;
  audit: string | null;
  hash: string;
}

function genericBadRequest(c: Context) {
  return c.json(
    {
      type: "text",
      request_id: "req_...",
      severity: 0.0,
      violations: [],
      action: null,
      audit: null,
      hash: "hash_...",
    } as ModerationResponse,
    { status: 400 },
  );
}

export async function textModeration(c: Context) {
  const { data = "", to = "", from = [] } = await c.req.json();
  const {
    CF_ACCOUNT_ID,
    CF_AI_GATEWAY,
    CF_AI_SECRET_TOKEN,
    GROQ_API_KEY,
    KAYLE_DB,
  } = env<
    {
      CF_ACCOUNT_ID: string;
      CF_AI_GATEWAY: string;
      CF_AI_SECRET_TOKEN: string;
      GROQ_API_KEY: string;
      KAYLE_DB: D1Database;
    }
  >(c);

  const { vector } = await getVector(
    data,
    CF_ACCOUNT_ID,
    CF_AI_GATEWAY,
    CF_AI_SECRET_TOKEN,
  );

  if (vector.length === 0) return genericBadRequest(c);

  const { data: matches, error: vectorQueryError } = await queryVectors({
    query: vector,
    CF_AI_SECRET_TOKEN,
    CF_ACCOUNT_ID,
    limit: 1,
    threshold: 0.9,
  });

  if (vectorQueryError) {
    console.log(vector)
    console.error(`Error querying vectors: ${vectorQueryError}`);
    return c.json({
      vector: vector,
    })
  }

  if (matches.length > 0) {
    // get moderation by vector id
    const { error, data } = await findModerationByVectorId(
      matches[0].id,
      KAYLE_DB,
    );

    return genericBadRequest(c); // temp
  }

  // otherwise, moderate the text

  const { severity, violations } = await moderateText(data, GROQ_API_KEY);

  // save to database
  await saveModerationToDatabase(
    { severity, violations, vector, text: data },
    KAYLE_DB,
  );

  return c.json({
    request_id: "req_...",
    type: "text",
    severity: severity,
    violations: violations,
    action: null,
    audit: null,
    hash: "hash_2...",
  } as ModerationResponse);
}

async function getVector(
  text: string,
  CF_ACCOUNT_ID: string,
  CF_AI_GATEWAY: string,
  CF_AI_SECRET_TOKEN: string,
) {
  const vectorResponse = await fetch(
    `https://gateway.ai.cloudflare.com/v1/${CF_ACCOUNT_ID}/${CF_AI_GATEWAY}/workers-ai/@cf/baai/bge-large-en-v1.5`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CF_AI_SECRET_TOKEN}`,
      },
      body: JSON.stringify({
        text: text,
      }),
    },
  );

  if (!vectorResponse.ok) {
    console.error(`Failed to vectorize text: ${text}`);
    return { vector: [] };
  }

  const vectorize: any = await vectorResponse.json();

  const vector = vectorize.result.data[0];

  return { vector };
}

interface QueryVectorsParams {
  query: number[];
  CF_AI_SECRET_TOKEN: string;
  CF_ACCOUNT_ID: string;
  limit?: number;
  threshold?: number;
}

interface VectorMatch {
  id: string;
  metadata: object;
  score: number;
}

interface QueryVectorsResponse {
  error: string | null;
  data: VectorMatch[];
}

interface CloudflareVectorMatch {
  id: string;
  metadata: object;
  score: number;
  values: number[];
}

interface CloudflareVectorQueryResponse {
  error: Array<any> | null;
  messages: Array<any> | null;
  result: {
    count: number;
    matches: Array<CloudflareVectorMatch>;
  };
  success: boolean;
}

async function queryVectors({
  query,
  CF_AI_SECRET_TOKEN,
  CF_ACCOUNT_ID,
  limit = 1,
  threshold = 0.9,
}: QueryVectorsParams): Promise<QueryVectorsResponse> {
  try {
    const vectorQueryResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/vectorize/indexes/kayle/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${CF_AI_SECRET_TOKEN}`,
        },
        body: JSON.stringify({
          vector: query,
          returnMetadata: true,
          topK: limit,
        }),
      },
    );

    if (!vectorQueryResponse.ok) {
      const errorText = await vectorQueryResponse.text();
      throw new Error(`Failed to query vectors: ${errorText}`);
    }

    const vectorQuery = await vectorQueryResponse
      .json() as CloudflareVectorQueryResponse;

    if (vectorQuery.result.count === 0) {
      return {
        error: null,
        data: [],
      };
    }

    const matches: VectorMatch[] = vectorQuery.result.matches
      .filter((match: any) => match.score >= threshold)
      .map(({ id, metadata, score }: any) => ({
        id,
        metadata,
        score,
      }));

    return {
      error: null,
      data: matches,
    };
  } catch (error: any) {
    console.error(`Error querying vectors: ${error}`);
    return {
      error: error.message || "An unknown error occurred",
      data: [],
    };
  }
}

async function findModerationByVectorId(vectorId: string, db: D1Database) {
  const client = drizzle(db);

  return {
    error: false,
    data: [],
  };
}

async function moderateText(text: string, GROQ_API_KEY: string) {
  const response = await fetch(
    `https://api.groq.com/openai/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        "model": "mixtral-8x7b-32768",
        "messages": [
          {
            "role": "user",
            "content": `You are a moderator for Kayle.
        
            Your role is to moderate the following text, determine it's severity, and provide a list of violations.

            Available violations:

            - Toxicity (toxic)
            - Hate Speech (hate-speech)
            - Violence (violence)
            - Spam (spam)
            - PII (pii)
            - CSAM (csam)
            - NSFW (nsfw)
            - Threat (threat)
            - Misinformation (misinformation)
            - Suicide (suicide)
            - Self Harm (self-harm)

            Respond in this format without including any additional feedback.

            10.0 - ['hate-speech', 'threat']

            Example 1:

            Input: "fuck you"

            Output: "9.0 - ['toxic', 'threat']"

            Example 2:

            Input: "have a nice day!"

            Output: "0.0 - []"

            Now moderate this:

            """
            ${text}
            """`,
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    console.error("error");
    return {
      error: true,
      severity: null,
      violations: null,
    };
  }

  const result: any = await response.json();

  const responseString = result.choices[0].message.content.trim();
  const firstLine = responseString.split("\n")[0];
  const textBeforeFinalBracket = firstLine.split("]")[0] + "]";
  const [severity, violations] = textBeforeFinalBracket.split(" - ");

  const severityFloat = parseFloat(severity);
  if (isNaN(severityFloat)) {
    console.error(`Invalid severity: ${severity}. Text: ${text}`);
  }
  const violationsArray = JSON.parse(violations.replace(/'/g, '"'));

  return {
    error: false,
    severity: severityFloat,
    violations: violationsArray,
  };
}

async function saveModerationToDatabase(data: any, db: D1Database) {
  const client = drizzle(db);

  return {
    success: true,
  };
}
*/