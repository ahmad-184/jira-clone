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
