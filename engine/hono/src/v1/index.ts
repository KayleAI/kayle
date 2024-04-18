import { Hono } from "hono";
import { unkey, type UnkeyContext } from "@unkey/hono";
import moderate from "./moderate";

const v1 = new Hono<{ Variables: { unkey: UnkeyContext } }>({ strict: false });

// Middleware
v1.use(
  "/*",
  unkey({
    apiId: "api_Q3Er9nRPV3Hf9g52ytcMQkSgi4P",
    getKey: (c) => {
      const key = c.req.header("x-api-key");
      if (!key) {
        return c.json({
          error: "Unauthorized",
          message:
            "No API Key provided. Check out the docs at https://docs.kayle.ai/",
          hint: "Provide an API Key in the `x-api-key` header.",
        }, 401);
      }
      return key;
    },
  }),
);

v1.route("/moderate", moderate);

v1.get("/", (c) => {
  return c.json({
    message:
      "Excellent! Since you’re seeing this, you’ve successfully authenticated with the Kayle Engine!",
  });
});

export default v1 as never;
