"use client";

import { updateTaskSchema } from "@/validations/task.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateTaskMutation } from "./mutations/use-update-task-mutation";
import { useWorkspace } from "@/hooks/workspace-provider";
import { GetTaskUseCaseReturn } from "@/use-cases/types";

type Props = {
  taskId: string;
  onCallback?: () => void;
  task: GetTaskUseCaseReturn;
};

export const useUpdateTask = ({ taskId, onCallback, task }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();

  const form = useForm({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      ...task,
      id: taskId,
      workspaceId,
    },
  });

  const { mutate, isPending } = useUpdateTaskMutation({
    onSuccess: async () => {
      toast.success("Task updated.");
      onCallback?.();
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
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
