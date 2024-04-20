import { Hono, Context } from "hono";
import { hyperdrive } from "./database";
import { upgradeWebSocket } from "hono/cloudflare-workers";

const live = new Hono().basePath("/");

live.get(
  "/connect",
  upgradeWebSocket(async (c: Context) => {
    const client = await hyperdrive(c);
    return {
      onMessage(event, ws) {
        liveModerationHandler(event.data, ws, client);
      },
      onClose: () => {
        console.log("Connection closed");
      },
    };
  }),
);

interface EventData {
  type: string;
  data: string; // could also be a Base64 encoded string containing image/audio/video data (since it is being streamed, it could also be partial data)
  parties?: string[]; // optional list of parties involved in the event
}

function liveModerationHandler(event: any, ws: any, client: any) {
  if (
    typeof event === "string" && event.startsWith("{") && event.endsWith("}")
  ) {
    const data: EventData = JSON.parse(event);
    switch (data.type) {
      case "text":
        const textModerationResult = moderateText(data.data, client);
        ws.send(JSON.stringify(textModerationResult));
        break;
      case "image":
        ws.send("Unsupported");
        break;
      case "audio":
        ws.send("Unsupported");
        break;
      case "video":
        ws.send("Unsupported");
        break;
      default:
        ws.send(JSON.stringify({ type: "error", data: "Invalid request" }));
        break;
    }
  }
}

export default live as never;
