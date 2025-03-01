import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  getTasksByProjectId,
  getTasksByWorkspaceId,
  updateTask,
} from "@/data-access/tasks";
import { GetTaskPropsType } from "@/data-access/type";
import { Task, tasks, TaskStatus } from "@/db/schema";
import { and, eq, like, SQL, sql } from "drizzle-orm";
import {
  GetTasksWithSearchQueries,
  GetTasksWithSearchQueriesUseCaseReturn,
  GetTaskUseCaseReturn,
  GetTaskWithCreatorUseCaseReturn,
} from "./types";

export async function createTaskUseCase(
  values: Omit<Task, "id" | "createdAt">,
) {
  await createTask(values);
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

export async function updateTaskUseCase(taskId: string, values: Partial<Task>) {
  return await updateTask(taskId, values);
}
