import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";

type RequestType = InferRequestType<
  (typeof client.api.task)["delete"]["$delete"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.task)["delete"]["$delete"]
>;

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseDeleteTaskMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useDeleteTaskMutation = (
  props: UseDeleteTaskMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["delete-task"],
    mutationFn: async ({ json }: RequestType) => {
      const res = await client.api.task["delete"]["$delete"]({
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
