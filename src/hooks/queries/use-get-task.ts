import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { convertToDate } from "@/util";

export const getTaskClient = async (workspaceId: string, taskId: string) => {
  const getCall = await client.api.task.$get({
    query: {
      workspaceId,
      taskId,
    },
  });
  const response = await getCall.json();
  const error = "error" in response ? response.error : "Something went wrong";
  if (!getCall.ok) throw new Error(error);
  if ("error" in response) throw new Error(error);
  if (!response.task) return undefined;
  return convertToDate(response.task);
};

export const useGetTaskQuery = (workspaceId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task", workspaceId, taskId],
    queryFn: async () => {
      const res = await getTaskClient(workspaceId, taskId);
      return res;
    },
    enabled: Boolean(!!workspaceId && !!taskId),
  });
};
