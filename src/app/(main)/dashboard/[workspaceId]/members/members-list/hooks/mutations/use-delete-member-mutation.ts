import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";

type RequestType = InferRequestType<
  (typeof client.api.member)[":memberId"]["$delete"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.member)[":memberId"]["$delete"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseDeleteMemberMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useDeleteMemberMutation = (
  props: UseDeleteMemberMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["delete-member"],
    mutationFn: async ({ param }: RequestType) => {
      const res = await client.api.member[":memberId"]["$delete"]({
        param: { memberId: param.memberId },
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
