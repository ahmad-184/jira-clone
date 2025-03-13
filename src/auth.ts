import { GitHub, Google } from "arctic";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import { env } from "@/env";
import { getSessionToken } from "@/lib/session";
import {
  SESSION_MAX_DURATION_MS,
  SESSION_REFRESH_INTERVAL_MS,
} from "@/app-config";
import {
  getSessionUseCase,
  invalidateSessionsUseCase,
  updateSessionUseCase,
} from "@/use-cases/sessions";
import { getUserUseCase } from "@/use-cases/users";
import { SessionValidationResult } from "@/types/session";

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  `${env.HOST_NAME}/api/login/github/callback`,
);

export const googleAuth = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.HOST_NAME}/api/login/google/callback`,
);

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export const generateSessionIdByToken = (token: string): string => {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
};

export async function validateRequest(): Promise<SessionValidationResult> {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return { session: null, user: null };
  return validateSessionToken(sessionToken);
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = generateSessionIdByToken(token);
  const sessionInDb = await getSessionUseCase(sessionId);

  if (!sessionInDb) return { session: null, user: null };

  if (Date.now() >= sessionInDb.expiresAt.getTime()) {
    await invalidateSessionsUseCase(sessionInDb.id);
    return { session: null, user: null };
  }

  const user = await getUserUseCase(sessionInDb.userId);

  if (!user) {
    await invalidateSessionsUseCase(sessionInDb.id);
    return { session: null, user: null };
  }

  if (
    Date.now() >=
    sessionInDb.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS
  ) {
    sessionInDb.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);
    await updateSessionUseCase(sessionInDb.id, {
      expiresAt: sessionInDb.expiresAt,
    });
  }

  return { session: sessionInDb, user };
}
