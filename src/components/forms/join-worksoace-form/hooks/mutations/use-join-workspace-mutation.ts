import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";

type RequestType = InferRequestType<
  (typeof client.api.workspace)[":id"]["join"]["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.workspace)[":id"]["join"]["$post"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseJoinWorkspaceMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useJoinWorkspaceMutation = (
  props: UseJoinWorkspaceMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["join-workspace"],
    mutationFn: async ({ json, param }: RequestType) => {
      const res = await client.api.workspace[":id"]["join"]["$post"]({
        json,
        param: { id: param.id },
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
