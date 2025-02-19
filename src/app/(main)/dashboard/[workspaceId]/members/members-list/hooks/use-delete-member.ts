"use client";

import { deleteMemberSchema } from "@/validations/member.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDeleteMemberMutation } from "./mutations/use-delete-member-mutation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useWorkspace } from "@/hooks/workspace-provider";
import { z } from "zod";
import { User } from "@/db/schema";

type Props = {
  memberId: string;
  memberUserId: User["id"];
  currentUserId: User["id"];
  onClose?: () => void;
};

export const useDeleteMember = ({
  memberId,
  memberUserId,
  currentUserId,
  onClose,
}: Props) => {
  const [error, setError] = useState<string | undefined>();

  const { workspaceId } = useWorkspace();

  const queryClient = useQueryClient();

  const { handleSubmit, setValue } = useForm<
    z.infer<typeof deleteMemberSchema>
  >({
    resolver: zodResolver(deleteMemberSchema),
    defaultValues: {
      memberId,
    },
  });

  useEffect(() => {
    setValue("memberId", memberId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  const { mutate, isPending } = useDeleteMemberMutation({
    onSuccess: async () => {
      toast.success("Member removed successfully");
      onClose?.();
      if (memberUserId === currentUserId) {
        queryClient.removeQueries({
          queryKey: ["workspace-members", workspaceId],
        });
        queryClient.removeQueries({
          queryKey: ["workspaces"],
        });
        queryClient.removeQueries({
          queryKey: ["workspace", workspaceId],
        });
        window.location.href = "/dashboard";
      }
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
      param: { memberId: values.memberId },
    });
  });

  return { onSubmit, error, loading: isPending };
};
