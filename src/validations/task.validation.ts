import { z } from "zod";
import { workspaceIdSchema } from "./workspace.validation";
import { projectIdSchema } from "./project.validation";
import { memberIdSchema } from "./member.validation";

export const taskIdSchema = z.string().min(1);

export const taskStatusSchema = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
]);

export const createTaskSchema = z.object({
  name: z.string().min(1, { message: "Please enter task name." }),
  workspaceId: workspaceIdSchema,
  projectId: projectIdSchema,
  assignedToMemberId: memberIdSchema,
  createdById: memberIdSchema,
  description: z.string().optional().default(""),
  status: taskStatusSchema,
  dueDate: z.coerce.date(),
});

export const deleteTaskSchema = z.object({
  taskIds: z.array(taskIdSchema),
  workspaceId: workspaceIdSchema,
});

export const updateTaskSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, { message: "Please enter task name." }).optional(),
  workspaceId: workspaceIdSchema,
  projectId: projectIdSchema.optional(),
  assignedToMemberId: memberIdSchema.optional(),
  createdById: memberIdSchema.optional(),
  description: z.string().default("").nullable(),
  status: taskStatusSchema.optional(),
  dueDate: z.coerce.date().optional(),
});
