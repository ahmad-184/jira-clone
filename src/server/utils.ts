import { Context } from "hono";

export function returnError(err: unknown, c: Context) {
  const errorMessage =
    err instanceof Error ? err.message : "Something went wrong";
  return c.json({ error: errorMessage }, 500);
}
