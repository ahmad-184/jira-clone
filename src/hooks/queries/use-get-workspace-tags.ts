import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { convertToDate } from "@/util";

export const useGetWorkspaceTagsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["tags", workspaceId],
    queryFn: async () => {
      const res = await client.api.tag["$get"]({
        query: {
          workspaceId,
        },
      });
      const response = await res.json();
      const error =
        "error" in response ? response.error : "Something went wrong";
      if (!res.ok) throw new Error(error);
      if ("error" in response) throw new Error(error);
      return convertToDate(response.tags);
    },
    enabled: Boolean(!!workspaceId),
  });
};
