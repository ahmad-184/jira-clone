import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  updateWorkspace,
} from "@/data-access/workspaces";
import { Member, tasks, Workspace } from "@/db/schema";
import { PublicError } from "@/lib/errors";
import { createMemberUseCase } from "./members";
import { generateUniqueCode } from "./utils";
import {
  getMembersByUserId,
  getMembersByWorkspaceId,
} from "@/data-access/members";
import { GetMemberPropsType, GetTasksPropsType } from "@/data-access/type";
import { getProjectsByWorkspaceId } from "@/data-access/projects";
import { GetWorkspaceMembersProfileUseCaseReturnType } from "./types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { and, count, eq, gte, lt, lte, not } from "drizzle-orm";
import { getTasks } from "@/data-access/tasks";

export async function createWorkspaceUseCase(
  values: Omit<Workspace, "id" | "createdAt" | "inviteCode">,
) {
  const inviteCode = generateUniqueCode();

  const data = { ...values, inviteCode };

  const workspace = await createWorkspace(data);

  if (!workspace) throw new PublicError("Failed to create workspace");

  await createMemberUseCase({
    userId: data.ownerId,
    workspaceId: workspace.id,
    role: "OWNER",
  });

  return workspace;
}

export async function getWorkspaceUseCase(workspaceId: string) {
  return await getWorkspace(workspaceId);
}

export async function getUserWorkspacesUseCase(userId: number) {
  const members = (await getMembersByUserId(userId, {
    with: { workspace: true },
  })) as (Member & { workspace: Workspace })[];

  return members.map(m => m.workspace);
}

export async function updateWorkspaceUseCase(
  workspaceId: string,
  values: Partial<Workspace>,
) {
  return await updateWorkspace(workspaceId, values);
}

export async function deleteWorkspaceUseCase(workspaceId: string) {
  return await deleteWorkspace(workspaceId);
}

export async function resetWorkspaceInviteCodeUseCase(workspaceId: string) {
  const newInviteCode = generateUniqueCode();
  return await updateWorkspace(workspaceId, { inviteCode: newInviteCode });
}

export async function getWorkspaceMembersUseCase(workspaceId: string) {
  return await getMembersByWorkspaceId(workspaceId);
}

export async function getWorkspaceMembersProfileUseCase(workspaceId: string) {
  const opts: GetMemberPropsType = {
    with: {
      user: {
        columns: { email: true },
        with: {
          profile: {
            columns: {
              image: true,
              displayName: true,
              bio: true,
            },
          },
        },
      },
    },
  };

  const members = await getMembersByWorkspaceId(workspaceId, opts);

  return members as GetWorkspaceMembersProfileUseCaseReturnType;
}

export async function getWorkspaceProjectsUseCase(workspaceId: string) {
  return await getProjectsByWorkspaceId(workspaceId);
}

type Total = {
  total: number;
}[];

export async function getWorkspaceAnalyticsUseCase(
  workspaceId: string,
  memberId: string,
) {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thiMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const getThisMonthTasksProps: GetTasksPropsType = {
    where: and(
      eq(tasks.workspaceId, workspaceId),
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
      eq(tasks.workspaceId, workspaceId),
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
      eq(tasks.workspaceId, workspaceId),
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
      eq(tasks.workspaceId, workspaceId),
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
      eq(tasks.workspaceId, workspaceId),
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
      eq(tasks.workspaceId, workspaceId),
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
      eq(tasks.workspaceId, workspaceId),
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
      eq(tasks.workspaceId, workspaceId),
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
      eq(tasks.workspaceId, workspaceId),
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
      eq(tasks.workspaceId, workspaceId),
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
