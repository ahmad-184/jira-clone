import { memberIdSchema } from "@/validations/member.validation";
import { projectIdSchema } from "@/validations/project.validation";
import { taskIdSchema, taskStatusSchema } from "@/validations/task.validation";
import { workspaceIdSchema } from "@/validations/workspace.validation";
import { z } from "zod";

export const getTasksQuerySchema = z.object({
  workspaceId: workspaceIdSchema,
  projectId: projectIdSchema.nullish(),
  assignedToMemberId: memberIdSchema.nullish(),
  status: taskStatusSchema.nullish(),
  search: z.string().nullish(),
  dueDate: z.coerce.date().nullish(),
  limit: z.string().nullish(),
});

export const getTaskSchema = z.object({
  taskId: taskIdSchema,
  workspaceId: workspaceIdSchema,
});

export const updateTasksPositionSchema = z.object({
  workspaceId: workspaceIdSchema,
  tasks: z.array(
    z.object({
      id: taskIdSchema,
      position: z.number(),
      status: taskStatusSchema,
    }),
  ),
});
