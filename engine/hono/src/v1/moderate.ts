import { Hono } from "hono";

const moderate = new Hono().basePath("/");

moderate.get("/", (c) => {
  return c.json({
    message: "Kayle Moderation Endpoint.",
  });
});

export default moderate as never;
