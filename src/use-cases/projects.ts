import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { and, eq, gte, lte, count, not, lt } from "drizzle-orm";

import {
  createProject,
  deleteProject,
  getProject,
  updateProject,
} from "@/data-access/projects";
import { getTasks } from "@/data-access/tasks";
import { GetTasksPropsType } from "@/data-access/type";
import { Project, tasks } from "@/db/schema";

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

type Total = {
  total: number;
}[];

export async function getProjectAnalyticsUseCase(
  projectId: string,
  memberId: string,
) {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thiMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const getThisMonthTasksProps: GetTasksPropsType = {
    where: and(
      eq(tasks.projectId, projectId),
      gte(tasks.createdAt, thisMonthStart),
      lte(tasks.createdAt, thiMonthEnd),
    ),
    columns: {},
    extras: {
      total: count().as("total"),
    },
  };

  const getLastMonthTasksProps: GetTasksPropsType = {
    where: and(
      eq(tasks.projectId, projectId),
      gte(tasks.createdAt, lastMonthStart),
      lte(tasks.createdAt, lastMonthEnd),
    ),
    columns: {},
    extras: {
      total: count().as("total"),
    },
  };

  const thisMonthAssignedTasksProps: GetTasksPropsType = {
    where: and(
      eq(tasks.projectId, projectId),
      eq(tasks.assignedToMemberId, memberId),
      gte(tasks.createdAt, thisMonthStart),
      lte(tasks.createdAt, thiMonthEnd),
    ),
    columns: {},
    extras: {
      total: count().as("total"),
    },
  };

  const lastMonthAssignedTasksProps: GetTasksPropsType = {
    where: and(
      eq(tasks.projectId, projectId),
      eq(tasks.assignedToMemberId, memberId),
      gte(tasks.createdAt, lastMonthStart),
      lte(tasks.createdAt, lastMonthEnd),
    ),
    columns: {},
    extras: {
      total: count().as("total"),
    },
  };

  const thisMonthIncompletedTasksProps: GetTasksPropsType = {
    where: and(
      eq(tasks.projectId, projectId),
      not(eq(tasks.status, "DONE")),
      gte(tasks.createdAt, thisMonthStart),
      lte(tasks.createdAt, thiMonthEnd),
    ),
    columns: {},
    extras: {
      total: count().as("total"),
    },
  };

  const lastMonthIncompletedTasksProps: GetTasksPropsType = {
    where: and(
      eq(tasks.projectId, projectId),
      not(eq(tasks.status, "DONE")),
      gte(tasks.createdAt, lastMonthStart),
      lte(tasks.createdAt, lastMonthEnd),
    ),
    columns: {},
    extras: {
      total: count().as("total"),
    },
  };

  const thisMonthCompletedTasksProps: GetTasksPropsType = {
    where: and(
      eq(tasks.projectId, projectId),
      eq(tasks.status, "DONE"),
      gte(tasks.createdAt, thisMonthStart),
      lte(tasks.createdAt, thiMonthEnd),
    ),
    columns: {},
    extras: {
      total: count().as("total"),
    },
  };

  const lastMonthCompletedTasksProps: GetTasksPropsType = {
    where: and(
      eq(tasks.projectId, projectId),
      eq(tasks.status, "DONE"),
      gte(tasks.createdAt, lastMonthStart),
      lte(tasks.createdAt, lastMonthEnd),
    ),
    columns: {},
    extras: {
      total: count().as("total"),
    },
  };

  const thisMonthOverdueTasksProps: GetTasksPropsType = {
    where: and(
      eq(tasks.projectId, projectId),
      not(eq(tasks.status, "DONE")),
      lt(tasks.dueDate, now),
      gte(tasks.createdAt, thisMonthStart),
      lte(tasks.createdAt, thiMonthEnd),
    ),
    columns: {},
    extras: {
      total: count().as("total"),
    },
  };

  const lastMonthOverdueTasksProps: GetTasksPropsType = {
    where: and(
      eq(tasks.projectId, projectId),
      not(eq(tasks.status, "DONE")),
      lt(tasks.dueDate, now),
      gte(tasks.createdAt, lastMonthStart),
      lte(tasks.createdAt, lastMonthEnd),
    ),
    columns: {},
    extras: {
      total: count().as("total"),
    },
  };

  const [
    thisMonthTasks,
    lastMonthTasks,
    thisMonthAssignedTasks,
    lastMonthAssignedTasks,
    thisMonthIncompletedTasks,
    lastMonthIncompletedTasks,
    thisMonthCompletedTasks,
    lastMonthCompletedTasks,
    thisMonthOverdueTasks,
    lastMonthOverdueTasks,
  ] = await Promise.all([
    (await getTasks(getThisMonthTasksProps)) as any as Total,
    (await getTasks(getLastMonthTasksProps)) as any as Total,
    (await getTasks(thisMonthAssignedTasksProps)) as any as Total,
    (await getTasks(lastMonthAssignedTasksProps)) as any as Total,
    (await getTasks(thisMonthIncompletedTasksProps)) as any as Total,
    (await getTasks(lastMonthIncompletedTasksProps)) as any as Total,
    (await getTasks(thisMonthCompletedTasksProps)) as any as Total,
    (await getTasks(lastMonthCompletedTasksProps)) as any as Total,
    (await getTasks(thisMonthOverdueTasksProps)) as any as Total,
    (await getTasks(lastMonthOverdueTasksProps)) as any as Total,
  ]);

  const tasksCount = thisMonthTasks[0].total;
  const tasksDifference = tasksCount - lastMonthTasks[0].total;

  const assignedTasksCount = thisMonthAssignedTasks[0].total;
  const assignedTasksDifference =
    assignedTasksCount - lastMonthAssignedTasks[0].total;

  const incompletedTasksCount = thisMonthIncompletedTasks[0].total;
  const incompletedTasksDifference =
    incompletedTasksCount - lastMonthIncompletedTasks[0].total;

  const completedTasksCount = thisMonthCompletedTasks[0].total;
  const completedTasksDifference =
    completedTasksCount - lastMonthCompletedTasks[0].total;

  const overdueTasksCount = thisMonthOverdueTasks[0].total;
  const overdueTasksDifference =
    overdueTasksCount - lastMonthOverdueTasks[0].total;

  return {
    tasksCount,
    tasksDifference,
    assignedTasksCount,
    assignedTasksDifference,
    incompletedTasksCount,
    incompletedTasksDifference,
    completedTasksCount,
    completedTasksDifference,
    overdueTasksCount,
    overdueTasksDifference,
  };
}
