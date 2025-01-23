import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
  (typeof client.api.workspace)["delete"][":id"]["$delete"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.workspace)["delete"][":id"]["$delete"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseDeleteWorkspaceMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useDeleteWorkspaceMutation = (
  props: UseDeleteWorkspaceMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["delete-workspace"],
    mutationFn: async ({ json, param }: RequestType) => {
      const res = await client.api.workspace["delete"][":id"]["$delete"]({
        json,
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
