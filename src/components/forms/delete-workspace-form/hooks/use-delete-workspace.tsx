import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDeleteWorkspaceMutation } from "./mutations/use-delete-workspace-mutation";

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

  const validation = validationSchema(workspaceName);

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      workspaceId,
      workspaceName: "",
    },
  });

  const { mutate, isPending } = useDeleteWorkspaceMutation({
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
