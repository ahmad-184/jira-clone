import { TaskStatus } from "@/db/schema";
import { client } from "@/lib/rpc";
import { convertToDate } from "@/util";
import { useQuery } from "@tanstack/react-query";

type Props = {
  workspaceId: string;
  projectId?: string;
  status?: TaskStatus;
  assignee?: string;
  dueDate?: Date;
  search?: string;
};

export const useGetTasksQuery = (filters: Props) => {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const res = await client.api.task.tasks.$get({
        query: {
          workspaceId: filters.workspaceId,
          projectId: filters?.projectId,
          status: filters?.status,
          assignedToMemberId: filters?.assignee,
          dueDate: filters?.dueDate?.toISOString() || undefined,
          search: filters?.search,
        },
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return response
        ? response.tasks?.map(task => convertToDate(task))
        : undefined;
    },
    enabled: !!filters.workspaceId,
  });
};
