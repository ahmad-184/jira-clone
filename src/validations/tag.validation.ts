import { z } from "zod";
import { workspaceIdSchema } from "./workspace.validation";

export const createTagSchema = z.object({
  workspaceId: workspaceIdSchema,
  name: z.string().min(1),
  id: z.string().min(1),
});
