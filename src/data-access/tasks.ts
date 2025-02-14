import { database } from "@/db";
import { Task, tasks } from "@/db/schema";
import "server-only";
import { GetTaskPropsType } from "./type";
import { eq } from "drizzle-orm";

export async function createTask(values: Omit<Task, "id" | "createdAt">) {
  await database.insert(tasks).values(values);
}

export async function getTask(taskId: string, props: GetTaskPropsType = {}) {
  return database.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    ...props,
  });
}

export async function getTasksByProjectId(
  projectId: string,
  props: GetTaskPropsType = {},
) {
  return database.query.tasks.findMany({
    where: eq(tasks.projectId, projectId),
    ...props,
  });
}

export async function getTasksByWorkspaceId(
  workspaceId: string,
  props: GetTaskPropsType = {},
) {
  return database.query.tasks.findMany({
    where: eq(tasks.workspaceId, workspaceId),
    ...props,
  });
}

export async function getTasks(props: Required<GetTaskPropsType>) {
  return database.query.tasks.findMany({
    ...props,
  });
}
