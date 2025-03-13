"use client";

import { REALTIME_LISTEN_TYPES, RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { validate } from "uuid";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Task, TaskStatus } from "@/db/schema";
import useInternetConnection from "@/hooks/use-connection";
import { supabase } from "@/lib/supabase";
import {
  GetTasksWithSearchQueriesUseCaseReturn,
  GetTaskUseCaseReturn,
} from "@/use-cases/types";

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

type TaskRealtimeProviderProps = {
  children: React.ReactNode;
  workspaceId: string;
};

type ContextType = {
  realtimeChannel: RealtimeChannel | null;
  createTaskOptimistic: (data: GetTaskUseCaseReturn) => void;
  updateTasksOptimistic: (
    data: (Partial<GetTaskUseCaseReturn> & {
      id: string;
    })[],
  ) => void;
  deleteTasksOptimistic: (data: string[]) => void;
  broadcastCreateTask: (data: GetTaskUseCaseReturn) => void;
  broadcastUpdatedTasks: (
    data: (Partial<GetTaskUseCaseReturn> & {
      id: string;
      workspaceId: string;
    })[],
  ) => void;
  broadcastDeletedTasks: (data: string[]) => void;
};

export const TaskRealtimeContext = createContext<ContextType>({
  realtimeChannel: null,
  createTaskOptimistic: () => {},
  updateTasksOptimistic: () => {},
  deleteTasksOptimistic: () => {},
  broadcastCreateTask: () => {},
  broadcastUpdatedTasks: () => {},
  broadcastDeletedTasks: () => {},
});

export const useTaskRealtime = () => {
  const context = useContext(TaskRealtimeContext);
  if (!context) {
    throw new Error(
      "useTaskRealtime must be used within a TaskRealtimeProvider",
    );
  }
  return context;
};

export default function TaskRealtimeProvider({
  children,
  workspaceId,
}: TaskRealtimeProviderProps) {
  const [realtimeChannel, setRealtimeChannel] =
    useState<RealtimeChannel | null>(null);

  const queryClient = useQueryClient();
  const connection = useInternetConnection();

  const createTaskOptimistic: ContextType["createTaskOptimistic"] = useCallback(
    (task: GetTaskUseCaseReturn) => {
      const newTask = task;
      queryClient
        .getQueryCache()
        .findAll({ queryKey: ["tasks"] })
        .forEach(({ queryKey }) => {
          const filters = queryKey[1] || {};
          if (taskMatchesFilters(newTask, filters)) {
            queryClient.setQueryData(
              queryKey,
              (old: GetTasksWithSearchQueriesUseCaseReturn) => {
                const taskExist = old.tasks.find(e => e.id === task.id);
                if (!taskExist)
                  return { ...old, tasks: [...old.tasks, newTask] };
                return {
                  ...old,
                  tasks: old.tasks.map(e => (e.id === task.id ? newTask : e)),
                };
              },
            );
          }
        });
    },
    [queryClient],
  );

  const updateTasksOptimistic: ContextType["updateTasksOptimistic"] =
    useCallback(
      taskUpdates => {
        queryClient
          .getQueryCache()
          .findAll({ queryKey: ["tasks"], type: "all" })
          .map(query => query.queryKey)
          .forEach(key => {
            queryClient.setQueryData(
              key,
              (oldData: GetTasksWithSearchQueriesUseCaseReturn) => {
                const newData = oldData.tasks.map(task => {
                  const update = taskUpdates.find(t => t.id === task.id);
                  return update ? { ...task, ...update } : task;
                });
                return { ...oldData, tasks: newData };
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

  const deleteTasksOptimistic: ContextType["deleteTasksOptimistic"] =
    useCallback(
      ids => {
        queryClient
          .getQueryCache()
          .findAll({ queryKey: ["tasks"] })
          .forEach(({ queryKey }) => {
            queryClient.setQueryData(
              queryKey,
              (old: GetTasksWithSearchQueriesUseCaseReturn | undefined) => {
                if (!old) return old;
                const filteredTasks = old.tasks.filter(task => {
                  if (ids.includes(task.id) || ids.includes(task.projectId))
                    return false;
                  return true;
                });
                return {
                  ...old,
                  tasks: filteredTasks,
                };
              },
            );
          });
        ids.forEach(id => {
          queryClient.removeQueries({ queryKey: ["task", workspaceId, id] });
        });
      },
      [queryClient, workspaceId],
    );

  const broadcastCreateTask: ContextType["broadcastCreateTask"] = useCallback(
    data => {
      sendEvent(realtimeChannel, taskRealtimeEvents.insert, data);
    },
    [realtimeChannel],
  );

  const broadcastUpdatedTasks: ContextType["broadcastUpdatedTasks"] =
    useCallback(
      data => {
        sendEvent(realtimeChannel, taskRealtimeEvents.update, data);
      },
      [realtimeChannel],
    );

  const broadcastDeletedTasks: ContextType["broadcastDeletedTasks"] =
    useCallback(
      data => {
        sendEvent(realtimeChannel, taskRealtimeEvents.delete, data);
      },
      [realtimeChannel],
    );

  const onDelete = useCallback(
    ({ payload }: DeletePayloadType) => {
      if (!payload || !payload.length) return;
      deleteTasksOptimistic(payload);
    },
    [deleteTasksOptimistic],
  );

  const onUpdate = useCallback(
    ({ payload }: UpdatePayloadType) => {
      if (!payload || !payload.length) return;
      if (payload.every(e => e.workspaceId !== workspaceId)) return;
      updateTasksOptimistic(payload);
    },
    [updateTasksOptimistic, workspaceId],
  );

  const onInsert = useCallback(
    ({ payload }: InsertPayloadType) => {
      if (!payload.id) return;
      if (payload.workspaceId !== workspaceId) return;
      createTaskOptimistic(payload);
    },
    [createTaskOptimistic, workspaceId],
  );

  useEffect(() => {
    if (!connection) return;
    if (!workspaceId || !validate(workspaceId)) return;

    const channel = supabase.channel(workspaceId);

    channel.subscribe(status => {
      if (status !== "SUBSCRIBED") return;
      setRealtimeChannel(channel);

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
    });

    return () => {
      channel.unsubscribe();
      setRealtimeChannel(null);
    };
  }, [workspaceId, connection, onInsert, onUpdate, onDelete]);

  return (
    <TaskRealtimeContext.Provider
      value={{
        realtimeChannel,
        createTaskOptimistic,
        updateTasksOptimistic,
        deleteTasksOptimistic,
        broadcastCreateTask,
        broadcastUpdatedTasks,
        broadcastDeletedTasks,
      }}
    >
      {children}
    </TaskRealtimeContext.Provider>
  );
}

const sendEvent = (
  socket: RealtimeChannel | null,
  event: string,
  payload: any,
) => {
  if (!socket) return;
  if (socket.state !== "joined") return sendEvent(socket, event, payload);
  socket.send({ event, type: "broadcast", payload });
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
