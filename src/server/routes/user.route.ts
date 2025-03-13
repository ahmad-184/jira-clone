import "server-only";

import { Hono } from "hono";

import { getCurrentUser } from "@/lib/session";
import { returnError } from "../utils";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getProfileWithUserEmailUseCase } from "@/use-cases/users";

const app = new Hono()
  // GET /current-user get current user
  .get("/current-user", async c => {
    try {
      const user = await getCurrentUser();
      return c.json({ user });
    } catch (err: unknown) {
      console.log(err);
      return returnError(err, c);
    }
  })
  // GET /current-user-profile get current user profile
  .get("/current-user-profile", authMiddleware, async c => {
    try {
      const user = c.get("user");
      const res = await getProfileWithUserEmailUseCase(user.id);
      return c.json({ profile: res });
    } catch (err: unknown) {
      console.log(err);
      return returnError(err, c);
    }
  });

export default app;
