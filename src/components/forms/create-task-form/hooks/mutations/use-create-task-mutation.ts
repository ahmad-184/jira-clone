import { InferRequestType } from "hono";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { UseMutationProps } from "@/types/mutation";
import { GetTaskUseCaseReturn } from "@/use-cases/types";
import { convertToDate } from "@/util";

type RequestType = InferRequestType<
  (typeof client.api.task)["create"]["$post"]
>;
type ResponseType =
  | {
      error: string;
    }
  | {
      task: GetTaskUseCaseReturn;
    };

type ResponseWithoutError = Exclude<ResponseType, { error: string }>;
type UseCreateTaskMutationProps = UseMutationProps<
  ResponseWithoutError,
  Error,
  RequestType
>;

export const useCreateTaskMutation = (
  props: UseCreateTaskMutationProps = {},
) => {
  const mutation = useMutation({
    mutationKey: ["create-task"],
    mutationFn: async ({ json }: RequestType) => {
      const res = await client.api.task["create"]["$post"]({ json });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return { task: convertToDate(response.task) };
    },
    ...props,
  });

  return mutation;
};
