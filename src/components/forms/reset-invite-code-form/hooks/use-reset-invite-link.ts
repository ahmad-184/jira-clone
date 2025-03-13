import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { useResetInviteLinkMutation } from "./mutations/use-reset-invite-link-mutation";
import { workspaceIdSchema } from "@/validations/workspace.validation";

const schema = z.object({
  workspaceId: workspaceIdSchema,
});

export function useResetInviteLink(workspaceId: string, onClose?: () => void) {
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      workspaceId,
    },
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useResetInviteLinkMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      onClose?.();
      toast.success(
        "Invite link reset successfully. Please share the new link with your team.",
      );
    },
    onError: error => {
      setError(error.message);
    },
    onMutate: () => {
      setError(null);
    },
  });

  const onSubmit = form.handleSubmit(data => {
    mutate({ param: { id: data.workspaceId } });
  });

  return { form, onSubmit, error, loading: isPending };
}
