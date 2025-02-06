import { z } from "zod";
import { workspaceIdSchema } from "./workspace.validation";

export const projectIdSchema = z.string().uuid();

export const createProjectSchema = z.object({
  name: z.string().min(1),
  workspaceId: workspaceIdSchema,
  imageUrl: z.string().url().nullable(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().nullable(),
});

export const deleteProjectSchema = z.object({
  projectId: projectIdSchema,
  projectName: z.string().min(1),
});
