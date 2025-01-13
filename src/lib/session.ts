import "server-only";
import {
  generateSessionIdByToken,
  generateSessionToken,
  validateRequest,
} from "@/auth";
import { cache } from "react";
import { cookies } from "next/headers";
import { UserId } from "@/use-cases/types";
import { AuthenticationError } from "./errors";
import {
  createSessionUseCase,
  getSessionUseCase,
  invalidateSessionsUseCase,
} from "@/use-cases/sessions";

const SESSION_COOKIE_NAME = "session";

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const allCookies = await cookies();
  await allCookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const allCookies = await cookies();
  await allCookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const allCookies = await cookies();
  const sessionCookie = allCookies.get(SESSION_COOKIE_NAME)?.value;
  return sessionCookie;
}

export const getCurrentUser = cache(async () => {
  const { user } = await validateRequest();
  return user ?? undefined;
});

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user || !user.emailVerified) throw new AuthenticationError();
  return user;
};

export const getCurrentUserUncached = async () => {
  const user = await getCurrentUser();
  return user ?? undefined;
};

export async function setSession(userId: UserId) {
  const token = generateSessionToken();
  const session = await createSessionUseCase(token, userId);
  await setSessionTokenCookie(token, session.expiresAt);
}

export async function logoutUser() {
  const sessionToken = await getSessionToken();
  if (!sessionToken) throw new Error("user session not found");
  const sessionId = generateSessionIdByToken(sessionToken);
  const sessionInDb = await getSessionUseCase(sessionId);
  if (!sessionInDb) throw new Error("session not found");
  await invalidateSessionsUseCase(sessionInDb.id);
}
