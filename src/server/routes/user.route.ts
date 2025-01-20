"server-only";

import { getCurrentUserUncached } from "@/lib/session";
import { Hono } from "hono";
import { returnError } from "../utils";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getUserProfileUseCase } from "@/use-cases/users";

const app = new Hono()
  // get current user
  .get("/current-user", async c => {
    try {
      const user = await getCurrentUserUncached();
      return c.json({ user });
    } catch (err: unknown) {
      console.log(err);
      return returnError(err, c);
    }
  })
  // get current user profile
  .get("/current-user-profile", authMiddleware, async c => {
    try {
      const user = c.get("user");
      const userProfile = await getUserProfileUseCase(user.id);
      return c.json({ profile: userProfile });
    } catch (err: unknown) {
      console.log(err);
      return returnError(err, c);
    }
  });

export default app;
