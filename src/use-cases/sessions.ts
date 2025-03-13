import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import {
  createSession,
  deleteSession,
  deleteSessionForUser,
  getSession,
  updateSession,
} from "@/data-access/sessions";
import { UserId } from "./types";
import { Session } from "@/db/schema";
import { SESSION_MAX_DURATION_MS } from "@/app-config";

export async function getSessionUseCase(sessionId: string) {
  return await getSession(sessionId);
}

export async function invalidateUserSessionsUseCase(userId: UserId) {
  await deleteSessionForUser(userId);
}

export async function invalidateSessionsUseCase(sessionId: string) {
  await deleteSession(sessionId);
}

export async function createSessionUseCase(token: string, userId: UserId) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
  };
  return await createSession(session);
}

export async function updateSessionUseCase(
  sessionId: string,
  session: Partial<Session>,
) {
  return await updateSession(sessionId, session);
}
