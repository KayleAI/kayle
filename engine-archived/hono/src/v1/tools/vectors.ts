import { Client } from "pg";

interface OpenAICreateVectorResponse {
  object: string;
  data: {
    object: string;
    embedding: number[];
    index: number;
  }[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export async function createVector({
  text = "",
  apiKey = "",
}: {
  readonly text: string;
  readonly apiKey: string;
}) {
  if (text.trim() === "") {
    return {
      error: {
        code: 400,
        message: "Text is empty",
        hint: "Text cannot be empty and must be provided to generate a vector",
        description: "An empty string cannot be used to create a vector.",
      },
      severity: null,
      violations: null,
    };
  }

  const response = await fetch(`https://api.openai.com/v1/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: [text],
      dimensions: 1024,
    }),
  });

  if (!response.ok) {
    return {
      error: {
        code: 500,
        message: "Internal Server Error",
        hint: "Please try again later",
        description: "An error occurred while creating the vector",
      },
      severity: null,
      violations: null,
    };
  }

  const vectorize = await response.json() as OpenAICreateVectorResponse;

  const vector = vectorize.data[0].embedding;

  return { vector };
}

interface FoundVector {
  readonly type?: string;
  readonly severity?: number;
  readonly violations?: string[];
  readonly similarity?: number;
  readonly found: boolean;
}

export async function findVector({
  hyperdrive,
  vector,
  threshold,
}: {
  readonly hyperdrive: Client;
  readonly vector: number[];
  readonly threshold: number;
}): Promise<FoundVector> {
  const similarVectors = await hyperdrive.query(
    `SELECT type, severity, violations, similarity FROM find_vector_similarity(CAST(ARRAY[${vector}] as vector), ${threshold}, 1);`,
  );
  
  if (similarVectors.rowCount === 0) {
    return { found: false };
  }

  const { type, severity, violations, similarity } = similarVectors.rows[0];

  return {
    found: true,
    type,
    severity,
    violations,
    similarity
  }
}

export async function storeVectorAndMetadata({
  vector,
  severity,
  violations,
  hyperdrive,
  data = "",
  type = "text",
}: {
  readonly vector: number[];
  readonly severity: number;
  readonly violations: string[];
  readonly hyperdrive: Client;
  readonly data: string;
  readonly type: "text";
}) {
  await hyperdrive.query(
    `INSERT INTO moderations (type, data, severity, violations, embeddings) VALUES ($1, $2, $3, $4, CAST(ARRAY[${vector}] AS vector)) ON CONFLICT (type, data) WHERE type = $1 DO UPDATE SET severity = EXCLUDED.severity, violations = EXCLUDED.violations, embeddings = EXCLUDED.embeddings;`,
    [
      type,
      data,
      severity ?? 0.0,
      violations ?? [],
    ],
  );
}
