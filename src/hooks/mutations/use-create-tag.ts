import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";

type RequestType = InferRequestType<(typeof client.api.tag)["create"]["$post"]>;
type ResponseType = InferResponseType<
  (typeof client.api.tag)["create"]["$post"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseCreateTagMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useCreateTagMutation = (props: UseCreateTagMutationProps = {}) => {
  const mutation = useMutation({
    mutationKey: ["create-tag"],
    mutationFn: async ({ json }: RequestType) => {
      const res = await client.api.tag["create"]["$post"]({
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
