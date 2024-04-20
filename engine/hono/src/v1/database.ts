import { Context } from "hono";
import { Client } from "pg";

export const hyperdrive = async (c: Context) => {
  const client = new Client({
    connectionString: c.env.HYPERDRIVE.connectionString,
  });
  
  await client.connect();
  return client;
};
