import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";

type RequestType = InferRequestType<
  (typeof client.api.member)[":memberId"]["$put"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.member)[":memberId"]["$put"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseUpdateMemberMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useUpdateMemberMutation = (
  props: UseUpdateMemberMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["update-member"],
    mutationFn: async ({ param, json }: RequestType) => {
      const res = await client.api.member[":memberId"]["$put"]({
        param,
        json,
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
