import { z } from "zod";

export const deleteWorkspaceSchema = z.object({
  workspaceId: z.string().min(1),
  workspaceName: z.string().min(1),
});
