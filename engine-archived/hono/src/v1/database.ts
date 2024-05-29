import { Context } from "hono";
import { Client } from "pg";

export const hyperdrive = async (c: Context): Promise<Client> => {
  let connectionString = "";

  if (c.env?.HYPERDRIVE?.connectionString) {
    connectionString = c.env.HYPERDRIVE.connectionString;
  } else {
    connectionString = `${c.env.HYPERDRIVE_FALLBACK}?sslmode=disable`;
  }

  const client = new Client({
    connectionString
  });
  
  await client.connect();
  return client;
};
