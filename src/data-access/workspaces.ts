import { database } from "@/db";
import { members, Workspace, workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createWorkspace(
  values: Omit<Workspace, "id" | "createdAt">,
) {
  const [workspace] = await database
    .insert(workspaces)
    .values(values)
    .returning();

  return workspace;
}

export async function getWorkspace(workspaceId: string) {
  const workspace = await database.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  });

  return workspace;
}

export async function getUserWorkspaces(userId: number) {
  const workspaces = await database.query.members.findMany({
    where: eq(members.userId, userId),
    with: { workspace: true },
    columns: {},
  });

  return workspaces.map(e => e.workspace);
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
