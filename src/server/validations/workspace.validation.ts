import { workspaceIdSchema } from "@/validations/workspace.validation";
import { z } from "zod";

export const deleteWorkspaceSchema = z.object({
  workspaceId: workspaceIdSchema,
  workspaceName: z.string().min(1),
});

export const resetInviteCodeSchema = z.object({
  id: workspaceIdSchema,
});
