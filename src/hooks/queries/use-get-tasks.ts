import { TaskStatus } from "@/db/schema";
import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetTasksQuery = (
  workspaceId: string,
  projectId?: string,
  status?: TaskStatus,
  assignedToMemberId?: string,
  dueDate?: Date,
  search?: string,
) => {
  return useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      assignedToMemberId,
      dueDate,
      search,
    ],
    queryFn: async () => {
      const res = await client.api.task.$get({
        query: {
          workspaceId: workspaceId,
          projectId: projectId,
          status: status,
          assignedToMemberId: assignedToMemberId,
          dueDate: dueDate?.toISOString() || undefined,
          search: search,
        },
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return response
        ? response.tasks?.map(task => ({
            ...task,
            createdAt: new Date(task.createdAt),
            dueDate: new Date(task.dueDate),
            createdBy: {
              ...task.createdBy,
              createdAt: new Date(task.createdBy.createdAt),
            },
            assignedTo: {
              ...task.assignedTo,
              createdAt: new Date(task.assignedTo.createdAt),
            },
          }))
        : undefined;
    },
    enabled: !!workspaceId,
  });
};
