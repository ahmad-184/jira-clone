"use client";

import { useGetTasksQuery } from "@/hooks/queries/use-get-tasks";
import { useTaskFilters } from "../../components/task/hooks/use-task-filters";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Task, TaskStatus } from "@/db/schema";
import {
  GetTasksWithSearchQueriesUseCaseReturn,
  GetTaskUseCaseReturn,
} from "@/use-cases/types";
import { useQueryClient } from "@tanstack/react-query";
import { REALTIME_LISTEN_TYPES, RealtimeChannel } from "@supabase/supabase-js";
import useInternetConnection from "../use-connection";
import { useWorkspace } from "../workspace-provider";
import { validate } from "uuid";
import { supabase } from "@/lib/supabase";

const taskRealtimeEvents = {
  insert: "TASK:INSERT",
  update: "TASK:UPDATE",
  delete: "TASK:DELETE",
};

type Payload<T> = {
  payload: T;
  type: REALTIME_LISTEN_TYPES.BROADCAST;
  event: string;
};

type DeletePayloadType = Payload<string[]>;
type UpdatePayloadType = Payload<
  (Partial<GetTaskUseCaseReturn> & { id: string; workspaceId: string })[]
>;
type InsertPayloadType = Payload<GetTaskUseCaseReturn>;

export const useTask = () => {
  const [realtimeChannel, setRealtimeChannel] =
    useState<RealtimeChannel | null>(null);

  const { projectId } = useParams<{ projectId: string | undefined }>();
  const queryClient = useQueryClient();
  const { filters } = useTaskFilters(projectId);
  const connection = useInternetConnection();
  const { workspaceId } = useWorkspace();

  const { data: tasks, isPending: taskPending } = useGetTasksQuery(filters);

  const createTaskOptimistic = useCallback(
    (task: GetTaskUseCaseReturn) => {
      const newTask = task;
      queryClient
        .getQueryCache()
        .findAll({ queryKey: ["tasks"] })
        .forEach(({ queryKey }) => {
          const filters = queryKey[1] || {};
          if (taskMatchesFilters(newTask, filters)) {
            queryClient.setQueryData(queryKey, (old: Task[]) => {
              const taskExist = old.find(e => e.id === task.id);
              return !!taskExist
                ? old.map(e => (e.id === task.id ? newTask : e))
                : [...old, newTask];
            });
          }
        });
    },
    [queryClient],
  );

  const updateTasksOptimistic = useCallback(
    (
      taskUpdates: (Partial<GetTaskUseCaseReturn> & {
        id: string;
      })[],
    ) => {
      queryClient
        .getQueryCache()
        .findAll({ queryKey: ["tasks"], type: "all" })
        .map(query => query.queryKey)
        .forEach(key => {
          queryClient.setQueryData(
            key,
            (
              oldData: Exclude<GetTasksWithSearchQueriesUseCaseReturn, "total">,
            ) => {
              const newData = oldData.tasks.map(task => {
                const update = taskUpdates.find(t => t.id === task.id);
                return update ? { ...task, ...update } : task;
              });
              return newData;
            },
          );
        });
      taskUpdates.forEach(update => {
        queryClient.setQueryData(
          ["task", workspaceId, update.id],
          (oldData: GetTaskUseCaseReturn) => ({
            ...oldData,
            ...update,
          }),
        );
      });
    },
    [queryClient, workspaceId],
  );

  const deleteTasksOptimistic = useCallback(
    (ids: string[]) => {
      queryClient
        .getQueryCache()
        .findAll({ queryKey: ["tasks"] })
        .forEach(({ queryKey }) => {
          queryClient.setQueryData(
            queryKey,
            (old: Task[] | undefined) =>
              old?.filter(task => !ids.includes(task.id)) || [],
          );
        });
      ids.forEach(id => {
        queryClient.removeQueries({ queryKey: ["task", workspaceId, id] });
      });
    },
    [queryClient, workspaceId],
  );

  const broadcastCreateTask = (data: GetTaskUseCaseReturn) => {
    if (!realtimeChannel) return;
    realtimeChannel.send({
      event: taskRealtimeEvents.insert,
      type: "broadcast",
      payload: data,
    });
  };

  const broadcastUpdatedTasks = (
    data: (Partial<GetTaskUseCaseReturn> & {
      id: string;
      workspaceId: string;
    })[],
  ) => {
    if (!realtimeChannel) return;
    realtimeChannel.send({
      event: taskRealtimeEvents.update,
      type: "broadcast",
      payload: data,
    });
  };

  const broadcastDeletedTasks = (data: string[]) => {
    if (!realtimeChannel) return;
    realtimeChannel.send({
      event: taskRealtimeEvents.delete,
      type: "broadcast",
      payload: data,
    });
  };

  const onDelete = useCallback(
    async ({ payload }: DeletePayloadType) => {
      if (!payload || !payload.length) return;
      deleteTasksOptimistic(payload);
    },
    [deleteTasksOptimistic],
  );

  const onUpdate = useCallback(
    async ({ payload }: UpdatePayloadType) => {
      if (!payload || !payload.length) return;
      if (payload.every(e => e.workspaceId !== workspaceId)) return;
      updateTasksOptimistic(payload);
    },
    [updateTasksOptimistic, workspaceId],
  );

  const onInsert = useCallback(
    async ({ payload }: InsertPayloadType) => {
      if (!payload.id) return;
      if (payload.workspaceId !== workspaceId) return;
      createTaskOptimistic(payload);
    },
    [createTaskOptimistic, workspaceId],
  );

  useEffect(() => {
    if (!connection) return;
    if (!workspaceId || !validate(workspaceId)) return;

    let channel: RealtimeChannel | null = null;
    channel = supabase.channel(workspaceId);

    if (!channel) return;

    channel.subscribe(status => {
      if (status !== "SUBSCRIBED") return;
      console.log("subscribed");

      channel
        .on("broadcast", { event: taskRealtimeEvents.insert }, payload =>
          onInsert(payload as InsertPayloadType),
        )
        .on("broadcast", { event: taskRealtimeEvents.update }, payload =>
          onUpdate(payload as UpdatePayloadType),
        )
        .on("broadcast", { event: taskRealtimeEvents.delete }, payload =>
          onDelete(payload as DeletePayloadType),
        );

      setRealtimeChannel(channel);
    });

    return () => {
      channel.unsubscribe().then(() => {
        setRealtimeChannel(null);
        console.log("unsubscribed");
      });
    };
  }, [workspaceId, connection, onInsert, onUpdate, onDelete]);

  return {
    tasks,
    loading: taskPending,
    realtimeChannel,
    createTaskOptimistic,
    updateTasksOptimistic,
    deleteTasksOptimistic,
    broadcastCreateTask,
    broadcastUpdatedTasks,
    broadcastDeletedTasks,
  };
};

const taskMatchesFilters = (
  task: Task,
  filters: {
    projectId?: string;
    assignee?: string;
    status?: TaskStatus;
    dueDate?: Date;
    search?: string;
  },
): boolean => {
  if (filters.projectId && task.projectId !== filters.projectId) return false;

  if (filters.assignee && task.assignedToMemberId !== filters.assignee)
    return false;

  if (filters.status && task.status !== filters.status) return false;

  // Due Date filter (matches tasks on or before the specified date)
  if (filters.dueDate) {
    const taskDue = task.dueDate ? new Date(task.dueDate) : null;
    const filterDue = new Date(filters.dueDate);

    // Normalize dates to midnight for accurate comparison
    filterDue.setHours(0, 0, 0, 0);

    if (!taskDue || taskDue.setHours(0, 0, 0, 0) > filterDue.getTime()) {
      return false;
    }
  }

  if (filters.search) {
    const cleanSearch = filters.search.trim().toLowerCase();
    if (cleanSearch) {
      const inTitle = task.name.toLowerCase().includes(cleanSearch);
      const inDescription =
        task.description?.toLowerCase().includes(cleanSearch) ?? false;
      if (!inTitle && !inDescription) return false;
    }
  }

  return true;
};
