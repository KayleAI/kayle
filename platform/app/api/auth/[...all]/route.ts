import { auth } from "@repo/auth/server";
import { toNextJsHandler } from "@repo/auth/exports";

export const { POST, GET } = toNextJsHandler(auth);
