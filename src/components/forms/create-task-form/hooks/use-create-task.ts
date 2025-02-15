"use client";

import { useWorkspace } from "@/hooks/workspace-provider";
import { createTaskSchema } from "@/validations/task.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTaskMutation } from "./mutations/use-create-task-mutation";
import { toast } from "sonner";
import { TASK_STATUS } from "@/constants/forms";
import { TaskStatus } from "@/db/schema";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  projectId?: string;
  onClose?: () => void;
  currentMemberId: string;
};

export const useCreateTask = ({
  projectId,
  onClose,
  currentMemberId,
}: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const { workspaceId } = useWorkspace();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      workspaceId,
      projectId,
      assignedToMemberId: undefined,
      createdById: currentMemberId,
      description: "",
      dueDate: undefined,
      name: "",
      status: TASK_STATUS[1] as TaskStatus,
    },
  });

  const { mutate, isPending } = useCreateTaskMutation({
    onSuccess: () => {
      toast.success("New task created.");
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
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
