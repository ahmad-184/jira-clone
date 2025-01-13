import { database } from "@/db";
import { Session, sessions } from "@/db/schema";
import { UserId } from "@/use-cases/types";
import { eq } from "drizzle-orm";

export async function getSession(sessionId: string) {
  const sessionInDb = await database.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  });
  return sessionInDb;
}

export async function deleteSessionForUser(userId: UserId, trx = database) {
  await trx.delete(sessions).where(eq(sessions.userId, userId));
}

export async function deleteSession(sessionId: string, trx = database) {
  await trx.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function createSession(session: Session): Promise<Session> {
  await database.insert(sessions).values(session);
  return session;
}

export async function updateSession(
  sessionId: string,
  session: Partial<Session>,
): Promise<Session> {
  const [res] = await database
    .update(sessions)
    .set({ ...session })
    .where(eq(sessions.id, sessionId));
  return res;
}
