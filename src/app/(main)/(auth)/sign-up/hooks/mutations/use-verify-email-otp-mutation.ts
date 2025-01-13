import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
  (typeof client.api.auth)["verify-email-otp"]["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.auth)["verify-email-otp"]["$post"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseVerifyEmailOtpMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useVerifyEmailOtpMutation = (
  props: UseVerifyEmailOtpMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["verify-email-otp"],
    mutationFn: async ({ json }) => {
      const res = await client.api.auth["verify-email-otp"]["$post"]({ json });
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
