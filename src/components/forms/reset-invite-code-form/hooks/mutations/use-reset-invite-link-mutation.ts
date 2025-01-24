import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
  (typeof client.api.workspace)["reset-invite-code"][":id"]["$put"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.workspace)["reset-invite-code"][":id"]["$put"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseResetInviteLinkMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useResetInviteLinkMutation = (
  props: UseResetInviteLinkMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["reset-invite-link"],
    mutationFn: async ({ param }: RequestType) => {
      const res = await client.api.workspace["reset-invite-code"][":id"][
        "$put"
      ]({
        param,
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return response;
    },
    ...props,
  });

  return mutation;
};
