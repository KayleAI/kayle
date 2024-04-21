import { Context } from "hono";
import { env } from "hono/adapter";

import { hyperdrive } from "../database";

import OpenAI from "openai";

interface ModerationResponse {
  type: string;
  request_id: string | null;
  severity: number;
  violations: string[];
  action: string | null;
  audit: string | null;
  hash: string;
}

export async function moderateText(c: Context) {
  const {
    OPENAI_API_KEY,
    CF_ACCOUNT_ID,
    CF_AI_GATEWAY,
    //CF_AI_SECRET_TOKEN,
    GROQ_API_KEY,
  } = env<
    {
      OPENAI_API_KEY: string;
      CF_ACCOUNT_ID: string;
      CF_AI_GATEWAY: string;
      //CF_AI_SECRET_TOKEN: string;
      GROQ_API_KEY: string;
    }
  >(c);
  const client = await hyperdrive(c);

  const { data = "", parties = "" } = await c.req.json();
  // NOTE: parties can either be a string or an array of strings

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL:
      `https://gateway.ai.cloudflare.com/v1/${CF_ACCOUNT_ID}/${CF_AI_GATEWAY}/openai`,
  });

  // vectorize the text
  const vectorize = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: [data],
  });

  const vector = vectorize.data[0].embedding;

  const similarVectors = await client.query(
    // inputs: vector, threshold, limit
    `SELECT type, severity, violations, hash, similarity FROM find_vector_similarity(CAST(ARRAY[${vector}] as vector), 0.95, 1);`,
  );

  if (similarVectors.rows.length > 0) {
    // return the result for the first match
    const firstMatch = similarVectors.rows[0];

    return c.json({
      request_id: null,
      type: firstMatch.type,
      severity: firstMatch.severity,
      violations: firstMatch.violations,
      action: null,
      audit: null,
      hash: firstMatch.hash,
    } as ModerationResponse);
  }

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
            ${data}
            """`,
          },
        ],
      }),
    },
  );

  const result = await response.json() as any;

  console.log(result);

  const responseString = result.choices[0].message.content.trim();
  const firstLine = responseString.split("\n")[0];
  const textBeforeFinalBracket = firstLine.split("]")[0] + "]";
  const [severity, violations] = textBeforeFinalBracket.split(" - ");

  const severityFloat = parseFloat(severity);
  if (isNaN(severityFloat)) {
    console.error(`Invalid severity: ${severity}. Text: ${data}`);
  }
  const violationsArray = JSON.parse(violations.replace(/'/g, '"'));

  await client.query(
    `INSERT INTO moderations (type, data, severity, violations, hash, embeddings)
    VALUES ('text', $1, $2, $3, $4, CAST(ARRAY[${vector}] AS vector))
    ON CONFLICT (type, data) WHERE type = 'text'
    DO UPDATE SET
      severity = EXCLUDED.severity,
      violations = EXCLUDED.violations,
      hash = EXCLUDED.hash,
      embeddings = EXCLUDED.embeddings;    
  `,
    [
      data,
      severityFloat || 0.0,
      violationsArray || [],
      "hash_...",
    ],
  );

  return c.json({
    request_id: "req_...",
    type: "text",
    severity: severityFloat,
    violations: violationsArray,
    action: null,
    audit: null,
    hash: "hash_...",
  } as ModerationResponse);
}
