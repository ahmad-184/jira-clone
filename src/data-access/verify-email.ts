import "server-only";

import { OTP_LENGTH, OTP_TTL, TOKEN_LENGTH, TOKEN_TTL } from "@/app-config";
import { generateRandomOtp, generateRandomToken } from "./utils";
import { database } from "@/db";
import { verifyEmailOtps, verifyEmailTokens } from "@/db/schema";
import { UserId } from "@/use-cases/types";
import { eq } from "drizzle-orm";

export async function createVerifyEmailToken(userId: UserId) {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await database
    .insert(verifyEmailTokens)
    .values({
      userId,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: verifyEmailTokens.id,
      set: {
        token,
        tokenExpiresAt,
      },
    });

  return token;
}

export async function getVerifyEmailToken(token: string) {
  const existingToken = await database.query.verifyEmailTokens.findFirst({
    where: eq(verifyEmailTokens.token, token),
  });

  return existingToken;
}

export async function deleteVerifyEmailToken(token: string) {
  await database
    .delete(verifyEmailTokens)
    .where(eq(verifyEmailTokens.token, token));
}

export async function createVerifyEmailOtp(userId: UserId) {
  const otp = await generateRandomOtp(OTP_LENGTH);
  const otpExpiresAt = new Date(Date.now() + OTP_TTL);

  await database
    .insert(verifyEmailOtps)
    .values({
      userId,
      otp,
      otpExpiresAt,
    })
    .onConflictDoUpdate({
      target: [verifyEmailOtps.userId],
      set: {
        otp,
        otpExpiresAt,
      },
    });

  return otp;
}

export async function getVerifyEmailOtps(otp: string) {
  const existingOtp = await database.query.verifyEmailOtps.findFirst({
    where: eq(verifyEmailOtps.otp, otp),
  });

  return existingOtp;
}

export async function deleteverifyEmailOtps(otp: string) {
  await database.delete(verifyEmailOtps).where(eq(verifyEmailOtps.otp, otp));
}
