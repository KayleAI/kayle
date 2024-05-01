import { Context } from "hono";
import { env } from "hono/adapter";

import { hyperdrive } from "../database";

import OpenAI from "openai";

interface ModerationResponse {
  error: boolean;
  type: string | null;
  request_id: string | null;
  severity: number | null;
  violations: string[];
  action: string | null;
  audit: string | null;
  hash: string | null;
}

export async function textModeration(c: Context) {
  const {
    OPENAI_API_KEY,
    CF_ACCOUNT_ID,
    CF_AI_GATEWAY,
    GROQ_API_KEY,
  } = env<
    {
      OPENAI_API_KEY: string;
      CF_ACCOUNT_ID: string;
      CF_AI_GATEWAY: string;
      GROQ_API_KEY: string;
    }
  >(c);
  const client = await hyperdrive(c);

  const { data = "", to = "", from = [] } = await c.req.json();

  const { vector } = await getVector(
    data,
    CF_ACCOUNT_ID,
    CF_AI_GATEWAY,
    OPENAI_API_KEY,
  );

  const similarVectors = await queryVectors({
    client,
    query: vector,
    threshold: 0.7,
    limit: 1,
  });

  if (similarVectors.rows.length > 0) {
    const firstMatch = similarVectors.rows[0];

    return c.json({
      request_id: null,
      type: firstMatch.type,
      severity: firstMatch.severity,
      violations: firstMatch.violations,
      action: null,
      audit: null,
      hash: null,
    } as ModerationResponse);
  }

  const { error, severity, violations } = await moderateText(
    data,
    GROQ_API_KEY,
  );

  if (error) return errorResponse(c, "Failed to moderate text");

  await client.query(
    `INSERT INTO moderations (type, data, severity, violations, embeddings)
    VALUES ('text', $1, $2, $3, CAST(ARRAY[${vector}] AS vector))
    ON CONFLICT (type, data) WHERE type = 'text'
    DO UPDATE SET
      severity = EXCLUDED.severity,
      violations = EXCLUDED.violations,
      embeddings = EXCLUDED.embeddings;`,
    [
      data,
      severity ?? 0.0,
      violations ?? [],
    ],
  );

  return c.json({
    request_id: "req_...",
    type: "text",
    severity: severity,
    violations: violations,
    action: null,
    audit: null,
    hash: null,
  } as ModerationResponse);
}

async function queryVectors({
  client,
  query,
  threshold,
  limit,
}: {
  client: any;
  query: number[];
  threshold: number;
  limit: number;
}) {
  const similarVectors = await client.query(
    // inputs: vector, threshold, limit
    `SELECT type, severity, violations, similarity FROM find_vector_similarity(CAST(ARRAY[${query}] as vector), ${threshold}, ${limit});`,
  );

  return similarVectors;
}

async function getVector(
  text: string,
  CF_ACCOUNT_ID: string,
  CF_AI_GATEWAY: string,
  OPENAI_API_KEY: string,
) {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL:
      `https://gateway.ai.cloudflare.com/v1/${CF_ACCOUNT_ID}/${CF_AI_GATEWAY}/openai`,
  });

  // vectorize the text
  const vectorize = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: [text],
    dimensions: 1024,
  });

  const vector = vectorize.data[0].embedding;

  return { vector };
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

function errorResponse(c: Context, message: string, status: number = 400) {
  return c.json({
    error: true,
    request_id: null,
    type: null,
    severity: null,
    violations: [],
    action: null,
    audit: null,
    hash: null,
  } as ModerationResponse, {
    status,
  });
}
