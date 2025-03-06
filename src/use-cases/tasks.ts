import {
  createTask,
  deleteTask,
  deleteTasks,
  getTask,
  getTasks,
  getTasksByProjectId,
  getTasksByWorkspaceId,
  updateTask,
  updateTasks,
} from "@/data-access/tasks";
import { GetTaskPropsType } from "@/data-access/type";
import { Member, Task, tasks, TaskStatus } from "@/db/schema";
import { and, eq, like, SQL, sql } from "drizzle-orm";
import {
  GetTasksWithSearchQueries,
  GetTasksWithSearchQueriesUseCaseReturn,
  GetTaskUseCaseReturn,
  GetTaskWithCreatorUseCaseReturn,
} from "./types";
import {
  createTaskTagsByTagIds,
  deleteTaskTagsByTaskId,
  deleteTaskTagsNotIncludeInIdsArray,
} from "@/data-access/tags";
import { hasPermission } from "@/lib/permission-system";

export async function createTaskUseCase(
  values: Omit<Task & { taskTags?: string[] }, "createdAt">,
) {
  const taskTags = values.taskTags;
  delete values.taskTags;
  const res = await createTask(values);
  if (taskTags?.length) await createTaskTagsByTagIds(taskTags, values.id);
  return res;
}

export async function updateTasksPositionUseCase(
  member: Member,
  values: Pick<Task, "id" | "position" | "status">[],
) {
  const tasks = await Promise.all(
    values.map(async task => {
      const taskData = (await getTask(task.id, {
        columns: { id: true, position: true, assignedToMemberId: true },
        with: { createdBy: true },
      })) as GetTaskUseCaseReturn; // not a real type, but it's ok

      const canUpdate = hasPermission(member.role, "tasks", "update", {
        member,
        task: taskData,
      });

      return canUpdate.permission ? task : undefined;
    }),
  );

  const filteredTasks = tasks.filter(task => task !== undefined);

  const results = filteredTasks.map(task => ({
    id: task.id,
    data: { position: task.position, status: task.status },
  }));

  await updateTasks(results);

  return results.map(result => result.id);
}

export async function getTaskUseCase(taskId: string) {
  const props: GetTaskPropsType = {
    where: eq(tasks.id, taskId),
    with: {
      assignedTo: {
        with: {
          user: {
            columns: { email: true },
            with: {
              profile: {
                columns: {
                  image: true,
                  displayName: true,
                },
              },
            },
          },
        },
      },
      createdBy: {
        with: {
          user: {
            columns: { email: true },
            with: {
              profile: {
                columns: {
                  image: true,
                  displayName: true,
                },
              },
            },
          },
        },
      },
      project: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      taskTags: {
        columns: {},
        with: {
          tag: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  };

  const task = await getTask(taskId, props as any);

  return task as GetTaskUseCaseReturn;
}

export async function getHighestPositionTaskUseCase(
  projectId: string,
  status: TaskStatus,
) {
  const options: GetTaskPropsType = {
    where: and(eq(tasks.projectId, projectId), eq(tasks.status, status)),
    orderBy: (tasks, { desc }) => desc(tasks.position),
    columns: {
      position: true,
    },
  };

  const task = await getTask("", options);

  return task;
}

export async function getTasksByWorkspaceIdUseCase(workspaceId: string) {
  return await getTasksByWorkspaceId(workspaceId);
}

export async function getTasksByProjectIdUseCase(projectId: string) {
  return await getTasksByProjectId(projectId);
}

export async function getTasksWithSearchQueriesUseCase(
  queries: GetTasksWithSearchQueries,
) {
  const conditions: SQL[] = [eq(tasks.workspaceId, queries.workspaceId)];

  if (queries.projectId)
    conditions.push(eq(tasks.projectId, queries.projectId));
  if (queries.status) conditions.push(eq(tasks.status, queries.status));
  if (queries.assignedToMemberId)
    conditions.push(eq(tasks.assignedToMemberId, queries.assignedToMemberId));
  if (queries.search)
    conditions.push(
      like(sql`lower(${tasks.name})`, `%${queries.search.toLowerCase()}%`),
    );
  if (queries.dueDate) conditions.push(eq(tasks.dueDate, queries.dueDate));

  const props: GetTaskPropsType = {
    where: and(...conditions),
    with: {
      assignedTo: {
        with: {
          user: {
            columns: { email: true },
            with: {
              profile: {
                columns: {
                  image: true,
                  displayName: true,
                },
              },
            },
          },
        },
      },
      createdBy: {
        with: {
          user: {
            columns: { email: true },
            with: {
              profile: {
                columns: {
                  image: true,
                  displayName: true,
                },
              },
            },
          },
        },
      },
      project: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      taskTags: {
        columns: {},
        with: {
          tag: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  };

  const result = await getTasks(props as any);

  return result as GetTasksWithSearchQueriesUseCaseReturn;
}

export async function getTaskWithCreator(taskId: string) {
  const props: GetTaskPropsType = {
    where: eq(tasks.id, taskId),
    with: {
      createdBy: true,
    },
  };

  const task = await getTask(taskId, props as any);

  return task as GetTaskWithCreatorUseCaseReturn;
}

export async function deleteTaskUseCase(taskId: string) {
  return await deleteTask(taskId);
}

export async function deleteTasksUseCase(taskIds: string[]) {
  return await deleteTasks(taskIds);
}

export async function updateTaskUseCase(
  taskId: string,
  values: Partial<Task & { taskTags: string[] }>,
) {
  if (values.taskTags !== undefined && !values.taskTags.length) {
    await deleteTaskTagsByTaskId(taskId);
  }
  if (values.taskTags !== undefined && values.taskTags.length) {
    await deleteTaskTagsNotIncludeInIdsArray(values.taskTags, taskId);
    // if task tag did not exist, create it
    await createTaskTagsByTagIds(values.taskTags, taskId);
  }
  delete values.taskTags;
  return await updateTask(taskId, values);
}
