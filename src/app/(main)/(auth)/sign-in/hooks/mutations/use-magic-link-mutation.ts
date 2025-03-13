import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";

type RequestType = InferRequestType<
  (typeof client.api.auth)["send-magic-link"]["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.auth)["send-magic-link"]["$post"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseMagicLinkMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useMagicLinkMutation = (props: UseMagicLinkMutationProps = {}) => {
  const mutation = useMutation({
    mutationKey: ["send-magic-link"],
    mutationFn: async ({ json }) => {
      const res = await client.api.auth["send-magic-link"]["$post"]({ json });
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
