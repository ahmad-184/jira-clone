"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { joinWorkspaceSchema } from "@/validations/workspace.validation";
import { useJoinWorkspaceMutation } from "./mutations/use-join-workspace-mutation";

type Props = {
  inviteCode: string;
  workspaceId: string;
};

export const useJoinWorkspace = ({ inviteCode, workspaceId }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof joinWorkspaceSchema>>({
    resolver: zodResolver(joinWorkspaceSchema),
    defaultValues: {
      inviteCode,
    },
  });

  form.setValue("inviteCode", inviteCode);

  const { mutate, isPending } = useJoinWorkspaceMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      window.location.href = `/dashboard/${workspaceId}`;
    },
    onError: err => {
      toast.error(err.message);
    },
    onMutate: () => {
      setError(null);
    },
  });

  const onSubmit = form.handleSubmit(values => {
    mutate({
      json: {
        inviteCode: values.inviteCode,
      },
      param: { id: workspaceId },
    });
  });

  return {
    form,
    onSubmit,
    loading: isPending,
    error,
  };
};
