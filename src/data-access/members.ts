import "server-only";

import { database } from "@/db";
import { Member, members } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { GetMemberPropsType } from "./type";

export async function getMemberByUserId(
  userId: number,
  props: GetMemberPropsType = {},
) {
  return await database.query.members.findFirst({
    where: eq(members.userId, userId),
    ...props,
  });
}

export async function getMembersByUserId(
  userId: number,
  props: GetMemberPropsType = {},
) {
  return await database.query.members.findMany({
    where: eq(members.userId, userId),
    ...props,
  });
}

export async function getMemberById(
  id: string,
  props: GetMemberPropsType = {},
) {
  return await database.query.members.findFirst({
    where: eq(members.id, id),
    ...props,
  });
}

export async function getMembersByWorkspaceId(
  workspaceId: string,
  props: GetMemberPropsType = {},
) {
  return await database.query.members.findMany({
    where: eq(members.workspaceId, workspaceId),
    ...props,
  });
}

export async function getMember(
  userId: number,
  workspaceId: string,
  props: GetMemberPropsType = {},
) {
  const member = await database.query.members.findFirst({
    where: and(
      eq(members.userId, userId),
      eq(members.workspaceId, workspaceId),
    ),
    ...props,
  });

  return member;
}

export async function createMember(values: Omit<Member, "id" | "createdAt">) {
  const [member] = await database.insert(members).values(values).returning();

  return member;
}

export async function deleteMember(memberId: string) {
  await database.delete(members).where(eq(members.id, memberId));
}

export async function updateMember(memberId: string, values: Partial<Member>) {
  await database.update(members).set(values).where(eq(members.id, memberId));
}
