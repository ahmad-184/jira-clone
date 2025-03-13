import "server-only";

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import {
  resetPasswordSchema,
  signUpSchema,
  verifyEmailOtpSchema,
  forgotPasswordSchema,
  signInSchema,
  signInWithMagicLinkSchema,
} from "@/validations/auth.validation";
import {
  changePasswordUseCase,
  registerUserUseCase,
  resetPasswordUseCase,
  signInUseCase,
  verifyEmailOtpUseCase,
} from "@/use-cases/users";
import { rateLimitByIp, rateLimitByKey } from "@/lib/limiter";
import { logoutUser, setSession } from "@/lib/session";
import { PublicError } from "@/lib/errors";
import { sendMagicLinkUseCase } from "@/use-cases/magic-link";
import { returnError } from "../utils";
import {
  authMiddleware,
  redirectIfAuthenticated,
} from "../middlewares/auth.middleware";

const signUpValidator = zValidator("json", signUpSchema);
const verifyEmailOtpValidator = zValidator("json", verifyEmailOtpSchema);
const signInValidator = zValidator("json", signInSchema);
const sendMagicLinkValidator = zValidator("json", signInWithMagicLinkSchema);
const forgotPasswordValidator = zValidator("json", forgotPasswordSchema);
const resetPasswordValidator = zValidator("json", resetPasswordSchema);

const app = new Hono()
  // POST /sign-in sign in with email password
  .post("/sign-in", redirectIfAuthenticated, signInValidator, async c => {
    try {
      const { email, password } = c.req.valid("json");

      await rateLimitByKey({ key: email, limit: 3, window: 30000 });

      const result = await signInUseCase(email, password);

      await setSession(result.id);

      return c.json({ id: result.id });
    } catch (err: unknown) {
      console.log(err);
      return returnError(err, c);
    }
  })
  // POST /sign-up sign up
  .post("/sign-up", redirectIfAuthenticated, signUpValidator, async c => {
    try {
      await rateLimitByIp({ key: "register", limit: 3, window: 30000 });
      const { email, password } = c.req.valid("json");

      const user = await registerUserUseCase(email, password);

      return c.json({ id: user.id });
    } catch (err: unknown) {
      console.log(err);
      return returnError(err, c);
    }
  })
  // POST /verify-email-otp verify email otp
  .post(
    "/verify-email-otp",
    redirectIfAuthenticated,
    verifyEmailOtpValidator,
    async c => {
      try {
        const { otp, userId } = c.req.valid("json");

        const id = await verifyEmailOtpUseCase(otp);

        if (!id || id !== userId) throw new PublicError("Invalid OTP");

        await setSession(userId);

        return c.json({ id });
      } catch (err: unknown) {
        console.log(err);
        return returnError(err, c);
      }
    },
  )
  // POST /send-magic-link sign in with magic link
  .post(
    "/send-magic-link",
    redirectIfAuthenticated,
    sendMagicLinkValidator,
    async c => {
      try {
        const { email } = c.req.valid("json");

        await rateLimitByKey({ key: email, limit: 1, window: 30000 });

        await sendMagicLinkUseCase(email);

        return c.json({ email });
      } catch (err: unknown) {
        console.log(err);
        return returnError(err, c);
      }
    },
  )
  // POST /send-forgot-password send forgot password email
  .post(
    "/send-forgot-password",
    redirectIfAuthenticated,
    forgotPasswordValidator,
    async c => {
      try {
        const { email } = c.req.valid("json");

        await rateLimitByKey({ key: email, limit: 3, window: 30000 });

        await resetPasswordUseCase(email);

        return c.json({ email });
      } catch (err: unknown) {
        console.log(err);
        return returnError(err, c);
      }
    },
  )
  // POST /reset-password reset password
  .post(
    "/reset-password",
    redirectIfAuthenticated,
    resetPasswordValidator,
    async c => {
      try {
        const { password, token } = c.req.valid("json");

        await rateLimitByIp({ limit: 1, window: 30000 });

        await changePasswordUseCase(token, password);

        return c.json({ success: true });
      } catch (err: unknown) {
        console.log(err);
        return returnError(err, c);
      }
    },
  )
  // POST /logout logout user
  .post("/logout", authMiddleware, async c => {
    try {
      await logoutUser();

      return c.json({
        success: true,
      });
    } catch (err: unknown) {
      console.log(err);
      return returnError(err, c);
    }
  });

export default app;
