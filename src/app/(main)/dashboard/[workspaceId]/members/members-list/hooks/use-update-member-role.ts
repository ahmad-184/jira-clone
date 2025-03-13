import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { useUpdateMemberMutation } from "./mutations/use-update-member-mutation";
import { updateMemberSchema } from "@/validations/member.validation";
import { useWorkspace } from "@/hooks/workspace-provider";
import { Role } from "@/db/schema";

type Props = {
  memberId: string;
  role: Exclude<Role, "OWNER">;
  onClose?: () => void;
};

export const useUpdateMemberRole = ({ memberId, role, onClose }: Props) => {
  const [error, setError] = useState<string | undefined>();

  const { workspaceId } = useWorkspace();

  const queryClient = useQueryClient();

  const { setValue, handleSubmit } = useForm<
    z.infer<typeof updateMemberSchema>
  >({
    resolver: zodResolver(updateMemberSchema),
    defaultValues: {
      role,
    },
  });

  const { mutate, isPending } = useUpdateMemberMutation({
    onSuccess: async () => {
      toast.success("Member role updated");
      onClose?.();
      await queryClient.invalidateQueries({
        queryKey: ["workspace-members", workspaceId],
      });
    },
    onMutate: () => {
      setError(undefined);
    },
    onError: error => {
      setError(error.message);
    },
  });

  const onSubmit = handleSubmit(values => {
    mutate({
      param: {
        memberId,
      },
      json: values,
    });
  });

  useEffect(() => {
    setValue("role", role);
  }, [role, setValue]);

  return {
    error,
    onSubmit,
    loading: isPending,
  };
};
