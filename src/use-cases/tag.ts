import { createTag, createTaskTag, getTags } from "@/data-access/tags";
import { Tag, TaskTag } from "@/db/schema";

export async function createTagUseCase(values: Tag) {
  return await createTag(values);
}

export async function getTagsUseCase(workspaceId: string) {
  return await getTags(workspaceId);
}

export async function createTaskTagUseCase(values: TaskTag) {
  return await createTaskTag(values);
}
