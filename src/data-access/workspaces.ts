import "server-only";

import { database } from "@/db";
import { Workspace, workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GetWorkspacePropsType } from "./type";

export async function createWorkspace(
  values: Omit<Workspace, "id" | "createdAt">,
) {
  const [workspace] = await database
    .insert(workspaces)
    .values(values)
    .returning();

  return workspace;
}

export async function getWorkspace(
  workspaceId: string,
  props: GetWorkspacePropsType = {},
) {
  const workspace = await database.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
    ...props,
  });

  return workspace;
}

export async function updateWorkspace(
  workspaceId: string,
  values: Partial<Workspace>,
) {
  return await database
    .update(workspaces)
    .set(values)
    .where(eq(workspaces.id, workspaceId));
}

export async function deleteWorkspace(workspaceId: string) {
  await database.delete(workspaces).where(eq(workspaces.id, workspaceId));
}
