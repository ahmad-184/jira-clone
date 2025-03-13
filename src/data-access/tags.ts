import "server-only";

import { and, eq, notInArray } from "drizzle-orm";

import { database } from "@/db";
import { Tag, tags, TaskTag, taskTags } from "@/db/schema";

export async function createTag(values: Tag) {
  await database.insert(tags).values(values);
}

export async function getTags(workspaceId: string) {
  return await database.query.tags.findMany({
    where: eq(tags.workspaceId, workspaceId),
  });
}

export async function createTaskTag(values: TaskTag) {
  await database.insert(taskTags).values(values);
}

export async function deleteTaskTagsByTaskId(taskId: string) {
  await database.delete(taskTags).where(eq(taskTags.taskId, taskId));
}

export async function createTaskTagsByTagIds(tagIds: string[], taskId: string) {
  await database
    .insert(taskTags)
    .values(tagIds.map(tagId => ({ tagId, taskId })))
    .onConflictDoNothing();
}

export async function deleteTaskTagsNotIncludeInIdsArray(
  tagIds: string[],
  taskId: string,
) {
  await database
    .delete(taskTags)
    .where(
      and(notInArray(taskTags.tagId, tagIds), eq(taskTags.taskId, taskId)),
    );
}
