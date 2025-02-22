import { database } from "@/db";
import { Task, tasks } from "@/db/schema";
import "server-only";
import { GetTaskPropsType } from "./type";
import { eq } from "drizzle-orm";

export async function createTask(values: Omit<Task, "id" | "createdAt">) {
  await database.insert(tasks).values(values);
}

export async function getTask(taskId: string, props: GetTaskPropsType = {}) {
  return await database.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    ...props,
  });
}

export async function getTasksByProjectId(
  projectId: string,
  props: GetTaskPropsType = {},
) {
  return await database.query.tasks.findMany({
    where: eq(tasks.projectId, projectId),
    ...props,
  });
}

export async function getTasksByWorkspaceId(
  workspaceId: string,
  props: GetTaskPropsType = {},
) {
  return await database.query.tasks.findMany({
    where: eq(tasks.workspaceId, workspaceId),
    ...props,
  });
}

export async function getTasks(props: Required<GetTaskPropsType>) {
  return await database.query.tasks.findMany({
    ...props,
  });
}

export async function deleteTask(taskId: string) {
  return await database.delete(tasks).where(eq(tasks.id, taskId));
}

export async function updateTask(taskId: string, values: Partial<Task>) {
  await database.update(tasks).set(values).where(eq(tasks.id, taskId));
}
