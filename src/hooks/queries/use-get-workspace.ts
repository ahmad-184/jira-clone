import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { convertToDate } from "@/util";

export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const res = await client.api.workspace[":id"].$get({
        param: { id: workspaceId },
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return {
        workspace: response.workspace
          ? convertToDate(response.workspace)
          : undefined,
      };
    },
    enabled: !!workspaceId,
  });
};
