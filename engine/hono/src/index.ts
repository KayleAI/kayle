import { Hono } from "hono";

// Engine Imports
import v1 from "./v1/index";

const app = new Hono({ strict: false });

// Routes
app.route("/v1", v1);

// Default Route
app.get("/", (c) => {
  return c.json({
    message:
      "You’ve stumbled across the Kayle Engine! Check out the docs at https://docs.kayle.ai/",
  });
});

export default app;
