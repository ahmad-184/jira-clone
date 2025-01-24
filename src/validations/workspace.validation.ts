import { z } from "zod";

export const createWorkspaceSchema = z.object({
  userId: z.number().min(1),
  name: z.string().min(1),
  imageUrl: z.string().nullable(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().nullable(),
});

export const workspaceIdSchema = z.string().min(1);
