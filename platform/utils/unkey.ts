import { Unkey } from "@unkey/api";

if (!process.env.UNKEY_AUTH_TOKEN) {
  throw new Error("UNKEY_AUTH_TOKEN is not set");
}
// construct signature implictly has any type
export const unkey = new Unkey({
  rootKey: process.env.UNKEY_AUTH_TOKEN,
  retry: {
  attempts: 0,
  },
});

