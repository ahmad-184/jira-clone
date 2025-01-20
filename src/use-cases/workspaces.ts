import {
  createWorkspace,
  getUserWorkspaces,
  getWorkspace,
  updateWorkspace,
} from "@/data-access/workspaces";
import { Workspace } from "@/db/schema";
import { PublicError } from "@/lib/errors";
import { createMemberUseCase } from "./members";
import { generateUniqueCode } from "./utils";

export async function createWorkspaceUseCase(
  values: Omit<Workspace, "id" | "createdAt" | "inviteCode">,
) {
  const data = { ...values, inviteCode: generateUniqueCode() };
  const workspace = await createWorkspace(data);
  if (!workspace) throw new PublicError("Failed to create workspace");
  await createMemberUseCase({
    userId: data.userId,
    workspaceId: workspace.id,
    role: "ADMIN",
  });
  return workspace;
}

export async function getWorkspaceUseCase(workspaceId: string) {
  return await getWorkspace(workspaceId);
}

export async function getUserWorkspacesUseCase(userId: number) {
  return await getUserWorkspaces(userId);
}

export async function updateWorkspaceUseCase(
  workspaceId: string,
  values: Partial<Workspace>,
) {
  return await updateWorkspace(workspaceId, values);
}
