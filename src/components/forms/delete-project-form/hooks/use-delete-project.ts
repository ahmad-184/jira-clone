import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDeleteProjectMutation } from "./mutations/use-delete-project-mutation";

type Props = {
  projectName: string;
  projectId: string;
};

const validationSchema = (projectName: string) => {
  return z
    .object({
      projectId: z
        .string()
        .min(1, { message: "Please enter the workspace name." }),
      projectName: z
        .string()
        .min(1, { message: "Please enter the workspace name." }),
    })
    .refine(data => data.projectName === projectName, {
      message: "Project name does not match.",
      path: ["projectName"],
    });
};

export const useDeleteProject = ({ projectId, projectName }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const validation = validationSchema(projectName);

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      projectId,
      projectName: "",
    },
  });

  const { mutate, isPending } = useDeleteProjectMutation({
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
      param: { id: values.projectId },
    });
  });

  return {
    form,
    onSubmit,
    error,
    loading: isPending,
  };
};
