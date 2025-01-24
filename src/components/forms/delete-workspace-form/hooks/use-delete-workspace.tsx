import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDeleteWorkspaceMutation } from "./mutations/use-delete-workspace-mutation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  workspaceName: string;
  workspaceId: string;
};

const validationSchema = (workspaceName: string) => {
  return z
    .object({
      workspaceId: z
        .string()
        .min(1, { message: "Please enter the workspace name." }),
      workspaceName: z
        .string()
        .min(1, { message: "Please enter the workspace name." }),
    })
    .refine(data => data.workspaceName === workspaceName, {
      message: "Workspace name does not match.",
      path: ["workspaceName"],
    });
};

export const useDeleteWorkspace = ({ workspaceName, workspaceId }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const validation = validationSchema(workspaceName);

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      workspaceId,
      workspaceName: "",
    },
  });

  const { mutate, isPending } = useDeleteWorkspaceMutation({
    onSuccess: async () => {
      toast.success("Workspace deleted successfully");
      await queryClient.removeQueries({ queryKey: ["workspaces"] });
      await queryClient.removeQueries({ queryKey: ["workspace", workspaceId] });
      window.location.href = "/dashboard";
    },
    onError: error => {
      setError(error.message);
    },
    onMutate: () => {
      setError(null);
    },
  });

  const onSubmit = form.handleSubmit(values => {
    mutate({
      json: values,
      param: { id: workspaceId },
    });
  });

  return {
    form,
    onSubmit,
    error,
    loading: isPending,
  };
};
