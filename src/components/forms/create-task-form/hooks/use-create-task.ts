"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useWorkspace } from "@/hooks/workspace-provider";
import { createTaskSchema } from "@/validations/task.validation";
import { useCreateTaskMutation } from "./mutations/use-create-task-mutation";
import { TASK_STATUS } from "@/constants/forms";
import { Task, TaskStatus } from "@/db/schema";
import { useTaskRealtime } from "@/providers/task-realtime-provider";

type Props = {
  projectId?: string;
  onClose?: () => void;
  currentMemberId: string;
  initialData?: Partial<Task>;
};

export const useCreateTask = ({
  projectId,
  onClose,
  currentMemberId,
  initialData,
}: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const { broadcastCreateTask, createTaskOptimistic } = useTaskRealtime();
  const { workspaceId } = useWorkspace();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      workspaceId,
      projectId,
      assignedToMemberId: undefined,
      createdById: currentMemberId,
      dueDate: undefined,
      name: "",
      status: TASK_STATUS[1] as TaskStatus,
      taskTags: [],
      ...initialData,
      description: "",
    },
  });

  const { mutate, isPending } = useCreateTaskMutation({
    onSuccess: ({ task }) => {
      toast.success("New task created.");
      broadcastCreateTask(task);
      createTaskOptimistic(task);
      onClose?.();
    },
    onError: err => {
      setError(err.message);
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
    loading: isPending,
    onSubmit,
    error,
  };
};
