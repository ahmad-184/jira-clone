import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";

type RequestType = InferRequestType<
  (typeof client.api.auth)["logout"]["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.auth)["logout"]["$post"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseLogOutMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useLogOutMutation = (props: UseLogOutMutationProps = {}) => {
  const mutation = useMutation({
    mutationKey: ["log-out"],
    mutationFn: async () => {
      const res = await client.api.auth["logout"]["$post"]();
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
