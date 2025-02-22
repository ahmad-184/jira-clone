"use client";

import { deleteTaskSchema } from "@/validations/task.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDeleteTaskMutation } from "./mutations/use-delete-task-mutation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useWorkspace } from "@/hooks/workspace-provider";

type Props = {
  taskIds: string[];
  onCallback?: () => void;
};

export const useDeleteTask = ({ taskIds, onCallback }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();

  const form = useForm({
    resolver: zodResolver(deleteTaskSchema),
    defaultValues: {
      taskIds,
      workspaceId,
    },
  });

  const { mutate, isPending } = useDeleteTaskMutation({
    onSuccess: () => {
      toast.success("Task deleted.");
      onCallback?.();
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: error => {
      toast.error(error.message);
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

  return { form, onSubmit, loading: isPending, error };
};
