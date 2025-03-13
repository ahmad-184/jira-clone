import { createMiddleware } from "hono/factory";

import { validateRequest, validateSessionToken } from "@/auth";
import { User } from "@/db/schema";
import { AUTHENTICATION_ERROR_MESSAGE } from "@/lib/errors";
import { getSessionToken } from "@/lib/session";

type AuthAdditionalContext = {
  Variables: {
    user: User;
  };
};

export const authMiddleware = createMiddleware<AuthAdditionalContext>(
  async (c, next) => {
    const session = await validateRequest();
    if (!session || !session.user)
      return c.json({ error: AUTHENTICATION_ERROR_MESSAGE }, 401);
    c.set("user", session.user);
    await next();
  },
);

export const redirectIfAuthenticated = createMiddleware(async (c, next) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return await next();
  const isAuthenticated = await validateSessionToken(sessionToken);
  if (isAuthenticated.user) return c.redirect("/dashboard");
  await next();
});
