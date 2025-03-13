import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";

type RequestType = InferRequestType<
  (typeof client.api.project)["delete"][":id"]["$delete"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.project)["delete"][":id"]["$delete"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseDeleteProjectMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useDeleteProjectMutation = (
  props: UseDeleteProjectMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["delete-project"],
    mutationFn: async ({ json, param }: RequestType) => {
      const res = await client.api.project["delete"][":id"]["$delete"]({
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
