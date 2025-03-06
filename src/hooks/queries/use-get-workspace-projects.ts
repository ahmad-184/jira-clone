import { client } from "@/lib/rpc";
import { convertToDate } from "@/util";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceProjectsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-projects", workspaceId],
    queryFn: async () => {
      const res = await client.api.workspace.projects.$get({
        query: { workspaceId },
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return {
        projects: response.projects
          ? response.projects.map(project => convertToDate(project))
          : undefined,
      };
    },
    enabled: !!workspaceId,
  });
};
