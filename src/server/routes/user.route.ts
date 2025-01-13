"server-only";

import { getCurrentUserUncached } from "@/lib/session";
import { Hono } from "hono";
import { returnError } from "../utils";

const app = new Hono()
  // get current user
  .get("/current-user", async c => {
    try {
      const user = await getCurrentUserUncached();
      return c.json({ user: user });
    } catch (err: unknown) {
      console.log(err);
      return returnError(err, c);
    }
  });

export default app;
