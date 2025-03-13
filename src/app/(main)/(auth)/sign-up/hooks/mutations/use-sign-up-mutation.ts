import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";

type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseSignUpMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useSignUpMutation = (props: UseSignUpMutationProps = {}) => {
  const mutation = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async ({ json }) => {
      const res = await client.api.auth["sign-up"]["$post"]({ json });
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
