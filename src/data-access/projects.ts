import "server-only";

import { eq } from "drizzle-orm";

import { database } from "@/db";
import { Project, projects } from "@/db/schema";
import { GetProjectPropsType } from "./type";

export async function createProject(
  values: Pick<Project, "workspaceId" | "name" | "imageUrl">,
) {
  const [project] = await database.insert(projects).values(values).returning();
  return project;
}

export async function getProject(
  porjectId: string,
  props: GetProjectPropsType = {},
) {
  return await database.query.projects.findFirst({
    where: eq(projects.id, porjectId),
    ...props,
  });
}

export async function getProjectByWorkspaceId(
  workspaceId: string,
  props: GetProjectPropsType = {},
) {
  return await database.query.projects.findFirst({
    where: eq(projects.workspaceId, workspaceId),
    ...props,
  });
}

export async function getProjectsByWorkspaceId(
  workspaceId: string,
  props: GetProjectPropsType = {},
) {
  return await database.query.projects.findMany({
    where: eq(projects.workspaceId, workspaceId),
    ...props,
  });
}

export async function updateProject(
  projectId: string,
  values: Partial<Project>,
) {
  return await database
    .update(projects)
    .set(values)
    .where(eq(projects.id, projectId));
}

export async function deleteProject(projectId: string) {
  return await database.delete(projects).where(eq(projects.id, projectId));
}
