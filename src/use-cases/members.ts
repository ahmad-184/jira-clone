import {
  createMember,
  findUserFirstWorkspaceMembership,
  getMember,
} from "@/data-access/members";
import { Member } from "@/db/schema";

export async function findUserFirstWorkspaceMembershipUseCase(userId: number) {
  return await findUserFirstWorkspaceMembership(userId);
}

export async function createMemberUseCase(
  values: Omit<Member, "id" | "createdAt">,
) {
  return await createMember(values);
}

export async function getMemberUseCase(userId: number, workspaceId: string) {
  return await getMember(userId, workspaceId);
}
