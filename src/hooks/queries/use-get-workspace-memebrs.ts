import { client } from "@/lib/rpc";
import { convertToDate } from "@/util";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceMembersQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      const res = await client.api.workspace["members"].$get({
        query: {
          workspaceId,
        },
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return response.members
        ? response.members.map(member => convertToDate(member))
        : undefined;
    },
    enabled: !!workspaceId,
  });
};
