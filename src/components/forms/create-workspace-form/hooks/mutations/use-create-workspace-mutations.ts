import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
  (typeof client.api.workspace)["create"]["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.workspace)["create"]["$post"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseCreateWorkspaceMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useCreateWorkspaceMutation = (
  props: UseCreateWorkspaceMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["create-workspace"],
    mutationFn: async ({ json }: RequestType) => {
      const res = await client.api.workspace["create"]["$post"]({ json });
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
