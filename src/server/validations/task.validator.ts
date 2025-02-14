import { memberIdSchema } from "@/validations/member.validation";
import { projectIdSchema } from "@/validations/project.validation";
import { taskStatusSchema } from "@/validations/task.validation";
import { workspaceIdSchema } from "@/validations/workspace.validation";
import { z } from "zod";

export const getTasksQuerySchema = z.object({
  workspaceId: workspaceIdSchema,
  projectId: projectIdSchema.nullish(),
  assignedToMemberId: memberIdSchema.nullish(),
  status: taskStatusSchema.nullish(),
  search: z.string().nullish(),
  dueDate: z.coerce.date().nullish(),
});
