import { database } from "@/db";
import { Member, members } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function findUserFirstWorkspaceMembership(userId: number) {
  return await database.query.members.findFirst({
    where: eq(members.userId, userId),
  });
}

export async function createMember(values: Omit<Member, "id" | "createdAt">) {
  const [member] = await database.insert(members).values(values).returning();

  return member;
}

export async function getMember(userId: number, workspaceId: string) {
  const member = await database.query.members.findFirst({
    where: and(
      eq(members.userId, userId),
      eq(members.workspaceId, workspaceId),
    ),
  });

  return member;
}
