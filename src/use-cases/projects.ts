import {
  createProject,
  deleteProject,
  getProject,
  updateProject,
} from "@/data-access/projects";
import { Project } from "@/db/schema";

export async function createProjectUseCase(
  values: Pick<Project, "workspaceId" | "name" | "imageUrl">,
) {
  return await createProject(values);
}

export async function getProjectUseCase(projectId: string) {
  return await getProject(projectId);
}

export async function updateProjectUseCase(
  projectId: string,
  values: Partial<Project>,
) {
  return await updateProject(projectId, values);
}

export async function deleteProjectUseCase(projectId: string) {
  return await deleteProject(projectId);
}
