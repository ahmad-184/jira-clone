"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { updateTaskSchema } from "@/validations/task.validation";
import { useUpdateTaskMutation } from "@/hooks/mutations/use-update-task-mutation";
import { useWorkspace } from "@/hooks/workspace-provider";
import { GetTaskUseCaseReturn } from "@/use-cases/types";
import { useTaskRealtime } from "@/providers/task-realtime-provider";

type Props = {
  taskId: string;
  onCallback?: () => void;
  task: GetTaskUseCaseReturn;
};

export const useUpdateTask = ({ taskId, onCallback, task }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const { workspaceId } = useWorkspace();
  const { updateTasksOptimistic, broadcastUpdatedTasks } = useTaskRealtime();

  const form = useForm<z.infer<typeof updateTaskSchema>>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      ...task,
      id: taskId,
      workspaceId,
      taskTags: task.taskTags.map(t => t.tag.id),
    },
  });

  const { mutate, isPending } = useUpdateTaskMutation({
    onSuccess: async res => {
      toast.success("Task updated.");
      onCallback?.();
      updateTasksOptimistic([res.task]);
      broadcastUpdatedTasks([res.task]);
    },
    onError: error => {
      setError(error.message);
    },
    onMutate: () => {
      setError(undefined);
    },
  });

  const onSubmit = form.handleSubmit(values => {
    mutate({
      json: values,
    });
  });

  return {
    form,
    onSubmit,
    loading: isPending,
    error,
  };
};
