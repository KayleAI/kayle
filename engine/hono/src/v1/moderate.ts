import { Hono } from "hono";
import { textModeration } from "./moderation/text";

const moderate = new Hono().basePath("/");

moderate.post("/", async (c) => {
  const { type = "text" } = await c.req.json();

  switch (type) {
    case "text":
      return await textModeration(c);
    case "audio":
      return c.json({
        message: "Audio moderation is not yet supported.",
        hint: "Please refer to the documentation for more information.",
        docs: "https://docs.kayle.ai",
      });
    default:
      return c.json({
        message: "This type of moderation is not yet supported.",
        hint: "Please refer to the documentation for more information.",
        docs: "https://docs.kayle.ai",
      });
  }
});

moderate.post("/text", async (c) => {
  return await textModeration(c);
});

export default moderate as never;
