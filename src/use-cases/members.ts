import {
  createMember,
  getMemberByUserId,
  getMember,
  getMemberById,
  deleteMember,
  updateMember,
} from "@/data-access/members";
import { Member } from "@/db/schema";

export async function findUserFirstWorkspaceMembershipUseCase(userId: number) {
  return await getMemberByUserId(userId);
}

export async function createMemberUseCase(
  values: Omit<Member, "id" | "createdAt">,
) {
  return await createMember(values);
}

export async function deleteMemberUseCase(memberId: string) {
  return await deleteMember(memberId);
}

export async function updateMemberUseCase(
  memberId: string,
  values: Partial<Member>,
) {
  return await updateMember(memberId, values);
}

export async function getMemberUseCase(userId: number, workspaceId: string) {
  return await getMember(userId, workspaceId);
}

export async function getMemberByIdUseCase(memberId: string) {
  return await getMemberById(memberId);
}
