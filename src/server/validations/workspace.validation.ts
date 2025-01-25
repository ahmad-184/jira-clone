import { workspaceIdSchema } from "@/validations/workspace.validation";
import { z } from "zod";

export const deleteWorkspaceSchema = z.object({
  workspaceId: workspaceIdSchema,
  workspaceName: z.string().min(1),
});

export const resetInviteCodeSchema = z.object({
  id: workspaceIdSchema,
});

export const joinWorkspaceParamsSchema = z.object({
  id: workspaceIdSchema,
});

export const joinWorkspaceBodySchema = z.object({
  inviteCode: z
    .string()
    .length(10, { message: "Invite code must be 10 characters long" }),
});
