import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";

type RequestType = InferRequestType<
  (typeof client.api.workspace)["update"][":id"]["$put"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.workspace)["update"][":id"]["$put"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseUpdateWorkspaceMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useUpdateWorkspaceMutation = (
  props: UseUpdateWorkspaceMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["update-workspace"],
    mutationFn: async ({ json, param }: RequestType) => {
      const res = await client.api.workspace["update"][":id"].$put({
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
