import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetTaskQuery = (workspaceId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task", workspaceId, taskId],
    queryFn: async () => {
      const res = await client.api.task["$get"]({
        query: {
          workspaceId,
          taskId,
        },
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return response.task
        ? {
            ...response.task,
            dueDate: new Date(response.task.dueDate),
            createdAt: new Date(response.task.createdAt),
            createdBy: {
              ...response.task.createdBy,
              createdAt: new Date(response.task.createdBy.createdAt),
            },
            assignedTo: {
              ...response.task.assignedTo,
              createdAt: new Date(response.task.assignedTo.createdAt),
            },
          }
        : undefined;
    },
    enabled: Boolean(!!workspaceId && !!taskId),
  });
};
