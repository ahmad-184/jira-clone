import { database } from "@/db";
import { Task, tasks } from "@/db/schema";
import "server-only";
import { GetTaskPropsType, GetTasksPropsType } from "./type";
import { count, eq, inArray, SQL } from "drizzle-orm";

export async function createTask(values: Omit<Task, "createdAt">) {
  const [res] = await database
    .insert(tasks)
    .values(values)
    .returning({ id: tasks.id });
  return res;
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

export async function getTasks(props: Partial<GetTasksPropsType> = {}) {
  return await database.query.tasks.findMany({
    ...props,
  });
}

export async function deleteTask(taskId: string) {
  return await database.delete(tasks).where(eq(tasks.id, taskId));
}

export async function deleteTasks(taskIds: string[]) {
  return await database.delete(tasks).where(inArray(tasks.id, taskIds));
}

export async function updateTask(taskId: string, values: Partial<Task>) {
  return await database.update(tasks).set(values).where(eq(tasks.id, taskId));
}

export async function updateTasks(
  values: { id: string; data: Partial<Task> }[],
) {
  await Promise.all(
    values.map(value =>
      database.update(tasks).set(value.data).where(eq(tasks.id, value.id)),
    ),
  );
}

export async function getTasksCount(props: SQL<unknown> | undefined) {
  const [res] = await database
    .select({ count: count() })
    .from(tasks)
    .where(props);
  return res.count;
}
