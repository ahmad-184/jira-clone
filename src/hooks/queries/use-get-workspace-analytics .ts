import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type WorkspaceAnalyticsResponse = Exclude<
  InferResponseType<(typeof client.api.workspace)[":id"]["analytics"]["$get"]>,
  { error: string }
>;

export const useGetWorkspaceAnalyticsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const res = await client.api.workspace[":id"].analytics.$get({
        param: {
          id: workspaceId,
        },
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return response.analytics;
    },
    enabled: !!workspaceId,
  });
};
