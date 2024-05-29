import { Hono, Context } from "hono";
import { hyperdrive } from "../src/v1/database";
import { upgradeWebSocket } from "hono/cloudflare-workers";

// TODO: Import moderation routes
//import { moderateText } from "./moderation/text";

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

//TODO: Implement live text moderation
//const textModerationResult = moderateText(data.data);
//ws.send(JSON.stringify(textModerationResult));

function isJsonString(event: string) {
  return typeof event === 'string' && event.startsWith('{') && event.endsWith('}');
}

function liveModerationHandler(event: any, ws: any, _client: any) {
  if (
    isJsonString(event)
  ) {
    const data: EventData = JSON.parse(event);
    switch (data.type) {
      case "text":
        ws.send("Unsupported");
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
