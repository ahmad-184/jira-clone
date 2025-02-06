import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
  (typeof client.api.project)["update"][":id"]["$put"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.project)["update"][":id"]["$put"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseUpdateProjectMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useUpdateProjectMutation = (
  props: UseUpdateProjectMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["update-project"],
    mutationFn: async ({ json, param }: RequestType) => {
      const res = await client.api.project["update"][":id"].$put({
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
