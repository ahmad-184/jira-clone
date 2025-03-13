import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

import { useCreateTagMutation } from "@/hooks/mutations/use-create-tag";
import { useWorkspace } from "../workspace-provider";
import { createTagSchema } from "@/validations/tag.validation";

export const useCreateTag = () => {
  const [error, setError] = useState<string | undefined>(undefined);

  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();

  const { mutate, isPending } = useCreateTagMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tags", workspaceId],
      });
    },
    onError: err => {
      setError(err.message);
    },
    onMutate: () => {
      setError(undefined);
    },
  });

  const onSubmit = async (id: string, name: string) => {
    if (!workspaceId || !name?.trim().length) return;
    try {
      const values = {
        workspaceId,
        name,
        id,
      };
      createTagSchema.parse(values);
      mutate({
        json: values,
      });
    } catch {
      toast.error("Invalid tag values");
    }
  };

  return { onSubmit, loading: isPending, error };
};
