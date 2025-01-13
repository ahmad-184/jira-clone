import { UseMutationOptions } from "@tanstack/react-query";

export type UseMutationProps<ResponseType, Error, RequestType> =
  UseMutationOptions<ResponseType, Error, RequestType>;
