import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  updateWorkspace,
} from "@/data-access/workspaces";
import { Member, Workspace } from "@/db/schema";
import { PublicError } from "@/lib/errors";
import { createMemberUseCase } from "./members";
import { generateUniqueCode } from "./utils";
import {
  getMembersByUserId,
  getMembersByWorkspaceId,
} from "@/data-access/members";
import { GetMemberPropsType } from "@/data-access/type";
import { getProjectsByWorkspaceId } from "@/data-access/projects";
import { GetWorkspaceMembersProfileUseCaseReturnType } from "./types";

export async function createWorkspaceUseCase(
  values: Omit<Workspace, "id" | "createdAt" | "inviteCode">,
) {
  const inviteCode = generateUniqueCode();

  const data = { ...values, inviteCode };

  const workspace = await createWorkspace(data);

  if (!workspace) throw new PublicError("Failed to create workspace");

  await createMemberUseCase({
    userId: data.ownerId,
    workspaceId: workspace.id,
    role: "OWNER",
  });

  return workspace;
}

export async function getWorkspaceUseCase(workspaceId: string) {
  return await getWorkspace(workspaceId);
}

export async function getUserWorkspacesUseCase(userId: number) {
  const members = (await getMembersByUserId(userId, {
    with: { workspace: true },
  })) as (Member & { workspace: Workspace })[];

  return members.map(m => m.workspace);
}

export async function updateWorkspaceUseCase(
  workspaceId: string,
  values: Partial<Workspace>,
) {
  return await updateWorkspace(workspaceId, values);
}

export async function deleteWorkspaceUseCase(workspaceId: string) {
  return await deleteWorkspace(workspaceId);
}

export async function resetWorkspaceInviteCodeUseCase(workspaceId: string) {
  const newInviteCode = generateUniqueCode();
  return await updateWorkspace(workspaceId, { inviteCode: newInviteCode });
}

export async function getWorkspaceMembersUseCase(workspaceId: string) {
  return await getMembersByWorkspaceId(workspaceId);
}

export async function getWorkspaceMembersProfileUseCase(workspaceId: string) {
  const opts: GetMemberPropsType = {
    with: {
      user: {
        columns: { email: true },
        with: {
          profile: {
            columns: {
              image: true,
              displayName: true,
              bio: true,
            },
          },
        },
      },
    },
  };

  const members = await getMembersByWorkspaceId(workspaceId, opts);

  return members as GetWorkspaceMembersProfileUseCaseReturnType;
}

export async function getWorkspaceProjectsUseCase(workspaceId: string) {
  return await getProjectsByWorkspaceId(workspaceId);
}
