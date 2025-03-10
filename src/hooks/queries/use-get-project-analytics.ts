import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ProjectAnalyticsResponse = Exclude<
  InferResponseType<
    (typeof client.api.project)[":projectId"]["analytics"]["$get"]
  >,
  { error: string }
>;

export const useGetProjectAnalyticsQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const res = await client.api.project[":projectId"].analytics.$get({
        param: {
          projectId,
        },
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return response.analytics;
    },
    enabled: !!projectId,
  });
};
