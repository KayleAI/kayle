import { Context } from "hono";
import { env } from "hono/adapter";

import { hyperdrive as db } from "./database";
import { observeText } from "./tools/text";
import { createVector, findVector, storeVectorAndMetadata } from "./tools/vectors";
import { moderateText } from "./moderate/text";

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
    GROQ_API_KEY = "",
    GROQ_ENABLED = "false",
  } = env<
    {
      OPENAI_API_KEY: string;
      CF_ACCOUNT_ID: string;
      CF_AI_GATEWAY: string;
      GROQ_API_KEY: string;
      GROQ_ENABLED: string;
    }
  >(c);
  const hyperdrive = await db(c);

  const { data = "", to = "", from = [] } = await c.req.json();

  const { text, skip } = observeText(data);

  if (skip) {
    return c.json(
      {
        error: false,
        type: "text",
        request_id: null,
        severity: null,
        violations: [],
        action: "skip",
        audit: "empty",
        hash: null,
      } satisfies ModerationResponse,
    );
  }

  const { vector, error } = await createVector({
    text,
    apiKey: OPENAI_API_KEY,
  });

  if (error) {
    return c.json(
      {
        error: true,
        type: "text",
        request_id: null,
        severity: null,
        violations: [],
        action: "error",
        audit: "vector",
        hash: null,
      } satisfies ModerationResponse,
    );
  }

  const { severity, violations, found } = await findVector({
    hyperdrive,
    vector,
    threshold: 0.6,
  });

  if (found) {
    return c.json(
      {
        error: false,
        type: "text",
        request_id: null,
        severity: severity ?? 0.0,
        violations: violations ?? [],
        action: null,
        audit: null,
        hash: null,
      } satisfies ModerationResponse,
    );
  }

  const { severity: moderatedSeverity, violations: moderatedViolations, error: moderationError } = await moderateText({
    apiKey: GROQ_ENABLED === "true" ? GROQ_API_KEY : OPENAI_API_KEY,
    endpoint: GROQ_ENABLED === "true"
      ? `https://api.groq.com/openai/v1`
      : `https://gateway.ai.cloudflare.com/v1/${CF_ACCOUNT_ID}/${CF_AI_GATEWAY}/openai`,
    text,
    model: GROQ_ENABLED === "true"
      ? "mixtral-8x7b-32768"
      : "gpt-3.5-turbo-0125",
  });

  if (moderationError) {
    return c.json(
      {
        error: true,
        type: "text",
        request_id: null,
        severity: null,
        violations: [],
        action: null,
        audit: null,
        hash: null,
      } satisfies ModerationResponse,
    );
  }

  await storeVectorAndMetadata({
    hyperdrive,
    vector,
    severity: moderatedSeverity ?? 0.0,
    violations: moderatedViolations ?? [],
    data: text,
    type: "text",
  });

  return c.json(
    {
      error: false,
      type: "text",
      request_id: null,
      severity: moderatedSeverity ?? 0.0,
      violations: moderatedViolations ?? [],
      action: null,
      audit: null,
      hash: null,
    } satisfies ModerationResponse,
  );
}
